import {Hash} from "viem"

const IsHash = (hash?: string): hash is Hash => hash?.startsWith('0x') || false

const ZeroAddress: Hash = '0x0000000000000000000000000000000000000000';


export {
    IsHash,
    ZeroAddress,
}
