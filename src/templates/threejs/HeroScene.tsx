import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const GLOBE_R = 2.2
// Milliseconds of inactivity after drag before auto-rotation resumes
const AUTO_ROTATE_RESUME_DELAY = 2500
// Maximum vertical tilt (radians) to prevent the globe from flipping upside-down
const MAX_TILT = Math.PI * 0.45
// Approximate degree threshold below which an arc target is considered "too close"
// to the developer's pin and is skipped (≈8° lat / 12° lng ≈ ~800-1200 km proximity)
const ARC_SKIP_LAT_DEG = 8
const ARC_SKIP_LNG_DEG = 12

// Convert geographic coordinates to a 3D point on a sphere
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

// Lookup table: location string fragment → [lat, lng]
const LOCATION_LOOKUP: Record<string, [number, number]> = {
  'new york': [40.71, -74.01],
  'los angeles': [34.05, -118.24],
  'san francisco': [37.77, -122.42],
  'chicago': [41.88, -87.63],
  'seattle': [47.61, -122.33],
  'austin': [30.27, -97.74],
  'boston': [42.36, -71.06],
  'toronto': [43.65, -79.38],
  'vancouver': [49.28, -123.12],
  'montreal': [45.50, -73.57],
  'london': [51.51, -0.13],
  'paris': [48.85, 2.35],
  'berlin': [52.52, 13.41],
  'amsterdam': [52.37, 4.90],
  'stockholm': [59.33, 18.07],
  'copenhagen': [55.68, 12.57],
  'oslo': [59.91, 10.75],
  'helsinki': [60.17, 24.93],
  'zurich': [47.38, 8.54],
  'vienna': [48.21, 16.37],
  'rome': [41.90, 12.50],
  'madrid': [40.42, -3.70],
  'lisbon': [38.72, -9.14],
  'barcelona': [41.39, 2.15],
  'brussels': [50.85, 4.35],
  'warsaw': [52.23, 21.01],
  'prague': [50.08, 14.44],
  'budapest': [47.50, 19.05],
  'kyiv': [50.45, 30.52],
  'moscow': [55.75, 37.62],
  'istanbul': [41.01, 28.96],
  'dubai': [25.20, 55.27],
  'tel aviv': [32.08, 34.78],
  'delhi': [28.67, 77.22],
  'mumbai': [19.08, 72.88],
  'bangalore': [12.97, 77.59],
  'hyderabad': [17.39, 78.49],
  'pune': [18.52, 73.86],
  'chennai': [13.08, 80.27],
  'kolkata': [22.57, 88.36],
  'karachi': [24.86, 67.01],
  'lahore': [31.55, 74.34],
  'beijing': [39.91, 116.39],
  'shanghai': [31.23, 121.47],
  'shenzhen': [22.54, 114.06],
  'guangzhou': [23.13, 113.26],
  'chengdu': [30.57, 104.07],
  'tokyo': [35.68, 139.69],
  'osaka': [34.69, 135.50],
  'seoul': [37.57, 127.00],
  'singapore': [1.29, 103.85],
  'jakarta': [-6.21, 106.85],
  'bangkok': [13.75, 100.52],
  'ho chi minh': [10.82, 106.63],
  'hanoi': [21.03, 105.83],
  'kuala lumpur': [3.14, 101.69],
  'manila': [14.60, 120.98],
  'taipei': [25.05, 121.56],
  'hong kong': [22.32, 114.17],
  'sydney': [-33.87, 151.21],
  'melbourne': [-37.81, 144.96],
  'brisbane': [-27.47, 153.02],
  'perth': [-31.95, 115.86],
  'auckland': [-36.86, 174.76],
  'nairobi': [-1.29, 36.82],
  'lagos': [6.46, 3.39],
  'cairo': [30.04, 31.24],
  'johannesburg': [-26.20, 28.05],
  'accra': [5.56, -0.20],
  'sao paulo': [-23.55, -46.63],
  'rio de janeiro': [-22.91, -43.17],
  'buenos aires': [-34.60, -58.44],
  'bogota': [4.71, -74.07],
  'lima': [-12.05, -77.04],
  'santiago': [-33.45, -70.67],
  'mexico city': [19.43, -99.13],
  'usa': [37.09, -95.71],
  'united states': [37.09, -95.71],
  'us': [37.09, -95.71],
  'uk': [54.0, -2.0],
  'united kingdom': [54.0, -2.0],
  'india': [20.59, 78.96],
  'china': [35.86, 104.20],
  'japan': [36.20, 138.25],
  'germany': [51.17, 10.45],
  'france': [46.23, 2.21],
  'canada': [56.13, -106.35],
  'australia': [-25.27, 133.78],
  'brazil': [-14.24, -51.93],
  'russia': [61.52, 105.32],
  'south korea': [35.91, 127.77],
  'indonesia': [-0.79, 113.92],
  'pakistan': [30.38, 69.35],
  'turkey': [38.96, 35.24],
  'spain': [40.46, -3.75],
  'italy': [41.87, 12.57],
  'netherlands': [52.13, 5.29],
  'poland': [51.92, 19.15],
  'sweden': [60.13, 18.64],
  'norway': [60.47, 8.47],
  'denmark': [56.26, 9.50],
  'finland': [61.92, 25.75],
  'switzerland': [46.82, 8.23],
  'portugal': [39.40, -8.22],
  'ukraine': [48.38, 31.17],
  'argentina': [-38.42, -63.62],
  'mexico': [23.63, -102.55],
  'south africa': [-30.56, 22.94],
  'nigeria': [9.08, 8.68],
  'egypt': [26.82, 30.80],
  'new zealand': [-40.90, 174.89],
  'israel': [31.05, 34.85],
  'malaysia': [4.21, 101.98],
  'philippines': [12.88, 121.77],
  'thailand': [15.87, 100.99],
  'vietnam': [14.06, 108.28],
  'colombia': [4.57, -74.30],
  'kenya': [-0.02, 37.91],
  'ethiopia': [9.15, 40.49],
  'ghana': [7.95, -1.02],
  'morocco': [31.79, -7.09],
  'greece': [39.07, 21.82],
  'romania': [45.94, 24.97],
}

// Pre-sorted descending by key length so longer names match before shorter substrings
// (e.g. "new york" matches before "york")
const SORTED_LOCATION_ENTRIES = Object.entries(LOCATION_LOOKUP).sort((a, b) => b[0].length - a[0].length)

function parseLocationCoords(location: string | null | undefined): [number, number] {
  if (!location) return [37.09, -95.71]
  const lower = location.toLowerCase()
  for (const [key, coords] of SORTED_LOCATION_ENTRIES) {
    if (lower.includes(key)) return coords
  }
  return [37.09, -95.71]
}

interface HeroSceneProps {
  location?: string | null
}

export default function HeroScene({ location }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [grabbing, setGrabbing] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const [pinLat, pinLng] = parseLocationCoords(location)
    const isMobile = mount.clientWidth < 768

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x050509)
    mount.appendChild(renderer.domElement)

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050509)

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200)
    camera.position.set(-1.5, 0.5, 8.5)
    camera.lookAt(1.5, 0, 0)

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0d1a3a, 4))

    const blueLight = new THREE.PointLight(0x3b82f6, 80, 25)
    blueLight.position.set(-2, 4, 5)
    scene.add(blueLight)

    const cyanLight = new THREE.PointLight(0x06b6d4, 50, 20)
    cyanLight.position.set(6, 1, 4)
    scene.add(cyanLight)

    const purpleLight = new THREE.PointLight(0x8b5cf6, 25, 15)
    purpleLight.position.set(3, -3, -3)
    scene.add(purpleLight)

    // ── Stars ─────────────────────────────────────────────────────────────────
    const starCount = isMobile ? 800 : 1500
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 120
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 120
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 120
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.65 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ── Globe group (all globe elements rotate together) ──────────────────────
    const globeGroup = new THREE.Group()
    globeGroup.position.set(2.8, 0, 0)
    scene.add(globeGroup)

    // Set initial rotation so the pin location faces roughly toward the camera
    const thetaPin = (pinLng + 180) * (Math.PI / 180)
    globeGroup.rotation.y = thetaPin - Math.PI / 2
    globeGroup.rotation.x = -pinLat * (Math.PI / 180) * 0.4

    // Globe body
    const bodyGeo = new THREE.SphereGeometry(GLOBE_R, 64, 64)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x060d1f,
      emissive: 0x091530,
      emissiveIntensity: 0.5,
      roughness: 0.85,
      metalness: 0.1,
    })
    globeGroup.add(new THREE.Mesh(bodyGeo, bodyMat))

    // ── Lat / Lng grid lines ──────────────────────────────────────────────────
    const LAT_LINES = [-60, -30, 0, 30, 60]
    LAT_LINES.forEach((lat) => {
      const pts: THREE.Vector3[] = []
      const latRad = lat * (Math.PI / 180)
      const cr = GLOBE_R * Math.cos(latRad)
      const y = GLOBE_R * Math.sin(latRad)
      for (let i = 0; i <= 128; i++) {
        const t = (i / 128) * Math.PI * 2
        pts.push(new THREE.Vector3(cr * Math.cos(t), y, cr * Math.sin(t)))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({
        color: lat === 0 ? 0x2563eb : 0x1e3a6e,
        transparent: true,
        opacity: lat === 0 ? 0.55 : 0.28,
      })
      globeGroup.add(new THREE.Line(geo, mat))
    })

    for (let lng = 0; lng < 360; lng += 30) {
      const pts: THREE.Vector3[] = []
      const lngRad = (lng + 180) * (Math.PI / 180)
      for (let i = 0; i <= 64; i++) {
        const lat = -90 + (180 * i) / 64
        const latRad = lat * (Math.PI / 180)
        pts.push(
          new THREE.Vector3(
            -(GLOBE_R * Math.cos(latRad) * Math.cos(lngRad)),
            GLOBE_R * Math.sin(latRad),
            GLOBE_R * Math.cos(latRad) * Math.sin(lngRad),
          ),
        )
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({ color: 0x1e3a6e, transparent: true, opacity: 0.22 })
      globeGroup.add(new THREE.Line(geo, mat))
    }

    // ── City-light dots (give the globe a living, populated feel) ─────────────
    const CITIES: [number, number][] = [
      [40.71, -74.01], [51.51, -0.13], [35.68, 139.69], [39.91, 116.39],
      [19.08, 72.88], [-33.87, 151.21], [43.65, -79.38], [37.77, -122.42],
      [48.85, 2.35], [52.52, 13.41], [55.75, 37.62], [-23.55, -46.63],
      [25.20, 55.27], [1.29, 103.85], [37.57, 127.00], [13.75, 100.52],
      [31.23, 121.47], [28.67, 77.22], [19.43, -99.13], [30.04, 31.24],
      [41.88, -87.63], [47.61, -122.33], [52.37, 4.90], [59.33, 18.07],
      [-1.29, 36.82], [34.05, -118.24], [6.46, 3.39], [3.86, 11.52],
      [-26.20, 28.05], [36.82, 10.17], [50.45, 30.52], [41.01, 28.96],
      [22.32, 114.17], [22.54, 114.06], [12.97, 77.59], [-37.81, 144.96],
      [-22.91, -43.17], [4.71, -74.07], [60.17, 24.93], [47.38, 8.54],
    ]

    const dotArr: number[] = []
    // Random surface dots (simulate continental glow)
    const randomDotCount = isMobile ? 350 : 700
    for (let i = 0; i < randomDotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r = GLOBE_R + 0.015
      dotArr.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
    }
    // City cluster dots
    CITIES.forEach(([lat, lng]) => {
      const v = latLngToVec3(lat, lng, GLOBE_R + 0.015)
      for (let j = 0; j < 6; j++) {
        dotArr.push(
          v.x + (Math.random() - 0.5) * 0.12,
          v.y + (Math.random() - 0.5) * 0.12,
          v.z + (Math.random() - 0.5) * 0.12,
        )
      }
    })

    const cityGeo = new THREE.BufferGeometry()
    cityGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dotArr), 3))
    const cityMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.022,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
    globeGroup.add(new THREE.Points(cityGeo, cityMat))

    // ── Atmospheric glow (3 nested back-side shells, additive blending) ────────
    const atmConfigs = [
      { scale: 1.06, color: 0x2563eb, opacity: 0.13 },
      { scale: 1.16, color: 0x1d4ed8, opacity: 0.07 },
      { scale: 1.30, color: 0x1e3a8a, opacity: 0.035 },
    ]
    atmConfigs.forEach(({ scale, color, opacity }) => {
      const geo = new THREE.SphereGeometry(GLOBE_R * scale, 32, 32)
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      globeGroup.add(new THREE.Mesh(geo, mat))
    })

    // ── Decorative orbit rings ────────────────────────────────────────────────
    const orbitConfigs = [
      { radius: GLOBE_R + 0.7, tube: 0.006, color: 0x3b82f6, opacity: 0.35, rx: Math.PI * 0.35, rz: Math.PI * 0.15, speedZ: 0.0009 },
      { radius: GLOBE_R + 0.5, tube: 0.004, color: 0x06b6d4, opacity: 0.20, rx: Math.PI * 0.5,  rz: 0,              speedZ: -0.0006 },
    ]
    const orbitMeshes: { mesh: THREE.Mesh; speedZ: number }[] = []
    orbitConfigs.forEach(({ radius, tube, color, opacity, rx, rz, speedZ }) => {
      const geo = new THREE.TorusGeometry(radius, tube, 2, 100)
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.x = rx
      mesh.rotation.z = rz
      mesh.position.copy(globeGroup.position)
      scene.add(mesh)
      orbitMeshes.push({ mesh, speedZ })
    })

    // ── Location pin ──────────────────────────────────────────────────────────
    const pinPos = latLngToVec3(pinLat, pinLng, GLOBE_R)
    const pinDir = pinPos.clone().normalize()

    // Spike (cone pointing outward)
    const spikeHeight = 0.38
    const spikeGeo = new THREE.ConeGeometry(0.032, spikeHeight, 8)
    const spikeMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    const spike = new THREE.Mesh(spikeGeo, spikeMat)
    spike.position.copy(pinPos.clone().add(pinDir.clone().multiplyScalar(spikeHeight / 2)))
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pinDir)
    globeGroup.add(spike)

    // Glowing base dot
    const dotGeo = new THREE.SphereGeometry(0.07, 16, 16)
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    const pinDot = new THREE.Mesh(dotGeo, dotMat)
    pinDot.position.copy(pinPos.clone().add(pinDir.clone().multiplyScalar(0.07)))
    globeGroup.add(pinDot)

    // Pulsing rings at pin base
    const pulseRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[] = []
    for (let i = 0; i < 3; i++) {
      const pGeo = new THREE.TorusGeometry(0.14, 0.007, 2, 32)
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.7 - i * 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const pRing = new THREE.Mesh(pGeo, pMat)
      pRing.position.copy(pinPos.clone().add(pinDir.clone().multiplyScalar(0.04)))
      pRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pinDir)
      globeGroup.add(pRing)
      pulseRings.push({ mesh: pRing, mat: pMat, phase: (i / 3) * Math.PI * 2 })
    }

    // ── Arc connections from pin to major distant cities ──────────────────────
    const ARC_TARGETS: [number, number][] = [
      [51.51, -0.13],    // London
      [35.68, 139.69],   // Tokyo
      [52.52, 13.41],    // Berlin
      [-33.87, 151.21],  // Sydney
      [1.29, 103.85],    // Singapore
      [37.57, 127.00],   // Seoul
    ]
    ARC_TARGETS.forEach(([lat2, lng2]) => {
      // Skip arc if target is too close to the developer's pin
      if (Math.abs(lat2 - pinLat) < ARC_SKIP_LAT_DEG && Math.abs(lng2 - pinLng) < ARC_SKIP_LNG_DEG) return
      const start = latLngToVec3(pinLat, pinLng, GLOBE_R + 0.04)
      const end = latLngToVec3(lat2, lng2, GLOBE_R + 0.04)
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_R + 1.1)
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64))
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      globeGroup.add(new THREE.Line(arcGeo, arcMat))

      // Small dot at the arc destination
      const destGeo = new THREE.SphereGeometry(0.04, 8, 8)
      const destMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa })
      const destDot = new THREE.Mesh(destGeo, destMat)
      destDot.position.copy(end)
      globeGroup.add(destDot)
    })

    // ── Interaction: mouse / touch drag to rotate the globe ───────────────────
    let isDragging = false
    let prevX = 0
    let prevY = 0
    let velX = 0
    let velY = 0
    let autoRotate = true

    const startDrag = (x: number, y: number) => {
      isDragging = true
      autoRotate = false
      prevX = x
      prevY = y
      velX = 0
      velY = 0
      setGrabbing(true)
    }
    const moveDrag = (x: number, y: number) => {
      if (!isDragging) return
      velX = (y - prevY) * 0.004
      velY = (x - prevX) * 0.004
      globeGroup.rotation.x += velX
      globeGroup.rotation.y += velY
      prevX = x
      prevY = y
    }
    const endDrag = () => {
      isDragging = false
      setGrabbing(false)
      setTimeout(() => { autoRotate = true }, AUTO_ROTATE_RESUME_DELAY)
    }

    const onMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY)
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY)
    const onMouseUp = () => endDrag()
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY) }
    const onTouchMove = (e: TouchEvent) => { if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY) }
    const onTouchEnd = () => endDrag()

    mount.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    mount.addEventListener('touchstart', onTouchStart, { passive: true })
    mount.addEventListener('touchmove', onTouchMove, { passive: true })
    mount.addEventListener('touchend', onTouchEnd)

    // ── Resize ────────────────────────────────────────────────────────────────
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
      const elapsed = clock.getElapsedTime()

      // Globe rotation
      if (autoRotate) {
        globeGroup.rotation.y += 0.0018
      } else if (!isDragging) {
        // Momentum decay after drag
        globeGroup.rotation.x += velX
        globeGroup.rotation.y += velY
        velX *= 0.94
        velY *= 0.94
      }
      // Clamp vertical rotation to avoid flipping
      globeGroup.rotation.x = Math.max(-MAX_TILT, Math.min(MAX_TILT, globeGroup.rotation.x))

      // Pulse rings – expand outward and fade
      pulseRings.forEach(({ mesh, mat, phase }) => {
        const t = ((elapsed * 0.9 + phase) % (Math.PI * 2))
        const s = 1 + Math.sin(t) * 0.7
        mesh.scale.setScalar(s)
        mat.opacity = 0.55 * Math.max(0, 1 - Math.sin(t) * 0.7)
      })

      // Orbit rings drift
      orbitMeshes.forEach(({ mesh, speedZ }) => {
        mesh.rotation.z += speedZ
      })

      // Gentle star drift
      stars.rotation.y = elapsed * 0.006
      stars.rotation.x = elapsed * 0.002

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      mount.removeEventListener('touchstart', onTouchStart)
      mount.removeEventListener('touchmove', onTouchMove)
      mount.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', handleResize)

      starGeo.dispose()
      starMat.dispose()
      cityGeo.dispose()
      cityMat.dispose()

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
      try { mount.removeChild(renderer.domElement) } catch { /* already removed */ }
    }
  }, [location])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ cursor: grabbing ? 'grabbing' : 'grab' }} />
}
