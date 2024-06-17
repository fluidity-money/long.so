package main

import (
	"fmt"
	"strings"

	"gorm.io/gorm"
)

// storePositions in the database, by formatting a string to use to make
// the insertion. Thankfully we're protected by the datatype for this.
func storePositions(db *gorm.DB, ids, amount0s, amount1s []string) error {
	// Gorm lacks the support for inserting arrays (we think) so this
	// is something we need to do. Ugly I know.
	err := db.Exec(fmt.Sprintf(
		"SELECT snapshot_create_positions_1(ARRAY[%s], ARRAY[%s], ARRAY[%s])",
		strings.Join(ids, ","),      // ids
		strings.Join(amount0s, ","), // amount0s
		strings.Join(amount1s, ","), // amount1s
	)).
		Error
	return err
}
