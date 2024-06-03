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
	handleLogCallback(seawaterAddr, l, func(table string, a any) error {
		assert.Equalf(t, "events_seawater_newpool", table, "table not equal")
		// This test is captured in a unit test, so we can focus on just testing
		// this one field.
		newPool, ok := a.(*seawater.NewPool)
		assert.Truef(t, ok, "NewPool type coercion not true")
		assert.Equalf(t,
			types.AddressFromString("0x3f511b0f5ce567899deee6a3c80a2742272687d0"),
			newPool.Token,
			"token not equal",
		)
		return nil
	})
}

func TestHandleLogCallbackMintPosition(t *testing.T) {
	// Test the new pool handling code.
	seawaterAddr := ethCommon.HexToAddress("0x40e659f4eB2fdA398ce0860aFB74701d4977E530")
	s := strings.NewReader(`
{
	"address": "0x40e659f4eb2fda398ce0860afb74701d4977e530",
	"blockHash": "0x79fd90d0e9893ecf19863fe5efa73c46d4901fcd4047666f12c7cbdf70689b6f",
	"blockNumber": "0x32",
	"data": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d89e8",
	"logIndex": "0x0",
	"removed": false,
	"topics": [
		"0x7b0f5059c07211d90c2400fc99ac93e0e56db5168afa91f60d178bb6dc1c73f0",
		"0x0000000000000000000000000000000000000000000000000000000000000000",
		"0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5",
		"0x000000000000000000000000e984f758f362d255bd96601929970cef9ff19dd7"
	],
	"transactionHash": "0x20757f5e66e75ba065a02ce052fcd2fa7d51f0ce71487da172cc6b37c286fd75",
	"transactionIndex": "0x1"
}`)
	var l ethTypes.Log
	assert.Nilf(t, json.NewDecoder(s).Decode(&l), "failed to decode log")
	handleLogCallback(seawaterAddr, l, func(table string, a any) error {
		assert.Equalf(t, "events_seawater_mintposition", table, "table not equal")
		// This test is captured in a unit test, so we can focus on just testing
		// this one field.
		newPool, ok := a.(*seawater.MintPosition)
		assert.Truef(t, ok, "MintPosition type coercion not true")
		assert.Equalf(t,
			types.AddressFromString("0xFEb6034FC7dF27dF18a3a6baD5Fb94C0D3dCb6d5"),
			newPool.Owner,
			"token not equal",
		)
		return nil
	})
}

func TestHandleLogCallbackSwap1(t *testing.T) {
	// Test the new pool handling code.
	seawaterAddr := ethCommon.HexToAddress("0x40e659f4eB2fdA398ce0860aFB74701d4977E530")
	s := strings.NewReader(`
{
	"address": "0x40e659f4eb2fda398ce0860afb74701d4977e530",
	"blockHash": "0x987589d1bde38473777e13752f9dd7acb089d3f2abcdec742c985d80a49cce53",
	"blockNumber": "0x44",
	"data": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000a9fe",
	"logIndex": "0x2",
	"removed": false,
	"topics": [
		"0x01bacdc82c3891bc884396788e83d024aafbd4e2a08341fb9c9ce422a683830f",
		"0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5",
		"0x000000000000000000000000e984f758f362d255bd96601929970cef9ff19dd7"
	],
	"transactionHash": "0x36f66e773dbf54c16e65ca12d2c0e4eeb37a66269332d6215f614e686c5b42a7",
	"transactionIndex": "0x1"
}`)
	var l ethTypes.Log
	assert.Nilf(t, json.NewDecoder(s).Decode(&l), "failed to decode log")
	handleLogCallback(seawaterAddr, l, func(table string, a any) error {
		assert.Equalf(t, "events_seawater_swap1", table, "table not equal")
		// This test is captured in a unit test, so we can focus on just testing
		// this one field.
		newPool, ok := a.(*seawater.Swap1)
		assert.Truef(t, ok, "Swap1 type coercion not true")
		assert.Equalf(t,
			types.AddressFromString("0xFEb6034FC7dF27dF18a3a6baD5Fb94C0D3dCb6d5"),
			newPool.User,
			"token not equal",
		)
		return nil
	})
}
