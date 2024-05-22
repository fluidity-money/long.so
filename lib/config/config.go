// config contains information about upstream hosts to connect to that
// are absolutely needed.

package config

import (
	"log"
	"log/slog"
	"os"
	"strconv"

	_ "github.com/fluidity-money/long.so/lib/setup"
	"github.com/fluidity-money/long.so/lib/types"
)

// C is configuration for each service, and globally.
type C struct {
	/* Global configuration */

	GethUrl, TimescaleUrl   string
	SeawaterAddr, FusdcAddr types.Address
	FusdcDecimals           int

	/* Ingestor specific configuration */

	// IngestorShouldPoll enabling the feature to poll the HTTP RPC.
	IngestorShouldPoll bool
	// IngestorPagination amount of blocks to use between polls.
	IngestorPagination uint64
	// IngestorPollWait to use as the number of seconds to wait between polls.
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
		GethUrl:       gethUrl,
		TimescaleUrl:  timescaleUrl,
		SeawaterAddr:  types.AddressFromString(seawaterAddr),
		FusdcAddr:     types.AddressFromString(fusdcAddr),
		FusdcDecimals: DefaultFusdcDecimals,

		IngestorShouldPoll: ingestorShouldPoll,
		IngestorPagination: ingestorPagination,
		IngestorPollWait:   ingestorPollWait,
	}
}
