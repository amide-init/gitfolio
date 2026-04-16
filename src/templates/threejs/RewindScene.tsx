import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// One hex colour per slide — must match ACCENT in RewindSection
const SLIDE_HEX = [0x3b82f6, 0x8b5cf6, 0x06b6d4, 0xf59e0b, 0x10b981, 0xa78bfa]

export default function RewindScene({ slideIndex }: { slideIndex: number }) {
  const mountRef  = useRef<HTMLDivElement>(null)
  const slideRef  = useRef(slideIndex)

  useEffect(() => { slideRef.current = slideIndex }, [slideIndex])

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

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 100)
    camera.position.z = 14

    // ── Particle field ──────────────────────────────────────────
    const N   = 80
    const pos = new Float32Array(N * 3)
    const vel: [number, number][] = []
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 28
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
      vel.push([(Math.random() - 0.5) * 0.007, (Math.random() - 0.5) * 0.005])
    }
    const pGeo  = new THREE.BufferGeometry()
    const pAttr = new THREE.BufferAttribute(pos, 3)
    pAttr.setUsage(THREE.DynamicDrawUsage)
    pGeo.setAttribute('position', pAttr)
    const pMat = new THREE.PointsMaterial({ color: SLIDE_HEX[0], size: 0.07, transparent: true, opacity: 0.35 })
    scene.add(new THREE.Points(pGeo, pMat))

    // ── Connection lines ─────────────────────────────────────────
    const lPos  = new Float32Array(N * N * 6)
    const lGeo  = new THREE.BufferGeometry()
    const lAttr = new THREE.BufferAttribute(lPos, 3)
    lAttr.setUsage(THREE.DynamicDrawUsage)
    lGeo.setAttribute('position', lAttr)
    const lMat     = new THREE.LineBasicMaterial({ color: SLIDE_HEX[0], transparent: true, opacity: 0.08 })
    const lineSegs = new THREE.LineSegments(lGeo, lMat)
    scene.add(lineSegs)

    // ── Wireframe icosahedron (central 3-D element) ───────────────
    const icoGeo   = new THREE.IcosahedronGeometry(2.4, 1)
    const icoEdges = new THREE.EdgesGeometry(icoGeo)
    const icoMat   = new THREE.LineBasicMaterial({ color: SLIDE_HEX[0], transparent: true, opacity: 0.3 })
    const ico      = new THREE.LineSegments(icoEdges, icoMat)
    scene.add(ico)

    const innerGeo = new THREE.IcosahedronGeometry(1.9, 0)
    const innerMat = new THREE.MeshBasicMaterial({ color: SLIDE_HEX[0], transparent: true, opacity: 0.05 })
    const inner    = new THREE.Mesh(innerGeo, innerMat)
    scene.add(inner)

    // ── Colour lerp state ─────────────────────────────────────────
    const cur = new THREE.Color(SLIDE_HEX[0])
    const tgt = new THREE.Color(SLIDE_HEX[0])
    const CONNECT_DIST = 5
    let frameId: number

    const tick = () => {
      frameId = requestAnimationFrame(tick)

      const idx = Math.min(slideRef.current, SLIDE_HEX.length - 1)
      tgt.set(SLIDE_HEX[idx])
      cur.lerp(tgt, 0.025)

      pMat.color.copy(cur)
      lMat.color.copy(cur)
      icoMat.color.copy(cur)
      innerMat.color.copy(cur)

      // Move particles + wrap
      for (let i = 0; i < N; i++) {
        pos[i * 3]     += vel[i][0];  pos[i * 3 + 1] += vel[i][1]
        if (pos[i * 3]     >  14) pos[i * 3]     = -14
        if (pos[i * 3]     < -14) pos[i * 3]     =  14
        if (pos[i * 3 + 1] >   8) pos[i * 3 + 1] =  -8
        if (pos[i * 3 + 1] <  -8) pos[i * 3 + 1] =   8
      }
      pAttr.needsUpdate = true

      // Connection lines
      let li = 0
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pos[i * 3] - pos[j * 3]
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
          if (dx * dx + dy * dy < CONNECT_DIST * CONNECT_DIST) {
            lPos[li * 6]     = pos[i * 3];     lPos[li * 6 + 1] = pos[i * 3 + 1]; lPos[li * 6 + 2] = pos[i * 3 + 2]
            lPos[li * 6 + 3] = pos[j * 3];     lPos[li * 6 + 4] = pos[j * 3 + 1]; lPos[li * 6 + 5] = pos[j * 3 + 2]
            li++
          }
        }
      }
      lGeo.setDrawRange(0, li * 2)
      lAttr.needsUpdate = true

      // Rotate central geometry
      ico.rotation.y   += 0.003
      ico.rotation.x   += 0.0015
      inner.rotation.y  = ico.rotation.y
      inner.rotation.x  = ico.rotation.x

      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      ;[pGeo, lGeo, icoGeo, icoEdges, innerGeo].forEach(g => g.dispose())
      ;[pMat, lMat, icoMat, innerMat].forEach(m => m.dispose())
      renderer.dispose()
      try { mount.removeChild(renderer.domElement) } catch { /* already removed */ }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
