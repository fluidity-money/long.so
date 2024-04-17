package erc20

import (
	"testing"
	"math/big"

	"github.com/fluidity-money/amm.superposition.so/lib/types"

	"github.com/stretchr/testify/assert"
)

func TestUnpackTransfer(t *testing.T) {
	var (
		topic1 = types.DataFromString("0x0000000000000000000000006665E62EF6F6DB29D5F8191FBAC472222C2CC80F")
		topic2 = types.DataFromString("000000000000000000000000cc5bbe7a136b0a949e00c7403987c1056f8bfa63")
		data = types.DataFromString("0x0000000000000000000000000000000000000000000000000000000428c70200")
	)
	expectedVal := new(big.Int).SetInt64(17864000000)
	sender, recipient, value, err := UnpackTransfer(topic1, topic2, data)
	if err != nil {
		t.Fatalf("unpack transfer: %v", err)
	}
	val, err := value.Big()
	if err != nil {
		t.Fatalf("failed to convert big to big int: %v", err)
	}
	assert.Equal(t, "0x6665e62ef6f6db29d5f8191fbac472222c2cc80f", sender.String())
	assert.Equal(t, "0xcc5bbe7a136b0a949e00c7403987c1056f8bfa63", recipient.String())
	assert.True(t, val.Cmp(expectedVal) == 0)
}
