package main

import (
	"gorm.io/gorm"
)

func storePositions(db *gorm.DB, pools []string, ids []int, amount0s, amount1s []string) error {
	query := `SELECT snapshot_create_positions_1($1, $2, $3, $4)`
	return db.Exec(query, pools, ids, amount0s, amount1s).Error
}
