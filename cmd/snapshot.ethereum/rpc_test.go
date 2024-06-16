package main

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"testing"

	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/types/seawater"

	"github.com/stretchr/testify/assert"
)

func TestGetSlot(t *testing.T) {
	s := getCalldata(
		types.AddressFromString("0xe984f758f362d255bd96601929970cef9ff19dd7"),
		types.NumberFromInt64(0),
	)
	assert.Equal(t,
		"0xe759c465000000000000000000000000e984f758f362d255bd96601929970cef9ff19dd70000000000000000000000000000000000000000000000000000000000000000",
		s,
		"calldata not equal",
	)
}

func TestReqPositionsErr(t *testing.T) {
	// Test that we're handling errors correctly.
	var p seawater.Position
	d := packRpcData("", p)
	ctx := context.TODO()
	_, err := reqPositions(ctx, "", d, func(url string, contentType string, r io.Reader) (io.ReadCloser, error) {
		var buf bytes.Buffer
		_ = json.NewEncoder(&buf).Encode(rpcResp{
			Id:     "",
			Result: "",
			Error:  "error",
		})
		return io.NopCloser(&buf), nil
	})
	assert.Errorf(t, err, "req positions errored")
}

func TestReqPositionsSinglePosition(t *testing.T) {
	// Test if the request function can handle a single position.
	ctx := context.TODO()
	p := seawater.Position{ // Only these fields are used.
		Id:   types.NumberFromInt64(10),
		Pool: types.AddressFromString("0xe984f758f362d255bd96601929970cef9ff19dd7"),
	}
	d := packRpcData("", p)
	id := encodeId(p.Pool, p.Id)
	pool, posId, ok := decodeId(id)
	assert.Equalf(t, p.Pool, pool, "pool not decoded")
	assert.Equalf(t, &p.Id, posId, "id not decoded")
	assert.Truef(t, ok, "decode id function not working")
	r, err := reqPositions(ctx, "", d, func(url string, contentType string, r io.Reader) (io.ReadCloser, error) {
		var buf bytes.Buffer
		_ = json.NewEncoder(&buf).Encode([]rpcResp{{
			Id:     id,
			Result: "0x00000000000000000000000000000000000000000000000000000000091c2e55",
			Error:  nil,
		}})
		return io.NopCloser(&buf), nil
	})
	assert.Nilf(t, err, "req positions errored")
	expected := []posResp{{
		pool:     p.Pool,
		position: p.Id,
		delta:    types.NumberFromInt64(152841813),
	}}
	assert.Equal(t, expected, r)
}

func TestReqPositionsHundredThousandPositions(t *testing.T) {
	// Test if the request function can handle a single position.
	ctx := context.TODO()
	positions := make([]seawater.Position, 100_000)
	for i := range positions {
		p := seawater.Position{ // Only these fields are used.
			Id:   types.NumberFromInt64(int64(i)),
			Pool: types.AddressFromString("0xe984f758f362d255bd96601929970cef9ff19dd7"),
		}
		id := encodeId(p.Pool, p.Id)
		pool, posId, ok := decodeId(id)
		assert.Equalf(t, p.Pool, pool, "pool not decoded")
		assert.Equalf(t, &p.Id, posId, "id not decoded")
		assert.Truef(t, ok, "decode id function not working")
		positions[i] = p
	}
	d := packRpcData("", positions...)
	resps := make([]rpcResp, 100_000)
	for i, p := range positions {
		resps[i] = rpcResp{
			Id:     encodeId(p.Pool, p.Id),
			Result: "0x00000000000000000000000000000000000000000000000000000000091c2e55",
			Error:  nil,
		}
	}
	_, err := reqPositions(ctx, "", d, func(url string, contentType string, r io.Reader) (io.ReadCloser, error) {
		// Decode the data to see which transactions are being sent.
		var buf bytes.Buffer
		var reqs []rpcReq
		_ = json.NewDecoder(r).Decode(&reqs)
		resps := make([]rpcResp, len(reqs))
		for i, r := range reqs {
			t.Logf("id %v", r.Id)
			resps[i] = rpcResp{
				Id:     r.Id,
				Result: "0x00000000000000000000000000000000000000000000000000000000091c2e55",
				Error:  nil,
			}
		}
		_ = json.NewEncoder(&buf).Encode(resps)
		return io.NopCloser(&buf), nil
	})
	assert.Nilf(t, err, "failed")
}
