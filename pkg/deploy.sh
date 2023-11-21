#!/bin/sh -e

die() {
    >&2 echo "died: $1"
    exit 1
}

STYLUS_ENDPOINT="${STYLUS_ENDPOINT:=http://localhost:8547}"

# this is the default stylus devnode prikey
STYLUS_PRIVATE_KEY="${STYLUS_PRIVATE_KEY:=0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659}"

[ ! -z "$PROXY_ADMIN_ADDR" ] || die "PROXY_ADMIN_ADDR not set!"
[ ! -z "$SEAWATER_ADMIN_ADDR" ] || die "SEAWATER_ADMIN_ADDR not set!"
[ ! -z "$NFT_MANAGER_ADDR" ] || die "NFT_MANAGER_ADDR not set!"
[ ! -z "$FUSDC_TOKEN_ADDR" ] || die "FUSDC_TOKEN_ADDR not set!"

deploy_feature() {
    >&2 echo "deploying $1..."

    cargo +nightly build --package seawater -Z build-std=std,panic_abort -Z build-std-features=panic_immediate_abort --release --target wasm32-unknown-unknown --features $1
    res=$(cargo stylus deploy --endpoint $STYLUS_ENDPOINT --wasm-file-path target/wasm32-unknown-unknown/release/seawater.wasm --private-key $STYLUS_PRIVATE_KEY \
        | tee /dev/stderr \
        | sed -nr "s/Deploying program to address (.+)(0x.{40}).*/\2/p" \
    )
    [ ! -z $res ] || die "deployment failed for feature $1"
    # echo $res | sed -r "s/\x1b\[[^@-~]*[@-~]//g" # strip colour characters
    echo $res
}

if [ -z "$swaps_addr" ]; then swaps_addr=$(deploy_feature "swaps"); fi
if [ -z "$positions_addr" ]; then positions_addr=$(deploy_feature "positions"); fi
if [ -z "$admin_addr" ]; then admin_addr=$(deploy_feature "admin"); fi

>&2 echo "executors deployed..."
>&2 echo "to resume from this point, set"
>&2 echo "swaps_addr=$swaps_addr positions_addr=$positions_addr admin_addr=$admin_addr"

>&2 echo "deploying diamond contract..."

forge build --revert-strings debug

forge create "SeawaterAMM" --rpc-url $STYLUS_ENDPOINT --private-key $STYLUS_PRIVATE_KEY \
    --constructor-args \
        $PROXY_ADMIN_ADDR \
        $SEAWATER_ADMIN_ADDR \
        $NFT_MANAGER_ADDR \
        $swaps_addr \
        $positions_addr \
        $admin_addr \
        $(cast --address-zero) \
        $FUSDC_TOKEN_ADDR
