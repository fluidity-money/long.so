package main

import (
	"log/slog"
	"os"
	"strconv"

	"github.com/fluidity-money/long.so/lib/setup"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/features"

	_ "github.com/lib/pq"

	gormSlog "github.com/orandin/slog-gorm"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	EnvIngestorShouldPoll   = "SPN_INGESTOR_SHOULD_POLL"
	EnvPaginationBlockCount = "SPN_INGESTOR_PAGINATION_BLOCK_COUNT"
	EnvPaginationPollWait   = "SPN_INGESTOR_PAGINATION_POLL_WAIT"
	EnvThirdwebAddr         = "SPN_THIRDWEB_ACCOUNT_FACTORY_ADDR"
)

const (
	// DefaultPaginationBlockCount to increase the last known block tracked
	// by with.
	DefaultPaginationBlockCount = 10_000

	// DefaultPaginationPollWait to wait between polls.
	DefaultPaginationPollWait = 2 // Seconds
)

func main() {
	defer setup.Flush()
	config := config.Get()
	db, err := gorm.Open(postgres.Open(config.PickTimescaleUrl()), &gorm.Config{
		Logger: gormSlog.New(),
	})
	if err != nil {
		setup.Exitf("opening postgres: %v", err)
	}
	// Start to ingest block headers by connecting to the websocket given.
	c, err := ethclient.Dial(config.GethUrl)
	if err != nil {
		setup.Exitf("websocket dial: %v", err)
	}
	defer c.Close()
	/* Ingestor-specific configuration. */
	ingestorShouldPoll := os.Getenv(EnvIngestorShouldPoll) != ""
	slog.Info("ingestor should poll?", "status", ingestorShouldPoll)
	var ingestorPagination uint64
	ingestorPagination_ := os.Getenv(EnvPaginationBlockCount)
	if ingestorPagination_ == "" {
		slog.Info("using the default pagination count",
			"default amount", DefaultPaginationBlockCount,
		)
		ingestorPagination = DefaultPaginationBlockCount
	} else {
		var err error
		ingestorPagination, err = strconv.ParseUint(ingestorPagination_, 10, 64)
		if err != nil {
			setup.Exitf(
				"failed to parse pagination block increase, string is %#v: %v",
				ingestorPagination_,
				err,
			)
		}
	}
	var ingestorPollWait int
	ingestorPollWait_ := os.Getenv(EnvPaginationPollWait)
	if ingestorPollWait_ == "" {
		slog.Info("using the ingestor polling seconds wait",
			"default amount", DefaultPaginationPollWait,
		)
		ingestorPollWait = DefaultPaginationPollWait
	} else {
		i, err := strconv.ParseInt(ingestorPollWait_, 10, 32)
		if err != nil {
			setup.Exitf(
				"failed to parse pagination poll wait, string is %#v: %v",
				ingestorPollWait_,
				err,
			)
		}
		ingestorPollWait = int(i)
	}
	thirdwebFactoryAddr := types.AddressFromString(os.Getenv(EnvThirdwebAddr))
	Entry(
		features.Get(),
		config,
		thirdwebFactoryAddr,
		ingestorShouldPoll,
		ingestorPagination,
		ingestorPollWait,
		c,
		db,
	)
}
