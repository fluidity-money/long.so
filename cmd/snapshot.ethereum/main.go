package main

import (
	"log"
	"math/rand"
	"time"

	_ "github.com/fluidity-money/long.so/lib/setup"
	"github.com/fluidity-money/long.so/lib/config"

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
		err := db.Table("seawater_active_positions_1").Scan(&positions).Error
		if err != nil {
			log.Fatalf("seawater positions scan: %v", err)
		}
		// Pack the RPC data to be batched using storage slot lookups.
		d := packRpcData(positions)
		// Request from the RPC the batched lookup of this data.
		// Makes multiple requests if the request size exceeds the current restriction.
		r, err := requestPositions(positions)
		if err != nil {
			log.Fatalf("positions request: %v", err)
		}
		// Reconcile the IDs from the request with the IDs from
		// the positions. Since we can optionally send a string
		// ID, this simplifies the implementation. But we should
		// test if there's a ID that's left over that wasn't
		// checked, an blow the entire thing up if that's the
		// case.
		if ok := checkAllPosReturned(positions, r); !ok {
			log.Fatalf("failed to retrieve all positions: %v", err)
		}
		// Store the positions in the database. Also include
		// position information to simplify queries on the
		// database later.
		if err := storePositions(positions, r); err != nil {
			log.Fatalf("store positions: %v", err)
		}
	}
}

func randSecs() time.Duration {
	return time.Duration(rand.Intn(3)) * time.Second
}
