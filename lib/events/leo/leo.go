package leo

import (
	"bytes"
	_ "embed"
	"fmt"
	"math/big"

	"github.com/fluidity-money/long.so/lib/types"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

var (
	TopicCampaignBalanceUpdated = abi.Events["CampaignBalanceUpdated"].ID
	TopicCampaignCreated        = abi.Events["CampaignCreated"].ID
)

//go:embed abi.json
var abiBytes []byte

var abi, _ = ethAbi.JSON(bytes.NewReader(abiBytes))
