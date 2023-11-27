import { ReactElement, ReactNode, useState } from 'react'
import styles from './Dropdown.module.scss'
import { Hoverable, Tooltip } from '@/components'
import { motion } from 'framer-motion'

interface IItem {
  children: ReactNode
  id: string
}

const Item: React.FC<IItem> = (props) => {
  const { children } = props
  return <div>
    {children}
  </div>
}

interface IDropdown {
  children: ReactElement<IItem>[]
  id: string
  label?: ReactNode
  initial: string
}

const Dropdown: React.FC<IDropdown> = (props) => {

  const { children, id, label, initial } = props

  const dropdownClasses = `
    ${styles.Dropdown}
  `

  const [selectedItem, setSelectedItem] = useState(initial)

  return (
    <div className={dropdownClasses}>
      {label}
      <Hoverable
        tooltip={
          <Tooltip
            layoutId={id}
          >
            {children}
          </Tooltip>
        }
      >
        <motion.div className={styles.selected} layoutId={id}>
        {
          children.find((child) => child.props.id === selectedItem) || 'test'
        }
        </motion.div>
      </Hoverable>
      {/* take a list of ReactElement<IItem> to render inside a tooltip */}
      {/* show tooltip conditionally based on dropdown element state */}
      {/* keep selected state uncontrolled in dropdown element */}
      {/* run a find (memo?) and render selected <Item> inline
        {/* use Hoverable? with shared layoutId and custom positioning */}
    </div>
  )
}

export default Object.assign(Dropdown, {
  Item
})
