package main

import "gorm.io/gorm"

type BlockCheckpoint struct {
	BlockNumber uint64
}

func getLastBlockCheckpointed(db *gorm.DB) (uint64, error) {
	var c BlockCheckpoint
	err := db.Table("ingestor_checkpointing_1").Find(&c).Error
	if err != nil {
		return 0, err
	}
	return c.BlockNumber, nil
}