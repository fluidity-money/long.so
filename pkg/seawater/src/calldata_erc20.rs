
use stylus_sdk::alloy_primitives::{Address, U256};

fn write_selector(bytes: &mut [u8], selector: &[u8; 4]) {
    bytes[0..4].copy_from_slice(&selector[..])
}
fn write_address(bytes: &mut [u8], slot: usize, address: Address) {
    bytes[4 + 32 * slot + 12..4 + 32 * slot + 32].copy_from_slice(&address.0 .0)
}
fn write_u256(bytes: &mut [u8], slot: usize, uint: U256) {
    bytes[4 + 32 * slot..4 + 32 * slot + 32].copy_from_slice(&uint.to_be_bytes::<32>())
}

/// Calculates a function's selector, and validates against passed bytes, since stylus doesn't give
/// us a great way to access these.
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

/// The selector for `transfer(address,uint256)`
const TRANSFER_SELECTOR: [u8; 4] = selector(b"transfer(address,uint256)", [0xa9, 0x05, 0x9c, 0xbb]);
/// The selector for `transferFrom(address,address,uint256)`
const TRANSFER_FROM_SELECTOR: [u8; 4] = selector(
    b"transferFrom(address,address,uint256)",
    [0x23, 0xb8, 0x72, 0xdd],
);
// The selector for `decimals()`. No generation function is needed to use this.
pub const DECIMALS_SELECTOR: [u8; 4] = selector(b"decimals()", [0x31, 0x3c, 0xe5, 0x67]);
const PERMIT_TRANSFER_FROM_SELECTOR: [u8; 4] = selector(
    b"permitTransferFrom(((address,uint256),uint256,uint256),(address,uint256),address,bytes)",
    [0x30, 0xf2, 0x8b, 0x7a],
);
pub const ERROR_SELECTOR: [u8; 4] = selector(b"Error(string)", [0x08, 0xc3, 0x79, 0xa0]);

// erc20 calldata encoding functions

/// Encodes a call to `transfer(address to, uint256 amount)`
pub fn encode_transfer(to: Address, amount: U256) -> [u8; 4 + 32 + 32] {
    let mut data = [0_u8; 4 + 32 * 2];
    write_selector(&mut data, &TRANSFER_SELECTOR);
    write_address(&mut data, 0, to);
    write_u256(&mut data, 1, amount);

    data
}

/// Encodes a call to `transferFrom(address from, address to, uint256 amount)`
pub fn encode_transfer_from(from: Address, to: Address, amount: U256) -> [u8; 4 + 32 + 32 + 32] {
    let mut data = [0_u8; 4 + 32 * 3];
    write_selector(&mut data, &TRANSFER_FROM_SELECTOR);
    write_address(&mut data, 0, from);
    write_address(&mut data, 1, to);
    write_u256(&mut data, 2, amount);

    data
}

pub fn encode_permit2(
    token: Address,
    max_amount: U256,
    nonce: U256,
    deadline: U256,
    to: Address,
    transfer_amount: U256,
    from: Address,
    sig: &[u8],
) -> Vec<u8> {
    let mut data = vec![0_u8; 4 + 32 * 9 + sig.len().next_multiple_of(32)];
    write_selector(&mut data, &PERMIT_TRANSFER_FROM_SELECTOR);
    write_address(&mut data, 0, token); // PermitTransferFrom.TokenPermissions.token
    write_u256(&mut data, 1, max_amount); // PermitTransferFrom.TokenPermissions.maxAmount
    write_u256(&mut data, 2, nonce); // PermitTransferFrom.nonce
    write_u256(&mut data, 3, deadline); // PermitTransferFrom.deadline
    write_address(&mut data, 4, to); // SignatureTransferDetails.to
    write_u256(&mut data, 5, transfer_amount); // SignatureTransferDetails.requestedAmount
    write_address(&mut data, 6, from); // owner
    write_u256(&mut data, 7, U256::from(0x100)); // signature (byte offset)
    write_u256(&mut data, 8, U256::from(sig.len())); // signature (length)
    data[4 + 32 * 9..4 + 32 * 9 + sig.len()].copy_from_slice(sig); // signature (data)

    data
}

/// construct a Revert containing an Error(string) based on a revert string
pub fn revert_from_msg(msg: &str) -> Vec<u8> {
    let msg_bytes = msg.as_bytes();

    // pad to the nearest multiple of 32
    let reason_len = msg_bytes.len().next_multiple_of(32);
    let mut reason = vec![0; reason_len];

    // encode reason and right pad with zeroes for alignment to a U256
    reason[..msg_bytes.len()].copy_from_slice(msg_bytes);

    // offset is always 32
    let offset = U256::from(32_u16);
    // length of the UTF-8 message string
    let len = U256::from(msg.len());

    // error selector + offset + message length + message
    let mut revert = Vec::<u8>::with_capacity(4 + 32 + 32 + reason_len);

    revert.extend_from_slice(&ERROR_SELECTOR);
    // EVM is big endian
    revert.extend_from_slice(&offset.to_be_bytes::<32>());
    revert.extend_from_slice(&len.to_be_bytes::<32>());
    revert.extend_from_slice(&reason);

    revert
}
