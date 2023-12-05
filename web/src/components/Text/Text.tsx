import styles from './Text.module.scss'

interface IText {
  children: React.ReactNode
  weight?: 'medium' | 'semibold'
  size?: 'tiny' | 'small' | 'medium' | 'large'
  className?: string
}

const Text: React.FC<IText> = (props) => {
  const { children, weight = 'medium', size='small', className = '' } = props

  const classes = `
    ${styles.Text}
    ${className}
    ${styles[weight]}
    ${styles[`size_${size}`]}
  `

  return (
    <span className={classes}>{children}</span>
  )
}

export { Text }
