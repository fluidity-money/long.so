package main

import (
	"context"
	"crypto/ecdsa"
	"log/slog"
	"math/big"
	"time"

	"github.com/fluidity-money/long.so/lib/config"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"
	"github.com/fluidity-money/long.so/cmd/faucet.superposition/lib/faucet"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

// BufferDuration to reuse to buffer requests to the faucet in.
const BufferDuration = 5 * time.Second

// RunSender, by creating a repeating timer of 5 seconds for the cache window, accumulating requests, then sending out tokens requested on demand. Takes the private key for the sender
func RunSender(config config.C, c *ethclient.Client, chainId *big.Int, key *ecdsa.PrivateKey, faucetAddr, senderAddr ethCommon.Address) chan<- graph.FaucetReq {
	reqs := make(chan graph.FaucetReq)
	go func() {
		t := time.NewTicker(BufferDuration)
		buf := make([]graph.FaucetReq, 10)
		i := 0
		for {
			select {
			case a := <-reqs:
				if len(buf) > i {
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
				addrs := make([]ethCommon.Address, i+1)
				for x, a := range buf[:i] {
					addrs[x] = a.Addr
				}
				o, err := ethAbiBind.NewKeyedTransactorWithChainID(key, chainId)
				if err != nil {
					for _, b := range buf {
						b.Resp <- err
					}
					slog.Error("failed to create keyed transactor with chain id",
						"err", err,
					)
					continue
				}
				// Start to send out the staked amounts, and log the hash.
				hash, err := faucet.SendFaucet(
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
				for _, b := range buf {
					b.Resp <- err
				}
				i = 0
				t.Reset(BufferDuration) // So there's no time lost in the ticker.
			}
		}
	}()
	return reqs
}
