import {useContext} from "react";
import {abi as SeawaterABI} from "../abi/SeawaterAMM.json"
import {encodeTick} from "../math";
import {prepareWriteContract, waitForTransaction, writeContract} from "wagmi/actions";
import {ActiveTokenContext} from "../context/ActiveTokenContext";

interface UseCreatePosition {
    createPosition: (
        lowerRange: number, 
        upperRange: number, 
        delta: bigint
    ) => void
    removePosition: (id: number) => void
    updatePosition: (id: number, delta: bigint) => void
}

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
            // TODO convert to floats
            // args: [debouncedToken, encodeTick(debouncedLowerRange), encodeTick(debouncedUpperRange)]
            args: [token0, encodeTick(lowerRange), encodeTick(upperRange)]
        })

        const {hash: mintPositionHash} = await writeContract(mintPositionRequest);
        const receipt = await waitForTransaction({hash: mintPositionHash});
        const mintPositionId = receipt.logs[0].topics[1];

        const {request: updatePositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'updatePosition',
            args: [token0, mintPositionId, delta]
        })

        await writeContract(updatePositionRequest);
    }

    const updatePosition = async(id: number, delta: bigint) => {
        const {request: updatePositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'updatePosition',
            args: [token0, id, delta]
        })

        await writeContract(updatePositionRequest);
    }


    // delta should be negative
    const removePosition = async(id: number) => {
        // TODO fetch liquidity in position
        let positionSize: bigint = BigInt(0);

        // reomve all liquidity
        await updatePosition(id, -positionSize);

        // burn position
        const {request: burnPositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'burnPosition',
            args: [id]
        })

        await writeContract(burnPositionRequest);
    }

    // TODO 
    const collectFees = async() => {}

    return {
        createPosition,
        updatePosition,
        removePosition,
    }
}

export {
    useCreatePosition
}
