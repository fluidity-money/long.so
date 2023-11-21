import {prepareWriteContract, writeContract} from "wagmi/actions"
import {useContext, useEffect, useMemo, useState} from "react"
import SeawaterABI from "../abi/SeawaterAMM"
import {ActiveTokenContext} from "../context/ActiveTokenContext"
import {usePrepareContractWrite} from "wagmi"
import {FluidTokenAddress} from "../tokens"
import {bigAbs} from "../math"
import {useDebounce} from "./useDebounce"

// the strongly typed return value of the Seawater contract function `T`
type SeawaterResult<T extends string> =
    Awaited<ReturnType<
        typeof prepareWriteContract<
            typeof SeawaterABI, T, number
        >
    >>['result']

// the strongly typed request value of the Seawater contract function `T`
type SeawaterRequest<T extends string> =
    Awaited<ReturnType<
        typeof prepareWriteContract<
            typeof SeawaterABI, T, number
        >
    >>['request']

// the arguments for a given `SeawaterRequest<T>`
type SeawaterRequestArgs<T extends string> = 
    'args' extends keyof SeawaterRequest<T> 
        ? SeawaterRequest<T>['args'] 
        : never

// the possible function/argument combinations for swaps
type PrepareContractState = 
{
    functionName: 'swapIn',
    args: SeawaterRequestArgs<'swapIn'>
} | 
{
    functionName: 'swapOut',
    args: SeawaterRequestArgs<'swapOut'>
} | 
{
    functionName: 'swap2ExactIn',
    args: SeawaterRequestArgs<'swap2ExactIn'>
}

interface UseSwapProps {
    amountIn: bigint | string
    minOut: bigint | string
}

/**
 * @description - provides an interface to perform swaps
 */
type UseSwap = ({amountIn, minOut}: UseSwapProps) => {
    /**
     * @description - swap a token for another token by executing the simulated contract call. Uses `token0` and `token1` from `ActiveTokenContext`, and `amountIn` and `minOut` from `UseSwapProps`. If one of the tokens is the fluid token, `swapIn` or `swapOut` are called, otherwise `swap2ExactIn` is called.
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

    const [prepareContractState, setPrepareContractState] = useState<PrepareContractState | undefined>()

    // debounce params passed to Wagmi hook to avoid RPC spam
    const debouncedState = useDebounce(prepareContractState, 500)

    // on update, set function name and arguments to trigger `usePrepareContractWrite`
    useEffect(() => {
        try {
            if (token0 === FluidTokenAddress) {
                setPrepareContractState({
                    functionName: 'swapOut',
                    args: [token0, BigInt(amountIn), BigInt(minOut)]
                })
            } else if (token1 === FluidTokenAddress) {
                setPrepareContractState({
                    functionName: 'swapIn',
                    args: [token0, BigInt(amountIn), BigInt(minOut)]
                })
            }  else {
                setPrepareContractState({
                    functionName: 'swap2ExactIn', 
                    args: [token0, token1, BigInt(amountIn), BigInt(minOut)]
                })
            }
        // ignore string -> BigInt conversion errors
        } catch(e) {}
    }, [token0, token1, amountIn, minOut])

    // simulate contract call and prepare payload
    const {config, error} = usePrepareContractWrite({
        address: ammAddress,
        abi: SeawaterABI,
        functionName: debouncedState?.functionName,
        // Typescript doesn't support strongly typing this with destructuring
        // https://github.com/microsoft/TypeScript/issues/46680
        // @ts-expect-error
        args: debouncedState?.args,
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
