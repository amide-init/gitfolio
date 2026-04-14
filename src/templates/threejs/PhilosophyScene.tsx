import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// One shape per card slot (cycles if more than 6 cards)
const SHAPES = ['tetrahedron', 'icosahedron', 'octahedron', 'torus', 'torusKnot', 'dodecahedron'] as const
type ShapeName = typeof SHAPES[number]

function buildGeometry(shape: ShapeName): THREE.BufferGeometry {
  switch (shape) {
    case 'tetrahedron':  return new THREE.TetrahedronGeometry(1.0)
    case 'icosahedron':  return new THREE.IcosahedronGeometry(0.92)
    case 'octahedron':   return new THREE.OctahedronGeometry(1.0)
    case 'torus':        return new THREE.TorusGeometry(0.72, 0.28, 14, 56)
    case 'torusKnot':    return new THREE.TorusKnotGeometry(0.58, 0.18, 90, 12)
    case 'dodecahedron': return new THREE.DodecahedronGeometry(0.95)
  }
}

const SHAPE_COLORS = [0x3b82f6, 0x8b5cf6, 0x06b6d4, 0x10b981, 0xf59e0b, 0xec4899]

interface PhilosophySceneProps {
  count: number
}

export default function PhilosophyScene({ count }: PhilosophySceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || count === 0) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
    camera.position.z = 9

    // Lights
    scene.add(new THREE.AmbientLight(0x0d1a3a, 5))
    const key = new THREE.PointLight(0x3b82f6, 50, 22)
    key.position.set(-4, 5, 7)
    scene.add(key)
    const fill = new THREE.PointLight(0x8b5cf6, 30, 18)
    fill.position.set(5, -3, 5)
    scene.add(fill)

    // ── Spread shape positions across the section ────────────────────────────
    // Arrange in a 2-col grid to mirror the card layout
    const cols = 2
    const rows = Math.ceil(count / cols)
    const xSpread = 4.5
    const ySpread = rows > 1 ? 2.8 : 0

    type ShapeEntry = {
      wire: THREE.LineSegments
      wireMat: THREE.LineBasicMaterial
      solid: THREE.Mesh
      solidMat: THREE.MeshStandardMaterial
      base: THREE.Vector3
      rotSpeed: THREE.Vector3
      phase: number
    }
    const entries: ShapeEntry[] = []

    for (let i = 0; i < count; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = (col / (cols - 1 || 1) - 0.5) * xSpread * 2
      const y = ((rows - 1 - row) / Math.max(rows - 1, 1) - 0.5) * ySpread * 2
      const base = new THREE.Vector3(x, y, 0)

      const shape = SHAPES[i % SHAPES.length]
      const color = SHAPE_COLORS[i % SHAPE_COLORS.length]
      const geo = buildGeometry(shape)

      // Wireframe
      const wireGeo = new THREE.WireframeGeometry(geo)
      const wireMat = new THREE.LineBasicMaterial({
        color, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const wire = new THREE.LineSegments(wireGeo, wireMat)
      wire.position.copy(base)
      scene.add(wire)

      // Transparent solid for depth
      const solidMat = new THREE.MeshStandardMaterial({
        color, emissive: new THREE.Color(color),
        emissiveIntensity: 0.12, transparent: true, opacity: 0.08,
        roughness: 0.3, metalness: 0.6,
      })
      const solid = new THREE.Mesh(geo, solidMat)
      solid.position.copy(base)
      scene.add(solid)

      // Outer glow halo
      const haloGeo = new THREE.SphereGeometry(1.4, 12, 12)
      const haloMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.04,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const halo = new THREE.Mesh(haloGeo, haloMat)
      halo.position.copy(base)
      scene.add(halo)

      entries.push({
        wire, wireMat, solid, solidMat, base,
        rotSpeed: new THREE.Vector3(
          0.18 + Math.random() * 0.12,
          0.24 + Math.random() * 0.14,
          0.08 + Math.random() * 0.06,
        ),
        phase: (i / count) * Math.PI * 2,
      })
    }

    // Faint connection lines between shapes
    const lineVerts: number[] = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = entries[i].base.distanceTo(entries[j].base)
        if (dist < 6) {
          lineVerts.push(...entries[i].base.toArray(), ...entries[j].base.toArray())
        }
      }
    }
    if (lineVerts.length) {
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3))
      scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
        color: 0x3b82f6, transparent: true, opacity: 0.07,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })))
    }

    // Background particles
    const PC = 55
    const pp = new Float32Array(PC * 3)
    for (let i = 0; i < PC; i++) {
      pp[i*3] = (Math.random() - 0.5) * 18; pp[i*3+1] = (Math.random() - 0.5) * 9; pp[i*3+2] = (Math.random() - 0.5) * 5 - 3
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.03, transparent: true, opacity: 0.3 })))

    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      entries.forEach(({ wire, wireMat, solid, solidMat, base, rotSpeed, phase }) => {
        wire.rotation.x = t * rotSpeed.x
        wire.rotation.y = t * rotSpeed.y
        wire.rotation.z = t * rotSpeed.z
        solid.rotation.copy(wire.rotation)

        // Gentle float
        const floatY = Math.sin(t * 0.55 + phase) * 0.12
        wire.position.y  = base.y + floatY
        solid.position.y = base.y + floatY

        // Breathing opacity
        wireMat.opacity  = 0.28 + Math.sin(t * 0.7 + phase) * 0.08
        solidMat.emissiveIntensity = 0.1 + Math.sin(t * 0.9 + phase) * 0.04
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose())
        else if (m.material) (m.material as THREE.Material).dispose()
      })
      renderer.dispose()
      try { mount.removeChild(renderer.domElement) } catch { /* already removed */ }
    }
  }, [count])

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
