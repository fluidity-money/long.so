import {useContext} from "react";
import {abi as SeawaterABI} from "../abi/SeawaterAMM.json"
import {encodeTick} from "../math";
import {prepareWriteContract, waitForTransaction, writeContract} from "wagmi/actions";
import {ActiveTokenContext} from "../context/ActiveTokenContext";

interface UseCreatePosition {
    createPosition: (lowerRange: bigint, upperRange: bigint, delta: bigint) => void
}

const useCreatePosition = (): UseCreatePosition => {
    const {activeToken, ammAddress} = useContext(ActiveTokenContext);
    // TODO add approve step

    // write the mintPosition action, then updatePosition using the pool ID
    // operates on the active token
    const createPosition = async (lowerRange: bigint, upperRange: bigint, delta: bigint) => {
        const {request: mintPositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'mintPosition',
            // TODO convert to floats
            // args: [debouncedToken, encodeTick(debouncedLowerRange), encodeTick(debouncedUpperRange)]
            args: [activeToken, encodeTick(50), encodeTick(150)]
        })

        const {hash: mintPositionHash} = await writeContract(mintPositionRequest);
        const receipt = await waitForTransaction({hash: mintPositionHash});
        const mintPositionId = receipt.logs[0].topics[1];

        const {request: updatePositionRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'updatePosition',
            args: [activeToken, mintPositionId, delta]
        })

        await writeContract(updatePositionRequest);
    }

    return {createPosition}
}

export {
    useCreatePosition
}
