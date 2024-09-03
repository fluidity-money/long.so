package multicall

import ethCommon "github.com/ethereum/go-ethereum/common"

type (
	AggregateCall3 struct {
		Target       ethCommon.Address
		AllowFailure bool
		CallData     []byte
	}

	Aggregate3Result struct {
		Success    bool    "json:\"success\""
		ReturnData []uint8 "json:\"returnData\""
	}
)
