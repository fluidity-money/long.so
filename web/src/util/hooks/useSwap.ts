import {prepareWriteContract, writeContract} from "wagmi/actions";
import {useContext} from "react";
import {abi as SeawaterABI} from "../abi/SeawaterAMM.json"
import {ActiveTokenContext} from "../context/ActiveTokenContext";

interface UseSwap {
    /**
     * @description - swapOut fluid -> non-fluid | swapIn non-fluid -> fluidd
     * @param token - the address of the non-fluid token
     * @param amountIn - the raw amount of the fluid token to use as input
     * @param minOut - the minimum output amount, reverting if not reached
     */
    swap: (amountIn: string, minOut: string, direction: 'in' | 'out') => Promise<void>
}

const useSwap = (): UseSwap => {
    const {activeToken, ammAddress} = useContext(ActiveTokenContext);

    const swap = async (amountIn: string, minOut: string, direction: 'in' | 'out') => {
        const {request: swapRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: direction === 'in' ? 'swapIn' : 'swapOut',
            args: [activeToken, amountIn, minOut]
        })
        await writeContract(swapRequest)
    }

    return {
        swap,
    }
}

export {
    useSwap, 
};
