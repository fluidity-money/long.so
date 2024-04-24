// types that are reused across our stack. Aggressively converts itself
// whenever it can to a lower representation for comparison later.
// Numbers however are written to the database in a decoded form.
// The reason for this is that it enables data work on the underlying numbers,
// without creating issue in the representation in the clients.

package types

import (
	"fmt"
	sqlDriver "database/sql/driver"
	"encoding/hex"
	"math/big"
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
type Number struct{ *big.Int }

// UnscaledNumber that's representing a large number that needs to be
// divided by the decimals
type UnscaledNumber struct{ *big.Int }

// UsdNumber conversion of an amount at the time
type UsdNumber struct{ *big.Rat }

func EmptyNumber() Number {
	return Number{new(big.Int)}
}
func NumberFromBig(v *big.Int) Number {
	i := new(big.Int).Set(v)
	return Number{i}
}
func NumberFromString(v string) (*Number, error) {
	i, ok := new(big.Int).SetString(v, 16)
	if !ok {
		return nil, fmt.Errorf("bad string")
	}
	n := NumberFromBig(i)
	return &n, nil
}
// String the Number, printing its hex
func (u Number) String() string {
	return u.Int.Text(16)
}
func (u Number) Big() *big.Int {
	return new(big.Int).Set(u.Int)
}
func (u Number) Value() (sqlDriver.Value, error) {
	// Use the underlying Int String method to get an actual number.
	return u.Int.String(), nil
}

func EmptyUnscaledNumber() UnscaledNumber {
	return UnscaledNumber{new(big.Int)}
}
func UnscaledNumberFromBig(v *big.Int) UnscaledNumber {
	i := new(big.Int).Set(v)
	return UnscaledNumber{i}
}
func UnscaledNumberFromString(v string) (*UnscaledNumber, error) {
	i, ok := new(big.Int).SetString(v, 16)
	if !ok {
		return nil, fmt.Errorf("bad string")
	}
	n := UnscaledNumberFromBig(i)
	return &n, nil
}
// String the UnscaledNumber, printing its hex
func (u UnscaledNumber) String() string {
	return u.Int.Text(16)
}
func (u UnscaledNumber) Big() *big.Int {
	return new(big.Int).Set(u.Int)
}
func (u UnscaledNumber) Value() (sqlDriver.Value, error) {
	// Use the underlying Int String method to get an actual number.
	return u.Int.String(), nil
}

func HashFromString(s string) Hash {
	return Hash(strings.ToLower(s))
}
func (h Hash) String() string {
	return strings.ToLower(string(h))
}
func (h Hash) Value() (sqlDriver.Value, error) {
	return h.String(), nil
}

func AddressFromString(s string) Address {
	return Address(strings.ToLower(s))
}
func (a Address) String() string {
	return strings.ToLower(string(a))
}
func (a Address) Value() (sqlDriver.Value, error) {
	return a.String(), nil
}

func DataFromString(s string) Data {
	return Data(strings.ToLower(s))
}
func (a Data) String() string {
	return strings.ToLower(string(a))
}
func (d Data) Value() (sqlDriver.Value, error) {
	return d.String(), nil
}
func (d Data) Bytes() ([]byte, error) {
	return hex.DecodeString(strings.TrimPrefix(string(d), "0x"))
}

func UnscaledNumberFromBigInt(b *big.Int) UnscaledNumber {
	return UnscaledNumber{b}
}
