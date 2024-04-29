package graph

import (
	"gorm.io/gorm"

	"github.com/ethereum/go-ethereum/ethclient"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/features"
)

type Resolver struct {
	DB     *gorm.DB     // db used to look up any fields that are missing from a request.
	F      features.F  // features to have enabled when requested
	Geth *ethclient.Client // needed to do lookups with geth
	C config.C    // config for connecting to the right endpoints
}
