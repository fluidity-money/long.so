package main

import (
	"log"
	"net/http"
	"database/sql"
	"os"

	_ "github.com/fluidity-money/amm.superposition.so/lib/setup"
	"github.com/fluidity-money/amm.superposition.so/lib/features"
	"github.com/fluidity-money/amm.superposition.so/lib/config"

	"github.com/fluidity-money/amm.superposition.so/cmd/graphql.ethereum/graph"

	"github.com/99designs/gqlgen/graphql/handler"

	_ "github.com/lib/pq"
)

// EnvListenAddr to listen the HTTP server on.
const EnvListenAddr = "SPN_LISTEN_ADDR"

func main() {
	config := config.Get()
	db, err := sql.Open("postgres", config.TimescaleUrl)
	if err != nil {
		log.Fatalf("database open: %v", err)
	}
	defer db.Close()
	var geth http.Client
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB: db,
			F: features.Get(),
			Geth: geth,
			C: config,
		},
	}))
	http.Handle("/query", srv)
	log.Fatal(http.ListenAndServe(os.Getenv(EnvListenAddr), nil))
}
