package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"log"
	"os"
	"net/http"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/features"
	_ "github.com/fluidity-money/long.so/lib/setup"

	"github.com/fluidity-money/long.so/cmd/graphql.ethereum/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/ethereum/go-ethereum/ethclient"

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
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB:   db,
			F:    features.Get(),
			Geth: geth,
			C:    config,
		},
	}))
	http.Handle("/", srv)
	http.Handle("/playground", playground.Handler("Long Tail playground", "/"))
	switch typ := os.Getenv(EnvBackendType); typ {
	case "lambda":
		lambda.Start(httpadapter.New(http.DefaultServeMux).ProxyWithContext)
	case "http":
		log.Fatal(http.ListenAndServe(os.Getenv(EnvListenAddr), nil))
	default:
		log.Fatalf("unexpected listen type: %#v, use either (lambda|http) for SPN_LISTEN_BACKEND", typ)
	}
}
