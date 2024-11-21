#!/bin/sh

log() {
	>&2 echo $@
}

err() {
	log $@
	exit 1
}

[ -z "$LEO_EMERGENCY_COUNCIL" ] && err "LEO_EMERGENCY_COUNCIL unset"
[ -z "$STYLUS_ENDPOINT" ] && err "STYLUS_ENDPOINT unset"
[ -z "$STYLUS_PRIVATE_KEY" ] && err "STYLUS_PRIVATE_KEY unset"

[ -z "$LEO_COLLECT" ] && LEO_COLLECT="$(sh deploy-stylus.sh leo-collect.wasm)"
[ -z "$LEO_COLLECT" ] && err "Failed to deploy leo-collect"
log "LEO_COLLECT=$LEO_COLLECT"

[ -z "$LEO_EXTRAS" ] && LEO_EXTRAS="$(sh deploy-stylus.sh leo-extras.wasm)"
[ -z "$LEO_EXTRAS" ] && err "Failed to deploy leo-extras"
log "LEO_EXTRAS=$LEO_EXTRAS"

leo_proxy="$(\
	sh deploy-solidity.sh "LeoProxy" --constructor-args \
		"$LEO_COLLECT" \
		"$LEO_EXTRAS" \
		"$LEO_EMERGENCY_COUNCIL")"
[ -z "$leo_proxy" ] && err "Failed to deploy leo_proxy"
log "Leo proxy deployed to $leo_proxy"

cat <<EOF
{
	"leo_proxy": "$leo_proxy",
	"leo_emergency_council": "$LEO_EMERGENCY_COUNCIL",
	"leo_collect_impl": "$LEO_COLLECT",
	"leo_extras_impl": "$LEO_EXTRAS"
}
