import {useContext} from "react";
import SeawaterABI from "../abi/SeawaterAMM"
import {encodeTick} from "../math";
import {prepareWriteContract, waitForTransaction, writeContract, readContract} from "wagmi/actions";
import {ActiveTokenContext} from "../context/ActiveTokenContext";
import {Hash, maxUint128} from "viem";

interface UseCreatePosition {
    // returns id of new position
    createPosition: (
        lowerRange: number, 
        upperRange: number, 
        delta: bigint
    ) => Promise<Hash>
    removePosition: (id: bigint) => Promise<void>
    updatePosition: (id: bigint, delta: bigint) => Promise<void>
    collectFees: (id: bigint) => Promise<void>
}

// TODO simulate for create/update position
const useCreatePosition = (): UseCreatePosition => {
    const {token0, ammAddress} = useContext(ActiveTokenContext);
    // TODO add approve step

    // write the mintPosition action, then updatePosition using the pool ID
    // operates on the active token
    const createPosition = async (lowerRange: number, upperRange: number, delta: bigint) => {
        
        const {request: mintPositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'mintPosition',
            args: [token0, encodeTick(lowerRange), encodeTick(upperRange)]
        })

        const {hash: mintPositionHash} = await writeContract(mintPositionRequest);
        const receipt = await waitForTransaction({hash: mintPositionHash});
        const mintPositionId = receipt.logs[0].topics[1];

        if (!mintPositionId) {
            throw new Error("Failed to fetch ID of new mint position!")
        }

        const {request: updatePositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'updatePosition',
            // TODO can this be cast? or should we just pass the 0xstring
            args: [token0, mintPositionId, delta]
        })

        await writeContract(updatePositionRequest);
        return mintPositionId;
    }

    /**
     * @description - update a position with the given ID. Uses `token0` as the pool token
     * @param id - the ID of the position to update
     * @param delta - positive to add liquidity, negative to remove
     */
    const updatePosition = async(id: bigint, delta: bigint) => {
        const {request: updatePositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'updatePosition',
            args: [token0, id, delta]
        })

        await writeContract(updatePositionRequest);
    }


    /**
     * @description - remove a position with the given ID. Uses `token0` as the pool token. Clears all liquidity, then burns the position
     * @param id - the ID of the position to update
     */
    const removePosition = async(id: bigint) => {
        const positionLiquidity = await readContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'positionLiquidity',
            args: [token0, id]
        })

        // remove all liquidity
        await updatePosition(id, -positionLiquidity);

        // burn position
        const {request: burnPositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'burnPosition',
            args: [id]
        })

        await writeContract(burnPositionRequest);
    }

    /**
     * @description - collect fees from a position with the given ID. Uses `token0` as the pool token.
     * @param id - the ID of the position to collect fees from
     */
    const collectFees = async(id: bigint) => {
        // simulate first to return the amount to be collected (or convert this to a simulated hook fn)
        const {request: collectRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'collect',
            args: [token0, id, maxUint128, maxUint128]
        })

        await writeContract(collectRequest)
    }

    return {
        createPosition,
        updatePosition,
        removePosition,
        collectFees,
    }
}

export {
    useCreatePosition
}
