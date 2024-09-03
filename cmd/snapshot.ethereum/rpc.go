package main

import (
	"bytes"
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"math/big"
	"strconv"

	"github.com/fluidity-money/long.so/lib/events/multicall"
	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/types/seawater"

	"github.com/ethereum/go-ethereum/common"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

const (
	// BatchLimit of calls to pack into a single JSON-RPC request.
	// External RPC currently has a hard limit at 50/second.
	BatchLimit = 18

	// MulticallBatchLimit for the number of calls to pack into each
	// aggregate3 call. Exceeding 500 leads to issues with calldata size.
	MulticallBatchLimit = 500

	// WorkerCount of simultaneous requests that can be made max.
	// External RPC currently has a hard limit at 50/second, so given that we
	// batch 50 requests in each, we don't need additional workers for processing
	WorkerCount = 1
)

type (
	rpcReq struct {
		JsonRpc string `json:"jsonrpc"`
		Id      string `json:"id"`
		Method  string `json:"method"`
		Params  []any  `json:"params"`
	}

	rpcResp struct {
		Id     string `json:"id"`
		Result string `json:"result"`
		Error  any    `json:"error"`
	}

	// posResp that's also given to gorm to be used with a custom
	// function that does a left join during insertion.
	posResp struct {
		Key   string
		Delta types.Number
	}
)

// packRpcPosData to pack positions into an array of JSON-RPC requests.
// each request is a multicall request with size MulticallBatchLimit.
func packRpcPosData(ammAddr string, positions map[string]seawater.Position) (reqs []rpcReq) {
	calls := make([]multicall.AggregateCall3, MulticallBatchLimit)
	var (
		// loop iterator as positions is a map
		i  = 0
		// index of the current call within the multicall request
		c = 0
		// ID contains position id and pool
		// padded to allow looking up positions by offset
		id = ""
	)
	for _, p := range positions {
		calls[c] = multicall.AggregateCall3{
			Target:   common.HexToAddress(ammAddr),
			CallData: getCalldata(p.Pool, p.Id),
		}
		id += encodeRpcId(p)
		i++
		c++
		if c == MulticallBatchLimit || i == len(positions) {
			calldata, err := multicall.PackAggregate3(calls[:c])
			if err != nil {
				panic(err)
			}
			reqs = append(reqs, rpcReq{
				JsonRpc: "2.0",
				Id:      id,
				Method:  "eth_call",
				Params: []any{
					map[string]string{
						"to":   multicallAddr,
						"data": "0x" + hex.EncodeToString(calldata),
					},
					"latest",
				},
			})
			c = 0
			id = ""
		}
	}
	return
}

type HttpReqFn func(url, contentType string, r io.Reader) (io.ReadCloser, error)

// reqPositions by querying the RPC provider with the requested
// positions. Returns the pool and the ID by splitting the retured ID up.
// Batches the response and uses an internal goroutine group if the
// request is above the batch limit. If it encounters a situation where
// anything is returned in error, it sends a done message to all the
// Goroutines after attempting to drain them for 5 seconds.
func reqPositions(ctx context.Context, url string, reqs []rpcReq, posCount int, makeReq HttpReqFn) ([]posResp, error) {
	var (
		chanReqs  = make(chan []rpcReq)
		chanResps = make(chan posResp)
		chanErrs  = make(chan error)
		chanDone  = make(chan bool)
	)
	// Figure out the maximum number of goroutines that we can run to
	// make the requests. Scaling up accordingly.
	batchLimit := BatchLimit
	slog.Info("sending requests using a predefined batch limit",
		"batch limit", batchLimit,
	)
	for i := 0; i < WorkerCount; i++ {
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
						if err := p.Error; err != nil {
							chanErrs <- fmt.Errorf(`error reported: %v`, err)
							return
						}
						resultBytes, err := hex.DecodeString(p.Result[2:])
						if err != nil {
							chanErrs <- fmt.Errorf(`decoding hex: %v`, err)
							return
						}
						unpacked, err := multicall.UnpackAggregate3(resultBytes)
						if err != nil {
							chanErrs <- fmt.Errorf(`unpacking: %v`, err)
							return
						}
						for i, result := range unpacked {
							if !result.Success {
								chanErrs <- fmt.Errorf(`external call failure: %v`, result)
								return
							}
							h := hex.EncodeToString(result.ReturnData)
							delta, err := types.NumberFromHex(h)
							if err != nil {
								chanErrs <- fmt.Errorf("unpacking delta: %#v: %v", p, err)
								return
							}
							pool, id, err := decodeRpcId(p.Id, i)
							if err != nil {
								chanErrs <- fmt.Errorf("unpacking pos id: %#v: %v", p, err)
								return
							}
							r := posResp{encodeId(types.AddressFromString(pool), id), *delta}
							select {
							case <-chanDone:
								return // Hopefully this will prevent us from going through the rest.
							case chanResps <- r:
								// Do nothing. We sent.
							}
						}
					}
				}
			}
		}()
	}
	go func() {
		b := make([]rpcReq, batchLimit)
		x := 0
		for _, p := range reqs {
			b[x] = p
			x++
			if x != batchLimit {
				continue
			}
			c := make([]rpcReq, batchLimit)
			for i := 0; i < batchLimit; i++ {
				c[i] = b[i]
			}
			select {
			case <-chanDone:
				return // We're done!
			case chanReqs <- c:
			}
			x = 0
		}
		if x > 0 {
			c := make([]rpcReq, x)
			// Copy the array so we don't have duplication.
			for i := 0; i < x; i++ {
				c[i] = b[i]
			}
			select {
			case <-chanDone:
				return // We're done!
			case chanReqs <- c:
			}

		}
	}()
	resps := make([]posResp, posCount)
	sleepRoutines := func() {
		for {
			chanDone <- true
		}
	}
	// Start to unpack everything/signal the worker group if we have an error.
	for i := 0; i < posCount; i++ {
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

func decodeId(x string) (pool types.Address, id int, ok bool) {
	if len(x) < 40 {
		return "", 0, false
	}
	pool = types.AddressFromString(x[:42])
	var err error
	id_, err := strconv.ParseInt(x[42:], 16, 64)
	if err != nil {
		return "", 0, false
	}
	id = int(id_)
	return pool, id, true
}

func encodeId(pool types.Address, id int) string {
	return fmt.Sprintf("%s%x", pool, id)
}

// RPC ID is pool0id0pool1id1... where ID is padded to 20 characters
// to allow for relating positions to their ID via a standard offset
func encodeRpcId(p seawater.Position) string {
	return p.Pool.String() + fmt.Sprintf("%020d", p.Id)
}

func decodeRpcId(p string, offset int) (string, int, error) {
	const (
		addrWidth = 42
		idWidth   = 20
	)
	combinedWidth := addrWidth + idWidth
	pool := p[offset*combinedWidth : offset*combinedWidth+addrWidth]
	idPadded := p[offset*combinedWidth+addrWidth : offset*combinedWidth+addrWidth+idWidth]
	id, err := strconv.Atoi(idPadded)
	if err != nil {
		return "", 0, err
	}
	return pool, id, nil
}

func getCalldata(pool types.Address, posId int) []byte {
	posIdB := new(big.Int).SetInt64(int64(posId)).Bytes()
	x := append(
		//positionLiquidity8D11C045(address,uint256)
		[]byte{0, 0, 0x02, 0x5b},
		append(
			ethCommon.LeftPadBytes(ethCommon.HexToAddress(pool.String()).Bytes(), 32),
			ethCommon.LeftPadBytes(posIdB, 32)...,
		)...,
	)
	return x
}
