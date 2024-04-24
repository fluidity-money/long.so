package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"log"
	"net/http"
	"os"
	"log/slog"

	"github.com/fluidity-money/amm.superposition.so/lib/config"
	"github.com/fluidity-money/amm.superposition.so/lib/features"
	_ "github.com/fluidity-money/amm.superposition.so/lib/setup"

	"github.com/fluidity-money/amm.superposition.so/cmd/graphql.ethereum/graph"

	"github.com/99designs/gqlgen/graphql/handler"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/aws/aws-lambda-go/lambda"

	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
)

const (
	// EnvBackendType to use to listen the server with, (http|lambda).
	EnvBackendType = "SPN_LISTEN_BACKEND"

	// EnvListenAddr to listen the HTTP server on.
	EnvListenAddr = "SPN_LISTEN_ADDR"
)

func main() {
	config := config.Get()
	slog.Info("connecting to the database")
	db, err := gorm.Open(postgres.Open(config.TimescaleUrl), &gorm.Config{
		DisableAutomaticPing: true,
	})
	if err != nil {
		log.Fatalf("database open: %v", err)
	}
	var geth http.Client
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB:   db,
			F:    features.Get(),
			Geth: geth,
			C:    config,
		},
	}))
	slog.Info("creating the server")
	http.Handle("/", srv)
	switch typ := os.Getenv(EnvBackendType); typ {
	case "lambda":
		lambda.Start(httpadapter.New(http.DefaultServeMux).ProxyWithContext)
	case "http":
		log.Fatal(http.ListenAndServe(os.Getenv(EnvListenAddr), nil))
	default:
		log.Fatalf("unexpected listen type: %#v", typ)
	}
}
