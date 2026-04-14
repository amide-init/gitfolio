import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x050509)
    mount.appendChild(renderer.domElement)

    // --- Scene & Camera ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050509)
    scene.fog = new THREE.FogExp2(0x050509, 0.025)

    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.8, 9)

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x1a2040, 2)
    scene.add(ambientLight)

    const bluePoint = new THREE.PointLight(0x3b82f6, 80, 30)
    bluePoint.position.set(-6, 4, -2)
    scene.add(bluePoint)

    const cyanPoint = new THREE.PointLight(0x06b6d4, 50, 25)
    cyanPoint.position.set(6, 3, 0)
    scene.add(cyanPoint)

    const purplePoint = new THREE.PointLight(0x8b5cf6, 30, 20)
    purplePoint.position.set(0, 5, -10)
    scene.add(purplePoint)

    // --- Floor grid ---
    const gridHelper = new THREE.GridHelper(60, 40, 0x1a2050, 0x0d0f1f)
    gridHelper.position.y = -1
    scene.add(gridHelper)

    // --- Star particles ---
    const starCount = 1200
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 60
      starPositions[i * 3 + 1] = Math.random() * 20 - 2
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.7 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // --- Floating panels (wireframe frames) ---
    const panelConfigs = [
      { w: 3.5, h: 2,   x: -4.5, y: 1.5,  z: -4,  ry: 0.3,  rx: 0.05 },
      { w: 2.5, h: 1.5, x:  3.8, y: 2.0,  z: -5,  ry: -0.35, rx: 0.0 },
      { w: 2,   h: 2.5, x: -2,   y: 0.8,  z: -7,  ry: 0.1,  rx: -0.05 },
      { w: 1.8, h: 1.2, x:  5.5, y: 0.5,  z: -3,  ry: -0.5, rx: 0.1 },
      { w: 3,   h: 1.8, x:  1,   y: 3.2,  z: -9,  ry: 0.0,  rx: 0.0 },
      { w: 1.2, h: 1.8, x: -7,   y: 0.5,  z: -2,  ry: 0.5,  rx: 0.0 },
    ]

    const panels: THREE.Group[] = []
    const panelMats: THREE.LineBasicMaterial[] = []

    panelConfigs.forEach((cfg) => {
      const group = new THREE.Group()
      group.position.set(cfg.x, cfg.y, cfg.z)
      group.rotation.x = cfg.rx
      group.rotation.y = cfg.ry

      // Outer border (bright)
      const borderGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(cfg.w, cfg.h))
      const borderMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.6 })
      panelMats.push(borderMat)
      const border = new THREE.LineSegments(borderGeo, borderMat)
      group.add(border)

      // Inner fill plane (subtle)
      const fillGeo = new THREE.PlaneGeometry(cfg.w - 0.06, cfg.h - 0.06)
      const fillMat = new THREE.MeshBasicMaterial({ color: 0x0d1a3a, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
      const fill = new THREE.Mesh(fillGeo, fillMat)
      fill.position.z = -0.01
      group.add(fill)

      // Horizontal scan-lines
      const lineCount = Math.floor(cfg.h / 0.25)
      for (let i = 0; i < lineCount; i++) {
        const y = -cfg.h / 2 + (i + 0.5) * (cfg.h / lineCount)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-cfg.w / 2 + 0.08, y, 0),
          new THREE.Vector3(cfg.w / 2 - 0.08, y, 0),
        ])
        const lineMat = new THREE.LineBasicMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.2 })
        group.add(new THREE.Line(lineGeo, lineMat))
      }

      scene.add(group)
      panels.push(group)
    })

    // --- Floating geometric shapes ---
    const shapes: THREE.Mesh[] = []
    const shapeConfigs = [
      { geo: new THREE.OctahedronGeometry(0.25), color: 0x3b82f6, x: -1.5, y: 3.5, z: -3 },
      { geo: new THREE.TetrahedronGeometry(0.2), color: 0x06b6d4, x: 2.5, y: 2.8, z: -2 },
      { geo: new THREE.IcosahedronGeometry(0.18), color: 0x8b5cf6, x: -3, y: 2, z: -1.5 },
      { geo: new THREE.OctahedronGeometry(0.15), color: 0x06b6d4, x: 4, y: 3.5, z: -4 },
    ]
    shapeConfigs.forEach(({ geo, color, x, y, z }) => {
      const mat = new THREE.MeshStandardMaterial({ color, wireframe: true, transparent: true, opacity: 0.7 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      scene.add(mesh)
      shapes.push(mesh)
    })

    // --- Mouse parallax ---
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // --- Resize ---
    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // --- Animation loop ---
    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.03
      targetY += (mouseY - targetY) * 0.03

      // Camera subtle sway + mouse parallax
      camera.position.x = targetX * 1.2
      camera.position.y = 1.8 + targetY * 0.5 + Math.sin(elapsed * 0.3) * 0.08
      camera.lookAt(0, 1, 0)

      // Rotate star field slowly
      stars.rotation.y = elapsed * 0.01

      // Animate floating panels
      panels.forEach((panel, i) => {
        panel.position.y = panelConfigs[i].y + Math.sin(elapsed * 0.4 + i * 1.2) * 0.12
        panel.rotation.y = panelConfigs[i].ry + Math.sin(elapsed * 0.2 + i) * 0.04
      })

      // Pulse panel border opacity
      panelMats.forEach((mat, i) => {
        mat.opacity = 0.4 + Math.sin(elapsed * 0.8 + i * 0.9) * 0.2
      })

      // Spin geometric shapes
      shapes.forEach((shape, i) => {
        shape.rotation.x = elapsed * (0.4 + i * 0.1)
        shape.rotation.y = elapsed * (0.3 + i * 0.15)
        shape.position.y = shapeConfigs[i].y + Math.sin(elapsed * 0.5 + i * 1.5) * 0.15
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      // Dispose all geometries and materials to prevent WebGL memory leaks
      starGeo.dispose()
      starMat.dispose()
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose())
        } else if (mesh.material) {
          ;(mesh.material as THREE.Material).dispose()
        }
      })

      renderer.dispose()
      try {
        mount.removeChild(renderer.domElement)
      } catch {
        // element may have already been removed from DOM
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />
}
