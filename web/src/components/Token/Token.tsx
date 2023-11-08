import USDC from '@/assets/icons/USDC.svg'
import ETH from '@/assets/icons/ETH.svg'
import Image from 'next/image'
import styles from './Token.module.scss'
import { motion } from 'framer-motion'
import { useState } from 'react'

const tokenVariants = {
  idle: {
    rotateY: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    }
  },
  hover: (size: number) => ({
    rotateY: [0, 360],
    x: [0,0+(size*2),0,0-(size*2),0],
    transition: {
      duration: (0.5 * size) + 1.5,
      ease: 'linear',
      repeat: Infinity,
    }
  }),
  bounce: (size: number) => ({
    y: [0, -(2*size + 8), 0],
    transition: {
      duration: 0.3 + (size*0.2),
      ease: 'easeInOut',
    }
  })
}

interface IToken {
  size?: 'small' | 'medium' | 'large'
}

const Token: React.FC<IToken> = (props) => {
  const { size = 'medium' } = props
  const [hovered, setHovered] = useState(false)

  const classNames = `
    ${styles.TokenContainer}
    ${styles[size]}
  `

  const sz = size === 'small' ? 0 : size === 'medium' ? 1 : 2

  return (
    <motion.div
      custom={sz}
      className={classNames}
      variants={tokenVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={'bounce'}
    >

    <motion.div className={styles.Token}
      custom={sz}
      variants={tokenVariants}
      initial={'idle'}
      animate={hovered ? 'hover' : 'idle'}
    >
    <div className={styles.tails}>
      <Image src={USDC} alt="USDC" />
    </div>
    <div className={styles.heads}>
      <Image src={ETH} alt="USDC" />
    </div>

    </motion.div>
  </motion.div>
  )
}

export { Token }
