import {GetContractResult, prepareWriteContract, writeContract} from "wagmi/actions"
import {useContext, useEffect, useMemo, useState} from "react"
import SeawaterABI from "../abi/SeawaterAMM"
import {ActiveTokenContext} from "../context/ActiveTokenContext"
import {usePrepareContractWrite} from "wagmi"
import {FluidTokenAddress} from "../tokens"
import {bigAbs} from "../math"

// the strongly typed return value of the Seawater contract function `T`
type SeawaterResult<T extends string> =
    Awaited<ReturnType<
        typeof prepareWriteContract<
            typeof SeawaterABI, T, number
        >
    >>['result']

interface UseSwapProps {
    amountIn: bigint | string
    minOut: bigint | string
}

/**
 * @description - provides an interface to perform swaps
 */
type UseSwap = ({amountIn, minOut}: UseSwapProps) => {
    /**
     * @description - swap a token for another token. Uses `token0` and `token1` from `ActiveTokenContext`, and `amountIn` and `minOut` from `UseSwapProps`. If one of the tokens is the fluid token, `swapIn` or `swapOut` are called, otherwise `swap2ExactIn` is called.
     * @example amount 100 fUSDC -> token0 calls swapOut - swap n token0 for 100 fusdc, result is [n, 100]
     * @example amount 100 token0 -> fUSDC calls swapIn  - swap 100 token0 for n fUSDC, result is [100, n]
     * @example amount 100 token0 -> token1 calls swap2ExactIn - swap 100 token0 for n token1, result is [100, n]
     */
    swap:  () => Promise<void>

    /**
     * @description - result of the simulated contract call with the current swap function and arguments. `result` is [bigint, bigint] if the function returns normally, otherwise undefined.
     **/
    result: SeawaterResult<'swapIn' | 'swapOut' | 'swap2ExactIn'> | undefined
    
    /**
     * @description - the simulated function's error, as returned by Wagmi
     */
    error: Error | null
}

const useSwap: UseSwap = ({amountIn, minOut}) => {
    // TODO add approve step
    const {token0, token1, ammAddress} = useContext(ActiveTokenContext)
    const [functionName, setFunctionName] = useState<'swapIn' | 'swapOut' | 'swap2ExactIn'>('swapIn')
    const [args, setArgs] = useState<any>([])

    // TODO debounce
    // on update, set function name and arguments to trigger `usePrepareContractWrite`
    useEffect(() => {
        try {
            if (token0 === FluidTokenAddress) {
                setFunctionName('swapOut')
                setArgs([token0, BigInt(amountIn), BigInt(minOut)])
            } else if (token1 === FluidTokenAddress) {
                setFunctionName('swapIn')
                setArgs([token0, BigInt(amountIn), BigInt(minOut)])
            } else {
                setFunctionName('swap2ExactIn')
                setArgs([token0, token1, BigInt(amountIn), BigInt(minOut)])
            }
        // ignore string -> BigInt conversion errors
        } catch(e) {}
    }, [token0, token1, amountIn, minOut])

    // simulate contract call and prepare payload
    const {config, error} = usePrepareContractWrite({
        address: ammAddress,
        abi: SeawaterABI,
        functionName,
        args,
    })

    const result = useMemo(() =>
        config.result?.map(n => bigAbs(n)) as [bigint, bigint] // assert type due to map's type erasure
    , [config]);


    // initiate a swap as described in the hook's interface
    const swap = async() => {
        if (error) {
            console.log("Error!",error)
            return
        }
        writeContract(config)
    }

    return {
        swap,
        result,
        error,
    }
}

export {
    useSwap, 
}
