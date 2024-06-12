package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.48

import (
	"context"
	"fmt"
	"math/big"
	"strconv"
	"time"

	"github.com/fluidity-money/long.so/cmd/graphql.ethereum/graph/model"
	"github.com/fluidity-money/long.so/cmd/graphql.ethereum/lib/erc20"
	"github.com/fluidity-money/long.so/lib/features"
	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/types/seawater"
	"gorm.io/gorm"
)

// Token is the resolver for the token field.
func (r *amountResolver) Token(ctx context.Context, obj *model.Amount) (model.Token, error) {
	if obj == nil {
		return model.Token{}, fmt.Errorf("empty amount")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		return MockToken(obj.Token.String())
	}
	name, symbol, totalSupply, err := erc20.GetErc20Details(
		ctx,
		r.Geth,
		obj.Token,
	)
	if err != nil {
		return model.Token{}, fmt.Errorf("erc20 token %#v: %v", obj.Token, err)
	}
	return model.Token{
		Address:     obj.Token.String(),
		Name:        name,
		Symbol:      symbol,
		TotalSupply: totalSupply.String(),
		Decimals:    obj.Decimals,
	}, nil
}

// ValueUnscaled is the resolver for the valueUnscaled field.
func (r *amountResolver) ValueUnscaled(ctx context.Context, obj *model.Amount) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("amount empty")
	}
	return obj.ValueUnscaled.String(), nil
}

// ValueScaled is the resolver for the valueScaled field.
func (r *amountResolver) ValueScaled(ctx context.Context, obj *model.Amount) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("empty amount")
	}
	amt := obj.ValueUnscaled
	return amt.ScaleStr(obj.Decimals), nil
}

// ValueUsd is the resolver for the valueUsd field.
func (r *amountResolver) ValueUsd(ctx context.Context, obj *model.Amount) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("empty amount")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		// If we're mocking the graph, then we take the uncaled
		// amount, and we simply divide it by 1e6, then we divide
		// it by 0.04 unless the token is fUSDC.
		value := obj.ValueUnscaled
		dividedAmt := value.Scale(obj.Decimals) //value / (10 ** decimals)
		switch obj.Token {
		case r.C.FusdcAddr:
			// 4 decimals
			return fmt.Sprintf("%0.4f", dividedAmt), nil
		default:
			//value / (10 ** decimals) * 0.04
			x := new(big.Float).Set(dividedAmt)
			x.Quo(dividedAmt, new(big.Float).SetFloat64(0.04))
			return fmt.Sprintf("%0.4f", x), nil
		}
	}
	if obj.ValueUnscaled.Cmp(types.EmptyUnscaledNumber().Int) == 0 {
		return "0", nil
	}
	// If the pool is the fUSDC address, then we can just skip the
	// lookup here and report $1 (assuming we maintain the peg.)
	if obj.Token == r.C.FusdcAddr {
		return "1.0", nil
	}
	pool, err := r.Query().GetPool(ctx, obj.Token.String())
	if err != nil {
		return "", err
	}
	if pool == nil {
		return "", fmt.Errorf("not able to find pool with addr %#v", obj.Token)
	}
	price, err := r.SeawaterPool().Price(ctx, pool)
	if err != nil {
		return "", err
	}
	return obj.UsdValue(price, r.C.FusdcAddr)
}

// Fusdc is the resolver for the fusdc field.
func (r *queryResolver) Fusdc(ctx context.Context) (t model.Token, err error) {
	name, symbol, totalSupply, err := erc20.GetErc20Details(
		ctx,
		r.Geth,
		r.C.FusdcAddr,
	)
	if err != nil {
		return t, fmt.Errorf("erc20 at %#v: %v", r.C.FusdcAddr, err)
	}
	return model.Token{
		Address:     r.C.FusdcAddr.String(),
		Name:        name,
		Symbol:      symbol,
		TotalSupply: totalSupply.String(),
		Decimals:    r.C.FusdcDecimals,
	}, nil
}

// Pools is the resolver for the pools field.
func (r *queryResolver) Pools(ctx context.Context) (pools []seawater.Pool, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		pools = MockSeawaterPools()
		return
	}
	err = r.DB.Table("events_seawater_newpool").Scan(&pools).Error
	return pools, err
}

// GetPool is the resolver for the getPool field.
func (r *queryResolver) GetPool(ctx context.Context, token string) (pool *seawater.Pool, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		pool = MockGetPool(token)
		return
	}
	err = r.DB.Table("events_seawater_newpool").
		Where("token = ?", token).
		Scan(&pool).
		Error
	return
}

// GetPoolPositions is the resolver for the getPoolPositions field.
func (r *queryResolver) GetPoolPositions(ctx context.Context, pool string) (positions []seawater.Position, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		positions = MockGetPoolPositions(pool)
		return
	}
	err = r.DB.Table("seawater_active_positions_1").Where("pool = ?", pool).Scan(&positions).Error
	return
}

// GetPosition is the resolver for the getPosition field.
func (r *queryResolver) GetPosition(ctx context.Context, id string) (position *seawater.Position, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		position = MockGetPosition(id)
		return
	}
	i, err := types.NumberFromString(id)
	if err != nil {
		return nil, fmt.Errorf("bad id: %v", err)
	}
	err = r.DB.Table("seawater_positions_1").Where("pos_id = ?", i).Scan(&position).Error
	return
}

// GetPositions is the resolver for the getPositions field.
func (r *queryResolver) GetPositions(ctx context.Context, wallet string) (positions []seawater.Position, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		positions = MockGetPoolPositions("0x65dfe41220c438bf069bbce9eb66b087fe65db36")
		return
	}
	err = r.DB.Table("seawater_active_positions_1").
		Where("owner = ?", wallet).
		Scan(&positions).
		Error
	return
}

// GetWallet is the resolver for the getWallet field.
func (r *queryResolver) GetWallet(ctx context.Context, address string) (wallet *model.Wallet, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		return &model.Wallet{Address: types.AddressFromString(address)}, nil
	}
	wallet = &model.Wallet{
		Address: types.AddressFromString(address),
	}
	return
}

// GetSwaps is the resolver for the getSwaps field.
func (r *queryResolver) GetSwaps(ctx context.Context, pool string) (swaps []model.SeawaterSwap, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		swaps = MockSwaps(r.C.FusdcAddr, 150, "0x65dfe41220c438bf069bbce9eb66b087fe65db36")
		return
	}
	err = r.DB.Raw(
		"SELECT * FROM seawater_swaps_1(?, ?)",
		r.C.FusdcAddr,
		r.C.FusdcDecimals,
	).
		Where("token_in = ?", pool).
		Or("token_out = ?", pool).
		Scan(&swaps).Error
	return
}

// GetSwapsForUser is the resolver for the getSwapsForUser field.
func (r *queryResolver) GetSwapsForUser(ctx context.Context, wallet string) (swaps []model.SeawaterSwap, err error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		swaps = MockSwaps(r.C.FusdcAddr, 150, types.AddressFromString(wallet))
		return
	}
	err = r.DB.Raw("SELECT * FROM seawater_swaps_1(?, ?)", r.C.FusdcAddr, r.C.FusdcDecimals).
		Where("sender = ?", wallet).
		Scan(&swaps).
		Error
	return
}

// TickLower is the resolver for the tickLower field.
func (r *seawaterLiquidityResolver) TickLower(ctx context.Context, obj *model.SeawaterLiquidity) (tick int, err error) {
	if obj == nil {
		return 0, fmt.Errorf("no pool obj")
	}
	tick, err = strconv.Atoi(obj.TickLower)
	return
}

// TickUpper is the resolver for the tickUpper field.
func (r *seawaterLiquidityResolver) TickUpper(ctx context.Context, obj *model.SeawaterLiquidity) (tick int, err error) {
	if obj == nil {
		return 0, fmt.Errorf("no pool obj")
	}
	tick, err = strconv.Atoi(obj.TickUpper)
	return
}

// ID is the resolver for the id field.
func (r *seawaterPoolResolver) ID(ctx context.Context, obj *seawater.Pool) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("empty pool")
	}
	return obj.Token.String(), nil
}

// Address is the resolver for the address field.
func (r *seawaterPoolResolver) Address(ctx context.Context, obj *seawater.Pool) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no pool obj")
	}
	return obj.Token.String(), nil
}

// TickSpacing is the resolver for the tickSpacing field.
func (r *seawaterPoolResolver) TickSpacing(ctx context.Context, obj *seawater.Pool) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no pool obj")
	}
	return strconv.Itoa(int(obj.TickSpacing)), nil
}

// Token is the resolver for the token field.
func (r *seawaterPoolResolver) Token(ctx context.Context, obj *seawater.Pool) (t model.Token, err error) {
	if obj == nil {
		return t, fmt.Errorf("no pool obj")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		return MockToken(obj.Token.String())
	}
	name, symbol, totalSupply, err := erc20.GetErc20Details(
		ctx,
		r.Geth,
		obj.Token,
	)
	if err != nil {
		return t, fmt.Errorf("erc20 at %#v: %v", obj.Token, err)
	}
	return model.Token{
		Address:     obj.Token.String(),
		Name:        name,
		Symbol:      symbol,
		TotalSupply: totalSupply.String(),
		Decimals:    int(obj.Decimals),
	}, nil
}

// Price is the resolver for the price field.
func (r *seawaterPoolResolver) Price(ctx context.Context, obj *seawater.Pool) (string, error) {
	// Get the last price item for the pool given.
	if obj == nil {
		return "", fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		daily, _, _, err := MockPriceOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return "", err
		}
		return daily[0], nil
	}
	var result model.PriceResult
	err := r.DB.Table("seawater_final_ticks_1").
		Where("pool = ?", obj.Token).
		First(&result).
		Error
	switch err {
	case gorm.ErrRecordNotFound:
		return "0", nil
	case nil:
		return result.Price(r.C.FusdcDecimals, int(obj.Decimals)), nil
	default:
		return "", err
	}
}

// PriceOverTime is the resolver for the priceOverTime field.
func (r *seawaterPoolResolver) PriceOverTime(ctx context.Context, obj *seawater.Pool) (price model.PriceOverTime, err error) {
	const (
		maxDays   = 31
		maxMonths = 12
	)
	if obj == nil {
		return price, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		daily, _, _, err := MockPriceOverTime(maxDays, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return price, err
		}
		monthly, _, _, err := MockPriceOverTime(maxMonths, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return price, err
		}
		return model.PriceOverTime{daily, monthly}, nil
	}
	var daily, monthly []model.PriceResult
	err = r.DB.Table("seawater_final_ticks_daily_1").Where("pool = ?", obj.Token).Limit(maxDays).Scan(&daily).Error
	if err != nil {
		return
	}
	err = r.DB.Table("seawater_final_ticks_monthly_1").Where("pool = ?", obj.Token).Limit(maxMonths).Scan(&monthly).Error
	if err != nil {
		return
	}
	for _, d := range daily {
		price.Daily = append(price.Daily, d.Price(r.C.FusdcDecimals, int(obj.Decimals)))
	}
	for _, m := range monthly {
		price.Monthly = append(price.Monthly, m.Price(r.C.FusdcDecimals, int(obj.Decimals)))
	}
	return price, nil
}

// VolumeOverTime is the resolver for the volumeOverTime field.
func (r *seawaterPoolResolver) VolumeOverTime(ctx context.Context, obj *seawater.Pool) (vol model.VolumeOverTime, err error) {
	const (
		maxDays   = 31
		maxMonths = 12
	)
	if obj == nil {
		return vol, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		daily, _, _, err := MockVolumeOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return vol, err
		}
		monthly, _, _, err := MockVolumeOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return vol, err
		}
		return model.VolumeOverTime{daily, monthly}, nil
	}
	var dailyResults, monthlyResults []struct {
		Token1Token    types.Address
		Token1Decimals int
		Timestamp      int
		// DailyTimestamp or MonthlyTimestamp
		IntervalTimestamp   time.Time
		FusdcValueUnscaled  types.UnscaledNumber
		Token1ValueUnscaled types.UnscaledNumber
	}
	err = r.DB.Table("seawater_pool_swap_volume_daily_1").
		Where("token1_token = ?", obj.Token).
		Limit(maxDays).Scan(&dailyResults).
		Error
	if err != nil {
		return
	}
	err = r.DB.Table("seawater_pool_swap_volume_monthly_1").
		Where("token1_token = ?", obj.Token).Limit(maxMonths).
		Scan(&monthlyResults).
		Error
	if err != nil {
		return
	}
	for _, d := range dailyResults {
		vol.Daily = append(vol.Daily, model.PairAmount{
			Timestamp: d.Timestamp,
			Fusdc: model.Amount{
				Token:         r.C.FusdcAddr,
				Decimals:      r.C.FusdcDecimals,
				Timestamp:     int(d.IntervalTimestamp.Unix()),
				ValueUnscaled: d.FusdcValueUnscaled,
			},
			Token1: model.Amount{
				Token:         d.Token1Token,
				Decimals:      d.Token1Decimals,
				Timestamp:     int(d.IntervalTimestamp.Unix()),
				ValueUnscaled: d.Token1ValueUnscaled,
			},
		})
	}
	for _, m := range monthlyResults {
		vol.Monthly = append(vol.Monthly, model.PairAmount{
			Timestamp: m.Timestamp,
			Fusdc: model.Amount{
				Token:         r.C.FusdcAddr,
				Decimals:      r.C.FusdcDecimals,
				Timestamp:     int(m.IntervalTimestamp.Unix()),
				ValueUnscaled: m.FusdcValueUnscaled,
			},
			Token1: model.Amount{
				Token:         m.Token1Token,
				Decimals:      m.Token1Decimals,
				Timestamp:     int(m.IntervalTimestamp.Unix()),
				ValueUnscaled: m.Token1ValueUnscaled,
			},
		})
	}
	return vol, nil
}

// LiquidityOverTime is the resolver for the liquidityOverTime field.
func (r *seawaterPoolResolver) LiquidityOverTime(ctx context.Context, obj *seawater.Pool) (liq model.LiquidityOverTime, err error) {
	if obj == nil {
		return liq, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		daily, _, _, err := MockVolumeOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return liq, err
		}
		monthly, _, _, err := MockVolumeOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return liq, err
		}
		return model.LiquidityOverTime{daily, monthly}, nil
	}
	return liq, nil // TODO
}

// TvlOverTime is the resolver for the tvlOverTime field.
func (r *seawaterPoolResolver) TvlOverTime(ctx context.Context, obj *seawater.Pool) (tvl model.TvlOverTime, err error) {
	if obj == nil {
		return tvl, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		r.F.On(features.FeatureGraphqlMockGraphDataDelay, func() error {
			MockDelay(r.F)
			return nil
		})
		daily, _, _, err := MockPriceOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return tvl, err
		}
		monthly, _, _, err := MockPriceOverTime(12, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return tvl, err
		}
		return model.TvlOverTime{daily, monthly}, nil
	}
	volumeOverTime, err := r.VolumeOverTime(ctx, obj)
	if err != nil {
		return
	}
	priceOverTime, err := r.PriceOverTime(ctx, obj)
	if err != nil {
		return
	}
	for i, v := range volumeOverTime.Daily {
		var (
			dailyTvl string
			price    = priceOverTime.Daily[i]
		)
		dailyTvl, err = v.Token1.UsdValue(price, r.C.FusdcAddr)
		if err != nil {
			return
		}
		tvl.Daily = append(tvl.Daily, dailyTvl)
	}
	for i, v := range volumeOverTime.Monthly {
		var (
			monthlyTvl string
			price      = priceOverTime.Monthly[i]
		)
		monthlyTvl, err = v.Token1.UsdValue(price, r.C.FusdcAddr)
		if err != nil {
			return
		}
		tvl.Monthly = append(tvl.Monthly, monthlyTvl)
	}
	return tvl, nil
}

// YieldOverTime is the resolver for the yieldOverTime field.
func (r *seawaterPoolResolver) YieldOverTime(ctx context.Context, obj *seawater.Pool) (yield model.YieldOverTime, err error) {
	if obj == nil {
		return yield, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		daily, _, _, err := MockVolumeOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return yield, err
		}
		monthly, _, _, err := MockVolumeOverTime(12, r.C.FusdcAddr, obj.Token)
		return model.YieldOverTime{daily, monthly}, nil
	}
	return yield, nil // TODO
}

// EarnedFeesAprfusdc is the resolver for the earnedFeesAPRFUSDC field.
func (r *seawaterPoolResolver) EarnedFeesAprfusdc(ctx context.Context, obj *seawater.Pool) ([]string, error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		return []string{"0", "0.15"}, nil
	}
	return nil, nil // TODO
}

// EarnedFeesAPRToken1 is the resolver for the earnedFeesAPRToken1 field.
func (r *seawaterPoolResolver) EarnedFeesAPRToken1(ctx context.Context, obj *seawater.Pool) ([]string, error) {
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		return []string{"0", "0.15"}, nil
	}
	return nil, nil // TODO
}

// LiquidityIncentives is the resolver for the liquidityIncentives field.
func (r *seawaterPoolResolver) LiquidityIncentives(ctx context.Context, obj *seawater.Pool) (amount model.Amount, err error) {
	if obj == nil {
		return amount, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		return MockAmount(), nil
	}
	amount = model.Amount{
		Token:         obj.Token,
		Decimals:      int(obj.Decimals),
		Timestamp:     int(time.Now().Unix()),
		ValueUnscaled: types.EmptyUnscaledNumber(),
	}
	return amount, nil // TODO
}

// SuperIncentives is the resolver for the superIncentives field.
func (r *seawaterPoolResolver) SuperIncentives(ctx context.Context, obj *seawater.Pool) (amount model.Amount, err error) {
	if obj == nil {
		return amount, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		return MockAmount(), nil
	}
	amount = model.Amount{
		Token:         obj.Token,
		Decimals:      int(obj.Decimals),
		Timestamp:     int(time.Now().Unix()),
		ValueUnscaled: types.EmptyUnscaledNumber(),
	}
	return amount, nil // TODO
}

// UtilityIncentives is the resolver for the utilityIncentives field.
func (r *seawaterPoolResolver) UtilityIncentives(ctx context.Context, obj *seawater.Pool) ([]model.UtilityIncentive, error) {
	return nil, nil // TODO
}

// Positions is the resolver for the positions field.
func (r *seawaterPoolResolver) Positions(ctx context.Context, obj *seawater.Pool) (positions []seawater.Position, err error) {
	if obj == nil {
		return nil, fmt.Errorf("no pool obj")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		positions = MockGetPoolPositions(obj.Token.String())
		return
	}
	err = r.DB.Table("seawater_positions_1").
		Where("pool = ?", obj.Token).
		Scan(&positions).Error
	return
}

// PositionsForUser is the resolver for the positionsForUser field.
func (r *seawaterPoolResolver) PositionsForUser(ctx context.Context, obj *seawater.Pool, wallet string) (positions []seawater.Position, err error) {
	if obj == nil {
		return nil, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		positions = MockGetPoolPositions(wallet)
		return
	}
	err = r.DB.Table("seawater_active_positions_1").
		Where("pool = ? and owner = ?", obj.Token, wallet).
		Scan(&positions).
		Error
	return
}

// Liquidity is the resolver for the liquidity field.
func (r *seawaterPoolResolver) Liquidity(ctx context.Context, obj *seawater.Pool) (liquidity []model.SeawaterLiquidity, err error) {
	if obj == nil {
		return nil, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		liquidity = MockLiquidity(r.C.FusdcAddr, obj.Token)
		return
	}
	return nil, nil // TODO
}

// Swaps is the resolver for the swaps field.
func (r *seawaterPoolResolver) Swaps(ctx context.Context, obj *seawater.Pool) (swaps []model.SeawaterSwap, err error) {
	if obj == nil {
		return nil, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		swaps = MockSwaps(r.C.FusdcAddr, 150, obj.Token)
		return
	}
	err = r.DB.Raw("SELECT * FROM seawater_swaps_1(?, ?)", r.C.FusdcAddr, r.C.FusdcDecimals).
		Where("token_in = ?", obj.Token).
		Or("token_out = ?", obj.Token).
		Scan(&swaps).
		Error
	return
}

// ID is the resolver for the id field.
func (r *seawaterPositionResolver) ID(ctx context.Context, obj *seawater.Position) (string, error) {
	s, err := r.PositionID(ctx, obj)
	if err != nil {
		return "", err
	}
	return "pos:" + s, nil
}

// PositionID is the resolver for the positionId field.
func (r *seawaterPositionResolver) PositionID(ctx context.Context, obj *seawater.Position) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no position obj")
	}
	return obj.Id.String(), nil
}

// Owner is the resolver for the owner field.
func (r *seawaterPositionResolver) Owner(ctx context.Context, obj *seawater.Position) (model.Wallet, error) {
	if obj == nil {
		return model.Wallet{}, fmt.Errorf("no position obj")
	}
	wallet, err := r.Query().GetWallet(ctx, obj.Owner.String())
	if err != nil {
		return model.Wallet{}, err
	}
	return *wallet, nil
}

// Pool is the resolver for the pool field.
func (r *seawaterPositionResolver) Pool(ctx context.Context, obj *seawater.Position) (pool seawater.Pool, err error) {
	if obj == nil {
		return seawater.Pool{}, fmt.Errorf("no position obj")
	}
	err = r.DB.Table("events_seawater_newpool").Where("token = ?", obj.Pool).Scan(&pool).Error
	return
}

// Lower is the resolver for the lower field.
func (r *seawaterPositionResolver) Lower(ctx context.Context, obj *seawater.Position) (int, error) {
	if obj == nil {
		return 0, fmt.Errorf("no position obj")
	}
	return int(obj.Lower.Int64()), nil
}

// Upper is the resolver for the upper field.
func (r *seawaterPositionResolver) Upper(ctx context.Context, obj *seawater.Position) (int, error) {
	if obj == nil {
		return 0, fmt.Errorf("no position obj")
	}
	return int(obj.Upper.Int64()), nil
}

// Liquidity is the resolver for the liquidity field.
func (r *seawaterPositionResolver) Liquidity(ctx context.Context, obj *seawater.Position) (model.PairAmount, error) {
	if obj == nil {
		return model.PairAmount{}, fmt.Errorf("no position obj")
	}

	var result model.PriceResult
	err := r.DB.Table("seawater_final_ticks_1").
		Where("pool = ?", obj.Pool).
		First(&result).
		Error

	if err != nil {
		return model.PairAmount{}, err
	}

	var (
		tickLow     = obj.Lower
		tickHigh    = obj.Upper
		currentTick = result.FinalTick

		fusdcAmount, token1Amount types.UnscaledNumber
	)

	// range is [low, high)
	belowRange := currentTick.Cmp(tickLow.Int) == -1
	aboveRange := currentTick.Cmp(tickHigh.Int) <= 0

	timestamp := int(time.Now().Unix())

	pool, err := r.Query().GetPool(ctx, obj.Pool.String())
	if err != nil {
		return model.PairAmount{}, err
	}

	switch true {
	case belowRange:
		// TODO set fusdcAmount, token1Amount
	case aboveRange:
		// TODO set fusdcAmount, token1Amount
	// within range
	default:
		// TODO set fusdcAmount, token1Amount
	}

	return model.PairAmount{
		Timestamp: timestamp,
		Fusdc: model.Amount{
			Token:         r.C.FusdcAddr,
			Decimals:      r.C.FusdcDecimals,
			Timestamp:     timestamp,
			ValueUnscaled: fusdcAmount,
		},
		Token1: model.Amount{
			Token:         pool.Token,
			Decimals:      int(pool.Decimals),
			Timestamp:     timestamp,
			ValueUnscaled: token1Amount,
		},
	}, nil
}

// Pool is the resolver for the pool field.
func (r *seawaterSwapResolver) Pool(ctx context.Context, obj *model.SeawaterSwap) (seawater.Pool, error) {
	var token string
	if obj.TokenIn == r.C.FusdcAddr {
		token = obj.TokenOut.String()
	} else {
		token = obj.TokenIn.String()
	}
	pool, err := r.Query().GetPool(ctx, token)
	if err != nil {
		return seawater.Pool{}, err
	}
	return *pool, nil
}

// Sender is the resolver for the sender field.
func (r *seawaterSwapResolver) Sender(ctx context.Context, obj *model.SeawaterSwap) (model.Wallet, error) {
	if obj == nil {
		return model.Wallet{}, fmt.Errorf("empty swap")
	}
	wallet, err := r.Query().GetWallet(ctx, obj.Sender.String())
	if err != nil {
		return model.Wallet{}, err
	}
	return *wallet, nil
}

// AmountIn is the resolver for the amountIn field.
func (r *seawaterSwapResolver) AmountIn(ctx context.Context, obj *model.SeawaterSwap) (model.Amount, error) {
	if obj == nil {
		return model.Amount{}, fmt.Errorf("empty swap")
	}
	return model.Amount{
		Token:         obj.TokenIn,
		Decimals:      obj.TokenInDecimals,
		Timestamp:     obj.Timestamp,
		ValueUnscaled: obj.AmountIn,
	}, nil
}

// AmountOut is the resolver for the amountOut field.
func (r *seawaterSwapResolver) AmountOut(ctx context.Context, obj *model.SeawaterSwap) (model.Amount, error) {
	if obj == nil {
		return model.Amount{}, fmt.Errorf("empty swap")
	}
	return model.Amount{
		Token:         obj.TokenOut,
		Decimals:      obj.TokenOutDecimals,
		Timestamp:     obj.Timestamp,
		ValueUnscaled: obj.AmountOut,
	}, nil
}

// ID is the resolver for the id field.
func (r *walletResolver) ID(ctx context.Context, obj *model.Wallet) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no wallet obj")
	}
	return "wallet:" + obj.Address.String(), nil
}

// Address is the resolver for the address field.
func (r *walletResolver) Address(ctx context.Context, obj *model.Wallet) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no token")
	}
	return obj.Address.String(), nil
}

// Balances is the resolver for the balances field.
func (r *walletResolver) Balances(ctx context.Context, obj *model.Wallet) ([]model.Amount, error) {
	panic(fmt.Errorf("not implemented: Balances - balances"))
}

// Positions is the resolver for the positions field.
func (r *walletResolver) Positions(ctx context.Context, obj *model.Wallet) (positions []seawater.Position, err error) {
	if obj == nil {
		return nil, fmt.Errorf("empty wallet")
	}
	if r.F.Is(features.FeatureGraphqlMockGraph) {
		MockDelay(r.F)
		positions = MockGetPoolPositions(obj.Address.String())
		return
	}
	err = r.DB.Table("seawater_active_positions_1").
		Where("owner = ?", obj.Address).
		Scan(&positions).
		Error
	return
}

// Amount returns AmountResolver implementation.
func (r *Resolver) Amount() AmountResolver { return &amountResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// SeawaterLiquidity returns SeawaterLiquidityResolver implementation.
func (r *Resolver) SeawaterLiquidity() SeawaterLiquidityResolver {
	return &seawaterLiquidityResolver{r}
}

// SeawaterPool returns SeawaterPoolResolver implementation.
func (r *Resolver) SeawaterPool() SeawaterPoolResolver { return &seawaterPoolResolver{r} }

// SeawaterPosition returns SeawaterPositionResolver implementation.
func (r *Resolver) SeawaterPosition() SeawaterPositionResolver { return &seawaterPositionResolver{r} }

// SeawaterSwap returns SeawaterSwapResolver implementation.
func (r *Resolver) SeawaterSwap() SeawaterSwapResolver { return &seawaterSwapResolver{r} }

// Wallet returns WalletResolver implementation.
func (r *Resolver) Wallet() WalletResolver { return &walletResolver{r} }

type amountResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type seawaterLiquidityResolver struct{ *Resolver }
type seawaterPoolResolver struct{ *Resolver }
type seawaterPositionResolver struct{ *Resolver }
type seawaterSwapResolver struct{ *Resolver }
type walletResolver struct{ *Resolver }
