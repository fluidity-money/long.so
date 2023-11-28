import { motion } from 'framer-motion'
import styles from './Link.module.scss'
import { Text } from '@/components'

interface ILink {
  children: React.ReactNode
  style?: 'solid' | 'dashed'
  size?: 'small' | 'medium' | 'large'
}

const Link: React.FC<ILink> = (props) => {
  const { children, style = 'solid', size } = props

  const classes = `
    ${styles.Link}
    ${styles[style]}
  `
  return <motion.a
    className={classes}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Text size={size}>
      {children}
    </Text>
  </motion.a>
}

export { Link }
