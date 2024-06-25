// setup: contains simple functions for setting up the logging library,
// as well as the database.

package setup

import (
	"log"
	"log/slog"
	"os"
	"runtime/debug"
	"strings"
	"fmt"
	"time"

	"github.com/getsentry/sentry-go"
	slogsentry "github.com/samber/slog-sentry/v2"
)

const (
	// EnvDebug for enabling debug printing of messages.
	EnvDebug = "SPN_DEBUG"

	// EnvSentryDsn to use for logging sentry-related messages.
	EnvSentryDsn = "SPN_SENTRY_DSN"
)

func init() {
	// Set up the logging to print JSON blobs.
	logLevel := slog.LevelInfo
	if os.Getenv(EnvDebug) != "" {
		logLevel = slog.LevelDebug
	}
	// Set up Sentry, if it's enabled.
	dsn := os.Getenv(EnvSentryDsn)
	if dsn != "" {
		err := sentry.Init(sentry.ClientOptions{
			Dsn:           dsn,
			EnableTracing: false,
		})
		if err != nil {
			panic(fmt.Sprintf("failed to set up sentry: %v", err))
		}
	}
	var logger *slog.Logger
	if dsn != "" { // DSN being set means we're using Sentry.
		slogSentryOpts := slogsentry.Option{Level: logLevel}.NewSentryHandler()
		logger = slog.New(slogSentryOpts)
	} else {
		logger = slog.New(slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{
			Level: logLevel,
		}))
	}
	// Find the commit hash (taken straight from
	// https:icinga.com/blog/2022/05/25/embedding-git-commit-information-in-go-binaries/)
	var revision string
	if info, ok := debug.ReadBuildInfo(); ok {
		for _, setting := range info.Settings {
			if setting.Key == "vcs.revision" {
				revision = setting.Value
				break
			}
		}
	}
	logger.
		With("revision", revision).
		With("environment", "backend").
		With("command line", strings.Join(os.Args, ",")).
		With("is debug", logLevel == slog.LevelDebug)
	slog.SetDefault(logger)
}

func Flush() {
	sentry.Flush(2 * time.Second)
}

func Exit() {
	Flush()
	os.Exit(1)
}
func Exitf(s string, f ...any) {
	log.Printf(s, f...)
	Exit()
}
