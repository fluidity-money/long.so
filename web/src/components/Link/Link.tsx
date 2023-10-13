import { motion } from 'framer-motion'
import styles from './Link.module.scss'

interface ILink {
  children: React.ReactNode
  style?: 'solid' | 'dashed'
}

const Link: React.FC<ILink> = (props) => {
  const { children, style = 'solid' } = props

  const classes = `
    ${styles.Link}
    ${styles[style]}
  `
  return <motion.button
    className={classes}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
}

export { Link }
