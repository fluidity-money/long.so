// config contains information about upstream hosts to connect to that
// are absolutely needed.

package config

import (
	"log"
	"log/slog"
	"os"
	"strconv"

	"github.com/fluidity-money/long.so/lib/types"
)

// C is configuration for accessing configuration for making requests
type C struct {
	GethUrl, TimescaleUrl   string
	SeawaterAddr, FusdcAddr types.Address

	/* Ingestor specific configurations */
	IngestorShouldPoll bool
	IngestorPagination   uint64
	IngestorPollWait int
}

// Get config by querying environment variables.
func Get() C {
	/* Global RPC configuration. */
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
	fusdcAddr := os.Getenv("SPN_FUSDC_ADDR")
	if fusdcAddr == "" {
		log.Fatal("SPN_FUSDC_ADDR not set")
	}

	/* Ingestor-specific configuration. */
	ingestorShouldPoll := os.Getenv("SPN_INGESTOR_SHOULD_POLL") != ""
	slog.Info("ingestor should poll?", "status", ingestorShouldPoll)
	var ingestorPagination uint64
	ingestorPagination_ := os.Getenv("SPN_INGESTOR_PAGINATION_BLOCK_COUNT")
	if ingestorPagination_ == "" {
		slog.Info("using the default pagination count",
			"default amount", DefaultPaginationBlockCount,
		)
		ingestorPagination = DefaultPaginationBlockCount
	} else {
		var err error
		ingestorPagination, err = strconv.ParseUint(ingestorPagination_, 10, 64)
		if err != nil {
			log.Fatalf(
				"failed to parse pagination block increase, string is %#v: %v",
				ingestorPagination_,
				err,
			)
		}
	}
	var ingestorPollWait int
	ingestorPollWait_ := os.Getenv("SPN_INGESTOR_PAGINATION_POLL_WAIT")
	if ingestorPollWait_ == "" {
		slog.Info("using the ingestor polling seconds wait",
			"default amount", DefaultPaginationPollWait,
		)
		ingestorPollWait = DefaultPaginationPollWait
	} else {
		i, err := strconv.ParseInt(ingestorPollWait_, 10, 32)
		if err != nil {
			log.Fatalf(
				"failed to parse pagination poll wait, string is %#v: %v",
				ingestorPollWait_,
				err,
			)
		}
		ingestorPollWait = int(i)
	}
	return C{
		GethUrl:      gethUrl,
		TimescaleUrl: timescaleUrl,
		SeawaterAddr: types.AddressFromString(seawaterAddr),
		FusdcAddr:    types.AddressFromString(fusdcAddr),

		IngestorShouldPoll: ingestorShouldPoll,
		IngestorPagination: ingestorPagination,
		IngestorPollWait: ingestorPollWait,
	}
}
