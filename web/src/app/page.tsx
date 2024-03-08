'use client'

import pkg from '@/config/package.json'
import { Button } from '@/components/ui/button'
import { Box, Input, Link, Slider, Text, Token } from '@/components'
import Caret from '@/assets/icons/Caret.svg'
import styles from './page.module.scss'
import { useEffect, useState } from 'react'
import { addressToSymbol } from '@/util/tokens'
import { useSwap } from '@/hooks/useSwap'
import { useAccount, useBalance } from 'wagmi'
import {
  getFormattedStringFromTokenAmount,
  getTokenAmountFromFormattedString,
} from '@/util/converters'
import { useActiveTokenStore } from '@/stores/useActiveTokenStore'
import { Welcome } from '@/app/welcome'
import { SwapButton } from '@/app/swap-button'
import { TokenModal, useModalStore } from '@/app/token-modal'
import { useWelcomeStore } from '@/stores/useWelcomeStore'
import Hourglass from '@/assets/icons/hourglass.svg'

const version = pkg.version

export default function Home() {
  const [inputReceive, setInputReceive] = useState('')

  const [amountIn, setAmountIn] = useState(BigInt(0))
  const [amountInDisplay, setAmountInDisplay] = useState('')
  const [minOut, setMinOut] = useState('')

  const { setWelcome, welcome } = useWelcomeStore()

  const {
    token0,
    token1,
    decimals0,
    decimals1,
    setToken0,
    setToken1,
    flipTokens,
  } = useActiveTokenStore()

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

  const { setActiveModalToken, enabled: activeModalToken } = useModalStore()

  const [hovering, setHovering] = useState(false)

  return (
    <>
      <TokenModal />

      {!activeModalToken && (
        <div className="group flex flex-col items-center">
          {welcome && (
            <div
              className="absolute top-[35%] z-[60] h-32 w-full cursor-pointer bg-gradient-to-b from-transparent to-white"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onClick={() => setWelcome(false)}
            />
          )}
          <div
            className={`mt-8 flex w-full max-w-[400px] flex-col items-center gap-4 transition-transform ${welcome ? `cursor-pointer hover:-translate-y-8 hover:blur-0 ${hovering ? '-translate-y-8 blur-0' : 'blur-sm'}` : ''}`}
            onClick={() => setWelcome(false)}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row">
                <Token size="small" />
                <div className="text-xs">
                  $29,123 in <span className="font-medium">USDC Rewards</span>{' '}
                  available.
                </div>
              </div>

              <div className="cursor-pointer  text-xs">
                <span className="underline">View all</span>
                {' ->'}
              </div>

              <div className="flex flex-row items-center gap-1 rounded bg-black px-1 text-xs text-white">
                <Hourglass width={15} height={20} />
                <div className="hidden sm:inline-flex">2d : 1h : 2m</div>
                <div className="inline-flex sm:hidden">2d:5h</div>
              </div>
            </div>

            <div
              className={`${styles.container} relative z-10 flex w-full flex-col gap-2 `}
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
                    onClick={() => setActiveModalToken('token0')}
                  >
                    <Token />
                    {/* Placeholder */}
                    <Text weight="semibold">{addressToSymbol(token0)}</Text>
                    <Caret />
                  </Box>
                </div>
                <div className={styles.rowBottom}>
                  {/* Use the actual amountIn so invalid inputs are visible */}
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
                    onClick={() => setActiveModalToken('token1')}
                  >
                    <Token />
                    <Text weight="semibold">{addressToSymbol(token1)}</Text>
                    <Caret />
                  </Box>
                </div>
                <div className={styles.rowBottom}>
                  <Text size="small">{inputReceive}</Text>
                  <Text size="small">Balance: {token1Balance?.formatted} </Text>
                </div>
              </Box>
            </div>

            {/* only shown on mobile */}
            <div className="w-full md:hidden">
              <Slider
                disabled={!isConnected || isSwapping || isLoading}
                onSlideComplete={() => {
                  swap()
                }}
              >
                Swap
              </Slider>
            </div>

            {/* only shown on desktop */}
            <div className="hidden w-full md:inline-flex">
              <Button className="w-full" size="lg">
                Swap
              </Button>
            </div>
          </div>
        </div>
      )}

      <Welcome />
    </>
  )
}
