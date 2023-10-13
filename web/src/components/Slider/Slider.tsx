'use client'

import { motion, useDragControls, useMotionValue, useTransform } from 'framer-motion'
import styles from './Slider.module.scss'
import { useEffect, useRef, useState } from 'react'

interface ISlider {
  onSlideComplete: () => void
  children: React.ReactNode
  disabled?: boolean
}

const Slider: React.FC<ISlider> = ({
  children,
  onSlideComplete,
  disabled = false,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const dragControls = useDragControls()

  const [dragComplete, setDragComplete] = useState(false)
  const [width, setWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!containerRef.current) return
    setWidth(containerRef.current.offsetWidth)
  }, [containerRef])

  const arrowOpacity = useTransform(x, [0, (width || 0) - 64], [1, 0])

  return (
    <motion.div className={`${styles.SliderButton} ${disabled ? styles.disabled : ''}`} ref={containerRef} style={dragComplete ? { background: 'white' } : {}}>
      <motion.div
        className={styles.draggable}
        drag="x"
        style={{ x, cursor: 'grab' }}
        dragElastic={0.1}
        dragSnapToOrigin
        dragMomentum={false}
        dragConstraints={
          containerRef
        }
        onDragEnd={(event, info) => {
          if (!width) return
          if (info.offset.x >= width - 64) {
            setDragComplete(true)
            onSlideComplete()
          }
        }}
      >
        <div
          className={styles.track}

        />
        {
          !dragComplete &&
          <div className={styles.thumb}>
            <motion.div
              style={{ opacity: arrowOpacity }}
            >
              -&gt;
            </motion.div>
          </div>
        }
      </motion.div>
      <motion.div className={styles.content}>
        {children}
      </motion.div>
    </motion.div>
  )
}

export { Slider }
