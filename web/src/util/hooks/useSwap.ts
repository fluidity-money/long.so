import {prepareWriteContract, signTypedData, writeContract} from 'wagmi/actions'
import {useContext, useEffect, useMemo, useState} from 'react'
import SeawaterABI from '../abi/SeawaterAMM'
import {ActiveTokenContext} from '../context/ActiveTokenContext'
import {usePrepareContractWrite} from 'wagmi'
import {FluidTokenAddress} from '../tokens'
import {bigAbs} from '../math'
import {useDebounce} from './useDebounce'
import {hexToBigInt} from 'viem'
import {usePermit2} from '../usePermit2'

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

// the possible function/argument combinations for swap simulations
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

type permit2Function = `${'swapIn' | 'swapOut' | 'swap2ExactIn'}Permit2`

interface UseSwapProps {
    amountIn: bigint | string
    minOut: bigint | string
}

/**
 * @description - provides an interface to perform swaps
 */
type UseSwap = ({amountIn, minOut}: UseSwapProps) => {
    /**
     * @description - swap a token for another token by executing a permit2 contract call. The simulated result uses the non-permit2 version, as simulating a permit2 call requires user input (signature approval), and the regular call will have the same result. 
     * Uses `token0` and `token1` from `ActiveTokenContext`, and `amountIn` and `minOut` from `UseSwapProps`. If one of the tokens is the fluid token, `swapInPermit2` or `swapOutPermit2` are called, otherwise `swap2ExactInPermit2` is called.
     * @example amount 100 fUSDC -> token0 calls swapOutPermit2 - swap n token0 for 100 fusdc, result is [n, 100]
     * @example amount 100 token0 -> fUSDC calls swapInPermit2  - swap 100 token0 for n fUSDC, result is [100, n]
     * @example amount 100 token0 -> token1 calls swap2ExactInPermit2 - swap 100 token0 for n token1, result is [100, n]
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
    const {token0, token1, ammAddress} = useContext(ActiveTokenContext)
    const {getPermit2Data} = usePermit2()

    const [prepareContractState, setPrepareContractState] = useState<PrepareContractState | undefined>()

    // debounce params passed to Wagmi hook to avoid RPC spam
    const debouncedState = useDebounce(prepareContractState, 500)

    // we cannot reactively simulate permit2 without spamming the user for a signature
    // instead, simulate the regular event (which has the same result), then create new args for permit2 when actually submitting to contract
    // on update, set function name and arguments to trigger `usePrepareContractWrite`
    useEffect(() => {
        (async () => {
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
                } else {
                    setPrepareContractState({
                        functionName: 'swap2ExactIn',
                        args: [token0, token1, BigInt(amountIn), BigInt(minOut)]
                    })
                }
                // ignore string -> BigInt conversion errors
            } catch (e) {}
        })()
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
    , [config])

    // initiate a swap as described in the hook's interface
    const swap = async() => {
        // simulation failed, so return early
        if (error) {
            console.log('Error!',error)
            return
        }

        // fetch permit2 data
        const {nonce: nonceHex, sig, encodedDeadline} = await getPermit2Data({token: token0, amount: BigInt(amountIn)}) || {}
        if (!nonceHex || !sig || !encodedDeadline || !debouncedState)
            return

        const nonce = hexToBigInt(nonceHex)
        const maxAmount = amountIn

        // use the permit2 variant of the function
        const functionName = debouncedState?.functionName + 'Permit2' as permit2Function

        // append permit2-specific arguments
        const args = [
            ...debouncedState.args, 
            nonce, 
            encodedDeadline, 
            // only swapIn and swapOut need maxAmount 
            ...(debouncedState?.functionName === 'swap2ExactIn' ? [] : [maxAmount]),
            sig,
        ]

        const {request} = await prepareWriteContract({
            address: ammAddress,
            abi: SeawaterABI,
            functionName,
            // Typescript doesn't support strongly typing this with destructuring
            // https://github.com/microsoft/TypeScript/issues/46680
            // @ts-expect-error
            args,
        })
        try {
            await writeContract(request)
        } catch(e) {console.log('failed to write swap!',e)}
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
