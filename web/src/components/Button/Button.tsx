interface IButton {
  children: React.ReactNode
}

const Button: React.FC<IButton> = (props) => {
  const { children } = props
  return <button>{children}</button>
}

export { Button }
