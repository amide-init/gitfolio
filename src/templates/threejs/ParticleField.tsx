import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  color?: number
  opacity?: number
}

export default function ParticleField({ count = 50, color = 0x3b82f6, opacity = 0.5 }: ParticleFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(1)
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 100)
    camera.position.z = 14

    // Particle positions and velocities
    const positions = new Float32Array(count * 3)
    const velocities: [number, number][] = []

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      velocities.push([
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.006,
      ])
    }

    const dotGeo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(positions, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    dotGeo.setAttribute('position', posAttr)
    const dotMat = new THREE.PointsMaterial({ color, size: 0.07, transparent: true, opacity })
    const dots = new THREE.Points(dotGeo, dotMat)
    scene.add(dots)

    // Line segments for connections
    const MAX_LINE_PAIRS = count * count
    const linePositions = new Float32Array(MAX_LINE_PAIRS * 6)
    const lineGeo = new THREE.BufferGeometry()
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3)
    linePosAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', linePosAttr)
    const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: opacity * 0.3 })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    const CONNECT_DIST = 5
    let frameId: number

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      // Move particles
      for (let i = 0; i < count; i++) {
        positions[i * 3]     += velocities[i][0]
        positions[i * 3 + 1] += velocities[i][1]
        if (positions[i * 3]     >  11) positions[i * 3]     = -11
        if (positions[i * 3]     < -11) positions[i * 3]     =  11
        if (positions[i * 3 + 1] >   6) positions[i * 3 + 1] =  -6
        if (positions[i * 3 + 1] <  -6) positions[i * 3 + 1] =   6
      }
      posAttr.needsUpdate = true

      // Draw connection lines
      let li = 0
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = positions[i * 3]     - positions[j * 3]
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
          if (dx * dx + dy * dy < CONNECT_DIST * CONNECT_DIST) {
            linePositions[li * 6]     = positions[i * 3]
            linePositions[li * 6 + 1] = positions[i * 3 + 1]
            linePositions[li * 6 + 2] = positions[i * 3 + 2]
            linePositions[li * 6 + 3] = positions[j * 3]
            linePositions[li * 6 + 4] = positions[j * 3 + 1]
            linePositions[li * 6 + 5] = positions[j * 3 + 2]
            li++
          }
        }
      }
      lineGeo.setDrawRange(0, li * 2)
      linePosAttr.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      dotGeo.dispose()
      dotMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
      try { mount.removeChild(renderer.domElement) } catch { /* already removed */ }
    }
  }, [count, color, opacity])

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
