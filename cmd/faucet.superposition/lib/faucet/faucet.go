package erc20

import (
	"context"

	"github.com/ethereum/go-ethereum/ethclient"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

// SendFaucet to multiple addresses, allowing the contract to randomly choose how much to send.
func SendFaucet(ctx context.Context, c *ethclient.Client, addrs ...ethCommon.Address) error {
	// TODO
}
