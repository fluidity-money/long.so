'use client'

import '@/styles/globals.scss'
import { Inter } from 'next/font/google'
import {configureChains, createConfig, WagmiConfig } from '@/config/node_modules/wagmi/dist/index'
import {arbitrumNova, localhost} from '@/config/node_modules/wagmi/dist/chains'
import {publicProvider} from '@/config/node_modules/wagmi/dist/providers/public'
import {infuraProvider} from '@/config/node_modules/wagmi/dist/providers/infura'
import {jsonRpcProvider} from '@/config/node_modules/wagmi/dist/providers/jsonRpc'
import {MetaMaskConnector} from '@/config/node_modules/wagmi/dist/connectors/metaMask'
import {encodeTick} from '@/util/math'
import univ3prices from '@/config/node_modules/@thanpolas/univ3prices'
import {ActiveTokenContextProvider} from '@/util/context/ActiveTokenContext'
import {TokenList} from '@/util/tokens'
import {mustEnv} from '@/util/env'
import {isHash} from 'viem'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
})

const {chains, publicClient, webSocketPublicClient} = process.env.NODE_ENV === "development" ?
  configureChains(
    [localhost],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: "http://localhost:8547"
        })
      })
    ],
  ) :
  configureChains(
    [arbitrumNova],
    [
      infuraProvider({apiKey: process.env.FLU_INFURA_KEY || ""})
    ],
  )
 
// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector(),
  ],
  publicClient,
  webSocketPublicClient,
})

const ammAddressString = mustEnv('NEXT_PUBLIC_AMM_ADDRESS')
if (!isHash(ammAddressString))
  throw new Error(`AMM address from env was not a valid address! Was ${ammAddressString}`)
const ammAddress = ammAddressString

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiConfig config={config}>
      {/* TODO source from env or config file */}
      <ActiveTokenContextProvider tokenList={TokenList} ammAddress={ammAddress}>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ActiveTokenContextProvider>
    </WagmiConfig>
  )
}
