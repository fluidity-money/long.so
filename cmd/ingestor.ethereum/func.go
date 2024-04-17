package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"log"
	"log/slog"

	"github.com/fluidity-money/amm.superposition.so/lib/features"

	"github.com/fluidity-money/amm.superposition.so/lib/types/ethereum.ingestor"

	_ "github.com/lib/pq"

	"github.com/gorilla/websocket"
)

func Entry(f features.F, c *websocket.Conn, db *sql.DB) {
	// Drain the subscription confirmation message, and log it.
	err := c.WriteJSON(map[string]any{
		"id":      1,
		"jsonrpc": "2.0",
		"method":  "eth_subscribe",
		"params":  []string{"newHeads"},
	})
	if err != nil {
		log.Fatalf("websocket sending newHeads: %v", err)
	}
	// Drain the subscription ID.
	drainSubscriptionId(c)
	for { // Start to read messages from the websocket, and write to the database.
		var buf bytes.Buffer // First copy the return data.
		_, r, err := c.NextReader()
		if err != nil {
			log.Fatalf("failed to open reader: %v", err)
		}
		if _, err := buf.ReadFrom(r); err != nil {
			log.Fatalf("failed to copy response: %v", err)
		}
		logBuf := buf
		var blockHeader struct {
			Params struct {
				Result ethereum_ingestor.BlockHeader `json:"result"`
			} `json:"params"`
			Error *any `json:"error"`
		}
		if err := json.NewDecoder(&buf).Decode(&blockHeader); err != nil {
			log.Fatalf("failed to decode reply, content %#v: %v", logBuf.String(), err)
		}
		slog.Debug("received block header",
			"block header", blockHeader,
			"raw data", logBuf.String(),
		)
		if err := blockHeader.Error; err != nil {
			log.Fatalf("block header: error field: %v", err)
		}
		// Start to write the block header to the database.
		databaseInsertBlockHeader(db, blockHeader.Params.Result)
	}
}

func databaseInsertBlockHeader(db *sql.DB, blockHeader ethereum_ingestor.BlockHeader) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(blockHeader); err != nil {
		log.Fatalf("encoding block header: %v", err)
	}
	_, err := db.Exec(
		"INSERT INTO arbitrum_block_headers (data) VALUES ($1)",
		buf.String(),
	)
	if err != nil {
		log.Fatalf("inserting block headers: %v", err)
	}
}

func drainSubscriptionId(c *websocket.Conn) {
	var buf bytes.Buffer // First copy the return data.
	_, r, err := c.NextReader()
	if err != nil {
		log.Fatalf("failed to open reader: %v", err)
	}
	if _, err := buf.ReadFrom(r); err != nil {
		log.Fatalf("failed to copy response: %v", err)
	}
	slog.Info("drained subscription id", "reply", buf.String())
}
