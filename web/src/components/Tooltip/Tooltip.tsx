import { HTMLAttributes } from 'react'
import styles from './Tooltip.module.scss'

export interface ITooltip extends HTMLAttributes<HTMLElement> {
  background?: 'light' | 'dark';
  cursor?: boolean
}

const Tooltip: React.FC<ITooltip> = (props) => {
  const { className = '', style={}, background = 'light', children } = props

  const tooltipClasses = `
    ${className}
    ${styles.Tooltip}
    ${styles[background]}
  `

  return (
    <div
      className={tooltipClasses}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip }
