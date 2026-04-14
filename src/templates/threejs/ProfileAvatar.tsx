import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ProfileAvatarProps {
  avatarUrl?: string | null
}

export default function ProfileAvatar({ avatarUrl }: ProfileAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100)
    camera.position.z = 6.5

    // Lights
    scene.add(new THREE.AmbientLight(0x0d1a3a, 5))
    const blueLight = new THREE.PointLight(0x3b82f6, 60, 18)
    blueLight.position.set(-3, 4, 5)
    scene.add(blueLight)
    const cyanLight = new THREE.PointLight(0x06b6d4, 40, 14)
    cyanLight.position.set(4, -2, 4)
    scene.add(cyanLight)
    const purpleLight = new THREE.PointLight(0x8b5cf6, 20, 10)
    purpleLight.position.set(0, -4, -3)
    scene.add(purpleLight)

    const RADIUS = 1.45

    // ── Profile disc ─────────────────────────────────────────────────────────
    const discGroup = new THREE.Group()
    scene.add(discGroup)

    const discGeo = new THREE.CircleGeometry(RADIUS, 128)
    let discMat: THREE.MeshStandardMaterial

    if (avatarUrl) {
      const loader = new THREE.TextureLoader()
      const texture = loader.load(avatarUrl)
      texture.colorSpace = THREE.SRGBColorSpace
      discMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
      })
    } else {
      discMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.3,
      })
    }
    discGroup.add(new THREE.Mesh(discGeo, discMat))

    // Tight border ring
    const borderGeo = new THREE.TorusGeometry(RADIUS + 0.06, 0.045, 2, 128)
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.9,
    })
    discGroup.add(new THREE.Mesh(borderGeo, borderMat))

    // Inner glow halo behind disc
    const haloGeo = new THREE.CircleGeometry(RADIUS + 0.22, 64)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    halo.position.z = -0.02
    discGroup.add(halo)

    // ── Orbit ring 1 (tilted, blue) ───────────────────────────────────────────
    const R1 = RADIUS + 0.52
    const ring1Geo = new THREE.TorusGeometry(R1, 0.022, 2, 128)
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI * 0.18
    scene.add(ring1)

    // Orbiting dot on ring1
    const dot1Geo = new THREE.SphereGeometry(0.065, 16, 16)
    const dot1Mat = new THREE.MeshBasicMaterial({ color: 0x60a5fa })
    const dot1 = new THREE.Mesh(dot1Geo, dot1Mat)
    scene.add(dot1)

    // ── Orbit ring 2 (tilted other way, cyan) ────────────────────────────────
    const R2 = RADIUS + 0.9
    const ring2Geo = new THREE.TorusGeometry(R2, 0.016, 2, 128)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI * 0.38
    ring2.rotation.z = Math.PI * 0.12
    scene.add(ring2)

    // Orbiting dot on ring2
    const dot2Geo = new THREE.SphereGeometry(0.048, 16, 16)
    const dot2Mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    const dot2 = new THREE.Mesh(dot2Geo, dot2Mat)
    scene.add(dot2)

    // ── Floating particles ────────────────────────────────────────────────────
    const PCOUNT = 28
    const pPos = new Float32Array(PCOUNT * 3)
    const pAngles: number[] = []
    const pRadii: number[] = []
    const pSpeeds: number[] = []
    const pPhases: number[] = []

    for (let i = 0; i < PCOUNT; i++) {
      const angle = (i / PCOUNT) * Math.PI * 2 + Math.random() * 0.4
      const radius = RADIUS + 0.6 + Math.random() * 1.1
      pAngles.push(angle)
      pRadii.push(radius)
      pSpeeds.push((0.003 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1))
      pPhases.push(Math.random() * Math.PI * 2)
      pPos[i * 3]     = Math.cos(angle) * radius
      pPos[i * 3 + 1] = Math.sin(angle) * radius * 0.4
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.6
    }

    const pGeo = new THREE.BufferGeometry()
    const pAttr = new THREE.BufferAttribute(pPos, 3)
    pAttr.setUsage(THREE.DynamicDrawUsage)
    pGeo.setAttribute('position', pAttr)
    const pMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.042,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    // ── Mouse hover tilt ──────────────────────────────────────────────────────
    let hoverX = 0
    let hoverY = 0
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      hoverX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      hoverY = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    mount.addEventListener('mousemove', onMouseMove)

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

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Disc gently tilts toward cursor
      discGroup.rotation.y += (hoverX * 0.28 - discGroup.rotation.y) * 0.05
      discGroup.rotation.x += (-hoverY * 0.18 - discGroup.rotation.x) * 0.05

      // Subtle floating bob
      discGroup.position.y = Math.sin(t * 0.6) * 0.06

      // Border pulse
      borderMat.opacity = 0.7 + Math.sin(t * 1.2) * 0.2
      borderMat.color.setHSL(0.58 + Math.sin(t * 0.4) * 0.06, 0.9, 0.6)

      // Halo pulse
      haloMat.opacity = 0.18 + Math.sin(t * 0.8) * 0.08

      // Ring 1 rotation + orbit dot
      ring1.rotation.z = t * 0.45
      const a1 = t * 0.8
      dot1.position.x = Math.cos(a1) * R1
      dot1.position.y = Math.sin(a1) * R1 * Math.cos(ring1.rotation.x)
      dot1.position.z = Math.sin(a1) * R1 * Math.sin(ring1.rotation.x)

      // Ring 2 rotation + orbit dot
      ring2.rotation.z = -t * 0.32
      const a2 = -t * 0.55 + 1.2
      dot2.position.x = Math.cos(a2) * R2
      dot2.position.y =
        Math.sin(a2) * R2 * Math.cos(ring2.rotation.x) * Math.cos(ring2.rotation.z)
      dot2.position.z = Math.sin(a2) * R2 * Math.sin(ring2.rotation.x) * 0.5

      // Float particles
      for (let i = 0; i < PCOUNT; i++) {
        pAngles[i] += pSpeeds[i]
        pPos[i * 3]     = Math.cos(pAngles[i]) * pRadii[i]
        pPos[i * 3 + 1] = Math.sin(pAngles[i]) * pRadii[i] * 0.38 + Math.sin(t * 0.7 + pPhases[i]) * 0.1
        pPos[i * 3 + 2] = Math.cos(t * 0.5 + pPhases[i]) * 0.25
      }
      pAttr.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

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
  }, [avatarUrl])

  return <div ref={mountRef} className="w-full h-full" />
}
