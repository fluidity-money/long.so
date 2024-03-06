'use client'
import { Button } from '@/components/ui/button'

import { Inter } from 'next/font/google'
import {
  configureChains,
  createConfig,
  WagmiConfig,
} from '@/config/node_modules/wagmi/dist/index'
import {
  arbitrumSepolia,
  localhost,
} from '@/config/node_modules/wagmi/dist/chains'
import { jsonRpcProvider } from '@/config/node_modules/wagmi/dist/providers/jsonRpc'
import { MetaMaskConnector } from '@/config/node_modules/wagmi/dist/connectors/metaMask'
import { ActiveTokenContextProvider } from '@/util/context/ActiveTokenContext'
import { TokenList } from '@/util/tokens'
import { isHex } from 'viem'
import '@/styles/globals.scss'
import './globals.css'
import styles from './layout.module.scss'
import { usePathname, useRouter } from 'next/navigation'

import Superposition from '@/assets/icons/superposition.svg'
import { Menu, Text } from '@/components'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
})

const multicall3AddressString = process.env.NEXT_PUBLIC_MULTICALL3_ADDRESS
if (!multicall3AddressString || !isHex(multicall3AddressString))
  throw new Error(
    `Multicall3 address from env was not a valid address! Was ${multicall3AddressString}`,
  )
const multicall3Address = multicall3AddressString

const { publicClient, webSocketPublicClient } =
  process.env.NODE_ENV === 'development'
    ? configureChains(
        [{ ...localhost, id: 412346 }],
        [
          jsonRpcProvider({
            rpc: () => ({
              http: 'http://localhost:8547',
            }),
          }),
        ],
      )
    : configureChains(
        [
          {
            // Stylus Testnet is based off of Arbitrum Sepolia
            ...arbitrumSepolia,
            name: 'Stylus Testnet',
            id: 23011913,
            // use a self-deployed multicall3 for Stylus Testnet as it doesn't support the standard address
            contracts: { multicall3: { address: multicall3Address } },
            rpcUrls: {
              default: { http: ['https://stylus-testnet.arbitrum.io/rpc'] },
              public: { http: ['https://stylus-testnet.arbitrum.io/rpc'] },
            },
            blockExplorers: {
              default: {
                name: 'Arbiscan',
                url: 'https://stylus-testnet-explorer.arbitrum.io/',
              },
            },
          },
        ],
        [
          jsonRpcProvider({
            rpc: () => ({
              http: 'https://stylus-testnet.arbitrum.io/rpc',
            }),
          }),
        ],
      )

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector()],
  publicClient,
  webSocketPublicClient,
})

const ammAddressString = process.env.NEXT_PUBLIC_AMM_ADDRESS
if (!ammAddressString || !isHex(ammAddressString))
  throw new Error(
    `AMM address from env was not a valid address! Was ${ammAddressString}`,
  )
const ammAddress = ammAddressString

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ActiveTokenContextProvider
          tokenList={TokenList}
          ammAddress={ammAddress}
        >
          <body className={`${inter.className} ${styles.layout}`}>
            <div className={styles.container}>
              <header>
                <div className="flex flex-col w-full gap-8">
                  <div className="flex flex-row justify-between items-center">
                    <Superposition />
                    <Button size="sm" color="light">
                      Connect Wallet
                    </Button>
                  </div>
                  <div>
                    <Menu id="nav">
                      <Menu.Item
                        onClick={() => {
                          router.push('/')
                        }}
                        selected={pathname === '/'}
                      >
                        <Text>Swap</Text>
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          router.push('/stake')
                        }}
                        selected={pathname.startsWith('/stake')}
                      >
                        <Text>Stake</Text>
                      </Menu.Item>
                    </Menu>
                  </div>
                </div>
              </header>
              {children}
            </div>
          </body>
        </ActiveTokenContextProvider>
      </WagmiConfig>
    </html>
  )
}
