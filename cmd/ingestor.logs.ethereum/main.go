package main

import (
	"log/slog"
	"math/rand"
	"os"

	"github.com/fluidity-money/long.so/lib/setup"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/features"
	"github.com/fluidity-money/long.so/lib/types"

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
	// DefaultPaginationBlockCountMin to use as the minimum number of blocks
	// to increase by.
	DefaultPaginationBlockCountMin = 1000

	// DefaultPaginationBlockCountMax to increase the last known block tracked
	// by with.
	DefaultPaginationBlockCountMax = 5000

	// DefaultPaginationPollWait to wait between polls.
	DefaultPaginationPollWait = 4 // Seconds
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
	ingestorPagination := rand.Intn(DefaultPaginationBlockCountMax-DefaultPaginationBlockCountMin) + DefaultPaginationBlockCountMin
	slog.Info("polling configuration",
		"poll wait time amount", DefaultPaginationPollWait,
		"pagination block count min", DefaultPaginationBlockCountMin,
		"pagination block count max", DefaultPaginationBlockCountMax,
		"pagination count", ingestorPagination,
	)
	thirdwebFactoryAddr := types.AddressFromString(os.Getenv(EnvThirdwebAddr))
	Entry(
		features.Get(),
		config,
		thirdwebFactoryAddr,
		ingestorShouldPoll,
		ingestorPagination,
		DefaultPaginationPollWait,
		c,
		db,
	)
}
