package purr_stream

import (
	"bytes"
	_ "embed"

	"github.com/fluidity-money/long.so/lib/types"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

var TopicDonated = abi.Events["Donated"].ID

//go:embed abi.json
var abiBytes []byte

var abi, _ = ethAbi.JSON(bytes.NewReader(abiBytes))

func UnpackDonated(topic1, topic2, topic3 ethCommon.Hash) (*Donated, error) {
	return &Donated{
		Cat:     hashToBytes8Data(topic1),
		Address: hashToAddr(topic2),
		Amount:  hashToUnscaledNumber(topic3),
	}, nil
}

func hashToBytes8Data(t ethCommon.Hash) types.Data {
	b := t.Bytes()[:8]
	return types.DataFromBytes(b)
}

func hashToAddr(h ethCommon.Hash) types.Address {
	v := ethCommon.BytesToAddress(h.Bytes())
	return types.AddressFromString(v.String())
}

func hashToUnscaledNumber(h ethCommon.Hash) types.UnscaledNumber {
	return types.UnscaledNumberFromBig(h.Big())
}
