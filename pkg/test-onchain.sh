#!/bin/sh -e

err() {
	>&2 echo $@
	exit 1
}

[ -z $SK ] && err "SK unset"
[ -z $STYLUS_ENDPOINT ] && err "STYLUS_ENDPOINT unset"

ADDR=$(cast wallet address --private-key=$SK)

FUSDC_ADDR=$(forge create --json --rpc-url=$STYLUS_ENDPOINT --private-key=$SK LightweightERC20 --constructor-args "fusdc" "fusdc token" 1 10000000000000 $ADDR | jq --raw-output ".deployedTo")
FUSDC_ADDR_TRIMMED=$(echo $FUSDC_ADDR | cut -c3-)

echo "fusdc addr is $FUSDC_ADDR"

OTHERTOKEN_ADDR=$(forge create --json --rpc-url=$STYLUS_ENDPOINT --private-key=$SK LightweightERC20 --constructor-args "OTHERTOKEN" "other token" 1 10000000000000 $ADDR | jq --raw-output ".deployedTo")
OTHERTOKEN_ADDR_TRIMMED=$(echo $OTHERTOKEN_ADDR | cut -c3-)

echo "other token addr is $OTHERTOKEN_ADDR"

echo "building..."

FLU_SEAWATER_PERMIT2_ADDR=$(cast address-zero) FLU_SEAWATER_FUSDC_ADDR=$FUSDC_ADDR_TRIMMED make -B build

echo "deploying..."

DEPLOY_DETAILS=$(SEAWATER_PROXY_ADMIN=$ADDR STYLUS_PRIVATE_KEY=$SK FLU_FUSDC_ADDR=$FUSDC_ADDR ./deploy.sh)

SEAWATER_ADDR=$(echo $DEPLOY_DETAILS | jq --raw-output ".seawater_proxy")

echo "deployed seawater addr $SEAWATER_ADDR"

echo "approvals..."
cast send --rpc-url=$STYLUS_ENDPOINT --private-key=$SK $FUSDC_ADDR "approve(address,uint)" $SEAWATER_ADDR $(cast --max-uint)
cast send --rpc-url=$STYLUS_ENDPOINT --private-key=$SK $OTHERTOKEN_ADDR "approve(address,uint)" $SEAWATER_ADDR $(cast --max-uint)

echo "create pool..."
cast send --rpc-url=$STYLUS_ENDPOINT --private-key=$SK $SEAWATER_ADDR "createPool(address,uint256,uint32,uint8,uint128)" $OTHERTOKEN_ADDR 0x000000000000000000000000000000000000000a000000000000000000000000 0 1 100000000000

echo "mint position..."
cast send --rpc-url=$STYLUS_ENDPOINT --private-key=$SK $SEAWATER_ADDR "mintPosition(address,int32,int32)" $OTHERTOKEN_ADDR 39122 50108

echo "update position..."
cast send --rpc-url=$STYLUS_ENDPOINT --private-key=$SK $SEAWATER_ADDR "updatePosition(address,uint256,int128)" $OTHERTOKEN_ADDR 0x 20000
