import styles from './Text.module.scss'

interface IText {
  children: React.ReactNode
  weight?: 'medium' | 'semibold'
}

const Text: React.FC<IText> = (props) => {
  const { children, weight = 'medium' } = props

  const classes = `
    ${styles.Text}
    ${styles[weight]}
  `

  return (
    <span className={classes}>{children}</span>
  )
}

export { Text }
