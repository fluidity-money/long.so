import { IToken, Token } from '@/components/Token/Token'
import styles from './Stack.module.scss'
import { motion } from 'framer-motion'

interface IStack {
  children: React.ReactElement<IToken>[]
  size?: 'small' | 'medium' | 'large'
}

const Stack: React.FC<IStack> = (props) => {
  const { children, size='medium' } = props

  const stackClasses = `
    ${styles.Stack}
    ${styles[size]}
  `

  const sz = size === 'small' ? 16 : size === 'medium' ? 32 : 64
  const length = ((children.length-1) * (sz - (sz/3))) + sz

  return <motion.div className={stackClasses} style={{width: length, height: sz}}>
    {children.map((child, i) => {
      return (
        <motion.div
          key={i}
          className={styles.item}
          initial={{x: (sz - (sz/3))*i}}
          style={{zIndex: i}}
        >
          <Token {...child} size={size} />
        </motion.div>
      )
    })
    }
  </motion.div>
}

export { Stack }
