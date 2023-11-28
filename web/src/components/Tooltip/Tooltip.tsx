import {ReactNode} from 'react'
import styles from './Tooltip.module.scss'

export interface ITooltip {
  children: ReactNode
  layoutId?: string
}

const Tooltip: React.FC<ITooltip> = (props) => {
  return <div>
  </div>
}

export { 
  Tooltip,
}
