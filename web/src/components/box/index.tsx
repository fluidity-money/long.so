import { motion } from 'framer-motion'

interface IBox {
  children: React.ReactNode
}

const Box: React.FC<IBox> = ({ children }) => {
  return (
    <motion.div>
      {children}
    </motion.div>
  )
}

export default Box
