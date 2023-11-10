'use client'

import Superposition from '@/assets/icons/Superposition.svg'
import Image from 'next/image'
import pkg from '@/config/package.json'
import { Menu } from '@/components'
const version = pkg.version

// import styles from './page.module.scss'
export default function Home() {
  return (
    <div>
      <Image src={Superposition} alt="Superposition" />
      <Menu id="nav">
        <Menu.Item>Swap</Menu.Item>
        <Menu.Item>Stake</Menu.Item>
      </Menu>
      {version}
    </div>
  )
}
