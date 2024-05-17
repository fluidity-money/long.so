package config

const (
	// DefaultPaginationBlockCount to increase the last known block tracked
	// by with.
	DefaultPaginationBlockCount = 10_000

	// DefaultPaginationPollWait to wait between polls.
	DefaultPaginationPollWait = 15 // Seconds
)
