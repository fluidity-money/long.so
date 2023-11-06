import { useEffect, useRef } from 'react'
import styles from './Supicon.module.scss'
import { Md5 } from 'ts-md5'

// TODO: Get color variables from scss export.

// Constant declarations
const SQUARE = 20
const GRID = 7
const PADDING = SQUARE / 2
const SIZE = SQUARE * GRID + PADDING * 2
const N = (GRID * Math.ceil(GRID / 2))

interface ISupicon {
  seed: string
}

const Supicon: React.FC<ISupicon> = (props) => {

  const { seed } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return
  }, [canvasRef])

  const identifier = Md5.hashStr(seed)

  const hexToDecimal = (hex: string) => parseInt(hex, 16)

  const map: boolean[] = []

  for (var i = 0; i < N; i++) {
    map.push(hexToDecimal(identifier[i]) % 2 === 0)
  }

  useEffect(() => {
    if (!canvasRef.current) return

    buildSupicon(canvasRef.current, map)
  }, [canvasRef, map])

  return <canvas ref={canvasRef} className={styles.Supicon} />
}

export { Supicon }

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

const generateIdenticon = (ctx: CanvasRenderingContext2D, map: boolean[]) => {
  // Fill canvas bg
  ctx.beginPath()
  ctx.rect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#ebebeb'
  ctx.fill()

  // Generate color
  var color = '#1e1e1e'

  // FILL THE SQUARES
  for (var x = 0; x < Math.ceil(GRID / 2); x++) {
    for (var y = 0; y < GRID; y++) {
      if (map[x * GRID + y]) {
        fillBlock(x, y, color, ctx);

        // Fill rhs symmetrically
        if (x < Math.floor(GRID / 2)) {
          fillBlock((GRID - 1) - x, y, color, ctx)
        }
      }
    }
  }
}

const buildSupicon = (ref: HTMLElement, map: boolean[]) => {
  const canvas = document.createElement('canvas')
  const _canvas = setupCanvas(canvas)

  if (!_canvas) return

  ref.appendChild(canvas)

  generateIdenticon(_canvas, map);
}
