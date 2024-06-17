package main

import (
	"github.com/fluidity-money/long.so/lib/types"

	"gorm.io/gorm"
)

func storePositions(db *gorm.DB, ids []types.Number, amount0s, amount1s []types.UnscaledNumber) error {
	// TODO
	return nil
}
