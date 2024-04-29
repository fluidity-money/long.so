package seawater

import (
	"time"

	"github.com/fluidity-money/long.so/lib/types"
)

// Pool is set by seawater_pools
type Pool struct {
	CreatedBy       time.Time     `json:"createdBy"`
	CreatedBlockHash       types.Hash    `json:"createdBlockHash"`
	CreatedTransactionHash types.Hash    `json:"createdTransactionHash"`
	CreatedBlockNumber     types.Number  `json:"blockNumber"`
	Token           types.Address `json:"token"`
	Fee             types.Number  `json:"fee"`
	Price           types.Number  `json:"price"`
}

// Position is set by seawater_active_positions_1
type Position struct {
	CreatedBy              time.Time     `json:"createdBy"`
	CreatedBlockHash       types.Hash    `json:"createdBlockHash"`
	CreatedTransactionHash types.Hash    `json:"createdTransactionHash"`
	CreatedBlockNumber     types.Number  `json:"createdBlockNumber"`
	Id                     types.Number  `json:"id",gorm:"posId"` // ID name might cause issues with gorm
	Owner                  types.Address `json:"owner"`
	Pool                   types.Address `json:"pool"`
	Lower                  types.Number  `json:"lower"`
	Upper                  types.Number  `json:"upper"`
}
