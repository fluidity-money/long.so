package main

import (
	"context"
	"crypto/ecdsa"
	"log/slog"
	"math/big"
	"math/rand"
	"time"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"
	"github.com/fluidity-money/long.so/cmd/faucet.superposition/lib/faucet"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// BufferDuration to reuse to buffer requests to the faucet in.
const BufferDuration = 4 * time.Second

var (
	// NonstakerSPNAmount to send when they request the faucet as a non-staker.
	NonstakerSPNAmount = new(big.Int).SetInt64(1e18)
	// StakerSPNAmount to send to FLY stakers.
	//1e18
	StakerSPNAmount, _ = new(big.Int).SetString("100000000000000000000", 10)
)

type SendFaucetFunc func(ctx context.Context, c *ethclient.Client, o *ethAbiBind.TransactOpts, faucet, sender ethCommon.Address, addrs ...faucet.FaucetReq) (hash *ethCommon.Hash, err error)

// RunSender, by creating a repeating timer of 5 seconds for the cache window, accumulating requests, then sending out tokens requested on demand. Takes the private key for the sender
func RunSender(c *ethclient.Client, chainId *big.Int, key *ecdsa.PrivateKey, senderAddr, faucetAddr ethCommon.Address, sendTokens SendFaucetFunc) chan<- graph.FaucetReq {
	reqs := make(chan graph.FaucetReq)
	go func() {
		t := time.NewTicker(BufferDuration + randSecs())
		buf := make([]graph.FaucetReq, 10)
		i := 0
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
					var amount *big.Int
					if a.IsStaker {
						amount = StakerSPNAmount
					} else {
						amount = NonstakerSPNAmount
					}
					faucetReqs[x] = faucet.FaucetReq{
						Recipient: a.Addr,
						Amount:    amount,
					}
				}
				o, err := ethAbiBind.NewKeyedTransactorWithChainID(key, chainId)
				if err != nil {
					for _, b := range buf[:i] {
						b.Resp <- err
					}
					slog.Error("failed to create keyed transactor with chain id",
						"err", err,
					)
					continue
				}
				// Start to send out the staked amounts, and log the hash.
				hash, err := sendTokens(
					context.Background(),
					c,
					o,
					faucetAddr,
					senderAddr,
					faucetReqs...,
				)
				if err != nil {
					slog.Error("failed to send with faucet", "err", err)
				}
				slog.Info("sent faucet amounts",
					"hash", hash,
					"size", len(buf),
					"faucet reqs", faucetReqs,
					"err?", err,
				)
				// Send responses to the connected
				// buffers, making sure to only send to
				// the ones that we set up.
				for _, b := range buf[:i] {
					b.Resp <- err
				}
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
