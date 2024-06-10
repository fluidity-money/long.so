// list contains the list of features currently supported in the Go codebase.

package features

const (
	// FeatureGraphqlMockGraph by sending mocked data instead of database data.
	FeatureGraphqlMockGraph = "graphql mock demo data"

	// FeatureGraphqlMockGraphDelay by delaying the display of the mocked data.
	FeatureGraphqlMockGraphDataDelay = "graphql mock demo data delay"

	// FeatureIngestorPollRpc using the ingestor. Useful in environments
	// where websocket access is inconsistent or unavailable. Does so with
	// a (by default) 15 second delay, with checkpointing done in the database.
	FeatureIngestorPollRpc  = "ingestor poll rpc"

	// FeatureFaucetStakersOnly to gate access to the faucet to the
	// list of stakers in the JSON blob in config/stakers.json.
	FeatureFaucetStakersOnly = "faucet stakers only"
)
