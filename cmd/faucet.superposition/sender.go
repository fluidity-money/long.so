package main

import (
	"context"
	"crypto/ecdsa"
	"log/slog"
	"math/big"
	"math/rand"
	"time"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// BufferDuration to reuse to buffer requests to the faucet in.
const BufferDuration = 4 * time.Second

type SendFaucetFunc func(ctx context.Context, c *ethclient.Client, o *ethAbiBind.TransactOpts, faucet, sender ethCommon.Address, addrs ...ethCommon.Address) (hash *ethCommon.Hash, err error)

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
				addrs := make([]ethCommon.Address, i)
				for x, a := range buf[:i] {
					addrs[x] = a.Addr
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
					addrs...,
				)
				if err != nil {
					slog.Error("failed to send with faucet", "err", err)
				}
				slog.Info("sent faucet amounts",
					"hash", hash,
					"size", len(buf),
					"addrs", addrs,
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
	return time.Duration(rand.Intn(3))
}
