import { useEffect, useRef } from 'react'
import { makeBrain } from '../lib/particles'
import { usePortfolioData } from '../data/usePortfolioData'

/* eslint-disable @typescript-eslint/no-explicit-any */
const THREE = () => (window as any).THREE

// ============================================================
//  HERO — Three.js particle morph (ported from portfolio2.html)
//  Scatter → sphere → brain → dissolve → network → architecture
//  driven by scroll over a 340vh sticky section.
// ============================================================
export default function HeroSection() {
  const { profile } = usePortfolioData()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const msg0Ref = useRef<HTMLDivElement>(null)
  const msg1Ref = useRef<HTMLDivElement>(null)
  const msg2Ref = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const T = THREE()
    if (!T) { console.warn('Three.js not loaded'); return }
    const cv = canvasRef.current!
    const heroEl = sectionRef.current!
    const msg0 = msg0Ref.current!, msg1 = msg1Ref.current!, msg2 = msg2Ref.current!, hint = hintRef.current!

    let W = cv.clientWidth, H = cv.clientHeight
    const scene = new T.Scene()
    const camera = new T.PerspectiveCamera(50, W / H, 0.1, 100)
    camera.position.set(0, 0, 6.2)
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    renderer.setSize(W, H, false)

    const P = window.innerWidth < 768 ? 4200 : 7200

    function randn() {
      let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random()
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    }

    const NN = 46, nodes: number[][] = []
    for (let i = 0; i < NN; i++) nodes.push([(Math.random() - .5) * 3.6, (Math.random() - .5) * 2.6, (Math.random() - .5) * 3.0])

    const scatter = new Float32Array(P * 3), sphere = new Float32Array(P * 3),
      brainC = new Float32Array(P * 3), brainD = new Float32Array(P * 3),
      dissolve = new Float32Array(P * 3), network = new Float32Array(P * 3),
      arch = new Float32Array(P * 3)

    const cols = 5, colX = [-2.2, -1.1, 0, 1.1, 2.2], gridN = Math.ceil(Math.sqrt(P / cols))

    for (let i = 0; i < P; i++) {
      const o = i * 3
      scatter[o] = (Math.random() - .5) * 7; scatter[o + 1] = (Math.random() - .5) * 4.4; scatter[o + 2] = (Math.random() - .5) * 4.4
      let dx = randn(), dy = randn(), dz = randn(); const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1; dx /= len; dy /= len; dz /= len
      const sr = 1.5 + (Math.random() - .5) * .18
      sphere[o] = dx * sr; sphere[o + 1] = dy * sr; sphere[o + 2] = dz * sr
      const dr = 3.4 + Math.random() * 1.2
      dissolve[o] = dx * dr; dissolve[o + 1] = dy * dr * 0.7; dissolve[o + 2] = dz * dr
      const nd = nodes[i % NN]
      network[o] = nd[0] + randn() * 0.13; network[o + 1] = nd[1] + randn() * 0.13; network[o + 2] = nd[2] + randn() * 0.13
      const c = i % cols, idx = Math.floor(i / cols) % (gridN * gridN)
      const gy2 = Math.floor(idx / gridN), gz = idx % gridN
      arch[o] = colX[c] + randn() * 0.03
      arch[o + 1] = ((gy2 / (gridN - 1)) - .5) * 2.6 + randn() * 0.02
      arch[o + 2] = ((gz / (gridN - 1)) - .5) * 2.6 + randn() * 0.02
    }
    // anatomical lateral brain (shared generator) — slightly scaled up for the hero
    const _brain = makeBrain(P, { thick: 0.22, scatter: 0.04 })
    for (let k = 0; k < _brain.length; k++) {
      const v = _brain[k] * 1.18
      brainD[k] = v
      brainC[k] = v + (Math.random() - 0.5) * 0.18
    }
    const TARGETS = [scatter, sphere, brainC, brainD, dissolve, network, arch]

    const pos = new Float32Array(P * 3); pos.set(scatter)
    const geo = new T.BufferGeometry()
    geo.setAttribute('position', new T.BufferAttribute(pos, 3))
    const mat = new T.PointsMaterial({ color: 0x111111, size: 0.022, sizeAttenuation: true, transparent: true, opacity: .82 })
    const points = new T.Points(geo, mat)
    const group = new T.Group()
    group.add(points)
    group.rotation.x = -0.12
    scene.add(group)

    // network lines
    const segs: number[] = []
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      const dx = nodes[a][0] - nodes[b][0], dy = nodes[a][1] - nodes[b][1], dz = nodes[a][2] - nodes[b][2]
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 1.35) segs.push(...nodes[a], ...nodes[b])
    }
    const lgeo = new T.BufferGeometry()
    lgeo.setAttribute('position', new T.BufferAttribute(new Float32Array(segs), 3))
    const lmat = new T.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0 })
    group.add(new T.LineSegments(lgeo, lmat))

    let sp = 0, dp = 0
    function smooth(t: number) { return t * t * (3 - 2 * t) }

    const onScroll = () => {
      const total = heroEl.offsetHeight - window.innerHeight
      const scrolled = -heroEl.getBoundingClientRect().top
      sp = Math.max(0, Math.min(1, scrolled / Math.max(1, total)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => {
      W = cv.clientWidth; H = cv.clientHeight
      renderer.setSize(W, H, false)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize, { passive: true })

    function fade(p: number, s: number, f1: number, f2: number, e: number) {
      if (p < s || p > e) return 0
      if (p < f1) return (p - s) / (f1 - s)
      if (p > f2) return 1 - (p - f2) / (e - f2)
      return 1
    }

    let raf = 0
    function animate() {
      raf = requestAnimationFrame(animate)
      dp += (sp - dp) * 0.08
      const p = dp
      const sf = p * (TARGETS.length - 1)
      let seg = Math.floor(sf); if (seg > TARGETS.length - 2) seg = TARGETS.length - 2
      const t = smooth(sf - seg)
      const A = TARGETS[seg], B = TARGETS[seg + 1]
      const arr = geo.attributes.position.array as Float32Array
      for (let i = 0; i < arr.length; i++) arr[i] = A[i] + (B[i] - A[i]) * t
      geo.attributes.position.needsUpdate = true
      const brainView = Math.max(0, 1 - Math.abs(p - 0.42) / 0.18)
      group.rotation.y += 0.0015 * (1 - 0.75 * brainView)
      lmat.opacity = Math.max(0, Math.min(1, (p - 0.74) / 0.12)) * 0.16

      msg0.style.opacity = String(fade(p, -1, -1, 0.30, 0.42))
      msg1.style.opacity = String(fade(p, 0.40, 0.48, 0.62, 0.72))
      msg2.style.opacity = String(fade(p, 0.74, 0.82, 1.1, 1.1))
      hint.style.opacity = String(Math.max(0, 1 - p * 6))
      renderer.render(scene, camera)
    }
    onScroll()
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose(); mat.dispose(); lgeo.dispose(); lmat.dispose()
    }
  }, [])

  const name = profile?.name || 'Kuldeep Kumar'

  return (
    <section ref={sectionRef} id="hero" style={{ position: 'relative', height: '340vh', background: 'var(--bg)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 46%, rgba(247,247,245,0) 30%, rgba(247,247,245,.5) 78%)',
        }} />

        {/* eyebrow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', paddingTop: 'clamp(96px,14vh,150px)', pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.42em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
            AI / ML&nbsp;·&nbsp;{name}
          </span>
        </div>

        {/* morphing messages */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 'min(92vw,1100px)', height: '40vh', textAlign: 'center' }}>
            {[
              { ref: msg0Ref, op: 1, html: <>Everything begins<br />with a thought.</> },
              { ref: msg1Ref, op: 0, html: <>From research<br />to reality.</> },
              { ref: msg2Ref, op: 0, html: <>Building intelligent<br />systems.</> },
            ].map((m, i) => (
              <div
                key={i}
                ref={m.ref}
                style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--serif)', fontWeight: 400,
                  fontSize: 'clamp(44px,8.2vw,124px)', lineHeight: 1.02, letterSpacing: '-.01em',
                  color: 'var(--ink)', transition: 'opacity .6s ease', opacity: m.op,
                }}
              >
                {m.html}
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div ref={hintRef} style={{ position: 'absolute', bottom: 34, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', transition: 'opacity .5s ease' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.3em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Scroll</span>
          <span style={{ width: 1, height: 30, background: 'linear-gradient(#111,transparent)', animation: 'floaty 2.4s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  )
}
