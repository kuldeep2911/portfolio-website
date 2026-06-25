import { useEffect, useRef } from 'react'
import { makeBrain } from '../lib/particles'
import { usePortfolioData } from '../data/usePortfolioData'

/* eslint-disable @typescript-eslint/no-explicit-any */
const THREE = () => (window as any).THREE

export default function BrainMapSection() {
  const { brainNodes } = usePortfolioData()
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const T = THREE()
    if (!T) return
    const cv = canvasRef.current!
    const stage = stageRef.current!

    let W = cv.clientWidth || stage.clientWidth, H = cv.clientHeight || 680
    const scene = new T.Scene()
    const camera = new T.PerspectiveCamera(50, W / H, 0.1, 100)
    camera.position.set(0, 0, 4.7)
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(W, H, false)

    const P = window.innerWidth < 768 ? 7000 : 15000
    const pos = makeBrain(P, { thick: 0.18, scatter: 0.07 })
    const geo = new T.BufferGeometry()
    geo.setAttribute('position', new T.BufferAttribute(pos, 3))
    const mat = new T.PointsMaterial({ color: 0x111111, size: 0.016, sizeAttenuation: true, transparent: true, opacity: 0.82 })
    const points = new T.Points(geo, mat)
    const group = new T.Group()
    group.add(points)
    group.rotation.x = -0.10
    scene.add(group)

    let mx = 0, my = 0, tmx = 0, tmy = 0
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      tmx = ((e.clientX - r.left) / r.width - .5) * 0.5
      tmy = ((e.clientY - r.top) / r.height - .5) * 0.3
    }
    const onLeave = () => { tmx = 0; tmy = 0 }
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)

    function resize() {
      W = cv.clientWidth || stage.clientWidth; H = cv.clientHeight || 680
      renderer.setSize(W, H, false)
      camera.aspect = W / H; camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize, { passive: true })

    let visible = true
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting }, { threshold: 0 })
    io.observe(stage)

    let tt = 0, raf = 0
    function animate() {
      raf = requestAnimationFrame(animate)
      if (!visible) return
      tt += 0.01
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05
      group.rotation.y = Math.sin(tt * 0.32) * 0.28 + mx * 0.5
      group.rotation.x = -0.05 + my * 0.18
      camera.position.x = mx * 0.4
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      io.disconnect()
      renderer.dispose(); geo.dispose(); mat.dispose()
    }
  }, [])

  // Brain origin (in the same 0–100 coordinate space as the node x/y).
  const BX = 50, BY = 48

  return (
    <section id="focus" style={{
      background: 'var(--bg-soft)', scrollMarginTop: 80,
      borderTop: '1px solid #E5E5E0', borderBottom: '1px solid #E5E5E0',
      padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)',
    }}>
      <style>{`
        @keyframes flow-dash { to { stroke-dashoffset: -300; } }
        .brain-label { transition: transform .3s cubic-bezier(.2,.7,.3,1), box-shadow .3s ease; }
        .brain-label:hover { transform: translate(var(--tx), -50%) scale(1.05) !important; box-shadow: 0 16px 34px -16px rgba(17,17,17,.34) !important; }
        @media (max-width: 860px) {
          .brain-stage { height: auto !important; }
          .brain-canvas { position: relative !important; height: 320px !important; }
          .brain-svg { display: none; }
          .brain-labels { position: static !important; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 22px; }
          .brain-label { position: static !important; transform: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>Neural map</span>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(40px,6vw,76px)', lineHeight: 1.04, letterSpacing: '-.01em', color: 'var(--ink)', margin: '14px 0 0' }}>The mind at work.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '52ch', margin: '22px 0 0' }}>
          A map of the domains where research, engineering, and curiosity intersect.
        </p>

        <div ref={stageRef} className="brain-stage" style={{ position: 'relative', width: '100%', height: 680, marginTop: 'clamp(28px,4vh,48px)' }}>
          <canvas ref={canvasRef} className="brain-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

          {/* Curved connector wires — driven by node x/y (endpoint) and cx/cy (curve control). */}
          <svg className="brain-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {brainNodes.map((n, i) => (
              <g key={n.id ?? i}>
                <path
                  d={`M ${BX} ${BY} Q ${n.cx} ${n.cy} ${n.x} ${n.y}`}
                  fill="none" stroke="rgba(17,17,17,0.22)" strokeWidth="0.25"
                  strokeDasharray="1.2 1" style={{ animation: 'flow-dash 6s linear infinite' }} vectorEffect="non-scaling-stroke"
                />
                <circle cx={n.x} cy={n.y} r="0.55" fill="rgba(17,17,17,0.6)" vectorEffect="non-scaling-stroke" />
                <circle cx={BX} cy={BY} r="0.4" fill="rgba(17,17,17,0.35)" vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>

          {/* Labels positioned at each node's (x,y), offset outward from the brain centre. */}
          <div className="brain-labels" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
            {brainNodes.map((n, i) => {
              const tx = n.x > 50 ? '14px' : 'calc(-100% - 14px)'
              return (
                <div
                  key={n.id ?? i}
                  className="brain-label"
                  title={n.label}
                  style={{
                    position: 'absolute', left: `${n.x}%`, top: `${n.y}%`,
                    ['--tx' as any]: tx,
                    transform: `translate(${tx}, -50%)`,
                    pointerEvents: 'auto', display: 'inline-flex', alignItems: 'center', gap: 11,
                    background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid #E5E5E0', borderRadius: 999, padding: '11px 17px',
                    boxShadow: '0 10px 28px -16px rgba(17,17,17,.3)', cursor: 'default',
                  }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.14em', color: 'var(--ink-soft)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-.01em', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{n.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
