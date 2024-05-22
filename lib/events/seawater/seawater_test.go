package seawater

import (
	"encoding/hex"
	"testing"

	"github.com/fluidity-money/long.so/lib/types"

	ethCommon "github.com/ethereum/go-ethereum/common"

	"github.com/stretchr/testify/assert"
)

func TestUnpackMintPosition(t *testing.T) {
	var (
		topic1 = ethCommon.HexToHash("0x0000000000000000000000000000000000000000000000000000000000000000")
		topic2 = ethCommon.HexToHash("0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5")
		topic3 = ethCommon.HexToHash("0x0000000000000000000000002f26b901590801476c5bac1debc4e42379127a44")
	)
	d, err := hex.DecodeString("00000000000000000000000000000000000000000000000000000000000098d2000000000000000000000000000000000000000000000000000000000000c3bc")
	if err != nil {
		t.Fatalf("failed to decode string: %v", err)
	}
	p, err := UnpackMintPosition(topic1, topic2, topic3, d)
	if err != nil {
		t.Fatalf("unpack mint position: %v", err)
	}
	assert.Equalf(t, types.EmptyNumber(), p.PosId, "id was not zero")
	assert.Equalf(t,
		types.AddressFromString("0xfeb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5"),
		p.Owner,
		"address not equal",
	)
	assert.Equalf(t,
		types.AddressFromString("0x2f26b901590801476c5bac1debc4e42379127a44"),
		p.Pool,
		"pool not equal",
	)
	assert.Equal(t,
		types.NumberFromInt64(39122),
		p.Lower,
		"lower not equal",
	)
	assert.Equal(t,
		types.NumberFromInt64(50108),
		p.Upper,
		"upper not equal",
	)
}

func TestUnpackBurnPosition(t *testing.T) {
}

func TestUnpackPositionLiquidity(t *testing.T) {
}

func TestUnpackCollectFees(t *testing.T) {

}

func TestUnpackNewPool(t *testing.T) {
	var (
		topic1 = ethCommon.HexToHash("0x0000000000000000000000003f511b0f5ce567899deee6a3c80a2742272687d0")
		topic2 = ethCommon.HexToHash("0x0000000000000000000000000000000000000000000000000000000000000000")
		topic3 = ethCommon.HexToHash("0x0000000000000000000000000000000000000000000000000000000000000000") // topic3 is not used.
	)
	d, err := hex.DecodeString("00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001")
	if err != nil {
		t.Fatalf("failed to decode string: %v", err)
	}
	p, err := UnpackNewPool(topic1, topic2, topic3, d)
	if err != nil {
		t.Fatalf("unpack mint position: %v", err)
	}
	assert.Equalf(t,
		types.AddressFromString("0x3f511b0f5ce567899deee6a3c80a2742272687d0"),
		p.Token,
		"token not equal",
	)
	assert.Equalf(t, uint32(0), p.Fee, "fee not equal")
	assert.Equalf(t, uint8(6), p.Decimals, "decimals not equal")
	assert.Equalf(t, uint8(1), p.TickSpacing, "tick spacing not equal")
}

func TestUnpackCollectProtocolFees(t *testing.T) {

}

func TestUnpackSwap2(t *testing.T) {

}

func TestUnpackSwap1(t *testing.T) {

}
