import { useEffect, useRef } from 'react'

/**
 * Renders lightweight canvas-based floating particles that mimic
 * Minecraft XP-orb / firefly particles drifting upwards.
 */
export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }

    const COLORS = ['#8acd32', '#5CC0D0', '#FFAA00', '#ffff55']
    const COUNT = 28

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.2 + Math.random() * 0.4),
      size: 2 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    function draw() {
      animRef.current = requestAnimationFrame(draw)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.y < -10) {
          p.y = canvas!.height + 10
          p.x = Math.random() * canvas!.width
        }
        if (p.x < -10) p.x = canvas!.width + 10
        if (p.x > canvas!.width + 10) p.x = -10

        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = p.color

        // Draw pixelated square particle (Minecraft style)
        const s = Math.round(p.size)
        ctx!.fillRect(Math.round(p.x), Math.round(p.y), s, s)
      }

      ctx!.globalAlpha = 1
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  )
}
