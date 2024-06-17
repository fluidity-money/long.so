// config contains configuration behaviour that should be configured
// using environment variables that're global.

package config

import (
	"log"
	"os"
	"strings"

	_ "github.com/fluidity-money/long.so/lib/setup"
	"github.com/fluidity-money/long.so/lib/types"
)

// C is configuration for each service, and globally.
type C struct {
	GethUrl, TimescaleUrl   string
	SeawaterAddr, FusdcAddr types.Address
	FusdcDecimals           int
}

// Get config by querying environment variables.
func Get() C {
	/* Global RPC configuration. */
	gethUrl := os.Getenv("SPN_GETH_URL")
	if gethUrl == "" {
		log.Fatal("SPN_GETH_URL not set")
	}
	timescaleUrl := strings.ToLower(os.Getenv("SPN_TIMESCALE"))
	if timescaleUrl == "" {
		log.Fatal("SPN_TIMESCALE not set")
	}
	seawaterAddr := strings.ToLower(os.Getenv("SPN_SEAWATER_ADDR"))
	if seawaterAddr == "" {
		log.Fatal("SPN_SEAWATER_ADDR not set")
	}
	fusdcAddr := strings.ToLower(os.Getenv("SPN_FUSDC_ADDR"))
	if fusdcAddr == "" {
		log.Fatal("SPN_FUSDC_ADDR not set")
	}
	return C{
		GethUrl:       gethUrl,
		TimescaleUrl:  timescaleUrl,
		SeawaterAddr:  types.AddressFromString(seawaterAddr),
		FusdcAddr:     types.AddressFromString(fusdcAddr),
		FusdcDecimals: DefaultFusdcDecimals,
	}
}
