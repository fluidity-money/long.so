'use client'

import pkg from '@/config/package.json'
import { Box, Slider, Token, Text, Link, Input, Stack, Button } from '@/components'
const version = pkg.version
import Swap from '@/assets/icons/Swap.svg'
import Caret from '@/assets/icons/Caret.svg'
import Search from '@/assets/icons/Search.svg'
import styles from './page.module.scss'
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ActiveModalToken, Breakdown } from '@/util/types'
import {ActiveTokenContext} from '@/util/context/ActiveTokenContext'
import {addressToSymbol, decimalsFromAddress, TokenList} from '@/util/tokens'
import {Hash} from 'viem'
import {useSwap} from '@/util/hooks/useSwap'
import {Profile} from './dev/page'
import {useBalance, useAccount} from 'wagmi'
import {getFormattedStringFromTokenAmount, getTokenAmountFromFormattedString} from '@/util/converters'

export default function Home() {
  const [inputReceive, setInputReceive] = useState('')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [breakdownSection, setBreakdownSection] = useState<Breakdown>(Breakdown.Fees)
  const [activeModalToken, setActiveModalToken] = useState<ActiveModalToken>()

  const [amountIn, setAmountIn] = useState(BigInt(0))
  const [amountInDisplay, setAmountInDisplay] = useState('')
  const [minOut, setMinOut] = useState('')

  const {token0, token1, setToken0, setToken1, flipTokens} = useContext(ActiveTokenContext)
  const decimals0 = useMemo(() => decimalsFromAddress(token0), [token0])
  const decimals1 = useMemo(() => decimalsFromAddress(token1), [token1])

  const {address} = useAccount()

  const {data: token0Balance} = useBalance({
    cacheTime: 2000,
    address,
    token: token0,
  })

  const {data: token1Balance} = useBalance({
    cacheTime: 2000,
    address,
    token: token1,
  })

  const {swap, result, error} = useSwap({amountIn, minOut})
  
  // update output using simulated swap result
  useEffect(() => {
    if (result) {
      const [, outAmount] = result 
      const formattedOutAmount = getFormattedStringFromTokenAmount(outAmount.toString(), decimals1)
      setInputReceive(formattedOutAmount)
    }
  }, [result, decimals1])

  // update amountIn when input amount changes
  useEffect(() => {
    try {
      if (!token0Balance?.value)
        return
      const amount = getTokenAmountFromFormattedString(amountInDisplay, decimals0)
      if (amount <= token0Balance.value)
        setAmountIn(amount)
    } catch {}
  }, [amountInDisplay, token0Balance?.value, decimals0])

  const setMax = () => setAmountInDisplay(token0Balance?.formatted ?? amountInDisplay)

  return (
    <>
    <Profile/>
    <TokenModal 
      enabled={!!activeModalToken} 
      disable={() => setActiveModalToken(undefined)}
      setToken={
        activeModalToken === 'token0' ? 
          setToken0 : 
          setToken1
    }/>
    {
      !activeModalToken &&
        (<><div className={styles.banner}>
          <Token />
          {/* Placeholder */}
          <Text >$29,123 in USDC Rewards available</Text>
          {/* Placeholder */}
          <Box className={styles.ticker}><Text size="tiny" weight="semibold">2d:3h:58m</Text></Box>
        </div>
        <div className={styles.container}>
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
              <Box whileTap={{scale: 0.98}} outline pill background="light" className={styles.tokenDropdown} onClick={() => {setActiveModalToken('token0')}}>
                <Token />
                {/* Placeholder */}
                <Text weight='semibold'>{addressToSymbol(token0)}</Text>
                <Caret />
              </Box>
            </div>
            <div className={styles.rowBottom}>
              {/* Use the actaul amountIn so invalid inputs are visible*/}
              <Text size="small">{getFormattedStringFromTokenAmount(amountIn.toString(), decimals0)}</Text>
              <Text size="small">Balance: {token0Balance?.formatted} <Link onClick={() => {setMax()}}>Max</Link></Text>
            </div>
          </Box>
          <SwapButton onClick={() => {
              // swap amounts and trigger a quote update
              const amount1 = result?.[1].toString()
              setInputReceive(amountInDisplay)
              setAmountInDisplay(getFormattedStringFromTokenAmount(amount1 || '0', decimals1))
              flipTokens()
            }}/>
          <Box className={styles.inputBox} layoutId='main'>
            <div className={styles.rowTop}>
              <Text size="small">Receive</Text>
              {/* Placeholder */}
              <Text size="small">${addressToSymbol(token1)}</Text>
            </div>
            <div className={styles.rowMiddle}>
              <Text size="large">
                <Input
                  placeholder="0.00"
                  value={inputReceive}
                  disabled={true}
                  onChange={(s) => setInputReceive(s)}
                />
              </Text>
              <Box whileTap={{scale: 0.98}} outline pill background="light" className={styles.tokenDropdown} onClick={() => {setActiveModalToken('token1')}}>
                <Token />
                {/* Placeholder */}
                <Text weight='semibold'>{addressToSymbol(token1)}</Text>
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
              inline
              color="light"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              <Text size="small">See breakdown
              <Caret className={styles.caret}/></Text>
            </Button>
          </div>
          {
            !showBreakdown && (
          <Box pill className={styles.cta}>
            <Stack size="small">
              <Token />
              <Token />
              <Token />
            </Stack>
            {/* Placeholder */}
            <Text size="tiny" weight='semibold'>Earn up to $38.21 for making this trade!</Text>
          </Box>)
          }
          {
            showBreakdown && <>
            <div className={styles.grid}>
              {/* Placeholders */}
              <Text>Fees</Text>
              <Text className={styles.value}>$3.28</Text>
              <Text >Rewards</Text>
              <Text className={styles.value}>$3.28</Text>
              <Text>Route</Text>
              <Text className={styles.value}>$3.28</Text>
            </div>
            <Box className={styles.detailsBox}>
              <Text>Rewards Breakdown</Text>
            </Box>
          </>
          }
        </div>
        <Slider
          onSlideComplete={() => { swap() }}
        >
          Swap
        </Slider></>)
    }
    {version}
    </>
  )
}

const SwapButton = ({onClick}: {onClick?: () => void}) => <Box
  whileHover={{
    borderRadius: 32,
    transition: {
      duration: 0.6,
    }
  }}
  initial={{
    borderRadius: 4,
    x: '-50%',
    y: '-50%'
  }}
  animate={{
    borderRadius: 4,
    transition: {
      duration: 0.6,
    }
  }}
  whileTap={{ scale: 0.9 }}
  background="dark"
  className={styles.swapBtn}
  onClick={onClick}
>
  <Swap className={styles.swapIcon}/>
</Box>

interface TokenModalProps {
  // whether the modal is enabled
  enabled: boolean
  // to disable the modal
  disable: () => void
  // dispatch to update token0/token1
  setToken: (token: string) => void
}

const TokenModal = ({enabled, disable, setToken}: TokenModalProps) =>
  !enabled ? <></> : (
    <Box size="large" className={styles.TokenModal}>
      <div className={styles.header}>
        <Text>Select Token</Text>
        <Button size="medium" color="light" onClick={disable}>
          <Text>Esc</Text>
        </Button>
      </div>
      <Text>Filter</Text>
      <Text className={styles.search}>
        <Input
          value=''
          onChange={() => {return }}
          placeholder='e.g. Ether, ARB, 0x0bafe8babf38bf3ba83fb80a82...'
        />
        <Search />
      </Text>
      {/* Placeholders */}
      <Text>Highest Rewarders</Text>
      <div className={styles.rewarders}>
        {TokenList.map((token, i) => (
          <Box key={i} outline pill background="light" onClick={() => {setToken(token.address); disable()}}>
            <Token />
            <Text weight='semibold'>{token.symbol}</Text>
          </Box>
        ))}
      </div>
    </Box>
  )

