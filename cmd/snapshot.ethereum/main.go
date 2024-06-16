package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"time"
	"context"

	"github.com/fluidity-money/long.so/lib/config"
	_ "github.com/fluidity-money/long.so/lib/setup"
	"github.com/fluidity-money/long.so/lib/types/seawater"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// WaitSecs to wait before checking each position again.
const WaitSecs = 5

func main() {
	config := config.Get()
	db, err := gorm.Open(postgres.Open(config.TimescaleUrl), nil)
	if err != nil {
		log.Fatalf("database open: %v", err)
	}
	for {
		time.Sleep((WaitSecs * time.Second) + randSecs())
		// Get every active position in the database, including the pools.
		var positions []seawater.Position
		err := db.Table("seawater_active_positions_1").
			Select("pos_id", "pool", "tick_lower", "tick_upper").
			Scan(&positions).
			Error
		if err != nil {
			log.Fatalf("seawater positions scan: %v", err)
		}
		// Pack the RPC data to be batched using storage slot lookups.
		d := packRpcData(config.SeawaterAddr.String(), positions...)
		// Request from the RPC the batched lookup of this data.
		// Makes multiple requests if the request size exceeds the current restriction.
		r, err := reqPositions(context.Background(), "TODO", d, httpPost)
		if err != nil {
			log.Fatalf("positions request: %v", err)
		}
		// Store the positions in the database. Also include
		// position information to simplify queries on the
		// database later. Uses a specialised database function
		// which also left joins information on the position from the
		// positions table to reduce the time to look things up.
		if err := storePositions(r); err != nil {
			log.Fatalf("store positions: %v", err)
		}
	}
}

func randSecs() time.Duration {
	return time.Duration(rand.Intn(3)) * time.Second
}

func httpPost(url string, contentType string, r io.Reader) (io.ReadCloser, error) {
	resp, err := http.Post(url, "application/json", r)
	if err != nil {
		return nil, err
	}
	switch s := resp.StatusCode; s {
	case http.StatusOK:
		// Do nothing
	default:
		var buf bytes.Buffer
		defer resp.Body.Close()
		if _, err := buf.ReadFrom(resp.Body); err != nil {
			return nil, fmt.Errorf("bad resp drain: %v", err)
		}
		return nil, fmt.Errorf("bad resp status %#v: %v", buf.String(), s)
	}
	return resp.Body, nil
}
