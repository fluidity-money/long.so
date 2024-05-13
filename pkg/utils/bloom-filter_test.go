package main

import (
	"encoding/hex"
	"math"
	"math/big"
	"math/rand"
	"testing"

	"github.com/stretchr/testify/assert"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

func TestEncodePacked(t *testing.T) {
	c, _ := hex.DecodeString("0000000000000000000000006221a9c005f6e47eb398fd867784cacfdcfff4e70000000000000000000000000000000000000000000000000000000000000000")
	a := ethCommon.HexToAddress("0x6221a9c005f6e47eb398fd867784cacfdcfff4e7")
	i := 0
	b := encodePacked(a, i)
	assert.Equal(t, c, b)
}

func TestAddToBloom(t *testing.T) {
	/*
	 * P is the probability of a false positive.
	 *
	 * k is the amount of hash functions used.
	 * n is the amount of elements in the bloom.
	 * m is the amount of bits.
	 *
	 * P = (1 - (1 - ((1 / m) ^ (k * n)))) ^ k
	 *
	 * For us, this would be:
	 *
	 * P = (1 - (1 - ((1 / 256) ^ (8 * 1000)))) ^ 8
	 *
	 * Assuming 1000 records.
	 */
	var (
		hashAmt = 8.0
		elems   = 1000.0
		bits    = 256.0
	)
	prob := 1 - math.Pow(1-math.Pow(1.0-1.0/bits, hashAmt*elems), hashAmt)
	addresses := make([]ethCommon.Address, 1000)
	bloom := new(big.Int)
	for i := 0; i < len(addresses); i++ {
		a := newAddr()
		addresses[i] = a
		addToBloom(bloom, int(hashAmt), a)
	}
	// Test that we can validate all the addresses.
	for _, a := range addresses {
		assert.True(t, bloomContains(bloom, int(hashAmt), a))
	}
	// Test that the amount of probabilities is in line.
	attempts := 1_000_000
	hits := 0
	for i := 0; i < attempts; i++ {
		if bloomContains(bloom, int(hashAmt), newAddr()) {
			hits++
		}
	}
	// Check!
	occurances := float64(hits / attempts)
	assert.Falsef(
		t, occurances > prob,
		"bloom filter not correct! occurances was %v, max is %v. hits was %v",
		occurances,
		prob,
		hits,
	)
}

func newAddr() ethCommon.Address {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return ethCommon.BytesToAddress(b)
}
