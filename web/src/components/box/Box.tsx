import { motion } from 'framer-motion'
import styles from './Box.module.scss'

interface IBox {
  children: React.ReactNode
}

const Box: React.FC<IBox> = ({ children }) => {
  return (
    <motion.div
      layoutId="box"
      className={styles.Box}

    >
      {children}
    </motion.div>
  )
}

export { Box }
