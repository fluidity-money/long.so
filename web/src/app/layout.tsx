'use client'

import { Menu, Supicon, Text, Button } from '@/components'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Superposition from '@/assets/icons/Superposition.svg'

import '@/styles/globals.scss'
import styles from './layout.module.scss'
import { usePathname, useRouter } from 'next/navigation'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.layout}`}>
        <div className={styles.container}>
          <header>
            {/* <Image src={Superposition} alt="Superposition" /> */}
            <Menu id="nav">
              <Menu.Item onClick={() => {router.push('/')}} selected={pathname==='/'}><Text>Swap</Text></Menu.Item>
              <Menu.Item onClick={() => {router.push('/stake')}} selected={pathname.startsWith('/stake')}><Text>Stake</Text></Menu.Item>
            </Menu>
            <Button color="light">
              <Text>owfie.eth</Text>
            </Button>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
