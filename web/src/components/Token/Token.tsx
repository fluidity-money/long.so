import USDC from '@/assets/icons/USDC.svg'
import ETH from '@/assets/icons/ETH.svg'
import Image from 'next/image'
import styles from './Token.module.scss'
import { motion, useAnimate, useAnimationControls } from 'framer-motion'
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
    x: [0,(size+1)*2,0,(size+1)*-2,0],
    transition: {
      duration: (0.5 * size) + 1.5,
      ease: 'linear',
      repeat: Infinity,
    }
  })
}

export interface IToken {
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

  const [scope, animate] = useAnimate()
  const [clickable, setClickable] = useState(true)

  const handleClick = async () => {
    if (!scope.current) return
    if (!clickable) return

    setClickable(false)
    setTimeout(() => {
      setClickable(true)
    }, 200+(sz*100))

    animate(scope.current, {
      y: [null, -(4*sz + 6), 0]
    },
    {
      duration: 0.3 + (sz*0.1),
      ease: 'easeOut',
    })
  }

  return (
    <motion.div
      custom={sz}
      className={classNames}
      variants={tokenVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
    <motion.div className={styles.Token}
      custom={sz}
      variants={tokenVariants}
      initial={'idle'}
      animate={hovered ? 'hover' : 'idle'}
      ref={scope}
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
