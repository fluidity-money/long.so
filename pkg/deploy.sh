#!/bin/sh -e

ownership_nfts_name="Superposition-AMM-NFTs"
ownership_nfts_symbol="SAN"
ownership_nfts_token_uri="https://superposition.so/"

err() {
	>&2 echo $@
	exit 1
}

[ -z "$STYLUS_ENDPOINT" ] && err "STYLUS_ENDPOINT unset"
[ -z "$STYLUS_PRIVATE_KEY" ] && err "STYLUS_PRIVATE_KEY unset"
[ -z "SEAWATER_PROXY_ADMIN" ] && err "SEAWATER_PROXY_ADMIN unset"
[ -z "$FLU_FUSDC_ADDR" ] && err "FLU_FUSDC_ADDR unset"

seawater_swaps="$(sh deploy-seawater.sh seawater-swaps.wasm)"
seawater_positions="$(sh deploy-seawater.sh seawater-positions.wasm)"
seawater_admin="$(sh deploy-seawater.sh seawater-admin.wasm)"

seawater_proxy="$(\
	sh deploy-solidity.sh "SeawaterAMM" --constructor-args \
		"$seawater_admin" \
		"$seawater_admin" \
		"$(cast --address-zero)" \
		"$seawater_swaps" \
		"$seawater_positions" \
		"$seawater_admin" \
		"$(cast --address-zero)" \
		"$FLU_FUSDC_ADDR")"

seawater_nft_manager="$(\
	sh deploy-solidity.sh "OwnershipNFTs" --constructor-args \
		"$ownership_nfts_name" \
		"$ownership_nfts_symbol" \
		"$ownership_nfts_token_uri" \
		"$seawater_proxy")"

cat <<EOF
{
	"seawater_proxy": "$seawater_proxy",
	"seawater_nft_manager": "$seawater_nft_manager",
	"seawater_swaps_impl": "$seawater_swaps",
	"seawater_positions_impl": "$seawater_positions",
	"seawater_admin_impl": "$seawater_admin",
	"seawater_proxy_admin": "$SEAWATER_PROXY_ADMIN",
	"ownership_nfts_name": "$ownership_nfts_name",
	"ownership_nfts_symbol": "$ownership_nfts_symbol",
	"ownership_nfts_token_uri": "$ownership_nfts_token_uri",
	"seawater_fusdc_addr": "$FLU_FUSDC_ADDR"
}
