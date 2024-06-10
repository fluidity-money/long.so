package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"context"
	_ "embed"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/features"
	_ "github.com/fluidity-money/long.so/lib/setup"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/ethereum/go-ethereum/ethclient"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/aws/aws-lambda-go/lambda"

	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
)

//go:embed stakers.json
var StakersBytes []byte

const (
	// EnvBackendType to use to listen the server with, (http|lambda).
	EnvBackendType = "SPN_LISTEN_BACKEND"

	// EnvListenAddr to listen the HTTP server on.
	EnvListenAddr = "SPN_LISTEN_ADDR"
)

// XForwardedFor to load as a cache key in the context for use
const XForwardedFor = "X-Forwarded-For"

type requestMiddleware struct {
	srv *handler.Server
}

func (m requestMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	ipAddr := r.Header.Get(XForwardedFor)
	ctx := context.WithValue(r.Context(), XForwardedFor, ipAddr)
	m.srv.ServeHTTP(w, r.WithContext(ctx))
}

// Stakers map created from stakers.json (that should be provided dring build-time.)
var Stakers map[string]bool

func main() {
	config := config.Get()
	db, err := gorm.Open(postgres.Open(config.TimescaleUrl), &gorm.Config{
		DisableAutomaticPing: true,
	})
	if err != nil {
		log.Fatalf("database open: %v", err)
	}
	geth, err := ethclient.Dial(config.GethUrl)
	if err != nil {
		log.Fatalf("geth open: %v", err)
	}
	defer geth.Close()
	// Start the sender in another Go routine to send batch requests
	// out of the SPN (gas) token.
	queue := RunSender()
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB:      db,
			F:       features.Get(),
			Geth:    geth,
			C:       config,
			Queue: queue,
			Stakers: Stakers,
		},
	}))
	// Add a custom transport so we can access the requesting IP address in a context.
	http.Handle("/", requestMiddleware{srv})
	http.Handle("/playground", playground.Handler("Faucet playground", "/"))
	switch typ := os.Getenv(EnvBackendType); typ {
	case "lambda":
		lambda.Start(httpadapter.New(http.DefaultServeMux).ProxyWithContext)
	case "http":
		err := http.ListenAndServe(os.Getenv(EnvListenAddr), nil)
		log.Fatalf( // This should only return if there's an error.
			"err listening, %#v not set?: %v",
			EnvListenAddr,
			err,
		)
	default:
		log.Fatalf(
			"unexpected listen type: %#v, use either (lambda|http) for SPN_LISTEN_BACKEND",
			typ,
		)
	}
}

func init() {
	var stakers []string
	if err := json.Unmarshal(StakersBytes, stakers); err != nil {
		panic(err)
	}
	Stakers = make(map[string]bool, len(stakers))
	for _, s := range stakers {
		Stakers[s] = true
	}
}
