package graph

import (
	"net/http"

	"gorm.io/gorm"

	"github.com/fluidity-money/amm.superposition.so/lib/config"
	"github.com/fluidity-money/amm.superposition.so/lib/features"
)

type Resolver struct {
	DB     *gorm.DB     // db used to look up any fields that are missing from a request.
	F      features.F  // features to have enabled when requested
	Geth   http.Client // for copying to make requests to mock easily
	C config.C    // config for connecting to the right endpoints
}
