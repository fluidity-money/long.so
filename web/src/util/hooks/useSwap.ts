import {prepareWriteContract, writeContract} from 'wagmi/actions'
import {useContext, useEffect, useMemo, useState} from 'react'
import SeawaterABI from '../abi/SeawaterAMM'
import {ActiveTokenContext} from '../context/ActiveTokenContext'
import {usePrepareContractWrite} from 'wagmi'
import {FluidTokenAddress} from '../tokens'
import {useDebounce} from './useDebounce'
import {Hash, hexToBigInt, maxUint256} from 'viem'
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
    functionName: 'quote',
    args: SeawaterRequestArgs<'quote'>
} | 
{
    functionName: 'quote2',
    args: SeawaterRequestArgs<'quote2'>
}

type permit2Function = `${'swap' | 'swap2ExactIn'}Permit2`

interface UseSwapProps {
    amountIn: bigint | string
    minOut: bigint | string
}

/**
 * @description - provides an interface to perform swaps
 */
type UseSwap = ({amountIn, minOut}: UseSwapProps) => {
    /**
     * @description - swap a token for another token by executing a permit2 contract call. The simulated result uses `quote` and `quote2`, as simulating a permit2 call requires user input (signature approval), and the regular call requires ERC20 Approval.
     * Uses `token0` and `token1` from `ActiveTokenContext`, and `amountIn` and `minOut` from `UseSwapProps`. If one of the tokens is the fluid token, `swapPermit2` is called, otherwise `swap2ExactInPermit2` is called.
     * @example amount 100 fUSDC -> token0 calls swapPermit2 with zeroForOne = false - swap n token0 for 100 fusdc, result is [n, 100]
     * @example amount 100 token0 -> fUSDC calls swapPermit2 with zeroForOne = true - swap 100 token0 for n fUSDC, result is [100, n]
     * @example amount 100 token0 -> token1 calls swap2ExactInPermit2 - swap 100 token0 for n token1, result is [100, n]
     */
    swap:  () => Promise<void>

    /**
     * @description - result of the simulated contract call with the current swap function and arguments. `result` is [bigint, bigint] if the function returns normally, otherwise undefined.
     **/
    result: SeawaterResult<'swap' | 'swap2ExactIn'> | undefined
    
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
    // instead, use the quote function, then create new args for permit2 when actually submitting to contract
    // on update, set function name and arguments to trigger `usePrepareContractWrite`
    useEffect(() => {
        (async () => {
            try {
                if (token0 === FluidTokenAddress) {
                    setPrepareContractState({
                        functionName: 'quote',
                        args: [token1, false, BigInt(amountIn), maxUint256]
                    })
                } else if (token1 === FluidTokenAddress) {
                    setPrepareContractState({
                        functionName: 'quote',
                        args: [token0, true, BigInt(amountIn), maxUint256]
                    })
                } else {
                    setPrepareContractState({
                        functionName: 'quote2',
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

    const result = useMemo(() => {
        // parse the standard revert message to find the quote amount as a decimal number
        const [, quoteAmountString] = error?.message.match(/reverted with the following reason:\n(.+)\n/) || []
        return [
            BigInt(amountIn ?? 0), 
            BigInt(quoteAmountString ?? 0)
        ] as const
    }, [error, amountIn])

    // initiate a swap as described in the hook's interface
    const swap = async() => {
        // simulation failed, so return early
        if (error && result.every(r => r === BigInt(0))) {
            console.log('Error!',error)
            return
        }

        // fetch permit2 data
        const {nonce: nonceHex, sig, encodedDeadline} = await getPermit2Data({token: token0, amount: BigInt(amountIn)}) || {}
        if (!nonceHex || !sig || !encodedDeadline || !debouncedState)
            return

        const nonce = hexToBigInt(nonceHex)
        const maxAmount = amountIn

        // determine which swap function to call
        const swapFunction = debouncedState?.functionName === 'quote'
            ? 'swap' // quote
            : 'swap2ExactIn' // quote2

        // use the permit2 variant of the function
        const functionName = swapFunction + 'Permit2' as permit2Function

        // append permit2-specific arguments
        const args = [
            ...debouncedState.args, 
            nonce, 
            encodedDeadline, 
            // only swap needs maxAmount 
            ...(swapFunction === 'swap2ExactIn' ? [] : [maxAmount]),
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
