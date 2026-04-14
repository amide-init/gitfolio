import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export interface BarDatum {
  label: string
  value: number
}

interface ThreeBarChartProps {
  data: BarDatum[]
  barColor?: number
  accentColor?: number
  height?: number
}

const EASE_DURATION = 1100 // ms

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function ThreeBarChart({
  data,
  barColor = 0x3b82f6,
  accentColor = 0x06b6d4,
  height = 260,
}: ThreeBarChartProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null)

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

    const n = data.length
    const barSpacing = 1.6
    const totalW = (n - 1) * barSpacing
    const cx = totalW / 2

    // Camera: slightly elevated isometric-ish view
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100)
    camera.position.set(cx, 4.5, 13)
    camera.lookAt(cx, 1.8, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0x0d1a3a, 5))
    const key = new THREE.DirectionalLight(0x3b82f6, 3)
    key.position.set(cx + 5, 10, 8)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x06b6d4, 1.5)
    fill.position.set(cx - 5, 4, -4)
    scene.add(fill)

    // Floor plane
    const floorGeo = new THREE.PlaneGeometry(totalW + 4, 6)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0d1220,
      transparent: true,
      opacity: 0.6,
      roughness: 1,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(cx, 0, 0)
    scene.add(floor)

    // Grid lines
    const gridHelper = new THREE.GridHelper(totalW + 4, n + 1, 0x1e3a5f, 0x1e3a5f)
    gridHelper.position.set(cx, 0.01, 0)
    scene.add(gridHelper)

    const maxValue = Math.max(...data.map((d) => d.value), 1)
    const MAX_BAR_H = 5

    type BarEntry = {
      mesh: THREE.Mesh
      mat: THREE.MeshStandardMaterial
      glow: THREE.Mesh
      glowMat: THREE.MeshBasicMaterial
      targetH: number
      index: number
    }
    const bars: BarEntry[] = []

    data.forEach((d, i) => {
      const targetH = (d.value / maxValue) * MAX_BAR_H

      // Main bar
      const geo = new THREE.BoxGeometry(0.9, 1, 0.9)
      const mat = new THREE.MeshStandardMaterial({
        color: barColor,
        emissive: new THREE.Color(barColor),
        emissiveIntensity: 0.12,
        roughness: 0.35,
        metalness: 0.4,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.scale.y = 0.001
      mesh.position.set(i * barSpacing, 0, 0)
      mesh.userData = { index: i }
      scene.add(mesh)

      // Outer glow shell (slightly larger, BackSide, additive)
      const glowGeo = new THREE.BoxGeometry(1.0, 1, 1.0)
      const glowMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      glow.scale.y = 0.001
      glow.position.set(i * barSpacing, 0, 0)
      scene.add(glow)

      bars.push({ mesh, mat, glow, glowMat, targetH, index: i })
    })

    // Raycaster for hover
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
      const progress = Math.min((ts - startTs) / EASE_DURATION, 1)
      const eased = easeOutCubic(progress)

      // Detect hovered bar
      raycaster.setFromCamera(mouse, camera)
      const meshes = bars.map((b) => b.mesh)
      const hits = raycaster.intersectObjects(meshes)
      const hoveredIdx = hits.length ? (hits[0].object.userData.index as number) : -1

      if (hoveredIdx >= 0) {
        const d = data[hoveredIdx]
        const pos3 = bars[hoveredIdx].mesh.position.clone()
        pos3.y = bars[hoveredIdx].mesh.scale.y * bars[hoveredIdx].targetH
        const projected = pos3.clone().project(camera)
        setTooltip({
          x: ((projected.x + 1) / 2) * w,
          y: ((-projected.y + 1) / 2) * h - 36,
          label: d.label,
          value: d.value,
        })
      } else {
        setTooltip(null)
      }

      bars.forEach(({ mesh, mat, glow, glowMat, targetH, index }) => {
        const currentH = Math.max(eased * targetH, 0.001)
        mesh.scale.y = currentH
        mesh.position.y = currentH / 2
        glow.scale.y = currentH
        glow.position.y = currentH / 2

        if (index === hoveredIdx) {
          mat.emissiveIntensity = 0.5
          mat.emissive.setHex(accentColor)
          glowMat.opacity = 0.18
        } else {
          mat.emissiveIntensity = 0.12
          mat.emissive.setHex(barColor)
          glowMat.opacity = 0
        }
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
  }, [data, barColor, accentColor])

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-blue-500/40 bg-[#050509]/95 px-3 py-1.5 text-xs shadow-lg shadow-blue-900/30 backdrop-blur-sm"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
        >
          <p className="font-semibold text-cyan-300">{tooltip.label}</p>
          <p className="text-slate-200">{tooltip.value.toLocaleString()}</p>
        </div>
      )}

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex px-[8%]">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-[10px] text-slate-500 truncate">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}
