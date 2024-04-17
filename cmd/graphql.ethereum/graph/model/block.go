package model

import "github.com/fluidity-money/amm.superposition.so/lib/types"

type Block struct {
	Hash types.Hash `json:"hash"`
	Bloom types.Data `json:"bloom"`
}
