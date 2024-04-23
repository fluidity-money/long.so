package seawater

import (
	"github.com/fluidity-money/amm.superposition.so/lib/applications/event"
	"github.com/fluidity-money/amm.superposition.so/lib/types"
)

type (
	MintPosition struct {
		event.Event

		PosId types.Number  `json:"posId"`
		Owner types.Address `json:"owner"`
		Pool  types.Address `json:"pool"`
		Lower types.Number  `json:"lower"`
		Upper types.Number  `json:"upper"`
	}

	BurnPosition struct {
		event.Event

		PosId types.Number  `json:"posId"`
		Owner types.Address `json:"owner"`
	}

	TransferPosition struct {
		event.Event

		From  types.Address `json:"from_"`
		To    types.Address `json:"to_"`
		PosId types.Number  `json:"posId"`
	}

	UpdatePositionLiquidity struct {
		event.Event

		PosId types.Number `json:"posId"`
		Delta types.Number `json:"delta"`
	}

	CollectFees struct {
		event.Event

		PosId   types.Number         `json:"posId"`
		Pool    types.Address        `json:"pool"`
		To      types.Address        `json:"to"`
		Amount0 types.UnscaledNumber `json:"amount0"`
		Amount1 types.UnscaledNumber `json:"amount1"`
	}

	NewPool struct {
		event.Event

		Token types.Address `json:"token"`
		Fee   types.Number  `json:"fee"`
		Price types.Number  `json:"price"`
	}

	CollectProtocolFees struct {
		event.Event

		Pool    types.Address        `json:"pool"`
		To      types.Address        `json:"to_"`
		Amount0 types.UnscaledNumber `json:"amount0"`
		Amount1 types.UnscaledNumber `json:"amount1"`
	}

	Swap2 struct {
		event.Event

		User        types.Address        `json:"user_"`
		From        types.Address        `json:"from_"`
		To          types.Address        `json:"to_"`
		AmountIn    types.UnscaledNumber `json:"amountIn"`
		AmountOut   types.UnscaledNumber `json:"amountOut"`
		FluidVolume types.UnscaledNumber `json:"fluidVolume"`
		FinalTick0  types.Number         `json:"finalTick0"`
		FinalTick1  types.Number         `json:"finalTick1"`
	}
)
