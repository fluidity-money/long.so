// config contains information about upstream hosts to connect to that
// are absolutely needed.

package config

import (
	"os"
	"log"
)

// C is configuration for accessing configuration for making requests
type C struct {
	GethUrl, TimescaleUrl string
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
	return C{
		GethUrl:   gethUrl,
		TimescaleUrl: timescaleUrl,
	}
}
