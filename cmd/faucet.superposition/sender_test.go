package main

import (
	"context"
	"math/big"
	"testing"
	"time"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/stretchr/testify/assert"
)

func TestFaucetThreeAddresses(t *testing.T) {
	// In a window of 3 seconds, send a request each second, then
	// hopefully they all get batched and sent out.
	expected := []ethCommon.Address{
		h2a("0x6221a9c005f6e47eb398fd867784cacfdcfff4e7"),
		h2a("0xfeb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5"),
		h2a("0x0000000000000000000000000000000000000000"),
	}
	var (
		faucetAddr = h2a("0x6221a9c005f6e47eb398fd867784cacfdcfff4e7")
		senderAddr = h2a("0x0000000000000000000000000000000000000000")
	)
	d := make(chan []ethCommon.Address)
	chainId := new(big.Int).SetInt64(0)
	k, err := ethCrypto.GenerateKey()
	assert.Nilf(t, err, "failed to create key")
	a := time.NewTimer(6 * time.Second)
	c := RunSender(nil, chainId, k, faucetAddr, senderAddr, func(ctx context.Context, c *ethclient.Client, o *ethAbiBind.TransactOpts, faucet, sender ethCommon.Address, addrs ...ethCommon.Address) (hash *ethCommon.Hash, err error) {
		d <- addrs
		return nil, nil
	})
	errs := make(chan error)
	for _, a := range expected {
		time.Sleep(1 * time.Second)
		c <- graph.FaucetReq{a, errs}
	}
	t.Log("sent through faucet requests")
	// Go through all the attempts we sent out, and make sure they're not errors.
	select {
	case addrs := <-d:
		assert.Equalf(t, expected, addrs, "first run inconsistent")
		// Do nothing. Seems like things went okay.
		break
	case <-a.C:
		t.Fatal("exceeded time budget")
	}
	a.Stop()
	for i := 0; i < len(expected); i++ {
		assert.Nilf(t, <-errs, "error happened in mock sender")
	}
	t.Log("done testing the expected list")
	// Test that the buffer is now empty by sending a single address.
	// It's not likely that we'll have a timer related issue here so
	// we can give up checking the time involved.
	c <- graph.FaucetReq{expected[0], errs}
	assert.Equalf(t, expected[:1], <-d, "second run inconsistent")
	assert.Nilf(t, <-errs, "final faucet req has errors")
}

func h2a(x string) ethCommon.Address {
	return ethCommon.HexToAddress(x)
}
