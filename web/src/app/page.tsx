'use client'

import pkg from '@/config/package.json'
import { Box, Slider, Token, Text, Link, Input, Stack, Button } from '@/components'
const version = pkg.version
import Image from 'next/image'
import Swap from '@/assets/icons/Swap.svg'
import Caret from '@/assets/icons/Caret.svg'
import Search from '@/assets/icons/Search.svg'
import styles from './page.module.scss'
import { useState } from 'react'

enum Breakdown {
  Fees=0,
  Rewards=1,
  Route=2
}

export default function Home() {
  const [inputSwap, setInputSwap] = useState('')
  const [inputReceive, setInputReceive] = useState('')
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [breakdownSection, setBreakdownSection] = useState<Breakdown>(Breakdown.Fees)
  const [showTokenModal, setShowTokenModal] = useState(true)
  return (
    <>
      {
        showTokenModal && (
          <Box size="large" layoutId='main' className={styles.TokenModal}>
            <div className={styles.header}>
            <Text>Select Token</Text>
            <Button size="medium" color="light" onClick={() => {setShowTokenModal(false)}}>
              <Text>Esc</Text>
            </Button>
            </div>
            <Text>Filter</Text>
            <Text className={styles.search}>
              <Input
                value=''
                onChange={() => { return }}
                placeholder='e.g. Ether, ARB, 0x0bafe8babf38bf3ba83fb80a82...'
              />
              <Search />
            </Text>
            <Text>Highest Rewarders</Text>
            <div className={styles.rewarders}>
              <Box outline pill background="light">
                <Token />
                <Text weight='semibold'>USDC</Text>
              </Box>
              <Box outline pill background="light">
                <Token />
                <Text weight='semibold'>USDC</Text>
              </Box>
              <Box outline pill background="light">
                <Token />
                <Text weight='semibold'>USDC</Text>
              </Box>
            </div>
          </Box>
        )
      }
      {
        !showTokenModal &&
          (<><div className={styles.banner}>
            <Token />
            <Text >$29,123 in USDC Rewards available</Text>
            <Box className={styles.ticker}><Text size="tiny" weight="semibold">2d:3h:58m</Text></Box>
          </div>
          <div className={styles.container}>
            <Box className={styles.inputBox}>
              <div className={styles.rowTop}>
                <Text size="small">Swap</Text>
                <Text size="small">US Dollar Coin</Text>
              </div>
              <div className={styles.rowMiddle}>
                <Text size="large">
                  <Input
                    placeholder="0.00"
                    value={inputSwap}
                    onChange={(s) => setInputSwap(s)}
                  />
                </Text>
                <Box whileTap={{scale: 0.98}} outline pill background="light" className={styles.tokenDropdown} onClick={() => {setShowTokenModal(true)}}>
                  <Token />
                  <Text weight='semibold'>USDC</Text>
                  <Caret />
                </Box>
              </div>
              <div className={styles.rowBottom}>
                <Text size="small">0.00</Text>
                <Text size="small">Balance: 0.00 <Link>Max</Link></Text>
              </div>
            </Box>
            <SwapButton />
            <Box className={styles.inputBox} layoutId='main'>
              <div className={styles.rowTop}>
                <Text size="small">Receive</Text>
                <Text size="small">US Dollar Coin</Text>
              </div>
              <div className={styles.rowMiddle}>
                <Text size="large">
                  <Input
                    placeholder="0.00"
                    value={inputReceive}
                    onChange={(s) => setInputReceive(s)}
                  />
                </Text>
                <Box whileTap={{scale: 0.98}} outline pill background="light" className={styles.tokenDropdown}>
                  <Token />
                  <Text weight='semibold'>USDC</Text>
                  <Caret />
                </Box>
              </div>
              <div className={styles.rowBottom}>
                <Text size="small">0.00</Text>
                <Text size="small">Balance: 0.00</Text>
              </div>
            </Box>
          </div>
          <div className={styles.details}>
            <div className={styles.preview}>
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
              <Text size="tiny" weight='semibold'>Earn up to $38.21 for making this trade!</Text>
            </Box>)
            }
            {
              showBreakdown && <>
              <div className={styles.grid}>
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
            onSlideComplete={() => { return }}
          >
            Swap
          </Slider></>)
      }
      {version}
    </>
  )
}

const SwapButton = () => <Box
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
>
  <Swap className={styles.swapIcon}/>
</Box>
