'use client'

import pkg from '@/config/package.json'
const version = pkg.version

// import styles from './page.module.scss'
export default function Home() {
  return (
    <div>
      {version}
    </div>
  )
}
