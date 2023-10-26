'use client'

import { useContext, useState } from 'react'
import styles from './page.module.scss'
import { Box, Button, Chip, Menu, Text, Link, Slider } from "@/components"
import {useSwap} from '@/util/hooks/useSwap'
import {useCreatePosition} from '@/util/hooks/useCreatePosition'

import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import {ActiveTokenContext} from '@/util/context/ActiveTokenContext'
 
// wagmi example boilerplate
const Profile = () => {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
 
  if (isConnected) {
    return (
      <div>
        <div>{address}</div>
        <div>Connected to {connector?.name}</div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }
 
  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
 
      {error && <div>{error.message}</div>}
    </div>
  )
}

const Dev = () => {
  const [menu, setMenu] = useState('foo')
  const [menuB, setMenuB] = useState('foo')

  const {activeToken, setActiveToken} = useContext(ActiveTokenContext);
  const {swap} = useSwap();
  const {createPosition} = useCreatePosition();

  const [amountIn, setAmountIn] = useState('');
  const [minOut, setMinOut] = useState('');
  const [direction, setDirection] = useState<'in' | 'out'>('in')
  const [delta, setDelta] = useState(BigInt(20000))
  const [lowerRange, setLowerRange] = useState(BigInt(50))
  const [upperRange, setUpperRange] = useState(BigInt(150))

  return <div className={styles.dev}>Components
    <Profile/>
    <Chip>Set Token</Chip>
    <input onChange={e => setActiveToken(e.target.value)}/>
    <Chip>Set AmountIn</Chip>
    <input onChange={e => setAmountIn(e.target.value)}/>
    <Chip>Set MinOut</Chip>
    <input onChange={e => setMinOut(e.target.value)}/>
    <Button onClick={() => {swap(amountIn, minOut, direction).then(console.log).catch(e=>{console.log("failed",e)})}}>confirm</Button>
    <Button onClick={() => {setDirection(direction === 'in' ? 'out' : 'in')}}>swapping {direction}</Button>
    <Button onClick={() => createPosition(lowerRange, upperRange, delta)}>Create new position</Button>
    <Box>This is a box</Box>
    <Button>This is a button</Button>
    <Chip>This is a chip</Chip>
    <Chip rounded>This is a rounded chip</Chip>
    <Chip><Text weight="semibold">This is a chip</Text><Text weight="semibold">with multiple children</Text></Chip>
    <div><Text>This is some </Text><Text weight="semibold">variable weight text.</Text></div>
    <Menu style="primary" id="a">
      <Menu.Item selected={menu === 'foo'} onClick={() => {
        setMenu('foo')
      }}>
        Foo
      </Menu.Item>
      <Menu.Item selected={menu === 'bar'} onClick={() => {
        setMenu('bar')
      }}>
        Bar (Longer Text)
      </Menu.Item>
    </Menu>
    <Menu style="secondary" id="b">
      <Menu.Item selected={menuB === 'foo'} onClick={() => {
        setMenuB('foo')
      }}>
        Foo
      </Menu.Item>
      <Menu.Item selected={menuB === 'bar'} onClick={() => {
        setMenuB('bar')
      }}>
        Bar (Longer Text)
      </Menu.Item>
    </Menu>
    <Link>Link Button -&gt;</Link>
    <Slider onSlideComplete={() => { console.log('hi') }}>Test</Slider>
  </div>
}

export default Dev
