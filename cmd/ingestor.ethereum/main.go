package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/fluidity-money/amm.superposition.so/lib/setup"

	"github.com/fluidity-money/amm.superposition.so/lib/features"
	"github.com/fluidity-money/amm.superposition.so/lib/config"

	_ "github.com/lib/pq"

	"github.com/gorilla/websocket"
)

// EnvGethUrl to connect to the websocket from.
const EnvGethUrl = "SPN_GETH_WS_URL"

func main() {
	db, err := sql.Open("postgres", config.Get().TimescaleUrl)
	if err != nil {
		log.Fatalf("opening postgres: %v", err)
	}
	defer db.Close()
	// Start to ingest block headers by connecting to the websocket given.
	c, _, err := websocket.DefaultDialer.Dial(os.Getenv(EnvGethUrl), nil)
	if err != nil {
		log.Fatalf("websocket dial: %v", err)
	}
	defer c.Close()
	Entry(features.Get(), c, db)
}
