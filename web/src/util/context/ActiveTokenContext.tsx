import {Hash, isHex} from 'viem'
import {createContext, useMemo, useState} from 'react'
import {ZeroAddress} from '../chainUtils'
import {decimalsFromAddress, TokenList} from '../tokens'

type ActiveTokenContextType = {
    token0: Hash
    token1: Hash
    decimals0: number
    decimals1: number
    setToken0: (token: string) => void
    setToken1: (token: string) => void
    flipTokens: () => void
    tokenList: typeof TokenList
    ammAddress: Hash
}

const initContext = () => ({
    token0: ZeroAddress,
    token1: ZeroAddress,
    decimals0: 0,
    decimals1: 0,
    setToken0: () => {},
    setToken1: () => {},
    flipTokens: () => {},
    tokenList: [],
    ammAddress: ZeroAddress,
})

const ActiveTokenContext = createContext<ActiveTokenContextType>(initContext())

type IActiveTokenContextProvider = React.PropsWithChildren<{
    tokenList: typeof TokenList
    ammAddress: Hash
}>

const ActiveTokenContextProvider = ({
    children,
    tokenList,
    ammAddress
}: IActiveTokenContextProvider) => {
    const [defaultToken0, defaultToken1] = tokenList.map(({address}) => address)
    // const [activeToken, setActiveTokens] = useState<[Hash, Hash]>([defaultToken0, defaultToken1])
    const [token0, setToken0] = useState<Hash>(defaultToken0)
    const [token1, setToken1] = useState<Hash>(defaultToken1)

    const decimals0 = useMemo(() => decimalsFromAddress(token0), [token0])
    const decimals1 = useMemo(() => decimalsFromAddress(token1), [token1])

    const updateToken0 = (token: string) => isHex(token) && setToken0(token)
    const updateToken1 = (token: string) => isHex(token) && setToken1(token)

    const flipTokens = () => {
        const token0_ = token0
        setToken0(token1)
        setToken1(token0_)
    }

    return (
        <ActiveTokenContext.Provider value={{token0, token1, decimals0, decimals1, setToken0: updateToken0, setToken1: updateToken1, tokenList, ammAddress, flipTokens}}>
            {children}
        </ActiveTokenContext.Provider>
    )
}

export {
    ActiveTokenContext,
    ActiveTokenContextProvider
}
