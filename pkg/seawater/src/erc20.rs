use crate::error::Error;
use crate::types::{I256, I256Extension};
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::call::RawCall;
use stylus_sdk::{contract, msg};

// call a function on a possibly noncomplient erc20 token, reverting iff
// the function reverts
// or there's calldata and the calldata is falsey
fn call_optional_return(contract: Address, data: &[u8]) -> Result<(), Error> {
    match RawCall::new().call(contract, data) {
        // reverting calls revert
        Err(revert) => Err(Error::Erc20Revert(revert)),
        Ok(data) => {
            match data.get(32) { // first byte of a 32 byte word
                // nonreverting with no return data is okay
                None => Ok(()),
                // nonreverting with falsey return data reverts
                Some(0) => Err(Error::Erc20RevertNoData),
                // nonreverting with truthy return data is okay
                Some(_) => Ok(()),
            }
        }
    }
}

// calculates a function's selector, and validates against passed bytes
// (stylus doesn't seem to give us a good way to access selectors)
const fn selector(name: &[u8], expected: [u8; 4]) -> [u8; 4] {
    let hash = keccak_const::Keccak256::new().update(name).finalize();
    let mut result = [0_u8; 4];

    result[0] = hash[0];
    result[1] = hash[1];
    result[2] = hash[2];
    result[3] = hash[3];

    assert!(result[0] == expected[0]);
    assert!(result[1] == expected[1]);
    assert!(result[2] == expected[2]);
    assert!(result[3] == expected[3]);

    result
}

const TRANSFER_SELECTOR: [u8; 4] = selector(b"transfer(address,uint256)", [0xa9, 0x05, 0x9c, 0xbb]);
const TRANSFER_FROM_SELECTOR: [u8; 4] = selector(
    b"transferFrom(address,address,uint256)",
    [0x23, 0xb8, 0x72, 0xdd],
);

// erc20 calldata encoding functions

fn encode_transfer(to: Address, amount: U256) -> [u8; 4 + 32 + 32] {
    let mut data = [0_u8; 4 + 32 + 32];
    data[0..4].copy_from_slice(&TRANSFER_SELECTOR[0..4]);
    data[4 + 12..4 + 32].copy_from_slice(&to.0 .0);
    data[4 + 32..4 + 32 + 32].copy_from_slice(&amount.to_be_bytes::<32>());

    data
}

fn encode_transfer_from(from: Address, to: Address, amount: U256) -> [u8; 4 + 32 + 32 + 32] {
    let mut data = [0_u8; 4 + 32 + 32 + 32];
    data[0..4].copy_from_slice(&TRANSFER_FROM_SELECTOR[0..4]);
    data[4 + 12..4 + 32].copy_from_slice(&from.0 .0);
    data[4 + 32 + 12..4 + 32 + 32].copy_from_slice(&to.0 .0);
    data[4 + 32 + 32..4 + 32 + 32 + 32].copy_from_slice(&amount.to_be_bytes::<32>());

    data
}

fn safe_transfer(token: Address, to: Address, amount: U256) -> Result<(), Error> {
    call_optional_return(token, &encode_transfer(to, amount))
}

fn safe_transfer_from(
    token: Address,
    from: Address,
    to: Address,
    amount: U256,
) -> Result<(), Error> {
    call_optional_return(token, &encode_transfer_from(from, to, amount))
}

// sends a token delta - if `amount` is positive, takes from the user
pub fn exchange(token: Address, amount: I256) -> Result<(), Error> {
    if amount.is_negative() {
        // send tokens to the user
        send(token, amount.abs_neg()?)
    } else if amount.is_positive() {
        // take tokens from the user
        take(token, amount.abs_pos()?)
    } else {
        // no amount, do nothing
        Ok(())
    }
}

pub fn send(token: Address, amount: U256) -> Result<(), Error> {
    safe_transfer(token, msg::sender(), amount)
}

pub fn take(token: Address, amount: U256) -> Result<(), Error> {
    safe_transfer_from(token, msg::sender(), contract::address(), amount)
}

#[cfg(test)]
mod test {
    use ruint::uint;
    use stylus_sdk::alloy_primitives::{address, bytes};

    #[test]
    fn test_encode_transfer() {
        let encoded = super::encode_transfer(
            address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            uint!(0x7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4_U256),
        );
        // generated with
        // `cast cd "transfer(address,uint256)" 0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6 (cast keccak "big number wow")`
        let expected = bytes!(
            "a9059cbb"
            "000000000000000000000000737b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4"
        )
        .0;

        assert_eq!(encoded, *expected);
    }

    #[test]
    fn test_encode_transfer_from() {
        let encoded = super::encode_transfer_from(
            address!("6221A9c005F6e47EB398fD867784CacfDcFFF4E7"),
            address!("737B7865f84bDc86B5c8ca718a5B7a6d905776F6"),
            uint!(0x7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4_U256),
        );
        // generated with
        // `cast cd "transferFrom(address,address,uint256)" 0x6221A9c005F6e47EB398fD867784CacfDcFFF4E7 0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6 (cast keccak "big number wow")`
        let expected = bytes!(
            "23b872dd"
            "0000000000000000000000006221a9c005f6e47eb398fd867784cacfdcfff4e7"
            "000000000000000000000000737b7865f84bdc86b5c8ca718a5b7a6d905776f6"
            "7eb714fc41b9793e1412837473385f266bc3ed1d496aa5022b57a4814780a5d4"
        )
        .0;

        assert_eq!(encoded, *expected);
    }
}
