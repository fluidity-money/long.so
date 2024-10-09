#!/bin/sh -e

# Uses several environment variables to skip deployment where it's possible! Please read the
# source of this script before using!

log() {
	>&2 echo $@
}

err() {
	log $@
	exit 1
}

[ -z "$SEAWATER_PROXY_ADMIN" ] && err "SEAWATER_PROXY_ADMIN unset"
[ -z "$SEAWATER_EMERGENCY_COUNCIL" ] && err "SEAWATER_EMERGENCY_COUNCIL unset"
[ -z "$STYLUS_ENDPOINT" ] && err "STYLUS_ENDPOINT unset"
[ -z "$STYLUS_PRIVATE_KEY" ] && err "STYLUS_PRIVATE_KEY unset"
[ -z "$FLU_SEAWATER_FUSDC_ADDR" ] && err "FLU_SEAWATER_FUSDC_ADDR unset"

[ -z "$SEAWATER_SWAPS" ] && SEAWATER_SWAPS="$(sh deploy-stylus.sh seawater-swaps.wasm)"
[ -z "$SEAWATER_SWAPS" ] && err "Failed to deploy seawater_swaps"
log "SEAWATER_SWAPS=$SEAWATER_SWAPS"

[ -z "$SEAWATER_SWAP_PERMIT2_A" ] && SEAWATER_SWAP_PERMIT2_A="$(sh deploy-stylus.sh seawater-swap-permit2-a.wasm)"
[ -z "$SEAWATER_SWAP_PERMIT2_A" ] && err "Failed to deploy seawater_swap_permit2_a"
log "SEAWATER_SWAP_PERMIT2_A=$SEAWATER_SWAP_PERMIT2_A"

[ -z "$SEAWATER_QUOTES" ] && SEAWATER_QUOTES="$(sh deploy-stylus.sh seawater-quotes.wasm)"
[ -z "$SEAWATER_QUOTES" ] && err "Failed to deploy seawater_quotes"
log "SEAWATER_QUOTES=$SEAWATER_QUOTES"

[ -z "$SEAWATER_POSITIONS" ] && SEAWATER_POSITIONS="$(sh deploy-stylus.sh seawater-positions.wasm)"
[ -z "$SEAWATER_POSITIONS" ] && err "Failed to deploy seawater_positions"
log "SEAWATER_POSITIONS=$SEAWATER_POSITIONS"

[ -z "$SEAWATER_UPDATE_POSITIONS" ] && SEAWATER_UPDATE_POSITIONS="$(sh deploy-stylus.sh seawater-update-positions.wasm)"
[ -z "$SEAWATER_UPDATE_POSITIONS" ] && err "Failed to deploy seawater_update_positions"
log "SEAWATER_UPDATE_POSITIONS=$SEAWATER_UPDATE_POSITIONS"

[ -z "$SEAWATER_ADMIN" ] && SEAWATER_ADMIN="$(sh deploy-stylus.sh seawater-admin.wasm)"
[ -z "$SEAWATER_ADMIN" ] && err "Failed to deploy seawater_admin"
log "SEAWATER_ADMIN=$SEAWATER_ADMIN"

[ -z "$SEAWATER_ADJUST_POSITIONS" ] && SEAWATER_ADJUST_POSITIONS="$(sh deploy-stylus.sh seawater-adjust-positions.wasm)"
[ -z "$SEAWATER_ADJUST_POSITIONS" ] && err "Failed to deploy seawater_adjust_positions"
log "SEAWATER_ADJUST_POSITIONS=$SEAWATER_ADJUST_POSITIONS"

[ -z "$SEAWATER_SWAP_PERMIT2_B" ] && SEAWATER_SWAP_PERMIT2_B="$(sh deploy-stylus.sh seawater-swap-permit2-b.wasm)"
[ -z "$SEAWATER_SWAP_PERMIT2_B" ] && err "Failed to deploy seawater_swap_permit2_b"
log "SEAWATER_SWAP_PERMIT2_B=$SEAWATER_SWAP_PERMIT2_B"

seawater_proxy="$(\
	sh deploy-solidity.sh "SeawaterAMM" --constructor-args \
		"$SEAWATER_PROXY_ADMIN" \
		"$SEAWATER_PROXY_ADMIN" \
		"$(cast --address-zero)" \
		"$SEAWATER_EMERGENCY_COUNCIL" \
		"$SEAWATER_SWAPS" \
		"$SEAWATER_SWAP_PERMIT2_A" \
		"$SEAWATER_QUOTES" \
		"$SEAWATER_POSITIONS" \
		"$SEAWATER_UPDATE_POSITIONS" \
		"$SEAWATER_ADMIN" \
		"$SEAWATER_ADJUST_POSITIONS" \
		"$SEAWATER_SWAP_PERMIT2_B" \
		"$(cast --address-zero)")"
[ -z "$seawater_proxy" ] && err "Failed to deploy seawater_proxy"
log "Seawater proxy deployed to $seawater_proxy"

cat <<EOF
{
	"seawater_proxy": "$seawater_proxy",
	"seawater_swaps_impl": "$SEAWATER_SWAPS",
	"seawater_swap_permit2_a_impl": "$SEAWATER_SWAP_PERMIT2_A",
	"seawater_quotes_impl": "$SEAWATER_QUOTES",
	"seawater_positions_impl": "$SEAWATER_POSITIONS",
	"seawater_update_positions_impl": "$SEAWATER_UPDATE_POSITIONS",
	"seawater_admin_impl": "$SEAWATER_ADMIN",
	"seawater_adjust_position_impl": "$SEAWATER_ADJUST_POSITIONS",
	"seawater_swap_permit2_b_impl": "$SEAWATER_SWAP_PERMIT2_B",
	"seawater_proxy_admin": "$SEAWATER_PROXY_ADMIN",
	"seawater_fusdc_addr": "$FLU_SEAWATER_FUSDC_ADDR"
}
EOF
