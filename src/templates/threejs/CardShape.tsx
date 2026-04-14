import { useEffect, useRef } from 'react'

// 3D vertex/edge definitions
const SHAPES = {
  cube: {
    verts: [
      [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
      [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
    ],
    edges: [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7],
    ],
  },
  octahedron: {
    verts: [[0,1.2,0],[0,-1.2,0],[1.2,0,0],[-1.2,0,0],[0,0,1.2],[0,0,-1.2]],
    edges: [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]],
  },
  tetrahedron: {
    verts: [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],
    edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],
  },
  diamond: {
    verts: [[0,1.4,0],[0,-1.4,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]],
    edges: [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,5],[5,3],[3,4],[4,2]],
  },
  prism: {
    verts: [
      [0, 1.2, 0],
      [Math.cos(Math.PI*2/3)*1.1, -0.6, Math.sin(Math.PI*2/3)*1.1],
      [Math.cos(Math.PI*4/3)*1.1, -0.6, Math.sin(Math.PI*4/3)*1.1],
      [1.1, -0.6, 0],
      [0, 1.2, 0.6],
      [0, 1.2,-0.6],
    ],
    edges: [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]],
  },
  star: {
    verts: (() => {
      const v: number[][] = []
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        v.push([Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0])
        v.push([Math.cos(a + Math.PI / 6) * 0.5, Math.sin(a + Math.PI / 6) * 0.5, (i % 2 ? 0.7 : -0.7)])
      }
      return v
    })(),
    edges: (() => {
      const e: number[][] = []
      for (let i = 0; i < 12; i++) e.push([i, (i + 1) % 12], [i, (i + 2) % 12])
      return e
    })(),
  },
} as const

type ShapeKey = keyof typeof SHAPES

export const SHAPE_KEYS: ShapeKey[] = ['cube', 'octahedron', 'tetrahedron', 'diamond', 'prism', 'star']

// Rotate a point around X then Y axis
function rotate(v: readonly number[], rx: number, ry: number): [number, number, number] {
  let [x, y, z] = v
  // Rotate Y
  const x1 = x * Math.cos(ry) - z * Math.sin(ry)
  const z1 = x * Math.sin(ry) + z * Math.cos(ry)
  x = x1; z = z1
  // Rotate X
  const y2 = y * Math.cos(rx) - z * Math.sin(rx)
  const z2 = y * Math.sin(rx) + z * Math.cos(rx)
  return [x, y2, z2]
}

// Simple perspective project
function project(x: number, y: number, z: number, cx: number, cy: number, scale: number): [number, number, number] {
  const fov = 4
  const s = (fov / (fov + z)) * scale
  return [cx + x * s, cy - y * s, z]
}

interface CardShapeProps {
  index: number
  color: string   // e.g. "#3b82f6"
  size?: number
  isHovered?: boolean
}

export default function CardShape({ index, color, size = 80, isHovered = false }: CardShapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isHovRef = useRef(isHovered)

  useEffect(() => {
    isHovRef.current = isHovered
  }, [isHovered])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const shape = SHAPES[SHAPE_KEYS[index % SHAPE_KEYS.length]]
    const cx = size / 2
    const cy = size / 2
    const scale = size * 0.28

    let rx = 0.4
    let ry = 0
    let frameId: number

    const draw = () => {
      frameId = requestAnimationFrame(draw)
      const speed = isHovRef.current ? 0.022 : 0.007

      rx += speed * 0.6
      ry += speed

      ctx.clearRect(0, 0, size, size)

      // Project all vertices
      const projected = shape.verts.map((v) => {
        const [rx2, ry2, rz2] = rotate(v, rx, ry)
        return project(rx2, ry2, rz2, cx, cy, scale)
      })

      // Draw edges — depth-sorted by average Z
      const edgesWithZ = shape.edges.map(([a, b]) => ({
        a, b, z: (projected[a][2] + projected[b][2]) / 2,
      }))
      edgesWithZ.sort((x, y) => x.z - y.z)

      edgesWithZ.forEach(({ a, b, z }) => {
        const alpha = isHovRef.current
          ? 0.45 + (z + 1.4) * 0.15
          : 0.25 + (z + 1.4) * 0.08
        ctx.beginPath()
        ctx.moveTo(projected[a][0], projected[a][1])
        ctx.lineTo(projected[b][0], projected[b][1])
        ctx.strokeStyle = color
        ctx.globalAlpha = Math.max(0.08, Math.min(alpha, 0.9))
        ctx.lineWidth = isHovRef.current ? 1.3 : 0.9
        ctx.stroke()
      })

      // Vertex dots
      projected.forEach(([px, py, pz]) => {
        const r = isHovRef.current ? 1.6 : 1.0
        const a = isHovRef.current ? 0.8 : 0.45
        ctx.beginPath()
        ctx.arc(px, py, r * ((pz + 1.4) / 2.8 + 0.4), 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = a * ((pz + 1.4) / 2.8 + 0.3)
        ctx.fill()
      })

      ctx.globalAlpha = 1
    }

    frameId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameId)
  }, [index, color, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="pointer-events-none"
      aria-hidden="true"
    />
  )
}
