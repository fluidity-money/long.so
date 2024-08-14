package leo

import (
	"github.com/fluidity-money/long.so/lib/events"
	"github.com/fluidity-money/long.so/lib/types"
)

type (
	CampaignBalUpdated struct {
		events.Event

		Identifier types.Data `json:"identifier"`
		NewMaximum *big.Int   `json:"newMaximum"`
	}

	// CampaignCreated, unpacked in the local function with some of
	// the concatenated fields.
	CampaignCreated struct {
		events.Event

		Identifier types.Data    `json:"identifier"`
		Pool       types.Address `json:"pool"`
		Token      types.Address `json:"token"`
		TickLower  int32         `json:"tickLower"`
		TickUpper  int32         `json:"tickUpper"`
		Owner      types.Address `json:"owner"`
		Starting   uint64        `json:"starting"`
		Ending     uint64        `json:"ending"`
	}
)
