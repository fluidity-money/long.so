package leo

import (
	"encoding/hex"
	"math/big"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/fluidity-money/long.so/lib/types"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

func TestHashToBytes8Data(t *testing.T) {
	h := hashToBytes8Data(ethCommon.HexToHash("0x1999784708000000000000000000000000000000000000000000000000000000"))
	assert.Equal(t, types.DataFromString("0x1999784708000000"), h)
}

func TestUnpackCampaignCreated(t *testing.T) {
	var (
		topic1 = ethCommon.HexToHash("0x27670260e0e7fe46000000000000000000000000000000000000000000000000")
		topic2 = ethCommon.HexToHash("0x00000000000000000000000022b9fa698b68bba071b513959794e9a47d19214c")
		topic3 = ethCommon.HexToHash("0x000000000000000000000000376bf949c05ebae6fdb0fcf2ca6ecced208ec670")
	)
	d, err := hex.DecodeString("00000000fff27618000d89e8feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d500000000000000000000000066ebec9b000000006ce046fb0000000000000064")
	if err != nil {
		t.Fatalf("failed to decode string: %v", err)
	}
	c, err := UnpackCampaignCreated(topic1, topic2, topic3, d)
	if err != nil {
		t.Fatalf("unpack campaign created: %v", err)
	}
	assert.Equalf(t,
		types.DataFromString("0x27670260e0e7fe46"),
		c.Identifier,
		"identifier not equal",
	)
	assert.Equalf(t,
		types.AddressFromString("0x22b9fa698b68bba071b513959794e9a47d19214c"),
		c.Pool,
		"pool not equal",
	)
	assert.Equalf(t, time.Unix(1726737563, 0), c.Starting, "starting not equal")
	assert.Equalf(t, time.Unix(1826637563, 0), c.Ending, "ending not equal")
	assert.Equalf(t,
		types.AddressFromString("0x376bf949C05EBAE6fdB0FCF2CA6ECCEd208Ec670"),
		c.Token,
		"token not equal",
	)
	assert.Equalf(t, uint64(100), c.PerSecond, "token per second not equal")
	assert.Equalf(t, int32(-887272), c.TickLower, "tick lower not equal")
	assert.Equalf(t, int32(887272), c.TickUpper, "tick upper not equal")
}

func TestUnpackCampaignBalanceUpdated(t *testing.T) {
	var (
		topic1 = ethCommon.HexToHash("0x27670260e0e7fe46000000000000000000000000000000000000000000000000")
		topic2 = ethCommon.HexToHash("0x000000000000000000000000000000000001ed09bead87c0378d8e6400000000")
		topic3 = ethCommon.HexToHash("0x0000000000000000000000000000000000000000000000000000000000000000")
	)
	d, err := hex.DecodeString("")
	if err != nil {
		t.Fatalf("failed to decode string: %v", err)
	}
	u, err := UnpackCampaignBalanceUpdated(topic1, topic2, topic3, d)
	if err != nil {
		t.Fatalf("unpack campaign created: %v", err)
	}
	assert.Equalf(t,
		types.DataFromString("0x27670260e0e7fe46"),
		u.Identifier,
		"identifier not correct",
	)
}

func TestUnpackDetails(t *testing.T) {
	//26959946541608605233643795350844886809526531442317004630100690334951
	lower, upper, owner := unpackDetails(new(big.Int).SetBits([]big.Word{
		8612231381554033895,
		429782047290621318,
		431143102912,
		4294967276,
	}))
	assert.Equalf(t, int32(-20), lower, "lower is wrong")
	assert.Equalf(t, int32(100), upper, "upper is wrong")
	assert.Equalf(t,
		types.AddressFromString(ethCommon.HexToAddress("0x6221a9c005f6e47eb398fd867784cacfdcfff4e7").String()),
		owner,
		"owner is wrong",
	)
}

func TestUnpackTimes(t *testing.T) {
	//1701411834604692327378907846580747919949856
	starting, ending, perSecond := unpackTimes(new(big.Int).SetBits([]big.Word{32, 545464, 5000, 0}))
	assert.Equalf(t, uint64(5000), starting, "starting not equal")
	assert.Equalf(t, uint64(545464), ending, "ending not equal")
	assert.Equalf(t, uint64(32), perSecond, "per second not equal")
}

func TestUnpackExtras(t *testing.T) {
	//29230032814334249381340450918364660083204158393161
	tickLower, tickUpper, starting, ending := unpackExtras(new(big.Int).SetBits([]big.Word{
		2889,
		1888,
		85899346119,
		0,
	}))
	assert.Equalf(t, int32(20), tickLower, "lower is wrong")
	assert.Equalf(t, int32(199), tickUpper, "upper is wrong")
	assert.Equalf(t, uint64(1888), starting, "starting is wrong")
	assert.Equalf(t, uint64(2889), ending, "ending is wrong")
}
