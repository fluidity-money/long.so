package graph

import (
	"regexp"

	ethCommon "github.com/ethereum/go-ethereum/common"
)

// reWallet to use to validate the wallet address before continuing with verification.
var reWallet = regexp.MustCompile("(0x)?[A-Z0-9a-z]{40}")

func IsValidWallet(a string) bool {
	if !reWallet.MatchString(a) {
		return false
	}
	return ethCommon.IsHexAddress(a)
}
