package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	"log/slog"
	"time"
	"math/big"

	"github.com/fluidity-money/long.so/cmd/graphql.ethereum/graph/model"
	"github.com/fluidity-money/long.so/cmd/graphql.ethereum/lib/erc20"
	"github.com/fluidity-money/long.so/lib/features"
	"github.com/fluidity-money/long.so/lib/types"
	"github.com/fluidity-money/long.so/lib/types/seawater"
)

// Token is the resolver for the token field.
func (r *amountResolver) Token(ctx context.Context, obj *model.Amount) (model.Token, error) {
	if obj == nil {
		return model.Token{}, fmt.Errorf("empty amount")
	}
	if r.F.Is(features.FeatureMockGraph) {
		time.Sleep(2 * time.Second)
		return MockToken(obj.Token.String())
	}
	name, symbol, totalSupply, decimals, err := erc20.GetErc20Details(
		ctx,
		r.Geth,
		obj.Token,
	)
	if err != nil {
		return model.Token{}, fmt.Errorf("erc20: %v", err)
	}
	return model.Token{
		Address:     obj.Token.String(),
		Name:        name,
		Symbol:      symbol,
		TotalSupply: totalSupply.String(),
		Decimals:    int(decimals),
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
	if r.F.Is(features.FeatureMockGraph) {
		time.Sleep(2 * time.Second)
		// If we're mocking the graph, then we take the uncaled
		// amount, and we simply divide it by 1e6, then we divide
		// it by 0.04 unless the token is fUSDC.
		value := obj.ValueUnscaled
		dividedAmt := value.Scale(obj.Decimals) //value / (10 ** decimals)
		switch obj.Token {
		case r.C.FusdcAddr:
			slog.Info("features mocked graph value fusdc", "value", value, "divided", dividedAmt)
			// 4 decimals
			return fmt.Sprintf("%0.4f", dividedAmt), nil
		default:
			//value / (10 ** decimals) * 0.04
			x := new(big.Float).Set(dividedAmt)
			x.Quo(dividedAmt, new(big.Float).SetFloat64(0.04))
			slog.Info("features mocked graph value usd non fusdc", "value", value, "divided", dividedAmt, "x", x)
			return fmt.Sprintf("%0.4f", x), nil
		}
	}
	return "", nil // TODO
}

// SetVolumeYieldPriceAndTVLForLastHour is the resolver for the setVolumeYieldPriceAndTVLForLastHour field.
func (r *mutationResolver) SetVolumeYieldPriceAndTVLForLastHour(ctx context.Context) (*string, error) {
	panic(fmt.Errorf("not implemented: SetVolumeYieldPriceAndTVLForLastHour - setVolumeYieldPriceAndTVLForLastHour"))
}

// Pools is the resolver for the pools field.
func (r *queryResolver) Pools(ctx context.Context) (pools []seawater.Pool, err error) {
	if r.F.Is(features.FeatureMockGraph) {
		time.Sleep(2 * time.Second)
		pools = MockSeawaterPools()
		return
	}
	err = r.DB.Table("seawater_active_positions_1").Scan(pools).Error
	return pools, err
}

// GetPool is the resolver for the getPool field.
func (r *queryResolver) GetPool(ctx context.Context, address string) (pool *seawater.Pool, err error) {
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		pool = MockGetPool(address)
		return
	}
	err = r.DB.Table("events_seawater_newpool").Where("token = ?", address).Scan(pool).Error
	return
}

// GetPoolPositions is the resolver for the getPoolPositions field.
func (r *queryResolver) GetPoolPositions(ctx context.Context, address string) (positions []seawater.Position, err error) {
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		positions = MockGetPoolPositions(address)
		return
	}
	err = r.DB.Table("seawater_active_positions_1").Where("pool = ?", address).Scan(positions).Error
	return
}

// GetPosition is the resolver for the getPosition field.
func (r *queryResolver) GetPosition(ctx context.Context, id string) (position *seawater.Position, err error) {
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		position = MockGetPosition(id)
		return
	}
	i, err := types.NumberFromString(id)
	if err != nil {
		return nil, fmt.Errorf("bad id: %v", err)
	}
	err = r.DB.Table("seawater_positions_1").Where("pos_id = ?", i).Scan(position).Error
	return
}

// GetPositions is the resolver for the getPositions field.
func (r *queryResolver) GetPositions(ctx context.Context, wallet string) ([]seawater.Position, error) {
	panic(fmt.Errorf("not implemented: GetPositions - getPositions"))
}

// GetWallet is the resolver for the getWallet field.
func (r *queryResolver) GetWallet(ctx context.Context, address string) (*model.Wallet, error) {
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		return &model.Wallet{types.AddressFromString(address)}, nil
	}
	return nil, nil // TODO
}

// GetSwaps is the resolver for the getSwaps field.
func (r *queryResolver) GetSwaps(ctx context.Context, pool string) (swaps []model.SeawaterSwap, err error) {
	if r.F.Is(features.FeatureMockGraph) {
		time.Sleep(2 * time.Second)
		swaps = MockSwaps(r.C.FusdcAddr, 150, types.AddressFromString(pool))
		return
	}
	return nil, nil // TODO
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

// Token is the resolver for the token field.
func (r *seawaterPoolResolver) Token(ctx context.Context, obj *seawater.Pool) (t model.Token, err error) {
	if obj == nil {
		return t, fmt.Errorf("no pool obj")
	}
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		return MockToken(obj.Token.String())
	}
	name, symbol, totalSupply, decimals, err := erc20.GetErc20Details(
		ctx,
		r.Geth,
		obj.Token,
	)
	if err != nil {
		return t, fmt.Errorf("erc20: %v", err)
	}
	return model.Token{
		Name:        name,
		Symbol:      symbol,
		TotalSupply: totalSupply.String(),
		Decimals:    int(decimals),
	}, nil
}

// PriceOverTime is the resolver for the priceOverTime field.
func (r *seawaterPoolResolver) PriceOverTime(ctx context.Context, obj *seawater.Pool) (price model.PriceOverTime, err error) {
	if obj == nil {
		return price, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		daily, _, _, err := MockPriceOverTime(31, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return price, err
		}
		monthly, _, _, err := MockPriceOverTime(12, r.C.FusdcAddr, obj.Token)
		if err != nil {
			return price, err
		}
		return model.PriceOverTime{daily, monthly}, nil
	}
	return price, nil // TODO
}

// VolumeOverTime is the resolver for the volumeOverTime field.
func (r *seawaterPoolResolver) VolumeOverTime(ctx context.Context, obj *seawater.Pool) (vol model.VolumeOverTime, err error) {
	if obj == nil {
		return vol, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
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
	return vol, nil // TODO
}

// LiquidityOverTime is the resolver for the liquidityOverTime field.
func (r *seawaterPoolResolver) LiquidityOverTime(ctx context.Context, obj *seawater.Pool) (liq model.LiquidityOverTime, err error) {
	if obj == nil {
		return liq, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
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
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
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
	return tvl, nil // TODO
}

// YieldOverTime is the resolver for the yieldOverTime field.
func (r *seawaterPoolResolver) YieldOverTime(ctx context.Context, obj *seawater.Pool) (yield model.YieldOverTime, err error) {
	if obj == nil {
		return yield, fmt.Errorf("pool empty")
	}
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
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
func (r *seawaterPoolResolver) EarnedFeesAprfusdc(ctx context.Context, obj *seawater.Pool) (string, error) {
	return "", nil // TODO
}

// EarnedFeesAPRToken1 is the resolver for the earnedFeesAPRToken1 field.
func (r *seawaterPoolResolver) EarnedFeesAPRToken1(ctx context.Context, obj *seawater.Pool) (string, error) {
	return "", nil // TODO
}

// LiquidityIncentives is the resolver for the liquidityIncentives field.
func (r *seawaterPoolResolver) LiquidityIncentives(ctx context.Context, obj *seawater.Pool) (model.Amount, error) {
	return model.Amount{}, nil // TODO
}

// SuperIncentives is the resolver for the superIncentives field.
func (r *seawaterPoolResolver) SuperIncentives(ctx context.Context, obj *seawater.Pool) (model.Amount, error) {
	return model.Amount{}, nil // TODO
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
	if r.F.Is(features.FeatureMockGraph) {
		r.F.On(features.FeatureMockGraphDataDelay, func() error {
			time.Sleep(2 * time.Second)
			return nil
		})
		positions = MockGetPoolPositions(obj.Token.String())
		return
	}
	err = r.DB.Table("seawater_positions_1").Where("pool = ?", obj.Token).Scan(positions).Error
	return
}

// PositionsForUser is the resolver for the positionsForUser field.
func (r *seawaterPoolResolver) PositionsForUser(ctx context.Context, obj *seawater.Pool, address string) ([]seawater.Position, error) {
	panic(fmt.Errorf("not implemented: PositionsForUser - positionsForUser"))
}

// Swaps is the resolver for the swaps field.
func (r *seawaterPoolResolver) Swaps(ctx context.Context, obj *seawater.Pool) (swaps []model.SeawaterSwap, err error) {
	if obj == nil {
		return nil, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureMockGraph) {
		time.Sleep(2 * time.Second)
		swaps = MockSwaps(r.C.FusdcAddr, 150, obj.Token)
		return
	}
	return nil, nil // TODO
}

// SwapsForUser is the resolver for the swapsForUser field.
func (r *seawaterPoolResolver) SwapsForUser(ctx context.Context, obj *seawater.Pool, address string) (swaps []model.SeawaterSwap, err error) {
	if obj == nil {
		return nil, fmt.Errorf("empty pool")
	}
	if r.F.Is(features.FeatureMockGraph) {
		time.Sleep(2 * time.Second)
		swaps = MockSwaps(r.C.FusdcAddr, 150, "0x65dfe41220c438bf069bbce9eb66b087fe65db36")
		return
	}
	return nil, nil // TODO

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
	return model.Wallet{obj.Owner}, nil
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
func (r *seawaterPositionResolver) Lower(ctx context.Context, obj *seawater.Position) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no position obj")
	}
	return obj.Lower.String(), nil
}

// Upper is the resolver for the upper field.
func (r *seawaterPositionResolver) Upper(ctx context.Context, obj *seawater.Position) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no position obj")
	}
	return obj.Upper.String(), nil
}

// Liquidity is the resolver for the liquidity field.
func (r *seawaterPositionResolver) Liquidity(ctx context.Context, obj *seawater.Position) (model.PairAmount, error) {
	return model.PairAmount{}, nil // TODO
}

// Sender is the resolver for the sender field.
func (r *seawaterSwapResolver) Sender(ctx context.Context, obj *model.SeawaterSwap) (model.Wallet, error) {
	if obj == nil {
		return model.Wallet{}, fmt.Errorf("empty swap")
	}
	return model.Wallet{obj.Sender}, nil
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
	return "wallet" + obj.Address.String(), nil
}

// Address is the resolver for the address field.
func (r *walletResolver) Address(ctx context.Context, obj *model.Wallet) (string, error) {
	if obj == nil {
		return "", fmt.Errorf("no token")
	}
	return obj.Address.String(), nil
}

// Balances is the resolver for the balances field.
func (r *walletResolver) Balances(ctx context.Context, obj *model.Wallet) ([]model.TokenBalance, error) {
	return nil, nil // TODO
}

// Positions is the resolver for the positions field.
func (r *walletResolver) Positions(ctx context.Context, obj *model.Wallet) ([]seawater.Position, error) {
	return nil, nil // TODO
}

// Amount returns AmountResolver implementation.
func (r *Resolver) Amount() AmountResolver { return &amountResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// SeawaterPool returns SeawaterPoolResolver implementation.
func (r *Resolver) SeawaterPool() SeawaterPoolResolver { return &seawaterPoolResolver{r} }

// SeawaterPosition returns SeawaterPositionResolver implementation.
func (r *Resolver) SeawaterPosition() SeawaterPositionResolver { return &seawaterPositionResolver{r} }

// SeawaterSwap returns SeawaterSwapResolver implementation.
func (r *Resolver) SeawaterSwap() SeawaterSwapResolver { return &seawaterSwapResolver{r} }

// Wallet returns WalletResolver implementation.
func (r *Resolver) Wallet() WalletResolver { return &walletResolver{r} }

type amountResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type seawaterPoolResolver struct{ *Resolver }
type seawaterPositionResolver struct{ *Resolver }
type seawaterSwapResolver struct{ *Resolver }
type walletResolver struct{ *Resolver }
