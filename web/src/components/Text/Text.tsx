interface IText {
  children: React.ReactNode
}

const Text: React.FC<IText> = (props) => {
  const { children } = props
  return (
    <span>{children}</span>
  )
}

export { Text }
