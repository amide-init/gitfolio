import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type PhilosophyCardData = { title: string; body: string }

interface PhilosophySceneProps {
  cards: PhilosophyCardData[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

const FACE_ANGLES = [0, Math.PI, Math.PI / 2, -Math.PI / 2]
const MAX_TRUNCATION_LENGTH = 95
const CUBE_SIZE = 3
const CUBE_METALNESS = 0.5
const CUBE_ROUGHNESS = 0.34
const CUBE_OPACITY = 0.45
const CUBE_EMISSIVE_INTENSITY = 0.55
const FLOOR_RADIUS = 2.7
const FLOOR_SEGMENTS = 64
const FLOOR_OPACITY = 0.14
const FLOOR_Y = -2.25
const ROTATION_DAMPING = 0.1
const WAVE_SPEED = 0.6
const WAVE_INTENSITY = 0.05
const FLOAT_SPEED = 0.9
const FLOAT_INTENSITY = 0.06
const AUTO_ROTATION_INTERVAL_SECONDS = 3.8

function normalizeAngle(value: number): number {
  let angle = value
  while (angle > Math.PI) angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/)
  let line = ''
  let lines = 0
  let currentY = y
  let truncated = false

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      if (lines >= maxLines - 1) {
        truncated = true
        break
      }
      ctx.fillText(line, x, currentY)
      lines += 1
      currentY += lineHeight
      line = word
    } else {
      line = test
    }
  }

  if (line && lines < maxLines) {
    const clipTextByWidth = (value: string, width: number) => {
      let clipped = value
      while (clipped && ctx.measureText(`${clipped}…`).width > width) {
        clipped = clipped.slice(0, -1)
      }
      return clipped
    }
    const clippedLine = clipTextByWidth(line, maxWidth)
    const isLongLine = clippedLine.length < line.length || line.length > MAX_TRUNCATION_LENGTH
    const needsEllipsis = truncated || isLongLine
    const baseLine =
      clippedLine.length > MAX_TRUNCATION_LENGTH ? clippedLine.slice(0, MAX_TRUNCATION_LENGTH) : clippedLine
    const rendered = lines === maxLines - 1 && needsEllipsis ? `${baseLine}…` : baseLine
    ctx.fillText(rendered, x, currentY)
  }
}

function buildFaceTexture(card: PhilosophyCardData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#07142d')
  gradient.addColorStop(1, '#060e1e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Border
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
  ctx.lineWidth = 5
  ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56)

  const PAD = 80

  // Label
  ctx.fillStyle = 'rgba(125, 211, 252, 0.8)'
  ctx.font = '600 52px Inter, ui-sans-serif, system-ui'
  ctx.fillText('PRINCIPLE', PAD, 120)

  // Accent line under label
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(PAD, 148)
  ctx.lineTo(PAD + 180, 148)
  ctx.stroke()

  // Title — large, prominent
  ctx.fillStyle = '#f1f5f9'
  ctx.font = '700 98px Inter, ui-sans-serif, system-ui'
  wrapText(ctx, card.title, PAD, 280, canvas.width - PAD * 2, 114, 2)

  // Body — readable weight
  ctx.fillStyle = 'rgba(203, 213, 225, 0.88)'
  ctx.font = '400 64px Inter, ui-sans-serif, system-ui'
  wrapText(ctx, card.body, PAD, 470, canvas.width - PAD * 2, 82, 6)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export default function PhilosophyScene({ cards, activeIndex, onActiveIndexChange }: PhilosophySceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<THREE.Group | null>(null)
  const targetYRef = useRef(0)
  const onActiveChangeRef = useRef(onActiveIndexChange)
  const currentAutoFaceRef = useRef(0)
  const nextAutoSwitchAtRef = useRef(AUTO_ROTATION_INTERVAL_SECONDS)
  const elapsedTimeRef = useRef(0)

  useEffect(() => {
    onActiveChangeRef.current = onActiveIndexChange
  }, [onActiveIndexChange])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || cards.length === 0) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0.2, 7)

    scene.add(new THREE.AmbientLight(0x0f172a, 2.6))
    const keyLight = new THREE.PointLight(0x38bdf8, 45, 25)
    keyLight.position.set(4, 4, 7)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0x8b5cf6, 26, 18)
    fillLight.position.set(-5, -3, 4)
    scene.add(fillLight)

    const cube = new THREE.Group()
    scene.add(cube)
    cubeRef.current = cube
    currentAutoFaceRef.current = 0
    nextAutoSwitchAtRef.current = AUTO_ROTATION_INTERVAL_SECONDS

    const size = CUBE_SIZE
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshStandardMaterial({
        color: 0x040712,
        metalness: CUBE_METALNESS,
        roughness: CUBE_ROUGHNESS,
        transparent: true,
        opacity: CUBE_OPACITY,
        emissive: 0x0b1228,
        emissiveIntensity: CUBE_EMISSIVE_INTENSITY,
      }),
    )
    cube.add(body)
    cube.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.62 }),
      ),
    )

    const faceConfigs = [
      { position: new THREE.Vector3(0, 0, size / 2 + 0.02),  rotationY: 0 },
      { position: new THREE.Vector3(0, 0, -size / 2 - 0.02), rotationY: Math.PI },
      { position: new THREE.Vector3(-size / 2 - 0.02, 0, 0), rotationY: -Math.PI / 2 },
      { position: new THREE.Vector3(size / 2 + 0.02, 0, 0),  rotationY: Math.PI / 2 },
    ]

    const faceMaterials = cards.map((card) => (
      new THREE.MeshBasicMaterial({
        map: buildFaceTexture(card),
        transparent: false,
        side: THREE.FrontSide,
      })
    ))
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
    faceMaterials.forEach((material) => {
      if (material.map) {
        material.map.anisotropy = Math.min(8, maxAnisotropy)
      }
    })

    faceMaterials.forEach((material, index) => {
      const face = new THREE.Mesh(new THREE.PlaneGeometry(size * 0.9, size * 0.9), material)
      face.position.copy(faceConfigs[index].position)
      face.rotation.y = faceConfigs[index].rotationY
      cube.add(face)
    })

    cube.rotation.y = targetYRef.current

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(FLOOR_RADIUS, FLOOR_SEGMENTS),
      new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: FLOOR_OPACITY,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = FLOOR_Y
    scene.add(floor)

    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    const clock = new THREE.Clock()
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      elapsedTimeRef.current = elapsed
      if (elapsed >= nextAutoSwitchAtRef.current) {
        currentAutoFaceRef.current = (currentAutoFaceRef.current + 1) % FACE_ANGLES.length
        nextAutoSwitchAtRef.current = elapsed + AUTO_ROTATION_INTERVAL_SECONDS
        onActiveChangeRef.current(currentAutoFaceRef.current)
      }
      targetYRef.current = FACE_ANGLES[currentAutoFaceRef.current]

      const cubeGroup = cubeRef.current
      if (cubeGroup) {
        cubeGroup.rotation.y += normalizeAngle(targetYRef.current - cubeGroup.rotation.y) * ROTATION_DAMPING
        cubeGroup.rotation.x = Math.sin(elapsed * WAVE_SPEED) * WAVE_INTENSITY
        cubeGroup.position.y = Math.sin(elapsed * FLOAT_SPEED) * FLOAT_INTENSITY
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            const materialWithMap = material as THREE.MeshBasicMaterial
            if (materialWithMap.map) materialWithMap.map.dispose()
            material.dispose()
          })
        } else if (mesh.material) {
          const material = mesh.material as THREE.Material & { map?: THREE.Texture }
          if (material.map) material.map.dispose()
          material.dispose()
        }
      })

      renderer.dispose()
      try { mount.removeChild(renderer.domElement) } catch { /* ignore */ }
      cubeRef.current = null
    }
  }, [cards])

  useEffect(() => {
    currentAutoFaceRef.current = activeIndex
    targetYRef.current = FACE_ANGLES[activeIndex] ?? 0
    nextAutoSwitchAtRef.current = elapsedTimeRef.current + AUTO_ROTATION_INTERVAL_SECONDS
  }, [activeIndex])

  return (
    <div
      ref={mountRef}
      className="h-full w-full"
      aria-label="Interactive philosophy cube"
      role="img"
    />
  )
}
