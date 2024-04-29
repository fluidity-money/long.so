package graph

import (
	"crypto/rand"
	"math/big"
	"fmt"
	"time"
	"slices"

	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/types/seawater"

	"github.com/fluidity-money/long.so/cmd/graphql.ethereum/graph/model"
)

var (
	// MaxMockedVolume for the random mocking of the volume/yield over time
	MaxMockedVolume, _ = new(big.Int).SetString("10000000000000000000000000000", 10)

	// MaxMockedPrice for the random mocking of the price/tvl/earned, divided by 1e5 for decimals
	MaxMockedPrice = new(big.Int).SetInt64(10000000000)
)

var ox65Price, _ = new(big.Int).SetString("79228162514264337593543950336", 10)

var (
	Tokens = map[string]model.Token{
		"0x65dfe41220c438bf069bbce9eb66b087fe65db36": model.Token{
			Address: "0x65dfe41220c438bf069bbce9eb66b087fe65db36",
			Name: "NEW_TOKEN_2",
			TotalSupply: "8ac72304c5836640", //10000000001000040000
			Decimals: 18,
			Symbol: "NEW_TOKEN_2",
		},
	}

	Pools = map[string]seawater.Pool{
		"0x65dfe41220c438bf069bbce9eb66b087fe65db36": {
			CreatedTransactionHash: "",             // TODO
			CreatedBlockNumber:     types.Number{}, // TODO
			Token:                  types.AddressFromString("0x65dfe41220c438bf069bbce9eb66b087fe65db36"),
			Fee:                    types.NumberFromBig(new(big.Int).SetInt64(0)),
			Price:                  types.NumberFromBig(ox65Price),
		},
	}

	Positions = map[string][]seawater.Position{
		"0x65dfe41220c438bf069bbce9eb66b087fe65db36": {{
			CreatedTransactionHash: "",             // TODO
			CreatedBlockNumber:     types.Number{}, // TODO
			Id:                     types.EmptyNumber(),
			Owner:                  types.AddressFromString("0xdca670597bcc35e11200fe07d9191a33a73850b9"),
			Pool:                   types.AddressFromString("0x65dfe41220c438bf069bbce9eb66b087fe65db36"),
			Lower:                  types.EmptyNumber(), // TODO
			Upper:                  types.EmptyNumber(), // TODO
		}},
	}
)

func MockSeawaterPools() (pools []seawater.Pool) {
	pools = make([]seawater.Pool, len(Pools))
	var i int
	for _, v := range Pools {
		pools[i] = v
		i++
	}
	return
}

func MockGetPool(address string) (pool *seawater.Pool) {
	x := Pools[address]
	return &x
}

func MockGetPoolPositions(address string) (positions []seawater.Position) {
	return Positions[address]
}

func MockGetPosition(id string) (position *seawater.Position) {
L:
	for _, ps := range Positions {
		for _, p := range ps {
			if p.Id.String() == id {
				x := p
				position = &x
				break L
			}
		}
	}
	return
}

func MockVolumeOverTime(period int, fusdc, token types.Address) (history []model.PairAmount, err error) {
	// Using crypto/rand.Int to save myself from having a constant
	// word size using the pseudorandom number generator
	// (math/rand.Read)
	history = make([]model.PairAmount, period)
	t := time.Now()
	for i := 0; i < period; i++ {
		fusdcAmt, _ := rand.Int(rand.Reader, MaxMockedVolume)
		token1Amt, _ := rand.Int(rand.Reader, MaxMockedVolume)
		// Two years in the past plus the position we're at in the graph
		days := time.Duration(i*24) * time.Hour
		backThen := t.Add(-time.Duration(24 * time.Hour * 365)).Add(days)
		history[i] = model.PairAmount{
			Fusdc: model.Amount{
				Token:         fusdc,
				Decimals:      6,
				Timestamp:     int(backThen.Unix()), // This should be safe
				ValueUnscaled: types.UnscaledNumberFromBig(fusdcAmt),
			},
			Token1: model.Amount{
				Token:         token,
				Decimals:      6,
				Timestamp:     int(backThen.Unix()),
				ValueUnscaled: types.UnscaledNumberFromBig(token1Amt),
			},
		}
	}
	return
}

func MockPriceOverTime(period int, fusdc, token types.Address) (history []string, err error) {
	history = make([]string, period)
	exp := new(big.Int).SetInt64(10)
	exp.Mul(exp, new(big.Int).SetInt64(4))
	for i := 0; i < period; i++ {
		priceI, _ := rand.Int(rand.Reader, MaxMockedPrice)
		price := new(big.Float).SetInt(priceI)
		price.Quo(price, new(big.Float).SetInt(exp))
		history[i] = fmt.Sprintf("%0.04f", price)
	}
	return
}

func MockToken(address string) (model.Token, error) {
	return Tokens[address], nil
}

func MockSwaps(fusdc types.Address, amount int, pool types.Address) (swaps []model.SeawaterSwap) {
	// Picks 150 random swaps, then sorts them according to the
	// timestamp (with all transactions being made less than a month ago randomly chosen.)
	// Assumes 6 as the decimals for fUSDC, and that the pool address is one that supports the
	// currently focused token.
	swaps = make([]model.SeawaterSwap, amount)
	now := time.Now()
	secsSinceLastMonth := new(big.Int).SetInt64(2678400) // 31 days in seconds
	tokenA := types.AddressFromString("0x65dfe41220c438bf069bbce9eb66b087fe65db36")
	tokenADecimals := Tokens[tokenA.String()].Decimals
	for i := 0; i < amount; i++ {
		ts, _ := rand.Int(rand.Reader, secsSinceLastMonth)
		ts.Sub(new(big.Int).SetInt64(now.Unix()), ts)
		var (
			tokenIn, tokenOut types.Address
			amountInDecimals, amountOutDecimals int
		)
		if fusdcIsSender := randomBoolean(); fusdcIsSender {
			tokenIn = fusdc
			amountInDecimals = 6
			tokenOut = tokenA
			amountOutDecimals = tokenADecimals
		} else {
			tokenIn = tokenA
			amountInDecimals = tokenADecimals
			tokenOut = fusdc
			amountOutDecimals = 6
		}
		amountIn, _ := rand.Int(rand.Reader, MaxMockedVolume)
		amountOut, _ := rand.Int(rand.Reader, MaxMockedVolume)
		swaps[i] = model.SeawaterSwap{
			Timestamp: int(ts.Int64()), // This should be fine.
			Sender: types.AddressFromString("0xdca670597bcc35e11200fe07d9191a33a73850b9"),
			TokenIn: tokenIn,
			TokenInDecimals: amountInDecimals,
			TokenOut: tokenOut,
			TokenOutDecimals: amountOutDecimals,
			AmountIn: types.UnscaledNumberFromBig(amountIn),
			AmountOut: types.UnscaledNumberFromBig(amountOut),
		}
	}
	// Sort the remainder by the timestamps
	slices.SortFunc(swaps, func(x, y model.SeawaterSwap) int {
		switch {
		case x.Timestamp > x.Timestamp:
			return -1
		case x.Timestamp > x.Timestamp:
			return 1
		default:
			return 0
		}
	})
	return
}

func randomBoolean() bool {
	b := make([]byte, 1)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	return uint8(b[0]) > 127
}
