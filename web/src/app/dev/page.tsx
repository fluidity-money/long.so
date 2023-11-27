'use client'

import { useState } from 'react'
import styles from './page.module.scss'
import {
  Box,
  Button,
  Chip,
  Menu,
  Text,
  Link,
  Slider,
  Supicon,
  Token,
  Hoverable,
  Dropdown,
  Tooltip,
  Stack
} from '@/components'

const Dev = () => {
  const [menu, setMenu] = useState('foo')
  const [menuB, setMenuB] = useState('foo')

  return (
    <div className={styles.dev}>
      Components
      <div className={styles.box}>
        <Box>This is a box</Box>
        <Button>This is a button</Button>
        <Chip>This is a chip</Chip>
        <Chip rounded>This is a rounded chip</Chip>
        <Chip>
          <Text weight="semibold">This is a chip</Text>
          <Text weight="semibold">with multiple children</Text>
        </Chip>
        <div>
          <Text>This is some </Text>
          <Text weight="semibold">variable weight text.</Text>
        </div>
        <Menu style="primary" id="a">
          <Menu.Item
            selected={menu === 'foo'}
            onClick={() => {
              setMenu('foo')
            }}
          >
            Foo
          </Menu.Item>
          <Menu.Item
            selected={menu === 'bar'}
            onClick={() => {
              setMenu('bar')
            }}
          >
            Bar (Longer Text)
          </Menu.Item>
        </Menu>
        <Menu style="secondary" id="b">
          <Menu.Item
            selected={menuB === 'foo'}
            onClick={() => {
              setMenuB('foo')
            }}
          >
            Foo
          </Menu.Item>
          <Menu.Item
            selected={menuB === 'bar'}
            onClick={() => {
              setMenuB('bar')
            }}
          >
            Bar (Longer Text)
          </Menu.Item>
        </Menu>
        <Link>Link Button -&gt;</Link>
        <Slider
          onSlideComplete={() => {
            console.log('hi')
          }}
        >
          Test
        </Slider>
        <Box pill>
          <Token size="small" />
        </Box>
        <Box pill>
          <Token />
          <Text>USDC</Text>
        </Box>
        <Box pill>
          <Token size="large" />
        </Box>
        <Box pill>
          <Stack>
            <Token />
            <Token />
            <Token />
          </Stack>
        </Box>
        <Chip rounded>
          <Stack size="small">
            <Token />
            <Token />
            <Token />
          </Stack>
          Lorem ipsum
        </Chip>
        <Hoverable
          tooltip={<Tooltip>Tooltip content</Tooltip>}
        >
          <Link>Link Button wrapped in a Hoverable</Link>
        </Hoverable>
        <Dropdown id="test" label={'Volume'} initial="test">
          <Dropdown.Item id="test">Test</Dropdown.Item>
          <Dropdown.Item id="test">Test</Dropdown.Item>

        </Dropdown>
        <Supicon seed="foo" />
        <Supicon seed="bar" />
      </div>
      <Box>
        <Token size="large" />
        <Token />
        <Token />
        <Box background="dark">
          Lorem ipsum dolor sit amet.
          <Menu id="3">
            <Menu.Item selected>Foo</Menu.Item>
            <Menu.Item>Foo</Menu.Item>
          </Menu>
        </Box>
        <Text>Foo</Text>
        <Link>Link Button -&gt;</Link>
        <Chip>This is a chip</Chip>
      </Box>
    </div>
  )
}

export default Dev
