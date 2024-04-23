package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"

	"github.com/fluidity-money/amm.superposition.so/lib/applications/erc20"
	"github.com/fluidity-money/amm.superposition.so/lib/applications/seawater"

	"github.com/fluidity-money/amm.superposition.so/lib/features"
	"github.com/fluidity-money/amm.superposition.so/lib/config"

	"gorm.io/gorm"

	"github.com/ethereum/go-ethereum"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethTypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

func Entry(f features.F, config config.C, c *ethclient.Client, db *gorm.DB) {
	seawaterAddr := ethCommon.HexToAddress(config.SeawaterAddr.String())
	topics := [][]ethCommon.Hash{{
		erc20.TopicTransfer,
		seawater.TopicMintPosition,
		seawater.TopicBurnPosition,
		seawater.TopicTransferPosition,
		seawater.TopicUpdatePositionLiquidity,
		seawater.TopicCollectFees,
		seawater.TopicNewPool,
		seawater.TopicCollectProtocolFees,
		seawater.TopicSwap2,
		seawater.TopicSwap1,
	}}
	filter := ethereum.FilterQuery{
		Topics: topics,
	}
	var (
		logs   = make(chan ethTypes.Log)
		errors = make(chan error)
	)
	go func() {
		subscription, err := c.SubscribeFilterLogs(context.Background(), filter, logs)
		if err != nil {
			log.Fatalf("eth log subscription: %v", err)
		}
		err = <-subscription.Err()
		errors <- err
	}()
	for {
		select {
		case err := <-errors:
			log.Fatalf("subscription error: %v", err)
		case l := <-logs:
			// Figure out what kind of log this is, and then insert it into the database.
			if err := handleLog(db, seawaterAddr, l); err != nil {
				log.Fatalf("handling log: %v", err)
			}
		}
	}
}

func handleLog(db *gorm.DB, seawaterAddr ethCommon.Address, l ethTypes.Log) error {
	var (
		topic0 = l.Topics[0]
		topic1 = l.Topics[1]
		topic2 = l.Topics[2]
		data   = l.Data
	)
	var (
		a     any // Log that we're unpacking.
		err   error
		table string // Table name to insert the log into
	)
	var (
		blockHash       = l.BlockHash.String()
		transactionHash = l.TxHash.String()
		blockNumber = l.BlockNumber
		emitterAddr = l.Address
	)
	slog.Debug("unpacking event",
		"block hash", blockHash,
		"transaction hash", transactionHash,
		"block number", blockNumber,
		"emitter addr", emitterAddr,
		"topic0", topic0,
		"topic1", topic1,
		"topic2", topic2,
	)
	// If the event was made by Seawater. Assumed to be the case, so
	// non-Seawater events should set this to false in this switch. Used to
	// check the event emitter.
	isSeawater := true
	switch topic0 {
	case erc20.TopicTransfer:
		a, err = erc20.UnpackTransfer(topic1, topic2, data)
		table = "events_erc20_transfer"
		isSeawater = false

	case seawater.TopicMintPosition:
		a, err = seawater.UnpackMintPosition(topic1, topic2, data)
		table = "applications_seawater_mintPosition"

	case seawater.TopicBurnPosition:
	case seawater.TopicTransferPosition:
	case seawater.TopicUpdatePositionLiquidity:
	case seawater.TopicCollectFees:
	case seawater.TopicNewPool:
	case seawater.TopicCollectProtocolFees:
	case seawater.TopicSwap2:
	case seawater.TopicSwap1:
	default:
		return fmt.Errorf("unexpected topic: %v", topic0)
	}
	if err != nil {
		return fmt.Errorf("failed to process topic for table %#v: %v", table, err)
	}
	if isSeawater {
		// Make sure that the log came from the Seawater contract.
		if seawaterAddr != emitterAddr {
			slog.Warn("ignoring a Seawater log from a sender that wasn't seawater",
				"seawater address", seawaterAddr,
				"emitter address", emitterAddr,
				"topic0", topic0,
				"transaction hash", transactionHash,
			)
			return nil
		}
	}
	setEventFields(&a, blockHash, transactionHash, blockNumber, emitterAddr.String())
	databaseInsertLog(db,table,a)
	return nil
}

func databaseInsertLog(db *gorm.DB, table string, a any) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(a); err != nil {
		log.Fatalf("encoding block header: %v", err)
	}

	if err := db.Table(table).Omit("createdBy").Create(a).Error; err != nil {
		log.Fatalf("inserting log: %v", err)
	}
}
