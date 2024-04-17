package model

import "github.com/fluidity-money/amm.superposition.so/lib/types"

type Erc20Transfer struct {
	TokenAddr     types.Address        `json:"asset"`
	SenderAddr    types.Address        `json:"sender"`
	RecipientAddr types.Address        `json:"recipient"`
	Value         types.UnscaledNumber `json:"value"`
}

type (
	SeawaterMintPosition struct {
		Id    types.Number  `json:"id"`
		Owner types.Address `json:"owner"`
		Pool  types.Address `json:"pool"`
		Lower types.Number  `json:"lower"`
		Upper types.Number  `json:"upper"`
	}

	SeawaterBurnPosition struct {
		Id    types.Number  `json:"id"`
		Owner types.Address `json:"owner"`
	}

	SeawaterTransferPosition struct {
		From types.Address `json:"from"`
		To   types.Address `json:"to"`
		Id   types.Number  `json:"id"`
	}

	SeawaterUpdatePositionLiquidity struct {
		Id    types.Number `json:"id"`
		Delta types.Number `json:"delta"`
	}

	SeawaterCollectFees struct {
		Id      types.Number         `json:"id"`
		Pool    types.Address        `json:"pool"`
		To      types.Address        `json:"to"`
		Amount0 types.UnscaledNumber `json:"amount0"`
		Amount1 types.UnscaledNumber `json:"amount1"`
	}

	SeawaterNewPool struct {
		Token types.Address `json:"token"`
		Fee   types.Number  `json:"fee"`
		Price types.Number  `json:"price"`
	}

	SeawaterCollectProtocolFees struct {
		Pool    types.Address        `json:"pool"`
		To      types.Address        `json:"to"`
		Amount0 types.UnscaledNumber `json:"amount0"`
		Amount1 types.UnscaledNumber `json:"amount1"`
	}

	SeawaterSwap2 struct {
		User        types.Address        `json:"user"`
		From        types.Address        `json:"from"`
		To          types.Address        `json:"to"`
		AmountIn    types.UnscaledNumber `json:"amountIn"`
		AmountOut   types.UnscaledNumber `json:"amountOut"`
		FluidVolume types.UnscaledNumber `json:"fluidVolume"`
		FinalTick0  types.Number         `json:"finalTick0"`
		FinalTick1  types.Number         `json:"finalTick1"`
	}
)

type Application struct {
	BlockHash types.Hash `json:"blockHash"`
	TransactionHash types.Hash `json:"transactionHash"`

	Erc20Transfer Erc20Transfer `json:"erc20Transfer"`

	SeawaterMintPosition            SeawaterMintPosition            `json:"seawaterMintPosition"`
	SeawaterBurnPosition            SeawaterBurnPosition            `json:"seawaterBurnPosition"`
	SeawaterTransferPosition        SeawaterTransferPosition        `json:"seawaterTransferPosition"`
	SeawaterUpdatePositionLiquidity SeawaterUpdatePositionLiquidity `json:"seawaterUpdatePositionLiquidity"`
	SeawaterCollectFees             SeawaterCollectFees             `json:"seawaterCollectFees"`
	SeawaterNewPool                 SeawaterNewPool                 `json:"seawaterNewPool"`
	SeawaterCollectProtocolFees     SeawaterCollectProtocolFees     `json:"seawaterCollectProtocolFees"`
	SeawaterSwap2                   SeawaterSwap2                   `json:"seawaterSwap2"`
	SeawaterSwap1                   SeawaterSwap1                   `json:"seawaterSwap1"`
}
