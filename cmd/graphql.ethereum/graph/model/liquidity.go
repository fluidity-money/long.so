package model

// SeawaterLiquidity available in a pool summed and grouped by ticks.
type SeawaterLiquidity struct {
	ID        string              `json:"id"`
	Tick      string              `json:"tick"`
	Amount    PairAmount          `json:"amount"`
}
