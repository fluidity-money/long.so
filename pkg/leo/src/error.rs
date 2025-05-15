use alloc::vec::Vec;

/// Assert or macro taken from Seawater.
#[macro_export]
macro_rules! assert_or {
    ($cond:expr, $err:expr) => {
        if !($cond) {
            Err($err)?; // question mark forces coercion
        }
    };
}

#[derive(Debug)]
#[repr(u8)]
pub enum Error {
    /// [ctor] failed, as the contract was already set up!
    // 0 (0x00)
    AlreadySetUp,

    /// The campaign wasn't configured correctly and has a zero pool.
    // 1 (0x01)
    CampaignMaxEmpty,

    /// The campaign finished.
    // 2 (0x02)
    CampaignFinished,

    /// This is an empty campaign!
    // 3 (0x03)
    NoCampaign,

    /// Leo is disabled!
    // 4 (0x04)
    NotEnabled,

    /// Sender is not the position owner!
    // 5 (0x05)
    NotPositionOwner,

    /// Campaign is fully distributed!
    // 6 (0x06)
    CampaignDistributedCompletely,

    /// Position already exists.
    // 7 (0x07)
    PositionAlreadyExists,

    /// Campaign configured incorrectly.
    // 8 (0x08)
    BadCampaignConfig,

    /// Campaign already exists.
    // 9 (0x09)
    CampaignAlreadyExists,

    /// Not campaign owner.
    // 10 (0x0a)
    NotCampaignOwner,

    /// Position is empty!
    // 11 (0x0b)
    PositionHasNoLiquidity,

    /// ERC20 during transfer returned false!
    // 12 (0x0c)
    ReturnedFalse,

    /// Seawater returned nothing.
    // 13 (0x0d)
    SeawaterDecode,

    /// Only the NFT manager that's registered can send Leo tokens
    // 14 (0x0e)
    OnlyNftManager,

    /// The campaign hasn't begun.
    // 14 (0x0e)
    CampaignHasntBegun,

    /// The campaign that a user requested to redeem was duplicated in
    /// the calldata.
    // 15 (0x0f)
    DuplicateCampaignIds,

    /// A checked multiplication failed!
    // 16 (0x10)
    CheckedMul,

    /// A checked division failed!
    // 17 (0x11)
    CheckedDiv,

    /// A checked add failed!
    // 18 (0x12)
    CheckedAdd,

    /// Sender tried to duplicate a position in their claim.
    // 19 (0x13)
    DuplicatedPosition,

    /// Sender tried to duplicate a campaign in their claim.
    // 20 (0x14)
    DuplicatedCampaign,
}

impl From<Error> for Vec<u8> {
    // tests return the message
    #[cfg(not(target_arch = "wasm32"))]
    fn from(val: Error) -> Self {
        val.to_string().into()
    }

    #[cfg(target_arch = "wasm32")]
    fn from(val: Error) -> Self {
        let id = unsafe { *<*const _>::from(&val).cast::<u8>() };
        vec![id]
    }
}
