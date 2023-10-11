#![feature(inherent_associated_types)]

use std::{env, str::FromStr, sync::Arc};

use ethers::prelude::*;

abigen!(SeawaterAMM, "../out/SeawaterAMM.sol/SeawaterAMM.json");
abigen!(
    LightweightERC20,
    "../out/LightweightERC20.sol/LightweightERC20.json"
);

fn must_address_from_env(env: &str) -> Address {
    match env::var(env) {
        Ok(addr) => Address::from_str(&addr)
            .expect(&format!("Failed to parse an address from the env {}!", env)),
        Err(e) => Err(e).expect(&format!("env {} not set!", env)),
    }
}
#[tokio::main]
async fn main() {
    let prikey = env::var("STYLUS_PRIVATE_KEY").unwrap_or_else(|_| {
        eprintln!("STYLUS_PRIVATE_KEY not set, defaulting to the local arbitrum testnode key...");
        "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659".to_string()
    });
    let rpc_url = env::var("STYLUS_ENDPOINT").unwrap_or_else(|_| {
        eprintln!("STYLUS_ENDPOINT not set, defaulting to the local arbitrum testnode endpoint...");
        "http://localhost:8547".to_string()
    });
    let swaps_addr = must_address_from_env("swaps_addr");
    let positions_addr = must_address_from_env("positions_addr");
    let admin_addr = must_address_from_env("admin_addr");

    let wallet = LocalWallet::from_str(&prikey).unwrap();
    let wallet_addr = wallet.address();

    let provider = Provider::<Http>::try_connect(&rpc_url).await.unwrap();
    let chainid = provider.get_chainid().await.unwrap().as_u64();

    let client = Arc::new(SignerMiddleware::new(
        provider,
        wallet.with_chain_id(chainid),
    ));

    let mut test_state = TestState {
        signer_addr: wallet_addr,
        swaps_addr,
        positions_addr,
        admin_addr,
        client,
    };

    let token = test_state
        .deploy_token_default(test_state.signer_addr)
        .await;

    let amm = test_state.deploy_amm_default(token.address()).await;

    println!("address {:?}", amm.address());

    let token2 = test_state
        .deploy_token_default(test_state.signer_addr)
        .await;

    let amm2 = test_state.deploy_amm_default(token2.address()).await;

    println!("address {:?}", amm2.address());
}

struct TestState<M: Middleware, S: Signer> {
    signer_addr: Address,

    swaps_addr: Address,
    positions_addr: Address,
    admin_addr: Address,

    client: Arc<SignerMiddleware<M, S>>,
}

impl<M: Middleware, S: Signer> TestState<M, S> {
    async fn deploy_amm(
        &mut self,
        proxy_admin: Address,
        seawater_admin: Address,
        nft_manager: Address,
        fusdc_token: Address,
    ) -> SeawaterAMM<SignerMiddleware<M, S>> {
        SeawaterAMM::deploy(
            self.client.clone(),
            (
                proxy_admin,
                seawater_admin,
                nft_manager,
                self.swaps_addr,
                self.positions_addr,
                self.admin_addr,
                Address::zero(),
                fusdc_token,
            ),
        )
        .unwrap()
        .send()
        .await
        .unwrap()
    }

    async fn deploy_amm_default(
        &mut self,
        fusdc_token: Address,
    ) -> SeawaterAMM<SignerMiddleware<M, S>> {
        self.deploy_amm(
            self.signer_addr,
            self.signer_addr,
            self.signer_addr,
            fusdc_token,
        )
        .await
    }

    async fn deploy_token(
        &mut self,
        name: String,
        symbol: String,
        decimals: u8,
        total_supply: U256,
        recipient: Address,
    ) -> LightweightERC20<SignerMiddleware<M, S>> {
        LightweightERC20::deploy(
            self.client.clone(),
            (name, symbol, decimals, total_supply, recipient),
        )
        .unwrap()
        .send()
        .await
        .unwrap()
    }

    async fn deploy_token_default(
        &mut self,
        recipient: Address,
    ) -> LightweightERC20<SignerMiddleware<M, S>> {
        self.deploy_token(
            "Test ERC20".to_string(),
            "TERC20".to_string(),
            6,
            U256::from(1_000_000) * U256::from(1_000_000), // 1 million * 6 decimals
            recipient,
        )
        .await
    }
}
