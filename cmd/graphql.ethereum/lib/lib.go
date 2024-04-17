// lib contains the entrypoint for the stateless application classification code.

package lib

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/fluidity-money/amm.superposition.so/lib/config"
	"github.com/fluidity-money/amm.superposition.so/lib/features"
	"github.com/fluidity-money/amm.superposition.so/lib/types"

	"github.com/fluidity-money/amm.superposition.so/cmd/graphql.ethereum/graph/model"

	"github.com/fluidity-money/amm.superposition.so/cmd/graphql.ethereum/lib/erc20"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

// LogData retrieved from eth_getLogs. Some fields not included
// intentionally.
type LogData struct {
	Address         types.Address `json:"address"`
	BlockHash       types.Hash    `json:"blockHash"`
	Data            types.Data    `json:"data"`
	Topics          []types.Data  `json:"topics"`
	TransactionHash types.Hash    `json:"transactionHash"`
}

// GetApplications for the features, config, and address provided.
// Assumes forking is not happening.
func GetApplications(config config.C, f features.F, geth http.Client, blockHash types.Hash, b types.Data) (apps []model.Application, err error) {
	// Check if we should look up this block by first checking if the
	// bloom filter contains anything we care about.
	filterBytes, err := b.Bytes()
	if err != nil {
		return nil, fmt.Errorf("bad bloom filter bytes hash %v: %v", blockHash, err)
	}
	// Create a bloom filter, and start to test if any applications match for it.
	bloom := ethTypes.BytesToBloom(filterBytes)
	hasApplication := false
	// Track every matching log topic so we can request it from eth_getLogs.
	var logTopics [][]byte
	if bloom.Test(erc20.TopicTransfer) {
		hasApplication = true
		logTopics = append(logTopics, erc20.TopicTransfer)
	}
	// If we don't find anything, just bail out.
	if !hasApplication {
		slog.Debug("no applications found for a hash",
			"hash", blockHash,
			"bloom", bloom,
		)
		return []model.Application{}, nil
	}
	// TODO: sort the log topics (once more are supported)
	logData, err := getLogs(config.GethUrl, &geth, blockHash, logTopics...)
	if err != nil {
		return nil, fmt.Errorf("logs for hash %v: %v", blockHash, err)
	}
	for i, log := range logData {
		if len(log.Topics) == 0 {
			slog.Info("log didn't contain any topics!",
				"block hash", blockHash,
				"position", i,
			)
			continue
		}
		slog.Debug("log response",
			"block hash", blockHash,
			"log data", logData,
		)
		topic0, err := log.Topics[0].Bytes()
		if err != nil {
			return nil, fmt.Errorf("unpacking topic0 %#v: %v", log.Topics[0], err)
		}
		switch {
		case bytes.Equal(topic0, erc20.TopicTransfer):
			sender, recipient, value, err := erc20.UnpackTransfer(
				log.Topics[1],
				log.Topics[2],
				log.Data,
			)
			if err != nil {
				return nil, fmt.Errorf("unable to unpack log %v: %v", i, err)
			}
			apps = append(apps, model.Application{
				BlockHash:       blockHash,
				TransactionHash: log.TransactionHash,
				Erc20Transfer: model.Erc20Transfer{
					TokenAddr:     log.Address, // Assume the log creator is the token.
					SenderAddr:    *sender,
					RecipientAddr: *recipient,
					Value:         *value,
				}},
			)
		}
	}
	return apps, nil
}

func getLogs(url string, c *http.Client, blockHash types.Hash, topics ...[]byte) ([]LogData, error) {
	type (
		param struct {
			Topics    []string   `json:"topics"`
			BlockHash types.Hash `json:"blockHash"`
		}
		request struct {
			Id      string  `json:"id"`
			Method  string  `json:"method"`
			JsonRpc string  `json:"jsonrpc"`
			Params  []param `json:"params"`
		}
		response struct {
			JsonRpc string    `json:"jsonrpc"`
			Id      string    `json:"id"`
			Result  []LogData `json:"result"`
		}
	)
	topicsHex := make([]string, len(topics))
	for i, t := range topics {
		topicsHex[i] = "0x" + hex.EncodeToString(t)
	}
	if blockHash == "" {
		log.Fatalf("block hash %v", blockHash)
	}
	req := request{
		Id:      "1", // Hardcode the ID, assuming socket pooling isn't happening.
		Method:  "eth_getLogs",
		JsonRpc: "2.0",
		Params: []param{{
			Topics:    topicsHex,
			BlockHash: blockHash,
		}},
	}
	var buf bytes.Buffer // Reuse the send buffer, not caring if it garbles due to a partial read.
	if err := json.NewEncoder(&buf).Encode(req); err != nil {
		return nil, fmt.Errorf("eth_getLogs request, request %v: %v", req, err)
	}
	resp, err := c.Post(url, "application/json", &buf)
	if err != nil {
		return nil, fmt.Errorf("requesting from geth, hash %v: %v", blockHash, err)
	}
	defer resp.Body.Close()
	if _, err := buf.ReadFrom(resp.Body); err != nil {
		return nil, fmt.Errorf("reading geth, hash %v: %v", blockHash, err)
	}
	buf2 := buf // Take a copy for logging.
	var r response
	if err := json.NewDecoder(&buf).Decode(&r); err != nil {
		return nil, fmt.Errorf(
			"decoding geth json, hash %v, data %#v: %v",
			blockHash,
			buf2.String(),
			err,
		)
	}
	slog.Debug("response for request for block hash",
		"buffer", buf2.String(),
		"decoded", r,
	)
	return r.Result, nil
}
