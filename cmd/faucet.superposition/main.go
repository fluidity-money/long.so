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
	// EnvSepoliaUrl to usea s the URL to access Sepolia.
	EnvSepoliaUrl = "SPN_SEPOLIA_GETH_URL"

	// EnvFaucetAddr to use as the address for the faucet for Sepolia.
	EnvFaucetAddrSepolia = "SPN_SEPOLIA_FAUCET_ADDR"

	// EnvFaucetAddrSpn to use as the address of the faucet for SPN testnet.
	EnvFaucetAddrSpn = "SPN_SPN_FAUCET_ADDR"

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
	var (
		faucetAddrSepolia = ethCommon.HexToAddress(os.Getenv(EnvFaucetAddrSepolia))
		faucetAddrSpn     = ethCommon.HexToAddress(os.Getenv(EnvFaucetAddrSpn))
	)
	senderPub, _ := key.Public().(*ecdsa.PublicKey) // Should be fine.
	senderAddr := ethCrypto.PubkeyToAddress(*senderPub)
	// Configure the RPCs.
	sepoliaUrl := os.Getenv(EnvSepoliaUrl)
	if sepoliaUrl == "" {
		setup.Exitf("sepolia url empty. set %#v", EnvSepoliaUrl)
	}
	gethSepolia, err := ethclient.Dial(sepoliaUrl)
	if err != nil {
		setup.Exitf("geth open sepolia: %v", err)
	}
	defer gethSepolia.Close()
	gethSpn, err := ethclient.Dial(config.GethUrl)
	if err != nil {
		setup.Exitf("geth open spn: %v", err)
	}
	defer gethSpn.Close()
	defer gethSepolia.Close()
	// Get the chain id for sending out requests to the faucet.
	chainIdSepolia, err := gethSepolia.ChainID(context.Background())
	if err != nil {
		setup.Exitf("chain id seoplia: %v", err)
	}
	chainIdSpn, err := gethSpn.ChainID(context.Background())
	if err != nil {
		setup.Exitf("chain id spn: %v", err)
	}
	// Start the sender in another Go routine to send batch requests
	// out of the SPN (gas) token.
	queue := RunSender(
		gethSepolia,
		gethSpn,
		chainIdSepolia,
		chainIdSpn,
		key,
		senderAddr,
		faucetAddrSepolia,
		faucetAddrSpn,
		faucet.SendFaucet,
		faucet.WaitMined,
	)
	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{
		Resolvers: &graph.Resolver{
			DB:          db,
			F:           features.Get(),
			GethSepolia: gethSepolia,
			GethSpn:     gethSpn,
			C:           config,
			Queue:       queue,
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
