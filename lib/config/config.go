// config contains information about upstream hosts to connect to that
// are absolutely needed.

package config

import (
	"log"
	"os"

	"github.com/fluidity-money/amm.superposition.so/lib/types"
)

// C is configuration for accessing configuration for making requests
type C struct {
	GethUrl, TimescaleUrl string
	SeawaterAddr     types.Address
}

// Get config by querying environment variables.
func Get() C {
	gethUrl := os.Getenv("SPN_GETH_URL")
	if gethUrl == "" {
		log.Fatal("SPN_GETH_URL not set")
	}
	timescaleUrl := os.Getenv("SPN_TIMESCALE")
	if timescaleUrl == "" {
		log.Fatal("SPN_TIMESCALE not set")
	}
	seawaterAddr := os.Getenv("SPN_SEAWATER_ADDR")
	if seawaterAddr == "" {
		log.Fatal("SPN_SEAWATER_ADDR not set")
	}
	return C{
		GethUrl:           gethUrl,
		TimescaleUrl:      timescaleUrl,
		SeawaterAddr: types.Address(seawaterAddr),
	}
}
