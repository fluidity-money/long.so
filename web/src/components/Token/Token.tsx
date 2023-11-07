import USDC from '@/assets/icons/USDC.svg'
import Image from 'next/image'
import styles from './Token.module.scss'
import { motion } from 'framer-motion'

const tokenVariants = {
  hover: {
    rotateY: [0, 360],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    }
  }
}

const Token = () => {
  return (
    <motion.div
      className={styles.Token}
      variants={tokenVariants}
      whileHover={'hover'}
    >

    <div className={styles.tails}>
      <Image src={USDC} alt="USDC" />
    </div>
    <div className={styles.heads}>
    <Image src={USDC} alt="USDC" />

    </div>


  </motion.div>
  )
}

export { Token }
