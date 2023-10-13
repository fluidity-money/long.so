import { LayoutGroup, motion } from 'framer-motion'
import styles from './Menu.module.scss'
import { Box, Text } from '..'

interface IItem {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  groupId?: string
}

interface IMenu {
  children: React.ReactElement<IItem>[]
  background?: 'light' | 'dark'
  style?: 'primary' | 'secondary'
  id: string
}

const Item: React.FC<IItem> = (props) => {
  const { children, selected, onClick, groupId } = props

  const classes = `
    ${styles.Item}
    ${selected ? styles.selected : ''}
  `

  return <motion.div
    className={classes}
    whileHover={{
      scale: !selected ? 1.05 : 1,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      }
    }}
    whileTap={{
      scale: !selected ? 0.95 : 1,
      y: 1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      }
    }}
    onClick={onClick}
  >
    {
      selected && <Box
        layoutId={groupId}
        background={'dark'}
        className={styles.virtualBox}
      />
    }
    {children}
  </motion.div>
}

const Menu: React.FC<IMenu> = (props) => {
  const { children, background = 'light', style = 'secondary', id } = props

  const classes = `
    ${styles.Menu}
    ${styles[background]}
    ${styles[style]}
  `

  const frameIsDark = (background === 'dark' && style === 'secondary') || (background === 'light' && style === 'primary')

  return <div className={classes}>
    <LayoutGroup id={id}>

      {children.map((item, i) => {
        return <Item {...item.props} groupId={id} key={`${id}-${i}`} />
      })}
    </LayoutGroup>
  </div>
}

export default Object.assign(Menu, {
  Item
})
