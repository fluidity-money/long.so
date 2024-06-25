package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"context"
	"crypto/ecdsa"
	_ "embed"
	"net/http"
	"os"

	"github.com/fluidity-money/long.so/lib/config"
	"github.com/fluidity-money/long.so/lib/features"
	"github.com/fluidity-money/long.so/lib/setup"

	"github.com/fluidity-money/long.so/cmd/faucet.superposition/graph"
	"github.com/fluidity-money/long.so/cmd/faucet.superposition/lib/faucet"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"

	"github.com/aws/aws-lambda-go/lambda"

	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
)

const (
	// EnvFaucetAddr to use as the address for the faucet.
	EnvFaucetAddr = "SPN_FAUCET_ADDR"

	// EnvPrivateKey is the hex-encoded private key used to call the faucet.
	EnvPrivateKey = "SPN_PRIVATE_KEY"

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

func main() {
	defer setup.Flush()
	config := config.Get()
	db, err := gorm.Open(postgres.Open(config.TimescaleUrl), &gorm.Config{
		DisableAutomaticPing: true,
		Logger:               gormLogger.Default.LogMode(gormLogger.Silent),
	})
	if err != nil {
		setup.Exitf("database open: %v", err)
	}
	// Get the private key to use to make transactions to the faucet with later.
	key_ := os.Getenv(EnvPrivateKey)
	if key_ == "" {
		setup.Exitf("%#v unset", EnvPrivateKey)
	}
	key, err := ethCrypto.HexToECDSA(key_)
	if err != nil {
		setup.Exitf("private key: %v", err)
	}
	faucetAddr := ethCommon.HexToAddress(os.Getenv(EnvFaucetAddr))
	senderPub, _ := key.Public().(*ecdsa.PublicKey) // Should be fine.
	senderAddr := ethCrypto.PubkeyToAddress(*senderPub)
	geth, err := ethclient.Dial(config.GethUrl)
	if err != nil {
		setup.Exitf("geth open: %v", err)
	}
	defer geth.Close()
	// Get the chain id for sending out requests to the faucet.
	chainId, err := geth.ChainID(context.Background())
	if err != nil {
		setup.Exitf("chain id: %v", err)
	}
	// Start the sender in another Go routine to send batch requests
	// out of the SPN (gas) token.
	queue := RunSender(geth, chainId, key, senderAddr, faucetAddr, faucet.SendFaucet)
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB:    db,
			F:     features.Get(),
			Geth:  geth,
			C:     config,
			Queue: queue,
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
		setup.Exitf( // This should only return if there's an error.
			"err listening, %#v not set?: %v",
			EnvListenAddr,
			err,
		)
	default:
		setup.Exitf(
			"unexpected listen type: %#v, use either (lambda|http) for SPN_LISTEN_BACKEND",
			typ,
		)
	}
}
