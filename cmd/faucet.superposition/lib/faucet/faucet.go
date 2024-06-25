package faucet

import (
	"bytes"
	"math/big"
	"context"
	_ "embed"

	"github.com/ethereum/go-ethereum"
	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethAbiBind "github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

//go:embed ifaucet.json
var abiBytes []byte

var abi, _ = ethAbi.JSON(bytes.NewReader(abiBytes))

type FaucetReq struct {
	Recipient ethCommon.Address `abi:"recipient"`
	Amount    *big.Int          `abi:"amount"`
}

// SendFaucet to multiple addresses, allowing the contract to randomly
// choose how much to send.
func SendFaucet(ctx context.Context, c *ethclient.Client, o *ethAbiBind.TransactOpts, faucet, sender ethCommon.Address, addrs ...FaucetReq) (hash *ethCommon.Hash, err error) {
	bc := ethAbiBind.NewBoundContract(faucet, abi, c, c, c)
	d, err := abi.Pack("sendTo", addrs)
	if err != nil {
		return nil, err
	}
	g, err := c.EstimateGas(ctx, ethereum.CallMsg{
		From: sender,
		To:   &faucet,
		Data: d,
	})
	if err != nil {
		return nil, err
	}
	o.GasLimit = uint64(float64(g) * 1.5)
	tx, err := bc.Transact(o, "sendTo", addrs)
	if err != nil {
		return nil, err
	}
	h := tx.Hash()
	if _, err := ethAbiBind.WaitMined(ctx, c, tx); err != nil {
		return nil, err
	}
	return &h, nil
}
