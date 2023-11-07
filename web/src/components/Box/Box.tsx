import { motion } from 'framer-motion'
import styles from './Box.module.scss'

interface IBox {
  children?: React.ReactNode;
  layoutId?: string;
  background?: 'light' | 'dark';
  className?: string;
}

const Box: React.FC<IBox> = (props) => {
  const { children, layoutId, background = 'light', className = '' } = props

  const classes = `
    ${styles.Box}
    ${styles[background]}
    ${className}
  `

  return (
    <motion.div
      layoutId={layoutId}
      className={classes}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{ borderRadius: 4 }}
    >
      {children}
    </motion.div>
  )
}

export { Box }
