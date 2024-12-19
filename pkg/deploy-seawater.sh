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

[ -z "$SEAWATER_SWAPS_A" ] && SEAWATER_SWAPS_A="$(sh deploy-stylus.sh seawater-swaps-a.wasm)"
[ -z "$SEAWATER_SWAPS_A" ] && err "Failed to deploy seawater_swaps_a"
log "SEAWATER_SWAPS_A=$SEAWATER_SWAPS_A"

[ -z "$SEAWATER_SWAPS_B" ] && SEAWATER_SWAPS_B="$(sh deploy-stylus.sh seawater-swaps-b.wasm)"
[ -z "$SEAWATER_SWAPS_B" ] && err "Failed to deploy seawater_swaps_b"
log "SEAWATER_SWAPS_B=$SEAWATER_SWAPS_B"

[ -z "$SEAWATER_SWAP_PERMIT2_A" ] && SEAWATER_SWAP_PERMIT2_A="$(sh deploy-stylus.sh seawater-swap-permit2-a.wasm)"
[ -z "$SEAWATER_SWAP_PERMIT2_A" ] && err "Failed to deploy seawater_swap_permit2_a"
log "SEAWATER_SWAP_PERMIT2_A=$SEAWATER_SWAP_PERMIT2_A"

[ -z "$SEAWATER_QUOTES_A" ] && SEAWATER_QUOTES_A="$(sh deploy-stylus.sh seawater-quotes-a.wasm)"
[ -z "$SEAWATER_QUOTES_A" ] && err "Failed to deploy seawater_quotes_a"
log "SEAWATER_QUOTES_A=$SEAWATER_QUOTES_A"

[ -z "$SEAWATER_QUOTES_B" ] && SEAWATER_QUOTES_B="$(sh deploy-stylus.sh seawater-quotes-b.wasm)"
[ -z "$SEAWATER_QUOTES_B" ] && err "Failed to deploy seawater_quotes_b"
log "SEAWATER_QUOTES_B=$SEAWATER_QUOTES_B"

[ -z "$SEAWATER_POSITIONS" ] && SEAWATER_POSITIONS="$(sh deploy-stylus.sh seawater-positions.wasm)"
[ -z "$SEAWATER_POSITIONS" ] && err "Failed to deploy seawater_positions"
log "SEAWATER_POSITIONS=$SEAWATER_POSITIONS"

[ -z "$SEAWATER_UPDATE_POSITIONS" ] && SEAWATER_UPDATE_POSITIONS="$(sh deploy-stylus.sh seawater-update-positions.wasm)"
[ -z "$SEAWATER_UPDATE_POSITIONS" ] && err "Failed to deploy seawater_update_positions"
log "SEAWATER_UPDATE_POSITIONS=$SEAWATER_UPDATE_POSITIONS"

[ -z "$SEAWATER_ADMIN" ] && SEAWATER_ADMIN="$(sh deploy-stylus.sh seawater-admin.wasm)"
[ -z "$SEAWATER_ADMIN" ] && err "Failed to deploy seawater_admin"
log "SEAWATER_ADMIN=$SEAWATER_ADMIN"

[ -z "$SEAWATER_ADJUST_POSITIONS_A" ] && SEAWATER_ADJUST_POSITIONS_A="$(sh deploy-stylus.sh seawater-adjust-positions-a.wasm)"
[ -z "$SEAWATER_ADJUST_POSITIONS_A" ] && err "Failed to deploy seawater_adjust_positions_a"
log "SEAWATER_ADJUST_POSITIONS_A=$SEAWATER_ADJUST_POSITIONS_A"

[ -z "$SEAWATER_SWAP_PERMIT2_B" ] && SEAWATER_SWAP_PERMIT2_B="$(sh deploy-stylus.sh seawater-swap-permit2-b.wasm)"
[ -z "$SEAWATER_SWAP_PERMIT2_B" ] && err "Failed to deploy seawater_swap_permit2_b"
log "SEAWATER_SWAP_PERMIT2_B=$SEAWATER_SWAP_PERMIT2_B"

[ -z "$SEAWATER_ADJUST_POSITIONS_B" ] && SEAWATER_ADJUST_POSITIONS_B="$(sh deploy-stylus.sh seawater-adjust-positions-b.wasm)"
[ -z "$SEAWATER_ADJUST_POSITIONS_B" ] && err "Failed to deploy seawater_adjust_positions_b"
log "SEAWATER_ADJUST_POSITIONS_B=$SEAWATER_ADJUST_POSITIONS_B"

seawater_proxy="$(\
	sh deploy-solidity.sh "SeawaterAMM" --constructor-args \
		"$SEAWATER_PROXY_ADMIN" \
		"$SEAWATER_PROXY_ADMIN" \
		"$(cast --address-zero)" \
		"$SEAWATER_EMERGENCY_COUNCIL" \
		"$SEAWATER_SWAPS_A" \
		"$SEAWATER_SWAP_PERMIT2_A" \
		"$SEAWATER_QUOTES_A" \
		"$SEAWATER_POSITIONS" \
		"$SEAWATER_UPDATE_POSITIONS" \
		"$SEAWATER_ADMIN" \
		"$SEAWATER_ADJUST_POSITIONS_A" \
		"$SEAWATER_SWAP_PERMIT2_B" \
		"$SEAWATER_ADJUST_POSITIONS_B" \
		"$SEAWATER_SWAPS_B" \
		"$SEAWATER_QUOTES_B" \
		"$(cast --address-zero)")"
[ -z "$seawater_proxy" ] && err "Failed to deploy seawater_proxy"
log "Seawater proxy deployed to $seawater_proxy"

cat <<EOF
{
	"seawater_proxy": "$seawater_proxy",
	"seawater_swaps_a_impl": "$SEAWATER_SWAPS_A",
	"seawater_swaps_b_impl": "$SEAWATER_SWAPS_B",
	"seawater_swap_permit2_a_impl": "$SEAWATER_SWAP_PERMIT2_A",
	"seawater_quotes_a_impl": "$SEAWATER_QUOTES_A",
	"seawater_quotes_b_impl": "$SEAWATER_QUOTES_B",
	"seawater_positions_impl": "$SEAWATER_POSITIONS",
	"seawater_update_positions_impl": "$SEAWATER_UPDATE_POSITIONS",
	"seawater_admin_impl": "$SEAWATER_ADMIN",
	"seawater_adjust_position_a_impl": "$SEAWATER_ADJUST_POSITIONS_A",
	"seawater_swap_permit2_b_impl": "$SEAWATER_SWAP_PERMIT2_B",
	"seawater_adjust_position_b_impl": "$SEAWATER_ADJUST_POSITIONS_B",
	"seawater_proxy_admin": "$SEAWATER_PROXY_ADMIN",
	"seawater_fusdc_addr": "$FLU_SEAWATER_FUSDC_ADDR"
}
