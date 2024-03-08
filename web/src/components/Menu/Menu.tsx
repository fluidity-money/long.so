import { LayoutGroup, motion } from 'framer-motion'
import styles from './Menu.module.scss'
import { Box } from '../index'
import ArrowDownWhite from '@/assets/icons/arrow-down-white.svg'
import ArrowDown from '@/assets/icons/arrow-down.svg'
import ProToggle from '@/assets/icons/pro-toggle.svg'

interface IItem {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  groupId?: string
  background?: 'light' | 'dark'
  proToggle?: boolean
}

interface IMenu {
  children: React.ReactElement<IItem>[]
  background?: 'light' | 'dark'
  style?: 'primary' | 'secondary'
  id: string
}

const Item: React.FC<IItem> = (props) => {
  const {
    children,
    selected,
    onClick,
    groupId,
    background = 'light',
    proToggle,
  } = props

  const classes = `
    ${styles.Item}
    ${selected ? styles.selected : ''}
    ${styles[background]}
  `

  return (
    <motion.div
      className={`${classes} group  cursor-pointer rounded-md px-8 py-1 text-sm font-medium  ${proToggle ? 'w-28 transition-[width] hover:w-32' : ''}`}
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
      <div className={'flex flex-row items-center gap-2'}>
        {children}
        {proToggle && (
          <>
            <div className="group-hover:hidden">
              {selected ? (
                <ArrowDownWhite height={10} width={10} />
              ) : (
                <ArrowDown height={10} width={10} />
              )}
            </div>
            <div
              className={`hidden group-hover:inline-flex ${!selected ? 'invert' : ''}`}
            >
              <ProToggle height={20} width={35} />
            </div>
          </>
        )}
      </div>
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
