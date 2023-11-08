import USDC from '@/assets/icons/USDC.svg'
import ETH from '@/assets/icons/ETH.svg'
import Image from 'next/image'
import styles from './Token.module.scss'
import { motion, useMotionValue } from 'framer-motion'
import { useState } from 'react'

const tokenVariants = {
  idle: {
    rotateY: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    }
  },
  hover: {
    rotateY: [0, 360],
    x: [0,4,0,-4,0],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    }
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    }
  }
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

  return (
    <motion.div
      className={classNames}
      variants={tokenVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={'bounce'}
    >

    <motion.div className={styles.Token}
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
