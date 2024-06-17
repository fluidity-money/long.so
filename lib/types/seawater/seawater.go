package seawater

import (
	"time"

	"github.com/fluidity-money/long.so/lib/types"
)

// Pool is set by events_seawater_newPool
type Pool struct {
	CreatedBy       time.Time     `json:"createdBy"`
	BlockHash       types.Hash    `json:"blockHash"`
	TransactionHash types.Hash    `json:"transactionHash"`
	BlockNumber     types.Number  `json:"blockNumber"`
	Token           types.Address `json:"token"`
	Fee             types.Number  `json:"fee"`
	Decimals        uint8         `json:"decimals"`
	TickSpacing     uint8         `json:"tickSpacing"`
}

// Position is set by seawater_active_positions_1
type Position struct {
	CreatedBy       time.Time     `json:"createdBy"`
	BlockHash       types.Hash    `json:"blockHash"`
	TransactionHash types.Hash    `json:"transactionHash"`
	BlockNumber     types.Number  `json:"blockNumber"`
	Id              types.Number  `json:"id" gorm:"column:pos_id"` // ID name might cause issues with gorm
	Owner           types.Address `json:"owner"`
	Pool            types.Address `json:"pool"`
	Lower           types.Number  `json:"lower"`
	Upper           types.Number  `json:"upper"`
}

// PositionSnapshot taken from snapshot_positions_log_1. Used to service
// liquidity queries.
type PositionSnapshot struct {
	PosId     types.Number         `json:"pos_id"`
	UpdatedBy time.Time            `json:"updated_by"`
	Owner     types.Address        `json:"owner"`
	Pool      types.Address        `json:"pool"`
	Lower     types.Number         `json:"lower"`
	Upper     types.Number         `json:"upper"`
	Amount0   types.UnscaledNumber `json:"amount0"`
	Amount1   types.UnscaledNumber `json:"amount1"`
}
