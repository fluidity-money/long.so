package seawater

import (
	_ "embed"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
)

var (
	TopicMintPosition, _            = hex.DecodeString("")
	TopicBurnPosition, _            = hex.DecodeString("")
	TopicTransferPosition, _        = hex.DecodeString("")
	TopicUpdatePositionLiquidity, _ = hex.DecodeString("")
	TopicCollectFees, _             = hex.DecodeString("")
	TopicNewPool, _                 = hex.DecodeString("")
	TopicCollectProtocolFees, _     = hex.DecodeString("")
	TopicSwap2, _                   = hex.DecodeString("")
	TopicSwap1, _                   = hex.DecodeString("")
)

//go:embed abi.json
var abiBytes []byte

var abi ethAbi.ABI
