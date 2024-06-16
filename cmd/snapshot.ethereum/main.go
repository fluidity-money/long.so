package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/math"
	_ "github.com/fluidity-money/long.so/lib/setup"
	"github.com/fluidity-money/long.so/lib/types/seawater"
	"github.com/fluidity-money/long.so/lib/types"

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
		// Get the decimals for each unique pool.
		// Store the positions in a map so we can reconcile the results together easier.
		positionMap := make(map[string]seawater.Position, len(positions))
		// Make a separate RPC lookup for the current price of each pool.
		// Pack the RPC data to be batched using storage slot lookups.
		d := packRpcPosData(config.SeawaterAddr.String(), positionMap)
		// Request from the RPC the batched lookup of this data.
		// Makes multiple requests if the request size exceeds the current restriction.
		resps, err := reqPositions(context.Background(), config.GethUrl, d, httpPost)
		if err != nil {
			log.Fatalf("positions request: %v", err)
		}
		var (
			ids      = make([]types.Number, len(positions))
			amount0s = make([]types.UnscaledNumber, len(positions))
			amount1s = make([]types.UnscaledNumber, len(positions))
		)
		for i, r := range resps {
			amount0Rat, amount1Rat := math.GetAmountsForLiq(
				pools[r.Pool].curSqrtRatio,
				positionMap[r.Pos.String()].Lower.Big(),
				positionMap[r.Pos.String()].Upper.Big(),
				r.Delta.Big(),
			)
			var (
				amount0 = mulRatToInt(amount0Rat, tokens[r.Pool].decimals)
				amount1 = mulRatToInt(amount1Rat, tokens[r.Pool].decimals)
			)
			ids[i] = r.Id
			amount0s[i] = amount0
			amount1s[i] = amount1
		}
		if err := storePositions(ids, amount1s, amount1s); err != nil {
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
