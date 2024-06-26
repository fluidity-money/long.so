package main

import (
	"context"
	"math/big"
	"testing"
	"time"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"
	"github.com/fluidity-money/long.so/cmd/faucet.superposition/lib/faucet"

	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/stretchr/testify/assert"
)

func TestFaucetThreeAddresses(t *testing.T) {
	// Test sending to 3 addresses, all waiting a second after
	// sending one to see how things are batched.
	responses := make(chan error)
	recipients := []graph.FaucetReq{
		{h2a("0x6221a9c005f6e47eb398fd867784cacfdcfff4e7"), true, responses},
		{h2a("0xfeb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5"), true, responses},
		{h2a("0x0000000000000000000000000000000000000000"), false, responses},
	}
	key, _ := ethCrypto.GenerateKey()
	data := make(chan []ethCommon.Address)
	f := func(ctx context.Context, c *ethclient.Client, o *ethAbiBind.TransactOpts, faucetAddr, sender ethCommon.Address, addrs ...faucet.FaucetReq) (tx *ethTypes.Transaction, err error) {
		// Explicitly copy the array that's in use here.
		x := make([]ethCommon.Address, len(addrs))
		for i, a := range addrs {
			x[i] = a.Recipient
		}
		data <- x
		tx = new(ethTypes.Transaction)
		return tx, nil
	}
	wait := func(ctx context.Context, c *ethclient.Client, tx *ethTypes.Transaction) error {
		return nil
	}
	// Create the server first to get started.
	requests := RunSender(
		nil,                      // Sepolia geth
		nil,                      // SPN geth
		new(big.Int).SetInt64(1), // Sepolia chain ID
		new(big.Int).SetInt64(2), // SPN chain ID
		key,
		h2a("0x0000000000000000000000000000000000000000"), // Sender addr
		h2a("0x03d9371825f0424b9b2c0b01630351c8d559c2bc"), // Faucet addr Sepolia
		h2a("0x027e3a2d86a7894c7ef68a3df1159496c88fedfc"), // Faucet addr SPN
		f,
		wait,
	)
	go func() {
		for _, a := range recipients {
			time.Sleep(time.Second)
			requests <- a
		}
	}()
	killTimer := time.NewTimer(10 * time.Second)
	for i := 0; i < 1; i++ {
		select {
		case <-killTimer.C:
			// We exceeded the batch time!
			t.Fatal("kill timer exceeded")
		case d := <-data:
			// We need this twice, the first being the Sepolia send, and the latter being SPN.
			for x, a := range d {
				assert.Equalf(t, recipients[x].Addr, a, "not equal recipient in batch!")
			}
			assert.Equalf(t, 3, len(d), "length of the response batch didn't make sense!")
		}
	}
	killTimer.Stop() // Kill the timer.
}

func h2a(x string) ethCommon.Address {
	return ethCommon.HexToAddress(x)
}
