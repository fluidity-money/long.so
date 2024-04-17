package model

import "github.com/fluidity-money/amm.superposition.so/lib/types"

type Transaction struct {
	Hash         types.Hash        `json:"hash"`
	BlockHash    types.Hash        `json:"blockHash"`
}
