package seawater

import (
	_ "embed"
	"fmt"
	"math/big"

	"github.com/fluidity-money/amm.superposition.so/lib/types"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

var (
	TopicMintPosition            = abi.Events["MintPosition"].ID
	TopicBurnPosition            = abi.Events["BurnPosition"].ID
	TopicTransferPosition        = abi.Events["TransferPosition"].ID
	TopicUpdatePositionLiquidity = abi.Events["UpdatePositionLiquidity"].ID
	TopicCollectFees             = abi.Events["CollectFees"].ID
	TopicNewPool                 = abi.Events["NewPool"].ID
	TopicCollectProtocolFees     = abi.Events["CollectProtocolFees"].ID
	TopicSwap2                   = abi.Events["Swap2"].ID
	TopicSwap1                   = abi.Events["Swap1"].ID
)

//go:embed abi.json
var abiBytes []byte

var abi ethAbi.ABI

func UnpackMintPosition(topic1, topic2 ethCommon.Hash, d []byte) (*MintPosition, error) {
	i, err := abi.Unpack("MintPosition", d)
	if err != nil {
		return nil, err
	}
	pool, ok := i[0].(ethCommon.Address)
	if !ok {
		return nil, fmt.Errorf("bad pool: %T", i[0])
	}
	lower, ok := i[1].(*big.Int)
	if !ok {
		return nil, fmt.Errorf("bad lower: %T", i[1])
	}
	upper, ok := i[2].(*big.Int)
	if !ok {
		return nil, fmt.Errorf("bad upper: %T", i[2])
	}
	return &MintPosition{
		PosId:    hashToNumber(topic1),
		Owner: hashToAddr(topic2),
		Pool:  ethAddrToAddr(pool),
		Lower: types.NumberFromBigInt(lower),
		Upper: types.NumberFromBigInt(upper),
	}, nil
}

func hashToNumber(h ethCommon.Hash) types.Number {
	return types.NumberFromBigInt(h.Big())
}

func hashToAddr(h ethCommon.Hash) types.Address {
	v := ethCommon.BytesToAddress(h.Bytes())
	return types.Address(v.String())
}

func ethAddrToAddr(a ethCommon.Address) types.Address {
	return types.Address(a.String())
}
