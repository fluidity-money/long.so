import { motion } from 'framer-motion'
import styles from './Box.module.scss'

interface IBox {
  children: React.ReactNode
  layoutId?: string
}

const Box: React.FC<IBox> = (props) => {
  const { children, layoutId } = props
  return (
    <motion.div
      layoutId={layoutId}
      className={styles.Box}
    >
      {children}
    </motion.div>
  )
}

export { Box }
