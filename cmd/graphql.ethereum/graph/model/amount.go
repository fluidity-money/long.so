package model

import "github.com/fluidity-money/long.so/lib/types"

// Amount often returned from a PairAmount, containing the price of the
// asset (optionally scaled), and the timestamp when it was produced.
type Amount struct {
	Token         types.Address        `json:"token"`
	Decimals      int                  `json:"decimals"`
	Timestamp     int                  `json:"timestamp"`
	ValueUnscaled types.UnscaledNumber `json:"valueUnscaled"`
}
