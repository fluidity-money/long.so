// list contains the list of features currently supported in the Go codebase.

package features

const (
	// FeatureMockGraph by sending mocked data instead of database data.
	FeatureMockGraph = "graphql mock demo data"

	// FeatureMockGraphDelay by delaying the display of the mocked data.
	FeatureMockGraphDataDelay = "graphql mock demo data delay"

	// FeaturePollRpc using the ingestor. Useful in environments
	// where websocket access is inconsistent or unavailable. Does so with
	// a (by default) 15 second delay, with checkpointing done in the database.
	FeaturePollRpc  = "ingestor poll rpc"
)
