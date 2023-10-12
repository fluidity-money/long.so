import { motion } from 'framer-motion'
import styles from './Button.module.scss'

interface IButton {
  children: React.ReactNode

}

const Button: React.FC<IButton> = (props) => {
  const { children } = props
  return <motion.button
    className={styles.Button}
    style={{
      rotate: 0,
      scale: 1
    }}
    whileHover={{
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }}
    whileTap={{
      scale: 0.95,
    }}
  >
    {children}
  </motion.button>
}

export { Button }
