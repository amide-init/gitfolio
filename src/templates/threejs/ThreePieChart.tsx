import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export interface PieDatum {
  label: string
  value: number
  percentage: number
}

interface ThreePieChartProps {
  data: PieDatum[]
  colors?: number[]
  height?: number
}

export const PIE_COLORS = [
  0x3b82f6, 0x10b981, 0xf59e0b, 0xef4444,
  0x8b5cf6, 0x06b6d4, 0xf97316, 0xec4899,
]

const ANIM_DURATION = 900

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function ThreePieChart({
  data,
  colors = PIE_COLORS,
  height = 260,
}: ThreePieChartProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; label: string; value: number; percentage: number
  } | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState(-1)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !data.length) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    camera.position.set(0, 7, 7)
    camera.lookAt(0, 0, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0x0d1a3a, 6))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(5, 10, 8)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x3b82f6, 1.2)
    fillLight.position.set(-5, 3, -5)
    scene.add(fillLight)

    const total = data.reduce((s, d) => s + d.value, 0)
    const RADIUS = 2.6
    const THICKNESS = 0.55
    const GAP_ANGLE = 0.025

    type SliceEntry = {
      mesh: THREE.Mesh
      mat: THREE.MeshStandardMaterial
      midAngle: number
      index: number
    }
    const slices: SliceEntry[] = []

    let currentAngle = -Math.PI / 2  // start at 12 o'clock

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2 - GAP_ANGLE
      const midAngle = currentAngle + sliceAngle / 2

      const geo = new THREE.CylinderGeometry(RADIUS, RADIUS, THICKNESS, 80, 1, false, currentAngle, sliceAngle)
      const col = colors[i % colors.length]
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: new THREE.Color(col),
        emissiveIntensity: 0.1,
        roughness: 0.3,
        metalness: 0.45,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.scale.set(1, 0.001, 1)   // animate scale.y 0 → 1
      mesh.userData = { index: i, midAngle }
      scene.add(mesh)

      slices.push({ mesh, mat, midAngle, index: i })
      currentAngle += sliceAngle + GAP_ANGLE
    })

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-99, -99)

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    mount.addEventListener('mousemove', onMouseMove)

    let frameId: number
    let startTs: number | null = null

    const animate = (ts: number) => {
      frameId = requestAnimationFrame(animate)
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / ANIM_DURATION, 1)
      const eased = easeOutCubic(progress)

      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(slices.map((s) => s.mesh))
      const hovered = hits.length ? (hits[0].object.userData.index as number) : -1

      if (hovered >= 0) {
        const d = data[hovered]
        const mid = slices[hovered].midAngle
        const proj = new THREE.Vector3(
          Math.cos(mid) * RADIUS * 0.55,
          THICKNESS * 0.5,
          Math.sin(mid) * RADIUS * 0.55,
        ).project(camera)
        setTooltip({
          x: ((proj.x + 1) / 2) * w,
          y: ((-proj.y + 1) / 2) * h - 40,
          label: d.label,
          value: d.value,
          percentage: d.percentage,
        })
        setHoveredIdx(hovered)
      } else {
        setTooltip(null)
        setHoveredIdx(-1)
      }

      slices.forEach(({ mesh, mat, midAngle, index }) => {
        // Grow animation
        mesh.scale.y = eased

        // Pop hovered slice outward
        const POP = 0.38
        const tx = index === hovered ? Math.cos(midAngle) * POP : 0
        const tz = index === hovered ? Math.sin(midAngle) * POP : 0
        mesh.position.x += (tx - mesh.position.x) * 0.14
        mesh.position.z += (tz - mesh.position.z) * 0.14

        mat.emissiveIntensity = index === hovered ? 0.45 : 0.1
      })

      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(animate)

    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose())
        else if (mesh.material) (mesh.material as THREE.Material).dispose()
      })
      renderer.dispose()
      try { mount.removeChild(renderer.domElement) } catch { /* already removed */ }
    }
  }, [data, colors])

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-blue-500/40 bg-[#050509]/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
        >
          <p className="font-semibold text-blue-300">{tooltip.label}</p>
          <p className="text-slate-200">{tooltip.value} repos · {tooltip.percentage}%</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-x-3 gap-y-1 px-2 pb-1">
        {data.slice(0, 8).map((d, i) => (
          <div
            key={d.label}
            className={`flex items-center gap-1 text-[10px] transition-opacity ${
              hoveredIdx >= 0 && hoveredIdx !== i ? 'opacity-30' : 'opacity-100'
            }`}
          >
            <span
              className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: `#${(colors[i % colors.length]).toString(16).padStart(6, '0')}` }}
            />
            <span className="max-w-[64px] truncate text-slate-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
