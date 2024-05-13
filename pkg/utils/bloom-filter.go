// bloom-filter: using the addresses given as stdin, create a bloom
// filter, and print it in it's hex form to stdout. in the approch
// similar to the contract.

package main

import (
	"log"
	"io"
	"math/big"
	"bufio"
	"strconv"
	"os"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
)

func main() {
	hashCount, err := strconv.Atoi(os.Args[1])
	if err != nil {
		log.Fatalf("failed to read hash count: %v", err)
	}
	r := bufio.NewScanner(os.Stdin)
	r.Split(bufio.ScanLines)
	bloom := new(big.Int)
	for i := 0; r.Scan(); i++ {
		t := r.Text()
		if !ethCommon.IsHexAddress(t) {
			log.Fatalf("failed to read address %#v at line %v", t, i+1)
		}
		a := ethCommon.HexToAddress(t)
		addToBloom(bloom, hashCount, a)
	}
	switch err := r.Err(); err {
	case io.EOF, nil:
		// Do nothing
	default:
		log.Fatalf("Failed to read line: %v", err)
	}
	log.Printf("0x%x", bloom.Bytes())
}

func addToBloom(bloom *big.Int, hashCount int, addr ethCommon.Address) {
	var (
		two56 = new(big.Int).SetInt64(256)
		one = new(big.Int).SetInt64(1)
	)
	for i := 0; i < hashCount; i++ {
		digest := new(big.Int).SetBytes(ethCrypto.Keccak256(encodePacked(addr, i)))
		digest.Mod(digest, two56)
		d := digest.Int64()
		digest.Lsh(one, uint(d))
		bloom.Xor(bloom, digest)
	}
}

func bloomContains(b *big.Int, hashCount int, addr ethCommon.Address) bool {
	var (
		two56 = new(big.Int).SetInt64(256)
		one = new(big.Int).SetInt64(1)
	)
	for i := 0; i < hashCount; i++ {
		pos := new(big.Int).SetBytes(ethCrypto.Keccak256(encodePacked(addr, i)))
		pos.Mod(pos, two56)
		digest := new(big.Int).Lsh(one, uint(pos.Int64()))
		notIncluded := b.Cmp(new(big.Int).Xor(b, digest)) != 0
		if notIncluded {
			return false
		}
	}
	return true
}

func encodePacked(addr ethCommon.Address, i int) []byte {
	b := ethCommon.LeftPadBytes(addr.Bytes(), 32)
	x := new(big.Int).SetInt64(int64(i)) // Idk how this is packed. Lazy.
	b = append(b, ethCommon.LeftPadBytes(x.Bytes(), 32)...)
	return b
}
