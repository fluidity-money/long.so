
| No |  Hex |                                   Explanation                                           |
|----|------|-----------------------------------------------------------------------------------------|
| 0  | 0x00 | Denominator is 0                                                                        |
| 1  | 0x01 | Result is U256::MAX                                                                     |
| 2  | 0x02 | Sqrt price is 0                                                                         |
| 3  | 0x03 | Sqrt price is less than or equal to quotient                                            |
| 4  | 0x04 | Can not get most significant bit or least significant bit on zero value                 |
| 5  | 0x05 | Liquidity is 0                                                                          |
| 6  | 0x06 | require((product = amount * sqrtPX96) / amount == sqrtPX96 && numerator1 > product);    |
| 7  | 0x07 | Denominator is less than or equal to prod_1                                             |
| 8  | 0x08 | Liquidity Sub                                                                           |
| 9  | 0x09 | Liquidity Add                                                                           |
| 10 | 0x0a | The given tick must be less than, or equal to, the maximum tick                         |
| 11 | 0x0b | Second inequality must be < because the price can never reach the price at the max tick |
| 12 | 0x0c | Overflow when casting to U160                                                           |
| 13 | 0x0d | Liquidity higher than max                                                               |
| 14 | 0x0e | Fee growth sub overflow                                                                 |
| 15 | 0x0f | ERC20 call reverted                                                                     |
| 16 | 0x10 | ERC20 call reverted with no data                                                        |
| 17 | 0x11 | Pool is already initialised                                                             |
| 18 | 0x12 | Contract is already initialised                                                         |
| 19 | 0x13 | Price limit too high                                                                    |
| 20 | 0x14 | Price limit too low                                                                     |
| 21 | 0x15 | Checked abs called on an unexpected positive number                                     |
| 22 | 0x16 | Checked abs called on an unexpected negative number                                     |
| 23 | 0x17 | Checked abs called on uint.min                                                          |
| 24 | 0x18 | Fee result too high                                                                     |
| 25 | 0x19 | Swap result too high                                                                    |
| 26 | 0x1a | Internal swap amounts not matched                                                       |
| 27 | 0x1b | Internal swap result was positive                                                       |
| 28 | 0x1c | Minimum out not reached                                                                 |
| 29 | 0x1d | Only the position owner can use this                                                    |
| 30 | 0x1e | Only the NFT manager can use this                                                       |
| 31 | 0x1f | Only the Seawater admin can use this                                                    |
| 32 | 0x20 | Operation unavailable when the pool is disabled                                         |
