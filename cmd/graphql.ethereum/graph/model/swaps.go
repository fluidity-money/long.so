package model

import "github.com/fluidity-money/long.so/lib/types"

type SeawaterSwap struct {
	Timestamp        int                  `json:"timestamp"`
	Sender           types.Address        `json:"sender"`
	TokenIn          types.Address        `json:"tokenIn"`
	TokenInDecimals  int                  `json:"tokenInDecimals"`
	TokenOut         types.Address        `json:"tokenOut"`
	TokenOutDecimals int                  `json:"tokenOutDecimals"`
	AmountIn         types.UnscaledNumber `json:"amountIn"`
	AmountOut        types.UnscaledNumber `json:"amountOut"`
}
