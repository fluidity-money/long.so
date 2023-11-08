import { motion } from 'framer-motion'
import styles from './Box.module.scss'

interface IBox {
  children?: React.ReactNode;
  layoutId?: string;
  background?: 'light' | 'dark';
  className?: string;
  pill?: boolean;
}

const Box: React.FC<IBox> = (props) => {
  const { children, layoutId, background = 'light', className = '', pill=false } = props

  const classes = `
    ${styles.Box}
    ${styles[background]}
    ${pill ? styles.pill : ''}
    ${className}
  `

  return (
    <motion.div
      layoutId={layoutId}
      className={classes}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export { Box }
