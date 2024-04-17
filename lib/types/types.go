// types that are reused across our stack. Aggressively converts itself
// whenever it can to a lower representation for comparison later.
// Numbers however are written to the database in a decoded form.
// The reason for this is that it enables data work on the underlying numbers,
// without creating issue in the representation in the clients.

package types

import (
	"database/sql/driver"
	"encoding/hex"
	"math/big"
	"fmt"
	"strings"
)

type (
	// Hash from a transaction
	Hash string
	// Address to designate a wallet
	Address string
	// Data to designate a large byte array
	Data string
)

// Number that represents something informational (ie, a large block
// number)
type Number string

// UnscaledNumber that's representing a large number that needs to be
// divided by the decimals
type UnscaledNumber string

// UsdNumber conversion of an amount at the time
type UsdNumber string

func EmptyUnscaledNumber() UnscaledNumber {
	return UnscaledNumber("0")
}

// String the UnscaledNumber, printing its hex
func (u UnscaledNumber) String() string {
	return string(u)
}
func (u UnscaledNumber) Big() (*big.Int, error) {
	i, ok := new(big.Int).SetString(u.String(), 16)
	if !ok {
		return nil, fmt.Errorf("failed to convert %#v", u.String())
	}
	return i, nil
}

func HashFromString(s string) Hash {
	return Hash(strings.ToLower(s))
}
func (h Hash) String() string {
	return strings.ToLower(string(h))
}
func (h Hash) Value() (driver.Value, error) {
	return h.String(), nil
}

func AddressFromString(s string) Address {
	return Address(strings.ToLower(s))
}
func (a Address) String() string {
	return strings.ToLower(string(a))
}
func (a Address) Value() (driver.Value, error) {
	return a.String(), nil
}

func DataFromString(s string) Data {
	return Data(strings.ToLower(s))
}
func (a Data) String() string {
	return strings.ToLower(string(a))
}
func (d Data) Value() (driver.Value, error) {
	return d.String(), nil
}
func (d Data) Bytes() ([]byte, error) {
	return hex.DecodeString(strings.TrimPrefix(string(d), "0x"))
}

func UnscaledNumberFromBigInt(b *big.Int) UnscaledNumber {
	return UnscaledNumber(b.Text(16))
}
