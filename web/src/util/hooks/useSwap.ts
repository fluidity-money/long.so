import {prepareWriteContract, writeContract} from "wagmi/actions";
import {useContext} from "react";
import {abi as SeawaterABI} from "../abi/SeawaterAMM.json"
import {ActiveTokenContext} from "../context/ActiveTokenContext";

interface UseSwap {
    /**
     * @description - swap a token for a fluid token, or vice versa
     * @param amountIn - the raw amount of the token to use as input
     * @param minOut - the minimum output amount, reverting if not reached
     * @param direction - in: non-fluid -> fluid | out: fluid -> non-fluid
     */
    swap:  (amountIn: string, minOut: string, direction: 'in' | 'out') => Promise<void>
    /**
     * @description - swap two non-fluid tokens
     * @param amountIn - the raw amount of the token to use as input
     * @param minOut - the minimum output amount, reverting if not reached
     * @param direction - in: non-fluid -> fluid | out: fluid -> non-fluid
     */
    swap2: (amountIn: string, minOut: string, direction: 'in' | 'out') => Promise<void>
}

const useSwap = (): UseSwap => {
    // use token0 for swaps involving a fluid token
    const {token0, token1, ammAddress} = useContext(ActiveTokenContext);

    const swap = async(amountIn: string, minOut: string, direction: 'in' | 'out') => {
        const {request: swapRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: direction === 'in' ? 'swapIn' : 'swapOut',
            args: [token0, amountIn, minOut]
        })
        await writeContract(swapRequest)
    }

    const swap2 = async(amountIn: string, minOut: string, direction: 'in' | 'out') => {
        let tokenFrom: string;
        let tokenTo: string;
        if (direction === 'in') {
            tokenFrom = token0;
            tokenTo = token1;
        } else {
            tokenFrom = token0;
            tokenTo = token1;
        }

        const {request: swapRequest} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName: 'swap2ExactIn',
            args: [tokenFrom, tokenTo, amountIn, minOut]
        })
        await writeContract(swapRequest)
    }

    return {
        swap,
        swap2,
    }
}

export {
    useSwap, 
};
