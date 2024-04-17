package ethereum_ingestor

import "github.com/fluidity-money/amm.superposition.so/lib/types"

type (
	// BlockHeader contained within a block on Arbitrum, may be forked.
	BlockHeader struct {
		ParentHash       types.Hash           `json:"parentHash"`
		StateRoot        types.Data           `json:"stateRoot"`
		TransactionsRoot types.Data           `json:"transactionsRoot"`
		ReceiptsRoot     types.Data           `json:"receiptsRoot"`
		LogsBloom        types.Data           `json:"logsBloom"`
		GasLimit         types.UnscaledNumber `json:"gasLimit"`
		GasUsed          types.UnscaledNumber `json:"gasUsed"`
		Hash             types.Hash           `json:"hash"`
	}

	// Transaction made on Ethereum, may be forked
	Transaction struct {
		BlockHash types.Hash `json:"blockHash"`
		Data      types.Data `json:"data"`

		// GasLimit could be set by transactions prior to London
		GasLimit types.UnscaledNumber `json:"gas"`

		// GasFeeCap is the maxFeePerGas
		GasFeeCap types.UnscaledNumber `json:"gasFeeCap"`

		// GasTipCap is the maxPriorityFeePerGas
		GasTipCap types.UnscaledNumber `json:"gasTipCap"`

		GasPrice types.UnscaledNumber `json:"gas_price"`
		Hash     types.Hash           `json:"hash"`
		To       types.Address        `json:"to"`
		From     types.Address        `json:"from"`
		Type     uint8                `json:"type"`
	}

	// Log represents a contract event log that we have confirmed isn't removed
	Log struct {
		// address of the contract that generated the event
		Address types.Address `json:"address"`

		// list of topics provided by the contract.
		Topics []types.Hash `json:"topics"`

		// supplied by the contract, usually ABI-encoded
		Data types.Data `json:"data"`

		// block in which the transaction was included
		BlockNumber types.Number `json:"blockNumber"`

		// hash of the transaction
		TxHash types.Hash `json:"transactionHash"`

		// index of the transaction in the block
		TxIndex types.Number `json:"transactionIndex"`

		// hash of the block in which the transaction was included
		BlockHash types.Hash `json:"blockHash"`

		// index of the log in the block
		Index types.Number `json:"logIndex"`

		// whether the log was removed due to a chain reorganisation!
		Removed bool `json:"removed"`
	}

	// Receipt is the type returned when you use ethclient TransactionReceipt
	// on a transaction
	Receipt struct {
		Type              uint8                `json:"type"`
		PostState         types.Data           `json:"root"`
		Status            uint64               `json:"status"`
		CumulativeGasUsed uint64               `json:"cumulativeGasUsed"`
		Bloom             types.Data           `json:"logsBloom"`
		Logs              []Log                `json:"logs"`
		TransactionHash   types.Hash           `json:"transactionHash"`
		ContractAddress   types.Address        `json:"contractAddress"`
		GasUsed           types.UnscaledNumber `json:"gasUsed"`
		BlockHash         types.Hash           `json:"blockHash"`
		BlockNumber       types.Number         `json:"blockNumber"`
		TransactionIndex  uint                 `json:"transactionIndex"`
	}
)
