import { LayoutGroup, motion } from 'framer-motion'
import styles from './Menu.module.scss'
import { Box } from '../index'

interface IItem {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  groupId?: string
  background?: 'light' | 'dark'
}

interface IMenu {
  children: React.ReactElement<IItem>[]
  background?: 'light' | 'dark'
  style?: 'primary' | 'secondary'
  id: string
}

const Item: React.FC<IItem> = (props) => {
  const { children, selected, onClick, groupId, background = 'light' } = props

  const classes = `
    ${styles.Item}
    ${selected ? styles.selected : ''}
    ${styles[background]}
  `

  return (
    <motion.div
      className={`${classes} cursor-pointer rounded-md px-8 py-1 text-sm font-medium`}
      whileHover={{
        scale: !selected ? 1.05 : 1,
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      }}
      whileTap={{
        scale: !selected ? 0.95 : 1,
        y: 1,
        transition: {
          duration: 0.2,
          ease: 'easeInOut',
        },
      }}
      onClick={onClick}
    >
      {selected && (
        <Box
          layoutId={groupId}
          background={background}
          className={styles.virtualBox}
        />
      )}
      {children}
    </motion.div>
  )
}

const Menu: React.FC<IMenu> = (props) => {
  const { children, background = 'light', style = 'secondary', id } = props

  const frameColor =
    (background === 'light' && style === 'primary') ||
    (background === 'dark' && style === 'secondary')
      ? 'dark'
      : 'light'

  return (
    <div className="flex flex-row gap-1 rounded p-1">
      <LayoutGroup id={id}>
        {children.map((item, i) => {
          return (
            <Item
              {...item.props}
              groupId={id}
              key={`${id}-${i}`}
              background={frameColor}
            />
          )
        })}
      </LayoutGroup>
    </div>
  )
}

export default Object.assign(Menu, {
  Item,
})
