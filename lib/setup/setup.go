// setup: contains simple functions for setting up the logging library,
// as well as the database.

package setup

import (
	"os"
	"log/slog"
)

const EnvDebug = "SPN_DEBUG"

func init() {
	// Set up the logging to print JSON blobs.
	logLevel := slog.LevelInfo
	if os.Getenv(EnvDebug) != "" {
		logLevel = slog.LevelDebug
	}
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{
		Level: logLevel,
	})))
}
