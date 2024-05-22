package main

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/fluidity-money/long.so/lib/events/seawater"
	"github.com/fluidity-money/long.so/lib/types"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"

	"github.com/stretchr/testify/assert"
)

func TestHandleLogCallbackNewPool(t *testing.T) {
	// Test the new pool handling code.
	seawaterAddr := ethCommon.HexToAddress("0x0fFC26C47FeD8C54AF2f0872cc51d79D173730a8")
	s := strings.NewReader(`
{
	"address": "0x0ffc26c47fed8c54af2f0872cc51d79d173730a8",
	"topics": [
		"0xcb076a66f4dca163de39a4023de987ca633a005767c796b3772e3462c573e339",
		"0x0000000000000000000000003f511b0f5ce567899deee6a3c80a2742272687d0",
		"0x0000000000000000000000000000000000000000000000000000000000000000"
	],
	"data": "0x00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001",
	"blockNumber": "0xa5a3",
	"transactionHash": "0xb2774f9d137158c9982a54764d9c2ec3fd5f3da3bc73e4937a37d29d8531d255",
	"transactionIndex": "0x1",
	"blockHash": "0x4ea3b2f32d398c23f3278fbb6fe1e74ad21a9216a9d2c8b366b6b6fe87702017",
	"logIndex": "0x0",
	"removed": false
}`)
	var l ethTypes.Log
	assert.Nilf(t, json.NewDecoder(s).Decode(&l), "failed to decode log")
	handleLogCallback(seawaterAddr, l, func(table string, a any) {
		assert.Equalf(t, "events_seawater_newPool", table, "table not equal")
		// This test is captured in a unit test, so we can focus on just testing
		// this one field.
		newPool, ok := a.(*seawater.NewPool)
		assert.Truef(t, ok, "NewPool type coercion not true")
		assert.Equalf(t,
			types.AddressFromString("0x3f511b0f5ce567899deee6a3c80a2742272687d0"),
			newPool.Token,
			"token not equal",
		)
	})
}
