package model

import (
	"time"

	"github.com/fluidity-money/amm.superposition.so/lib/types"
)

// SeawaterPool is set by seawater_pools_1
type SeawaterPool struct {
	CreatedBy       time.Time     `json:"createdBy"`
	BlockHash       types.Hash    `json:"blockHash"`
	TransactionHash types.Hash    `json:"transactionHash"`
	BlockNumber     types.Number  `json:"blockNumber"`
	Id              types.Number  `json:"id"`
	Token           types.Address `json:"token"`
	Fee             types.Number  `json:"fee"`
	Price           types.Number  `json:"price"`
}

// SeawaterPosition is set by seawater_active_positions_1
type SeawaterPosition struct {
	CreatedBy              time.Time    `json:"createdBy"`
	CreatedBlockHash       types.Hash   `json:"createdBlockHash"`
	CreatedTransactionHash types.Hash   `json:"createdTransactionHash"`
	CreatedBlockNumber     types.Number `json:"createdBlockNumber"`
	Owner                  Wallet       `json:"owner"`
	Pool                   SeawaterPool `json:"pool"`
	Lower                  types.Number `json:"lower"`
	Upper                  types.Number `json:"upper"`
}
