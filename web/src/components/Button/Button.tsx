import { ForwardRefComponent, HTMLMotionProps, motion } from 'framer-motion'
import styles from './Button.module.scss'

interface IButton extends ForwardRefComponent<HTMLButtonElement, HTMLMotionProps<"button">> {
    children: React.ReactNode
}


const Button: React.FC<IButton> = (props) => {
  const { children, ...p } = props
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
    {...p}
  >
    {children}
  </motion.button>
}

export { Button }
