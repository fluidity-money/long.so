
# GraphQL Faucet interface

Listens for a mutation to request tokens, and sends the SPN token for Superposition
Testnet on demand. With a feature flag optionally supports gating the amount of tokens
send to a list of users.

## Features

|         Name          |                      Description                       |
|-----------------------|--------------------------------------------------------|
| `faucet stakers only` | Sends only to the list of stakers in the stakers file. |
