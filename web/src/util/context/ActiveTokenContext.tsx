import {Hash} from "viem"
import {createContext, useState} from "react"

const IsHash = (hash: string): hash is Hash => hash.startsWith('0x')

type ActiveTokenContextType = {
    activeToken: Hash
    setActiveToken: (token: string) => void
    tokenList: Array<Hash>
    ammAddress: Hash
}

const initContext = () => ({
    activeToken: '0x0000000000000000000000000000000000000000' as Hash,
    setActiveToken: () => {
        return
    },
    tokenList: [],
    ammAddress: '0x0000000000000000000000000000000000000000' as Hash,
})

const ActiveTokenContext = createContext<ActiveTokenContextType>(initContext())

type IActiveTokenContextProvider = React.PropsWithChildren<{
    tokenList: Array<Hash>
    ammAddress: Hash
}>

const ActiveTokenContextProvider = ({
    children,
    tokenList,
    ammAddress
}: IActiveTokenContextProvider) => {
    const [activeToken, setActiveToken] = useState<Hash>(tokenList?.[0])
    const updateToken = (token: string): void => IsHash(token) ? setActiveToken(token) : undefined; 

    return (
        <ActiveTokenContext.Provider value={{activeToken, setActiveToken: updateToken, tokenList, ammAddress}}>
            {children}
        </ActiveTokenContext.Provider>
    )
}

export {
    ActiveTokenContext,
    ActiveTokenContextProvider
}
