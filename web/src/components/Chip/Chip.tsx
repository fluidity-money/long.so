import styles from './Chip.module.scss'

interface IChip {
  children: React.ReactNode
  rounded?: boolean
}

const Chip: React.FC<IChip> = (props) => {
  const { children, rounded = false } = props

  const classes = `
    ${styles.Chip}
    ${rounded ? styles.rounded : ''}
  `
  return <div className={classes}>{children}</div>
}

export { Chip }
