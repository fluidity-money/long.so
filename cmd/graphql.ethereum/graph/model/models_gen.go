// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"github.com/fluidity-money/long.so/lib/types/seawater"
)

type Mutation struct {
}

type PairAmount struct {
	Timestamp int    `json:"timestamp"`
	Fusdc     Amount `json:"fusdc"`
	Token1    Amount `json:"token1"`
}

type PriceOverTime struct {
	Amounts []string `json:"amounts"`
}

type Query struct {
}

// SeawaterLiquidity is like SeawaterPosition, though it's an aggregation for easy use.
type SeawaterLiquidity struct {
	ID        string              `json:"id"`
	Lower     string              `json:"lower"`
	Upper     string              `json:"upper"`
	Liquidity PairAmount          `json:"liquidity"`
	Positions []seawater.Position `json:"positions"`
}

type Token struct {
	Address     string `json:"address"`
	Name        string `json:"name"`
	TotalSupply string `json:"totalSupply"`
	Decimals    int    `json:"decimals"`
	Symbol      string `json:"symbol"`
}

type TokenBalance struct {
	Token   Token  `json:"token"`
	Balance Amount `json:"balance"`
}

type TvlOverTime struct {
	Amounts []string `json:"amounts"`
}

type UtilityIncentive struct {
	AmountGivenOut string `json:"amountGivenOut"`
	MaximumAmount  string `json:"maximumAmount"`
}

type VolumeOverTime struct {
	Amounts []PairAmount `json:"amounts"`
}

type YieldOverTime struct {
	Amounts []PairAmount `json:"amounts"`
}
