import styles from './Input.module.scss'

export interface ControlledInput extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (s: string) => void
  className?: string
  placeholder?: string
}


export type IInput = ControlledInput

const Input: React.FC<IInput> = ({
  className = '',
  placeholder = '',
  value = '',
  onChange,
}) => {

  const presentationStyles = `
    ${styles.Input}
    ${className}
  `

  return <>
    <input
      type="text"
      className={presentationStyles}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </>
}

export { Input }
