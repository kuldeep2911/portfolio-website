import { useEffect, useRef } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
const THREE = () => (window as any).THREE

// 3D companion robot whose head tracks the cursor.
// Ported faithfully from the portfolio2.html `initRobot` routine.
export default function Robot3D({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const T = THREE()
    if (!T) return
    const cv = ref.current!

    let W = cv.clientWidth || 480, H = cv.clientHeight || 480
    const scene = new T.Scene()
    const camera = new T.PerspectiveCamera(42, W / H, 0.1, 100)
    camera.position.set(0, -0.15, 4.5)
    camera.lookAt(0, -0.15, 0)
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(W, H, false)

    // lighting — soft, editorial
    scene.add(new T.AmbientLight(0xffffff, 0.72))
    const key = new T.DirectionalLight(0xffffff, 0.95); key.position.set(3, 5, 4); scene.add(key)
    const rim = new T.DirectionalLight(0xeef0ff, 0.5); rim.position.set(-4, 1.5, -3); scene.add(rim)
    const fill = new T.PointLight(0xffffff, 0.4); fill.position.set(0, -1, 4); scene.add(fill)

    const root = new T.Group(); scene.add(root)

    const bodyMat = new T.MeshStandardMaterial({ color: 0xeceae4, roughness: 0.42, metalness: 0.18 })
    const darkMat = new T.MeshStandardMaterial({ color: 0x161616, roughness: 0.34, metalness: 0.30 })
    const eyeMat = new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9fb4ff, emissiveIntensity: 1.5, roughness: 0.2 })

    // body
    const body = new T.Mesh(new T.CylinderGeometry(0.60, 0.78, 1.0, 44), bodyMat)
    body.position.y = -0.98; root.add(body)
    const chest = new T.Mesh(new T.CircleGeometry(0.24, 36), darkMat)
    chest.position.set(0, -0.86, 0.74); root.add(chest)
    ;[-0.7, 0.7].forEach(x => {
      const sh = new T.Mesh(new T.SphereGeometry(0.18, 24, 24), bodyMat)
      sh.position.set(x, -0.62, 0); root.add(sh)
    })
    const neck = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.2, 24), darkMat)
    neck.position.y = -0.40; root.add(neck)

    // head group (rotates toward cursor)
    const head = new T.Group(); head.position.y = 0.18; root.add(head)
    const skull = new T.Mesh(new T.SphereGeometry(0.62, 48, 48), bodyMat)
    skull.scale.set(1.06, 0.94, 0.96); head.add(skull)
    const visor = new T.Mesh(new T.SphereGeometry(0.5, 44, 44), darkMat)
    visor.scale.set(0.94, 0.5, 0.58); visor.position.set(0, 0.02, 0.34); head.add(visor)
    const eyeGeo = new T.SphereGeometry(0.078, 24, 24)
    const eyeL = new T.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.18, 0.04, 0.62); head.add(eyeL)
    const eyeR = new T.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.18, 0.04, 0.62); head.add(eyeR)
    ;[-0.61, 0.61].forEach(x => {
      const ear = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.09, 24), darkMat)
      ear.rotation.z = Math.PI / 2; ear.position.set(x, 0, 0); head.add(ear)
    })
    const ant = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.3, 12), darkMat)
    ant.position.set(0, 0.68, 0); head.add(ant)
    const bulb = new T.Mesh(new T.SphereGeometry(0.06, 18, 18), eyeMat)
    bulb.position.set(0, 0.86, 0); head.add(bulb)

    // cursor tracking (global)
    let tx = 0, ty = 0, cx = 0, cy = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const onResize = () => {
      W = cv.clientWidth || 480; H = cv.clientHeight || 480
      renderer.setSize(W, H, false)
      camera.aspect = W / H; camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize, { passive: true })

    let visible = true
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting }, { threshold: 0 })
    io.observe(cv)

    let t = 0, raf = 0
    function animate() {
      raf = requestAnimationFrame(animate)
      if (!visible) return
      t += 0.016
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07
      const yaw = Math.max(-0.7, Math.min(0.7, cx * 0.7))
      const pitch = Math.max(-0.45, Math.min(0.45, cy * 0.45))
      head.rotation.y = yaw
      head.rotation.x = pitch
      root.rotation.y = yaw * 0.18
      root.position.y = Math.sin(t * 1.1) * 0.05
      eyeMat.emissiveIntensity = 1.3 + Math.sin(t * 2.2) * 0.25
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      io.disconnect()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', ...style }} />
}
