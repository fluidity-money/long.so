package leo

import (
	"bytes"
	_ "embed"
	"fmt"
	"math/big"

	"github.com/fluidity-money/long.so/lib/types"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

var (
	TopicCampaignBalanceUpdated = abi.Events["CampaignBalanceUpdated"].ID
	TopicCampaignCreated        = abi.Events["CampaignCreated"].ID
)

//go:embed abi.json
var abiBytes []byte

var abi, _ = ethAbi.JSON(bytes.NewReader(abiBytes))

func hashToNumber(h ethCommon.Hash) types.Number {
	// Always assumes the hash is well-formed.
	return types.NumberFromBig(h.Big())
}

func UnpackCampaignBalanceUpdated(topic1, topic2, topic3 ethCommon.Hash, d []byte) (*CampaignBalanceUpdated, error) {
	return &CampaignBalanceUpdated{
		Identifier: hashToBytes8Data(topic1),
		NewMaximum: hashToNumber(topic2),
	}, nil
}

// UnpackCampaignCreated events, also unpacking the packed "details"
// field to some of the extra bits of information we track
func UnpackCampaignCreated(topic1, topic2, topic3 ethCommon.Hash, d []byte) (*CampaignBalanceUpdated, error) {
	i, err := abi.Unpack("CampaignCreated", d)
	if err != nil {
		return nil, err
	}
	details, ok := i[0].(*big.Int)
	if !ok {
		return nil, fmt.Errorf("bad details: %T", i[0])
	}
	times, ok := i[1].(*big.Int)
	if !ok {
		return nil, fmt.Errorf("bad times: %T", i[1])
	}
	tickLower, tickUpper, owner, err := unpackDetails(details)
	if err != nil {
		return nil, err
	}
	starting, ending, err := unpackTimes(times)
	if err != nil {
		return nil, err
	}
	return &CampaignCreated{
		Identifier: hashToBytes8Data(topic1),
		Pool: hashToAddress(topic2),
		Token: hashToAddress(topic3),
		TickLower: tickLower,
		TickUpper: tickUpper,
		Owner: owner,
		Starting: starting,
		Ending: ending,
	}, nil
}

func hashToBytes8Data(t ethCommon.Hash) types.Data {
	b := t.Bytes()[:8]
	return types.DataFromBytes(b)
}

func unpackDetails(i *big.Int) (tickLower int32, tickUpper int32, owner types.Address, err error) {

}

func unpackTimes(i int128) (starting uint64, ending uint64, err error) {

}