package multicall

import (
	"bytes"
	_ "embed"
	"fmt"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

//go:embed abi.json
var abiBytes []byte

var abi, _ = ethAbi.JSON(bytes.NewReader(abiBytes))

func PackAggregate3(calls []AggregateCall3) ([]byte, error) {
	return abi.Pack("aggregate3", calls)
}

func UnpackAggregate3(b []byte) (results []Aggregate3Result, err error) {
	unpacked, err := abi.Unpack("aggregate3", b)
	if err != nil {
		return
	}
	for _, u := range unpacked {
		// we're not allowed to convert this directly to []Aggregate3Result
		// even though they're the same type
		r, ok := u.([]struct {
			Success    bool    "json:\"success\""
			ReturnData []uint8 "json:\"returnData\""
		})
		if !ok {
			return results, fmt.Errorf("failed to convert unpacked result array %v", u)
		}
		for _, inner := range r {
			results = append(results, inner)
		}
	}
	return
}
