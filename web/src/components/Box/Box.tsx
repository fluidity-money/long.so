import {motion, AnimationProps, TargetAndTransition, VariantLabels} from 'framer-motion'
import {CSSProperties, SVGAttributes} from 'react'
import styles from './Box.module.scss'

interface IBox {
  children?: React.ReactNode
  layoutId?: string
  background?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
  className?: string
  pill?: boolean
  outline?: boolean
  whileHover?: VariantLabels | TargetAndTransition
  animate?: VariantLabels | TargetAndTransition
  initial?: AnimationProps['initial']
  whileTap?: VariantLabels | TargetAndTransition
  style?: React.CSSProperties
  onClick?: () => void
}

const Box: React.FC<IBox> = (props) => {
  const {
    children,
    layoutId,
    background = 'light',
    size='medium',
    className = '',
    pill = false,
    outline = false,
    whileHover,
    animate,
    initial,
    whileTap,
    style = {},
    onClick = () => {},
  } = props

  const classes = `
    ${styles.Box}
    ${styles[background]}
    ${styles[size]}
    ${pill ? styles.pill : ''}
    ${outline ? styles.outline : ''}
    ${className}
  `

  return (
    <motion.div
      style={style}
      layoutId={layoutId}
      className={classes}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      whileHover={whileHover}
      animate={animate}
      initial={initial}
      whileTap={whileTap}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export { Box }
