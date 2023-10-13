'use client'

import { useState } from 'react'
import styles from './page.module.scss'
import { Box, Button, Chip, Menu, Text } from "@/components"

const Dev = () => {

  const [menu, setMenu] = useState('foo')
  const [menuB, setMenuB] = useState('foo')


  return <div className={styles.dev}>Components
    <Box>This is a box</Box>
    <Button>This is a button</Button>
    <Chip>This is a chip</Chip>
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
    <Menu style="primary" id="b">
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
  </div>
}

export default Dev
