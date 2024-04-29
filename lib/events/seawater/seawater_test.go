package seawater

import (
	"testing"
	"encoding/hex"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

func TestUnpackMintPosition(t *testing.T) {
	var (
		topic1 = ethCommon.HexToHash("0x0000000000000000000000000000000000000000000000000000000000000000")
		topic2 = ethCommon.HexToHash("0x0000000000000000000000003f1eae7d46d88f08fc2f8ed27fcb2ab183eb2d0e")
		topic3 = ethCommon.HexToHash("0x000000000000000000000000c6464a3072270a3da814bb0ec2907df935ff839d")
	)
	d, err := hex.DecodeString("00000000000000000000000000000000000000000000000000000000000098d2000000000000000000000000000000000000000000000000000000000000c3bc")
	if err != nil {
		t.Fatalf("failed to decode string: %v", err)
	}
	_, err = UnpackMintPosition(topic1, topic2, topic3, d)
	if err != nil {
		t.Fatalf("unpack mint position: %v", err)
	}
	// TODO
}

func TestUnpackBurnPosition(t *testing.T) {

}

func TestUnpackPositionLiquidity(t *testing.T) {
}

func TestUnpackCollectFees(t *testing.T) {

}

func TestUnpackNewPool(t *testing.T) {

}

func TestUnpackCollectProtocolFees(t *testing.T) {

}

func TestUnpackSwap2(t *testing.T) {

}

func TestUnpackSwap1(t *testing.T) {

}
