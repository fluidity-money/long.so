package leo

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashToBytes8Data(t *testing.T) {
	h := hashToBytes8Data(ethCommon.HexToHash("0x1999784708000000000000000000000000000000000000000000000000000000"))
	assert.Equal(t, h, "0x1999784708")
}
