package config

import "github.com/fluidity-money/long.so/lib/types/seawater"

// Pool config, probably derived from config/pools.toml.
type Pool struct {
	Displayed      bool                    `toml:"displayed"`
	Classification seawater.Classification `toml:"classification"`
}
