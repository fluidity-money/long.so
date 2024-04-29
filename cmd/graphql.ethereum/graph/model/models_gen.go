// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"github.com/fluidity-money/long.so/lib/types/seawater"
)

type Amount struct {
	ValueUnscaled string `json:"valueUnscaled"`
	ValueScaled   string `json:"valueScaled"`
	ValueUsd      string `json:"valueUsd"`
}

type Mutation struct {
}

type PairAmount struct {
	Fusdc  Amount `json:"fusdc"`
	Token0 Amount `json:"token0"`
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
	Name        string `json:"name"`
	TotalSupply string `json:"totalSupply"`
	Decimals    int    `json:"decimals"`
	Symbol      string `json:"symbol"`
}

type TokenBalance struct {
	Token   Token  `json:"token"`
	Balance Amount `json:"balance"`
}

type UtilityIncentive struct {
	AmountGivenOut string `json:"amountGivenOut"`
	MaximumAmount  string `json:"maximumAmount"`
}
