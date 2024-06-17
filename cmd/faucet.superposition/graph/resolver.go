package graph

import (
	"gorm.io/gorm"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/features"
)

type (
	Resolver struct {
		DB      *gorm.DB          // db used to look up any fields that are missing from a request.
		F       features.F        // features to have enabled when requested
		Geth    *ethclient.Client // needed to do lookups with geth
		C       config.C          // config for connecting to the right endpoints
		Queue   chan<- FaucetReq    // queue for faucet requests
		Stakers map[string]bool   // stakers list to support to filter Ethereum addresses on. (read-only)
	}

	// FaucetReq to an IP address given, assuming they passed the
	// restrictions.
	FaucetReq struct {
		Addr ethCommon.Address
		Resp chan error
	}
)
