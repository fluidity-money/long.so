package erc20

import (
	"context"
	"bytes"
	"math/big"
	_ "embed"
	"fmt"

	"github.com/fluidity-money/long.so/lib/types"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/ethclient"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

// multicallAddr from the default web config multicall (testnet only!)
var multicallAddr = ethCommon.HexToAddress("0x42aaE78422EF3e8E6d0D88e58E25CA7C7Ecb9D5a")

var (
	//go:embed erc20.json
	erc20AbiBytes []byte
	//go:embed multicall.json
	multicallAbiBytes []byte
)

var (
	erc20Abi, _     = ethAbi.JSON(bytes.NewReader(erc20AbiBytes))
	multicallAbi, _ = ethAbi.JSON(bytes.NewReader(multicallAbiBytes))
)

func GetErc20Details(ctx context.Context, c *ethclient.Client, addr_ types.Address) (name string, symbol string, totalSupply types.UnscaledNumber, decimals uint8, err error) {
	if !ethCommon.IsHexAddress(addr_.String()) {
		err = fmt.Errorf("bad erc20 address: %v", err)
		return
	}
	addr := ethCommon.HexToAddress(addr_.String())
	type multicallCall struct {
		Target ethCommon.Address `abi:"target"`
		Bytes  []byte            `abi:"callData"`
	}
	b := ethAbiBind.NewBoundContract(multicallAddr, multicallAbi, c, c, c)
	nameCd, err := erc20Abi.Pack("name")
	if err != nil {
		return
	}
	totalSupplyCd, err := erc20Abi.Pack("totalSupply")
	if err != nil {
		return
	}
	decimalsCd, err := erc20Abi.Pack("decimals")
	if err != nil {
		return
	}
	symbolCd, err := erc20Abi.Pack("symbol")
	if err != nil {
		return
	}
	opts := ethAbiBind.CallOpts{
		Context: ctx,
	}
	var i []any
	err = b.Call(&opts, &i, "aggregate", []multicallCall{
		{addr, nameCd},
		{addr, symbolCd},
		{addr, totalSupplyCd},
		{addr, decimalsCd},
	})
	if err != nil {
		return
	}
	return decodeErc20Details(i[1])
}

func decodeErc20Details(i any) (name string, symbol string, totalSupply types.UnscaledNumber, decimals uint8, err error) {
	b, ok := i.([][]byte)
	if !ok {
		err = fmt.Errorf("bad multicall data: %T", i)
		return
	}
	name_, err := erc20Abi.Unpack("name", b[0])
	if err != nil {
		return
	}
	if name, ok = name_[0].(string); !ok {
		err = fmt.Errorf("bad name: %T", name_)
		return
	}
	symbol_, err := erc20Abi.Unpack("symbol", b[1])
	if err != nil {
		return
	}
	if symbol, ok = symbol_[0].(string); !ok {
		err = fmt.Errorf("bad symbol: %T", symbol_)
		return
	}
	totalSupply__, err := erc20Abi.Unpack("totalSupply", b[2])
	if err != nil {
		return
	}
	totalSupply_, ok := totalSupply__[0].(*big.Int)
	if  !ok {
		err = fmt.Errorf("bad totalSupply: %T", totalSupply_)
		return
	}
	totalSupply = types.UnscaledNumberFromBig(totalSupply_)
	decimals_, err := erc20Abi.Unpack("decimals", b[3])
	if err != nil {
		return
	}
	if decimals, ok = decimals_[0].(uint8); !ok {
		err = fmt.Errorf("bad decimals: %T", decimals_)
		return
	}
	return
}
