import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type Repo = {
  name: string
  description: string
  url: string
  stars: number
  language?: string | null
  topics?: string[]
  lastUpdated?: string
  featured?: boolean
}

// Language → hex colour
const LANG_COLOR: Record<string, number> = {
  TypeScript: 0x3178c6, JavaScript: 0xf7df1e, Python: 0x3572a5,
  Rust: 0xdea584, Go: 0x00add8, Java: 0xb07219, 'C++': 0xf34b7d,
  'C#': 0x178600, Ruby: 0x701516, PHP: 0x4f5d95, Swift: 0xf05138,
  Kotlin: 0xa97bff, Dart: 0x00b4ab, Vue: 0x41b883, HTML: 0xe34c26,
  CSS: 0x563d7c, Shell: 0x89e051, Lua: 0x000080,
}

function langColor(lang?: string | null): number {
  return lang ? (LANG_COLOR[lang] ?? 0x3b82f6) : 0x3b82f6
}

function makeLabel(name: string, stars: number): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 76
  const ctx = canvas.getContext('2d')!

  // Pill background
  ctx.clearRect(0, 0, 320, 76)
  ctx.fillStyle = 'rgba(5,5,15,0.82)'
  const r = 14
  ctx.beginPath()
  ctx.moveTo(6 + r, 6); ctx.lineTo(314 - r, 6)
  ctx.quadraticCurveTo(314, 6, 314, 6 + r)
  ctx.lineTo(314, 70 - r)
  ctx.quadraticCurveTo(314, 70, 314 - r, 70)
  ctx.lineTo(6 + r, 70)
  ctx.quadraticCurveTo(6, 70, 6, 70 - r)
  ctx.lineTo(6, 6 + r)
  ctx.quadraticCurveTo(6, 6, 6 + r, 6)
  ctx.closePath()
  ctx.fill()

  // Border
  ctx.strokeStyle = 'rgba(59,130,246,0.55)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Name
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 22px system-ui,-apple-system,sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(name, 160, 34, 290)

  // Stars
  ctx.fillStyle = '#f59e0b'
  ctx.font = '16px system-ui'
  ctx.fillText(`★ ${stars}`, 160, 56)

  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(3.0, 0.72, 1)
  return sprite
}

interface RepoGraphProps {
  repos: Repo[]
}

export default function RepoGraph({ repos }: RepoGraphProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<Repo | null>(null)
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 })
  const hoveredIdxRef = useRef(-1)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !repos.length) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 2.5, 10)
    camera.lookAt(0, 0, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0x0d1a3a, 6))
    const key = new THREE.PointLight(0x3b82f6, 60, 28)
    key.position.set(-5, 7, 9)
    scene.add(key)
    const fill = new THREE.PointLight(0x06b6d4, 35, 22)
    fill.position.set(6, -3, 6)
    scene.add(fill)

    // ── Node positions ────────────────────────────────────────────────────────
    const featured = repos.filter((r) => r.featured)
    const others   = repos.filter((r) => !r.featured)
    const ordered  = [...featured, ...others]
    const maxStars = Math.max(...ordered.map((r) => r.stars), 1)

    const basePositions: THREE.Vector3[] = []

    // Featured: tight inner ring
    featured.forEach((_, i) => {
      const angle = (i / Math.max(featured.length, 1)) * Math.PI * 2
      const r = featured.length === 1 ? 0 : 1.8
      basePositions.push(new THREE.Vector3(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 0.8,
        Math.sin(angle) * r * 0.45,
      ))
    })

    // Others: outer ring(s)
    others.forEach((_, i) => {
      const angle = (i / others.length) * Math.PI * 2 + Math.PI / others.length
      const r = 3.4 + (i % 2) * 0.75
      basePositions.push(new THREE.Vector3(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 1.6,
        Math.sin(angle) * r * 0.45,
      ))
    })

    // ── Nodes ─────────────────────────────────────────────────────────────────
    type NodeEntry = { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; haloMat: THREE.MeshBasicMaterial; repo: Repo; idx: number }
    const nodes: NodeEntry[] = []

    ordered.forEach((repo, i) => {
      const radius = 0.14 + (repo.stars / maxStars) * 0.22
      const col = langColor(repo.language)

      const geo = new THREE.SphereGeometry(radius, 32, 32)
      const mat = new THREE.MeshStandardMaterial({
        color: col, emissive: new THREE.Color(col),
        emissiveIntensity: 0.22, roughness: 0.25, metalness: 0.55,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(basePositions[i])
      mesh.userData = { idx: i }
      scene.add(mesh)

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(radius * 1.75, 16, 16)
      const haloMat = new THREE.MeshBasicMaterial({
        color: col, transparent: true, opacity: 0.07,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      scene.add(new THREE.Mesh(haloGeo, haloMat))
      scene.children[scene.children.length - 1].position.copy(basePositions[i])

      // Featured ring
      if (repo.featured) {
        const ringGeo = new THREE.TorusGeometry(radius * 2.0, 0.016, 2, 64)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.75 })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.position.copy(basePositions[i])
        ring.rotation.x = Math.PI / 2
        scene.add(ring)
      }

      // Label
      const label = makeLabel(repo.name, repo.stars)
      label.position.set(basePositions[i].x, basePositions[i].y + radius + 0.52, basePositions[i].z)
      scene.add(label)

      nodes.push({ mesh, mat, haloMat, repo, idx: i })
    })

    // ── Connection lines ──────────────────────────────────────────────────────
    const lineVerts: number[] = []

    // Same-language connections
    for (let i = 0; i < ordered.length; i++) {
      for (let j = i + 1; j < ordered.length; j++) {
        if (ordered[i].language && ordered[i].language === ordered[j].language) {
          lineVerts.push(...basePositions[i].toArray(), ...basePositions[j].toArray())
        }
      }
    }
    // Featured → first 3 others
    featured.forEach((_, fi) => {
      others.slice(0, 3).forEach((_, oi) => {
        lineVerts.push(...basePositions[fi].toArray(), ...basePositions[featured.length + oi].toArray())
      })
    })

    if (lineVerts.length) {
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3))
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3b82f6, transparent: true, opacity: 0.14,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      scene.add(new THREE.LineSegments(lineGeo, lineMat))
    }

    // ── Ambient particles ─────────────────────────────────────────────────────
    const PC = 70
    const pp = new Float32Array(PC * 3)
    for (let i = 0; i < PC; i++) {
      pp[i * 3]     = (Math.random() - 0.5) * 18
      pp[i * 3 + 1] = (Math.random() - 0.5) * 9
      pp[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.032, transparent: true, opacity: 0.35 })))

    // ── Orbit / drag ──────────────────────────────────────────────────────────
    let orbitY = 0, orbitX = 0
    let autoRotate = true
    let isDragging = false, prevDX = 0, prevDY = 0
    const mouse = new THREE.Vector2(-99, -99)
    const raycaster = new THREE.Raycaster()

    const onDown = (e: MouseEvent) => { isDragging = true; autoRotate = false; prevDX = e.clientX; prevDY = e.clientY }
    const onUp   = () => { isDragging = false; setTimeout(() => { autoRotate = true }, 2200) }
    const onMove = (e: MouseEvent) => {
      if (isDragging) {
        orbitY += (e.clientX - prevDX) * 0.005
        orbitX = Math.max(-0.55, Math.min(0.55, orbitX + (e.clientY - prevDY) * 0.003))
        prevDX = e.clientX; prevDY = e.clientY
      }
      const rect = mount.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
    }
    const onClick = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      const cm = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        -((e.clientY - rect.top)  / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(cm, camera)
      const hits = raycaster.intersectObjects(nodes.map((n) => n.mesh))
      if (hits.length) window.open(ordered[hits[0].object.userData.idx as number].url, '_blank', 'noreferrer')
    }

    mount.addEventListener('mousedown', onDown)
    mount.addEventListener('click', onClick)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)

    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation loop ────────────────────────────────────────────────────────
    let frameId: number
    const clock = new THREE.Clock()
    let lastHoverCheck = 0
    const tmpScale = new THREE.Vector3()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (autoRotate) orbitY += 0.0025

      const dist = 10
      camera.position.x = Math.sin(orbitY) * dist
      camera.position.z = Math.cos(orbitY) * dist
      camera.position.y = 2.5 + orbitX * 5
      camera.lookAt(0, 0, 0)

      // Throttled hover detection
      if (t - lastHoverCheck > 0.045) {
        lastHoverCheck = t
        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObjects(nodes.map((n) => n.mesh))
        const newIdx = hits.length ? (hits[0].object.userData.idx as number) : -1

        if (newIdx !== hoveredIdxRef.current) {
          hoveredIdxRef.current = newIdx
          if (newIdx >= 0) {
            const proj = nodes[newIdx].mesh.position.clone().project(camera)
            setTipPos({
              x: ((proj.x + 1) / 2) * mount.clientWidth,
              y: ((-proj.y + 1) / 2) * mount.clientHeight,
            })
            setHovered(ordered[newIdx])
          } else {
            setHovered(null)
          }
        }
      }

      // Node update
      nodes.forEach(({ mesh, mat, haloMat, idx }) => {
        const isHov = idx === hoveredIdxRef.current
        mesh.position.y = basePositions[idx].y + Math.sin(t * 0.55 + idx * 1.1) * 0.07
        mat.emissiveIntensity = isHov ? 0.85 : 0.18 + Math.sin(t * 1.1 + idx * 0.9) * 0.07
        haloMat.opacity = isHov ? 0.2 : 0.07
        const ts = isHov ? 1.45 : 1.0
        mesh.scale.lerp(tmpScale.set(ts, ts, ts), 0.12)
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener('mousedown', onDown)
      mount.removeEventListener('click', onClick)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
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
  }, [repos])

  return (
    <div className="relative w-full rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/60 to-[#080c18]/60 overflow-hidden" style={{ height: 480 }}>
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Hover card */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-20 w-64 rounded-xl border border-blue-500/40 bg-[#050509]/96 p-3.5 text-sm shadow-2xl shadow-blue-900/40 backdrop-blur-md"
          style={{ left: tipPos.x, top: tipPos.y, transform: 'translate(-50%, -110%)' }}
        >
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h4 className="font-semibold text-slate-100 leading-tight">{hovered.name}</h4>
            {hovered.featured && (
              <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                Featured
              </span>
            )}
          </div>
          {hovered.description && (
            <p className="mb-2 text-[12px] leading-relaxed text-slate-400">{hovered.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-amber-400">★ {hovered.stars}</span>
            {hovered.language && (
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-blue-300">
                {hovered.language}
              </span>
            )}
          </div>
          {hovered.topics && hovered.topics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {hovered.topics.slice(0, 4).map((t) => (
                <span key={t} className="rounded-full border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-400">
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-[10px] text-slate-600">Click node to open on GitHub →</p>
        </div>
      )}

      {/* Controls hint */}
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-3 text-[10px] text-slate-600">
        <span>Drag to rotate</span>
        <span>·</span>
        <span>Hover node for details</span>
        <span>·</span>
        <span>Click to open repo</span>
      </div>
    </div>
  )
}
