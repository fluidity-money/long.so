'use client'

import pkg from '@/config/package.json'
import { Button } from '@/components/ui/button'
import { Box, Input, Link, Slider, Stack, Text, Token } from '@/components'
import Swap from '@/assets/icons/Swap.svg'
import Caret from '@/assets/icons/Caret.svg'
import Search from '@/assets/icons/Search.svg'
import styles from './page.module.scss'
import { useContext, useEffect, useState } from 'react'
import { ActiveModalToken, Breakdown } from '@/util/types'
import { ActiveTokenContext } from '@/util/context/ActiveTokenContext'
import { addressToSymbol, TokenList } from '@/util/tokens'
import { useSwap } from '@/util/hooks/useSwap'
import { useAccount, useBalance } from 'wagmi'
import {
  getFormattedStringFromTokenAmount,
  getTokenAmountFromFormattedString,
} from '@/util/converters'

const version = pkg.version

export default function Home() {
  const [inputReceive, setInputReceive] = useState('')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [breakdownSection, setBreakdownSection] = useState<Breakdown>(
    Breakdown.Fees,
  )
  const [activeModalToken, setActiveModalToken] = useState<ActiveModalToken>()

  const [amountIn, setAmountIn] = useState(BigInt(0))
  const [amountInDisplay, setAmountInDisplay] = useState('')
  const [minOut, setMinOut] = useState('')

  const [showWelcome, setShowWelcome] = useState(true)

  const {
    token0,
    token1,
    decimals0,
    decimals1,
    setToken0,
    setToken1,
    flipTokens,
  } = useContext(ActiveTokenContext)

  const { address } = useAccount()

  const { data: token0Balance } = useBalance({
    cacheTime: 2000,
    address,
    token: token0,
  })

  const { data: token1Balance } = useBalance({
    cacheTime: 2000,
    address,
    token: token1,
  })

  const { isConnected } = useAccount()
  const { swap, result, resultUsd, error, isLoading, isSwapping } = useSwap({
    amountIn,
    minOut,
  })

  // update output using quoted swap result
  useEffect(() => {
    if (result) {
      const [, outAmount] = result
      const formattedOutAmount = getFormattedStringFromTokenAmount(
        outAmount.toString(),
        decimals1,
      )
      setInputReceive(formattedOutAmount)
    }
  }, [result, decimals1])

  // update amountIn when input amount changes
  useEffect(() => {
    try {
      if (!token0Balance?.value) return
      const amount = getTokenAmountFromFormattedString(
        amountInDisplay,
        decimals0,
      )
      if (amount <= token0Balance.value) setAmountIn(amount)
    } catch {}
  }, [amountInDisplay, token0Balance?.value, decimals0])

  const setMax = () =>
    setAmountInDisplay(token0Balance?.formatted ?? amountInDisplay)

  return (
    <>
      <TokenModal
        enabled={!!activeModalToken}
        disable={() => setActiveModalToken(undefined)}
        setToken={activeModalToken === 'token0' ? setToken0 : setToken1}
      />
      {!activeModalToken && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center max-w-screen-sm transition-transform hover:-translate-y-8 mt-8">
            <div
              className={`${styles.container} relative z-10 flex gap-4 flex-col w-full `}
            >
              <Box className={styles.inputBox}>
                <div className={styles.rowTop}>
                  <Text size="small">Swap</Text>
                  {/* Placeholder */}
                  <Text size="small">${addressToSymbol(token0)}</Text>
                </div>
                <div className={styles.rowMiddle}>
                  <Text size="large">
                    <Input
                      placeholder="0.00"
                      value={amountInDisplay}
                      onChange={(s) => setAmountInDisplay(s)}
                    />
                  </Text>
                  <Box
                    whileTap={{ scale: 0.98 }}
                    outline
                    pill
                    background="light"
                    className={styles.tokenDropdown}
                    onClick={() => {
                      setActiveModalToken('token0')
                    }}
                  >
                    <Token />
                    {/* Placeholder */}
                    <Text weight="semibold">{addressToSymbol(token0)}</Text>
                    <Caret />
                  </Box>
                </div>
                <div className={styles.rowBottom}>
                  {/* Use the actaul amountIn so invalid inputs are visible */}
                  <Text size="small">
                    {getFormattedStringFromTokenAmount(
                      amountIn.toString(),
                      decimals0,
                    )}
                  </Text>
                  <Text size="small">
                    Balance: {token0Balance?.formatted}{' '}
                    <Link
                      onClick={() => {
                        setMax()
                      }}
                    >
                      Max
                    </Link>
                  </Text>
                </div>
              </Box>
              <SwapButton
                onClick={() => {
                  // swap amounts and trigger a quote update
                  const amount1 = result?.[1].toString()
                  setInputReceive(amountInDisplay)
                  setAmountInDisplay(
                    getFormattedStringFromTokenAmount(
                      amount1 || '0',
                      decimals1,
                    ),
                  )
                  flipTokens()
                }}
              />
              <Box className={styles.inputBox} layoutId="main">
                <div className={styles.rowTop}>
                  <Text size="small">Receive</Text>
                  {/* Placeholder */}
                  <Text size="small">${addressToSymbol(token1)}</Text>
                </div>
                <div className={styles.rowMiddle}>
                  <Text size="large">
                    <Input
                      placeholder="0.00"
                      value={isLoading ? '...' : inputReceive}
                      disabled={true}
                      onChange={(s) => setInputReceive(s)}
                    />
                  </Text>
                  <Box
                    whileTap={{ scale: 0.98 }}
                    outline
                    pill
                    background="light"
                    className={styles.tokenDropdown}
                    onClick={() => {
                      setActiveModalToken('token1')
                    }}
                  >
                    <Token />
                    {/* Placeholder */}
                    <Text weight="semibold">{addressToSymbol(token1)}</Text>
                    <Caret />
                  </Box>
                </div>
                <div className={styles.rowBottom}>
                  {/* Placeholder */}
                  <Text size="small">{inputReceive}</Text>
                  {/* Placeholder */}
                  <Text size="small">Balance: {token1Balance?.formatted} </Text>
                </div>
              </Box>
            </div>

            <div className={styles.details}>
              <div className={styles.preview}>
                {/* Placeholder */}
                <Text size="small">$3.28</Text>
                <Button
                  color="light"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                >
                  <Text size="small">
                    See breakdown
                    <Caret className={styles.caret} />
                  </Text>
                </Button>
              </div>
              {!showBreakdown && (
                <Box pill className={styles.cta}>
                  <Stack size="small">
                    <Token />
                    <Token />
                    <Token />
                  </Stack>
                  {/* Placeholder */}
                  <Text size="tiny" weight="semibold">
                    Earn up to $38.21 for making this trade!
                  </Text>
                </Box>
              )}
              {showBreakdown && (
                <>
                  <div className={styles.grid}>
                    {/* Placeholders */}
                    <Text>Fees</Text>
                    <Text className={styles.value}>$3.28</Text>
                    <Text>Rewards</Text>
                    <Text className={styles.value}>$3.28</Text>
                    <Text>Route</Text>
                    <Text className={styles.value}>$3.28</Text>
                  </div>
                  <Box className={styles.detailsBox}>
                    <Text>Rewards Breakdown</Text>
                  </Box>
                </>
              )}
            </div>
            <Slider
              disabled={!isConnected || isSwapping || isLoading}
              onSlideComplete={() => {
                swap()
              }}
            >
              Swap
            </Slider>
          </div>
        </div>
      )}

      {showWelcome && (
        <>
          <div className="absolute z-50 top-[30%] w-full">
            <div className="bg-gradient-to-b from-transparent to-white w-full  h-32" />
            <div className="bg-white flex flex-col items-center justify-around gap-8">
              <div className="flex flex-row gap-1 items-center text-xl mt-10">
                Think{' '}
                <div className="bg-black text-white font-medium p-1 px-2 rounded-md">
                  inside
                </div>{' '}
                the box.
              </div>

              {/* this text is different on desktop and mobile */}
              {/* mobile */}
              <div className="inline-flex md:hidden">
                Earn rewards on every trade on the first DeFi <br />
                Layer-3 focused on incentives and order flow.
              </div>
              {/* desktop */}
              <div className="hidden md:inline-flex">
                The AMM That Pays You To Use It
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                  <div className="group h-10 hover:h-14 rounded-full border-2 border-black p-1 px-3 text-sm hover:bg-black hover:text-white transition-[height] ">
                    <div className="flex flex-col items-center h-full justify-center gap-1">
                      <div>⛽️💰 Gas Rebates and Negative Fees for traders</div>
                      <div className="group-hover:inline-flex hidden text-gray-1 text-xs">
                        Less Gas, More Cash.{' '}
                        <span className="cursor-pointer underline">
                          Learn More {'->'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="group h-10 hover:h-14 rounded-full border-2 border-black p-1 px-3 text-sm hover:bg-black hover:text-white transition-[height] ">
                    <div className="flex flex-col items-center h-full justify-center gap-1">
                      <div>
                        ⛽️💰 $29,123 Trader Rewards available on every swap
                      </div>
                      <div className="group-hover:inline-flex hidden text-gray-1 text-xs">
                        Get rewarded for every transaction you make.{' '}
                        <span className="cursor-pointer underline">
                          Learn More {'->'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-center">
                  <div className="group h-10 hover:h-14 rounded-full border-2 border-black p-1 px-3 text-sm hover:bg-black hover:text-white transition-[height] ">
                    <div className="flex flex-col items-center h-full justify-center gap-1">
                      <div>🔺🚀️ Earn Higher Revenue with Utility Booster</div>
                      <div className="group-hover:inline-flex hidden text-gray-1 text-xs">
                        Earn easy and earn big.{' '}
                        <span className="cursor-pointer underline">
                          Learn More {'->'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => setShowWelcome(false)}>Get Started</Button>
              <Button variant="ghost">Learn more {'->'}</Button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

const SwapButton = ({ onClick }: { onClick?: () => void }) => (
  <Box
    whileHover={{
      borderRadius: 32,
      transition: {
        duration: 0.6,
      },
    }}
    initial={{
      borderRadius: 4,
      x: '-50%',
      y: '-50%',
    }}
    animate={{
      borderRadius: 4,
      transition: {
        duration: 0.6,
      },
    }}
    whileTap={{ scale: 0.9 }}
    background="dark"
    className={styles.swapBtn}
    onClick={onClick}
  >
    <Swap className={styles.swapIcon} />
  </Box>
)

interface TokenModalProps {
  // whether the modal is enabled
  enabled: boolean
  // to disable the modal
  disable: () => void
  // dispatch to update token0/token1
  setToken: (token: string) => void
}

const TokenModal = ({ enabled, disable, setToken }: TokenModalProps) =>
  !enabled ? (
    <></>
  ) : (
    <Box size="large" className={styles.TokenModal}>
      <div className={styles.header}>
        <Text>Select Token</Text>
        <Button color="light" onClick={disable}>
          <Text>Esc</Text>
        </Button>
      </div>
      <Text>Filter</Text>
      <Text className={styles.search}>
        <Input
          value=""
          onChange={() => {
            return
          }}
          placeholder="e.g. Ether, ARB, 0x0bafe8babf38bf3ba83fb80a82..."
        />
        <Search />
      </Text>
      {/* Placeholders */}
      <Text>Highest Rewarders</Text>
      <div className={styles.rewarders}>
        {TokenList.map((token, i) => (
          <Box
            key={i}
            outline
            pill
            background="light"
            onClick={() => {
              setToken(token.address)
              disable()
            }}
          >
            <Token />
            <Text weight="semibold">{token.symbol}</Text>
          </Box>
        ))}
      </div>
    </Box>
  )
