// bloom-filter: using the addresses given as stdin, create a bloom
// filter, and print it in it's hex form to stdout with a contract
// prelude.

package main

import (
	"bufio"
	"encoding/binary"
	"io"
	"log"
	"math/big"
	"os"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
)

const MaxContractSizeMinPrelude = 24576 - 1

var maxContractSizeMinPrelude = new(big.Int).SetInt64(MaxContractSizeMinPrelude)

func main() {
	r := bufio.NewScanner(os.Stdin)
	r.Split(bufio.ScanLines)
	bloom := new(big.Int)
	for i := 0; r.Scan(); i++ {
		t := r.Text()
		if !ethCommon.IsHexAddress(t) {
			log.Fatalf("failed to read address %#v at line %v", t, i+1)
		}
		a := ethCommon.HexToAddress(t)
		addToBloom(bloom, a)
	}
	switch err := r.Err(); err {
	case io.EOF, nil:
		// Do nothing
	default:
		log.Fatalf("Failed to read line: %v", err)
	}
	log.Printf("%x", createContract(bloom))
}

func createContract(bloom *big.Int) []byte {
	b := bloom.Bytes()
	l := make([]byte, 2)
	// Include the STOP opcode before the blob.
	binary.BigEndian.PutUint16(l, uint16(len(b) + 1))
	return append(
		[]byte{0x61},
		append(
			l,
			append(
				// (0x00 is the STOP opcode)
				[]byte{0x3d, 0x81, 0x60, 0x0a, 0x3d, 0x39, 0xf3, 0x00},
				b...,
			)...,
		)...,
	)
}

func addToBloom(bloom *big.Int, addr ethCommon.Address) {
	pos := new(big.Int)
	pos.SetBytes(ethCrypto.Keccak256(encodePacked(addr)))
	pos.Mod(pos, maxContractSizeMinPrelude)
	bloom.SetBit(bloom, int(pos.Int64()), 1)
}

func bloomContains(b *big.Int, addr ethCommon.Address) bool {
	pos := new(big.Int).SetBytes(ethCrypto.Keccak256(encodePacked(addr)))
	pos.Mod(pos, maxContractSizeMinPrelude)
	if b.Bit(int(pos.Int64())) == 0 {
		return false
	}
	return true
}

func encodePacked(a ethCommon.Address) []byte {
	return ethCommon.LeftPadBytes(a.Bytes(), 32)
}
