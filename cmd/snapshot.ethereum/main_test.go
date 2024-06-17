package main

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMulRatToInt(t *testing.T) {
	x, _ := new(big.Rat).SetString("1.028")
	y := mulRatToInt(x, 18)
	assert.Equal(t, "1028000000000000000", y.Text(10))
}
