package erc20

import (
	"bytes"
	_ "embed"
	"encoding/hex"
	"fmt"
	"math/big"

	"github.com/fluidity-money/amm.superposition.so/lib/types"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

//go:embed abi.json
var abiBytes []byte

var abi, _ = ethAbi.JSON(bytes.NewReader(abiBytes))

// TopicTransfer emitted by Transfer(address,uint256)
var TopicTransfer, _ = hex.DecodeString("ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")

func UnpackTransfer(topic1, topic2, data types.Data) (sender *types.Address, recipient *types.Address, value *types.UnscaledNumber, err error) {
	sender_ := types.AddressFromString(ethCommon.HexToAddress(topic1.String()).String())
	sender = &sender_
	recipient_ := types.AddressFromString(ethCommon.HexToAddress(topic2.String()).String())
	recipient = &recipient_
	valueB, err := data.Bytes()
	if err != nil {
		return nil, nil, nil, fmt.Errorf("value bytes: %v", err)
	}
	// If valueB is 0x, then no value was transferred
	if len(valueB) != 0 {
		unpacked, err := abi.Unpack("Transfer", valueB)
		if err != nil {
			return nil, nil, nil, fmt.Errorf("transfer unpack, value: %#v: %v", data, err)
		}
		a, ok := unpacked[0].(*big.Int)
		if !ok {
			return nil, nil, nil, fmt.Errorf("transfer unpack not int: %T", a)
		}
		value_ := types.UnscaledNumberFromBigInt(a)
		value = &value_
	} else {
		value_ := types.EmptyUnscaledNumber()
		value = &value_
	}
	return
}
