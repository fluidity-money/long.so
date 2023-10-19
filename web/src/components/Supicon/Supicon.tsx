import { useEffect, useRef } from 'react'
import styles from './Supicon.module.scss'

interface ISupicon {
  seed: string
}

const Supicon: React.FC<ISupicon> = (props) => {

  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    buildSupicon(canvasRef.current)
  }, [canvasRef])
  return <div ref={canvasRef} className={styles.Supicon} />
}

export { Supicon }

// Constant declarations
const SQUARE = 20
const GRID = 7
const PADDING = SQUARE / 2
const FILL_CHANCE = 0.5
var SIZE = SQUARE * GRID + PADDING * 2

const setupCanvas = (c: HTMLCanvasElement) => {
  var ctx = c.getContext('2d')
  c.width = SIZE
  c.height = SIZE

  return ctx
}

const fillBlock = (x: number, y: number, color: string, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath()
  ctx.rect(
    PADDING + x * SQUARE,
    PADDING + y * SQUARE,
    SQUARE,
    SQUARE
  );
  ctx.fillStyle = color
  ctx.fill()
}

// canvas: HTMLCanvasElement;
// context: CanvasRenderingContext2D;

const generateIdenticon = (ctx: CanvasRenderingContext2D) => {
  // Fill canvas bg
  ctx.beginPath()
  ctx.rect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#ebebeb'
  ctx.fill()

  // Generate color
  var color = 'rgb(0,0,0)'

  // FILL THE SQUARES
  for (var x = 0; x < Math.ceil(GRID / 2); x++) {
    for (var y = 0; y < GRID; y++) {
      if (Math.random() < FILL_CHANCE) {
        fillBlock(x, y, color, ctx);

        // Fill rhs symmetrically
        if (x < Math.floor(GRID / 2)) {
          fillBlock((GRID - 1) - x, y, color, ctx)
        }
      }
    }
  }
}

const buildSupicon = (ref: HTMLElement) => {
  const canvas = document.createElement('canvas')
  const _canvas = setupCanvas(canvas)

  if (!_canvas) return

  ref.appendChild(canvas)

  generateIdenticon(_canvas);
}
