'use client'

import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import styles from './page.module.scss'
import { Box, Button, Chip as Chip, Menu, Text, Link, Slider } from "@/components"
import {useSwap} from '@/util/hooks/useSwap'
import {useCreatePosition} from '@/util/hooks/useCreatePosition'

import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import {ActiveTokenContext} from '@/util/context/ActiveTokenContext'
import {addressToSymbol, FluidTokenAddress, Token, TokenList, TokenMap} from '@/util/tokens'
import {Hash} from 'viem'
 
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
          Click to connect with {connector.name}
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

const TokenSelector = ({tokenList, token, setToken}: {tokenList: Array<Token>, token: Hash, setToken: (token: string) => void}) => {
  return <div>
  <select value={token} onChange={(e) => setToken(e.target.value as Hash)}>
    {tokenList.map(token => (
      <option key={token.address} value={token.address}>{token.symbol}</option>
    ))}
  </select>
  </div>
}

const Dev = () => {
  const [menu, setMenu] = useState('foo')
  const [menuB, setMenuB] = useState('foo')

  const {token0, token1, setToken0, setToken1, flipTokens, ammAddress} = useContext(ActiveTokenContext);
  const {createPosition, updatePosition, removePosition, collectFees} = useCreatePosition();

  const [amountIn, setAmountIn] = useState('');
  const [minOut, setMinOut] = useState('');

  const {swap, result, error} = useSwap({amountIn, minOut});

  const [delta, setDelta] = useState(BigInt(20000))
  const [lowerRange, setLowerRange] = useState(50)
  const [upperRange, setUpperRange] = useState(150)
  const [positionId, setPositionId] = useState(BigInt(0));

  return <div className={styles.dev}>
    <Profile/>
    <h1>Swap</h1>
    {!!error && <div>Swap Error: {error.stack}</div>}

    <Chip>Token 0</Chip>
    <TokenSelector tokenList={TokenList} token={token0} setToken={setToken0}/>

    <Chip>Token 1</Chip>
    <TokenSelector tokenList={TokenList} token={token1} setToken={setToken1}/>

    <Button onClick={() => flipTokens()}>Flip tokens</Button>

    <Chip>AmountIn</Chip>
    <input onChange={e => setAmountIn(e.target.value)}/>

    <Chip>MinOut</Chip>
    <input onChange={e => setMinOut(e.target.value)}/>

    {!!result && <Chip>Simulated response: {result[0].toString()} {addressToSymbol(token0)} -&gt; {result[1].toString()} {addressToSymbol(token1)}</Chip>}
    <Button onClick={() => {swap()}}>Make swap</Button>

    <Chip>token0: {token0}</Chip>
    <Chip>token1: {token1}</Chip>

    
    <br/>
    <h1>Modify positions for {addressToSymbol(token0)}</h1>
    <Chip>Set Position</Chip>
    <input value={positionId}  onChange={e => setPositionId(e.target.value)}/>
    <Chip>Set Delta</Chip>
    <input value={delta}  onChange={e => setDelta(e.target.value)}/>
    <Chip>Set Lower Range</Chip>
    <input value={lowerRange}  onChange={e => setLowerRange(e.target.value)}/>
    <Chip>Set Upper Range</Chip>
    <input value={upperRange}  onChange={e => setUpperRange(e.target.value)}/>
    <Button onClick={() => {createPosition(lowerRange, upperRange, delta).then(setPositionId)}}>{'Create new position'}</Button>
    <Button onClick={() => {updatePosition(positionId, delta)}}>{`Update position ${positionId}`}</Button>
    <Button onClick={() => {removePosition(positionId)}}>{`Remove position with id ${positionId}`}</Button>
    <Button onClick={() => {collectFees(positionId)}}>{`Collect fees for position with id ${positionId}`}</Button>
    {/*
    <Button onClick={() => {tryApprove(token0, ammAddress)}}>try approve {token0}</Button>
    */}
    {/*
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
    */}
  </div>
}

export default Dev
