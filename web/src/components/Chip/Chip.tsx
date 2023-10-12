import styles from './Chip.module.scss'

interface IChip {
  children: React.ReactNode
}

const Chip: React.FC<IChip> = (props) => {
  const { children } = props
  return <div className={styles.Chip}>{children}</div>
}

export { Chip }
