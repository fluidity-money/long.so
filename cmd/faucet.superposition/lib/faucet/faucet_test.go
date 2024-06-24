package faucet

import (
	"encoding/hex"
	"testing"
	"math/big"

	"github.com/stretchr/testify/assert"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

func TestAbiPacking(t *testing.T) {
	d, err := abi.Pack("sendTo", []FaucetReq{{
		Recipient: ethCommon.HexToAddress("0x6221a9c005f6e47eb398fd867784cacfdcfff4e7"),
		Amount:    new(big.Int).SetInt64(123),
	}})
	assert.Nilf(t, err, "error happened packing")
	assert.Equalf(t, "057f3e37000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006221a9c005f6e47eb398fd867784cacfdcfff4e7000000000000000000000000000000000000000000000000000000000000007b", hex.EncodeToString(d), "not encoding abi properly")
}
