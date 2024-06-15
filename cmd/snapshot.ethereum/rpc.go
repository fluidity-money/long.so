package main

import (
	"fmt"

	"github.com/fluidity-money/long.so/lib/types/seawater"
)

const (
	// StorageOffset to access using the eth_getStorageAt function.
	StorageOffset = "0x00"

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

	posResp struct {
		pool     string
		position int
		delta    *big.Int
	}
)

// packRpcData by concatenating the pool address with the position id, so
// we can quickly unpack it later. Assumes poolAddr, and ammAddr, are
// correctly formatted (0x[A-Za-z0-9]{40}).
func packRpcData(ammAddr, poolAddr string, positions []seawater.Position) (req []rpcReq) {
	req = make([]rpcReq, len(positions))
	for i, p := range positions {
		req[i] = rpcReq{
			JsonRpc: "2.0",
			Id:      poolAddr + positions.Id.String(),
			Method:  "eth_getStorageAt",
			// TODO make the offset
			Params: []string{ammAddr, StorageOffset, "latest"},
		}
	}
	return
}

// reqPositions by querying the RPC provider with the requested
// positions. Returns the pool and the ID by splitting the retured ID up.
// Batches the response and uses an internal goroutine group if the
// request is above the batch limit. If it encounters a situation where
// anything is returned in error, it sends a done message to all the
// Goroutines after attempting to drain them for 5 seconds.
func reqPositions(url string, req []rpcReq) ([]rpcResp, error) {
	var (
		chanReqs  = make([]rpcReq)
		chanResps = make(chan rpcResp)
		chanErrs  = make(chan error)
		chanDone  = make(chan bool)
	)
	// Figure out the maximum number of goroutines that we can run to
	// make the requests. Scaling up accordingly.
	frames := len(req) % BatchSize
	workerCount := min(frames, WorkerCount)
	for i := 0; i < workerCount; i++ {
		go func() {
			for {
				select {
				case <-done:
					// Time to stop processing. An error happened externally/we finished.
					return
				case r := <-reqs:
					// Make the request, then unpack the data to send back.
					resp, err := http.Post(url, "application/json", r)
					if err != nil {
						chanErrs <- fmt.Errorf("request: %v", err)
						return
					}
					defer resp.Body.Close()
					var resps []rpcResp
					if err := json.NewDecoder(resp.Body).Decode(&resps); err != nil {
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
						delta, ok := new(big.Int).SetString(strings.TrimPrefix(p.Result, "0x"))
						if !ok {
							chanErrs <- fmt.Errorf("unpacking delta: %#v", p.Result)
							return
						}
						chanResps <- posResp{
							pool,
							position,
							delta,
						}
					}
				}
			}
		}()
	}
	// Start to unpack everything/signal the worker group if we have an error.
	for {

	}
}

func decodeId(x string) (pool string, id string, ok bool) {
	if len(x) < 40 {
		return "", "", false
	}
	pool = x[:40]
	id = x[40:]
	return pool, id, true
}
