package main

import (
	"bytes"
	"strings"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"encoding/hex"

	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/types/seawater"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

const (
	// BatchLimit to get from the server before using multiple batches.
	BatchLimit = 1500

	// WorkerCount of simultaneous requests that can be made max.
	WorkerCount = 100
)

type (
	rpcReq struct {
		JsonRpc string   `json:"jsonrpc"`
		Id      string   `json:"id"`
		Method  string   `json:"method"`
		Params  []string `json:"params"`
	}

	rpcResp struct {
		Id     string `json:"id"`
		Result string `json:"result"`
		Error  any    `json:"error"`
	}

	// posResp that's also given to gorm to be used with a custom
	// function that does a left join during insertion.
	posResp struct {
		Pool            types.Address
		Pos, Delta types.Number
	}
)

// packRpcPosData by concatenating the pool address with the position id, so
// we can quickly unpack it later. Assumes poolAddr, and ammAddr, are
// correctly formatted (0x[A-Za-z0-9]{40}).
func packRpcPosData(ammAddr string, positions map[string]seawater.Position) (req []rpcReq) {
	req = make([]rpcReq, len(positions))
	i := 0
	for _, p := range positions {
		s := getCalldata(p.Pool, p.Id)
		req[i] = rpcReq{
			JsonRpc: "2.0",
			Id:      encodeId(p.Pool, p.Id),
			Method:  "eth_getStorageAt",
			// TODO make the offset
			Params: []string{ammAddr, s, "latest"},
		}
		i++
	}
	return
}

type HttpReqFn func(url string, contentType string, r io.Reader) (io.ReadCloser, error)

// reqPositions by querying the RPC provider with the requested
// positions. Returns the pool and the ID by splitting the retured ID up.
// Batches the response and uses an internal goroutine group if the
// request is above the batch limit. If it encounters a situation where
// anything is returned in error, it sends a done message to all the
// Goroutines after attempting to drain them for 5 seconds.
func reqPositions(ctx context.Context, url string, reqs []rpcReq, makeReq HttpReqFn) ([]posResp, error) {
	var (
		chanReqs  = make(chan []rpcReq)
		chanResps = make(chan posResp)
		chanErrs  = make(chan error)
		chanDone  = make(chan bool)
	)
	// Figure out the maximum number of goroutines that we can run to
	// make the requests. Scaling up accordingly.
	frames := len(reqs) % BatchLimit
	workerCount := min(frames, WorkerCount)
	for i := 0; i < workerCount; i++ {
		go func() {
			for {
				select {
				case <-chanDone:
					// Time to stop processing. An error happened externally/we finished.
					return
				case r := <-chanReqs:
					var buf bytes.Buffer
					if err := json.NewEncoder(&buf).Encode(r); err != nil {
						chanErrs <- fmt.Errorf("encoding json: %v", err)
						return
					}
					// Make the request, then unpack the data to send back.

					resp, err := makeReq(url, "application/json", &buf)
					if err != nil {
						chanErrs <- fmt.Errorf("request: %v", err)
						return
					}
					if resp == nil {
						chanErrs <- fmt.Errorf("empty rpc resp: %v", err)
						return
					}
					defer resp.Close()
					var resps []rpcResp
					if err := json.NewDecoder(resp).Decode(&resps); err != nil {
						chanErrs <- fmt.Errorf("decoding: %v", err)
						return
					}
					for _, p := range resps {
						// Decode the response data, and decode the ID.
						pool, position, ok := decodeId(p.Id)
						if !ok {
							chanErrs <- fmt.Errorf("unpacking id: %#v", p.Id)
							return
						}
						delta, err := types.NumberFromString(strings.TrimPrefix(p.Result, "0x"))
						if err != nil {
							chanErrs <- fmt.Errorf("unpacking delta: %#v: %v", p.Result, err)
							return
						}
						r := posResp{
							pool,
							*position,
							*delta,
						}
						select {
						case <-chanDone:
							return // Hopefully this will prevent us from going through the rest.
						case chanResps <- r:
							// Do nothing. We sent.
						}
					}
				}
			}
		}()
	}
	go func() {
		b := make([]rpcReq, BatchLimit)
		x := 0
		for _, p := range reqs {
			b[x] = p
			x++
			if x != BatchLimit {
				continue
			}
			c := make([]rpcReq, BatchLimit)
			for i := 0; i < BatchLimit; i++ {
				c[i] = b[i]
			}
			select {
			case <-chanDone:
				return // We're done!
			case chanReqs <- b:
			}
			x = 0
		}
		if x > 0 {
			c := make([]rpcReq, x)
			for i := 0; i < x; i++ {
				c[i] = b[i]
			}
			select {
			case <-chanDone:
				return // We're done!
			case chanReqs <- b:
			}

		}
	}()
	resps := make([]posResp, len(reqs))
	sleepRoutines := func() {
		for {
			chanDone <- true
		}
	}
	// Start to unpack everything/signal the worker group if we have an error.
	for i := 0; i < len(reqs); i++ {
		select {
		case resp := <-chanResps:
			resps[i] = resp
		case <-ctx.Done():
			go sleepRoutines()
			return nil, ctx.Err()
		case err := <-chanErrs:
			// Orphan a goroutine to spam done to the children.
			go sleepRoutines()
			return nil, err
		}
	}
	return resps, nil
}

func decodeId(x string) (pool types.Address, id *types.Number, ok bool) {
	if len(x) < 40 {
		return "", nil, false
	}
	pool = types.AddressFromString(x[:42])
	var err error
	if id, err = types.NumberFromString(x[42:]); err != nil {
		return "", nil, false
	}
	return pool, id, true
}

func encodeId(pool types.Address, id types.Number) string {
	return pool.String() + id.String()
}

func getCalldata(pool types.Address, posId types.Number) string {
	x := append(
		[]byte{0xe7, 0x59, 0xc4, 0x65},
		append(
			ethCommon.LeftPadBytes(ethCommon.HexToAddress(pool.String()).Bytes(), 32),
			ethCommon.LeftPadBytes(posId.Big().Bytes(), 32)...,
		)...,
	)
	return "0x" + hex.EncodeToString(x)
}
