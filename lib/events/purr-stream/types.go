package purr_stream

import (
	_ "embed"

	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/events"
)

type Donated struct {
	events.Event

	Cat     types.Data           `json:"cat"`
	Address types.Address        `json:"address"`
	Amount  types.UnscaledNumber `json:"amount"`
}
