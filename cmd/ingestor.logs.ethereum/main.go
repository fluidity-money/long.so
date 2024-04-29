package main

import (
	"log"
	"os"

	_ "github.com/fluidity-money/long.so/lib/setup"

	"github.com/fluidity-money/long.so/lib/features"
	"github.com/fluidity-money/long.so/lib/config"

	_ "github.com/lib/pq"

	"gorm.io/gorm"
	"gorm.io/driver/postgres"

	"github.com/ethereum/go-ethereum/ethclient"
)

// EnvGethUrl to connect to the websocket from.
const EnvGethUrl = "SPN_GETH_WS_URL"

func main() {
	config := config.Get()
	db, err := gorm.Open(postgres.Open(config.TimescaleUrl))
	if err != nil {
		log.Fatalf("opening postgres: %v", err)
	}
	// Start to ingest block headers by connecting to the websocket given.
	c, err := ethclient.Dial(os.Getenv(EnvGethUrl))
	if err != nil {
		log.Fatalf("websocket dial: %v", err)
	}
	defer c.Close()
	Entry(features.Get(), config, c, db)
}
