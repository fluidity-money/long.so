'use client'

import pkg from '@/config/package.json'
const version = pkg.version

// import styles from './page.module.scss'
import { Box } from '@/components'
export default function Home() {
  return (
    <div>
      {version}
      <Box>.</Box>
    </div>
  )
}
