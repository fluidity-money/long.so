package main

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log/slog"
	"math/big"
	"math/rand"
	"time"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"
	"github.com/fluidity-money/long.so/cmd/faucet.superposition/lib/faucet"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

// BufferDuration to reuse to buffer requests to the faucet in.
const BufferDuration = 4 * time.Second

type (
	SendFaucetFunc func(ctx context.Context, c *ethclient.Client, o *ethAbiBind.TransactOpts, faucet, sender ethCommon.Address, addrs ...faucet.FaucetReq) (tx *ethTypes.Transaction, err error)
	WaitMinedFunc  func(ctx context.Context, c *ethclient.Client, tx *ethTypes.Transaction) error
)

// RunSender, by creating a repeating timer of 5 seconds for the cache window, accumulating requests, then sending out tokens requested on demand. Takes the private key for the sender
func RunSender(cSepolia, cSpn *ethclient.Client, chainIdSepolia, chainIdSpnTestnet *big.Int, key *ecdsa.PrivateKey, senderAddr, faucetAddrSepolia, faucetAddrSpnTestnet ethCommon.Address, sendTokens SendFaucetFunc, waitMined WaitMinedFunc) chan<- graph.FaucetReq {
	reqs := make(chan graph.FaucetReq)
	go func() {
		t := time.NewTicker(BufferDuration + randSecs())
		buf := make([]graph.FaucetReq, 10)
		i := 0
		sendErrs := func(err error) {
			for _, b := range buf[:i] {
				b.Resp <- err
			}
		}
		for {
			select {
			case a := <-reqs:
				if i > len(buf) {
					buf = append(buf, a)
					i++
				} else {
					buf[i] = a
					i++
				}

			case <-t.C:
				if i == 0 {
					continue
				}
				faucetReqs := make([]faucet.FaucetReq, i)
				for x, a := range buf[:i] {
					faucetReqs[x] = faucet.FaucetReq{
						Recipient: a.Addr,
						IsStaker:  a.IsStaker,
					}
				}
				// Get configuration for sending.
				oSpn, err := ethAbiBind.NewKeyedTransactorWithChainID(key, chainIdSpnTestnet)
				if err != nil {
					for _, b := range buf[:i] {
						b.Resp <- err
					}
					slog.Error("failed to create keyed transactor with chain id for SPN",
						"err", err,
					)
					continue
				}
				oSepolia, err := ethAbiBind.NewKeyedTransactorWithChainID(key, chainIdSepolia)
				if err != nil {
					for _, b := range buf[:i] {
						b.Resp <- err
					}
					slog.Error("failed to create keyed transactor with chain id for Sepolia",
						"err", err,
					)
					continue
				}
				// Send SPN tokens using the faucet!
				var (
					chanSpnTestnetTx  = make(chan *ethTypes.Transaction)
					chanSpnTestnetErr = make(chan error)
				)
				go func() {
					tx, err := sendTokens(
						context.Background(),
						cSpn,
						oSpn,
						faucetAddrSpnTestnet,
						senderAddr,
						faucetReqs...,
					)
					if err != nil {
						slog.Error("failed to send with spn faucet", "err", err)
						chanSpnTestnetErr <- fmt.Errorf("spn error: %v", err)
						return
					}
					chanSpnTestnetTx <- tx
				}()
				ctxWait, _ := context.WithTimeout(context.Background(), 15*time.Second)
				// Start to send out the staked amounts, and log the hash.
				txSepolia, err := sendTokens(
					ctxWait,
					cSepolia,
					oSepolia,
					faucetAddrSepolia,
					senderAddr,
					faucetReqs...,
				)
				if err != nil {
					slog.Error("sepolia failed to send: %v", "err", err)
				}
				if txSepolia == nil {
					sendErrs(fmt.Errorf("sepolia transaction is empty"))
				}
				if err := waitMined(ctxWait, cSepolia, txSepolia); err != nil {
					sendErrs(fmt.Errorf(
						"failed to wait for the mining to happen for sepolia tx hash: %v",
						txSepolia,
					))
				}
				var txSpn *ethTypes.Transaction
				select {
				case tx := <-chanSpnTestnetTx:
					txSpn = tx
				case err := <-chanSpnTestnetErr:
					sendErrs(err)
				}
				if err := waitMined(ctxWait, cSpn, txSpn); err != nil {
					sendErrs(fmt.Errorf(
						"failed to wait for the mining to happen for spn tx hash: %v",
						txSpn.Hash(),
					))
				}
				slog.Info("sent faucet amounts",
					"spn hash", txSpn.Hash,
					"sepolia hash", txSepolia.Hash(),
					"size", len(buf),
					"faucet reqs", faucetReqs,
					"err?", err,
				)
				// Send responses to the connected buffers, making sure to only send to
				// the ones that we set up.
				sendErrs(err) // Thisshould be sent regardless.
				i = 0
				t.Reset(BufferDuration + randSecs()) // So there's no time lost in the ticker.
			}
		}
	}()
	return reqs
}

// randSecs for some extra fault tolerance in buffering this
func randSecs() time.Duration {
	return time.Duration(rand.Intn(3)) * time.Second
}
