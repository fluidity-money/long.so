interface IChip {
  children: React.ReactNode
}

const Chip: React.FC<IChip> = (props) => {
  const { children } = props
  return <div>{children}</div>
}

export { Chip }
