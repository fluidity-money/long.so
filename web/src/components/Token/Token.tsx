import USDC from '@/assets/icons/USDC.svg'
import Image from 'next/image'
import styles from './Token.module.scss'
import { motion } from 'framer-motion'
import { useState } from 'react'

const tokenVariants = {
  idle: {
    rotateY: 180,
  },
  hover: {
    rotateY: [0, 360],
    x: [0,2,0,-2,0],
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

const Token = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className={styles.TokenContainer}
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
    <Image src={USDC} alt="USDC" />

    </div>

    </motion.div>
  </motion.div>
  )
}

export { Token }
