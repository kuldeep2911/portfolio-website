import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePortfolioData } from '../data/usePortfolioData'

const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const DEPTHS = [44, 18, 58, 14, 36, 28, 40, 20]

// Skills · Neural Constellation. Hovering a category orbits its skills around a
// central hub. Names only — proficiency is kept in the data/CMS but not shown.
export default function SkillsSection() {
  const { skills } = usePortfolioData()
  const [active, setActive] = useState(0)
  const [size, setSize] = useState({ w: 700, h: 480 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  // measure the constellation stage so node positions stay circular & responsive
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  // 3D parallax tilt (applied imperatively to avoid re-rendering on mousemove)
  useEffect(() => {
    const wrap = wrapRef.current, stage = stageRef.current
    if (!wrap || !stage) return
    const move = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      stage.style.transform = `rotateX(${-py * 12}deg) rotateY(${px * 14}deg)`
    }
    const leave = () => { stage.style.transform = 'rotateX(0) rotateY(0)' }
    wrap.addEventListener('mousemove', move)
    wrap.addEventListener('mouseleave', leave)
    return () => { wrap.removeEventListener('mousemove', move); wrap.removeEventListener('mouseleave', leave) }
  }, [])

  const maxItems = Math.max(1, ...skills.map(s => s.items.length))
  const items = skills[active]?.items ?? []
  const n = items.length || 1
  const cx = size.w / 2, cy = size.h / 2
  const R = Math.min(size.w, size.h) * 0.4
  const slots = Array.from({ length: maxItems })

  return (
    <section id="skills" style={{
      background: 'var(--bg-soft)', scrollMarginTop: 80,
      borderTop: '1px solid #E5E5E0', borderBottom: '1px solid #E5E5E0',
      padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)',
    }}>
      <style>{`
        @keyframes conPulse { 0%,100%{ transform:scale(1); opacity:.9 } 50%{ transform:scale(1.18); opacity:.35 } }
        .con-node:hover { z-index:9 !important; }
        .con-node:hover .con-float { transform:scale(1.16) !important; }
        .con-node:hover .con-label { color:var(--ink) !important; font-weight:600 !important; }
        @media (max-width:860px){
          .skl-grid{ grid-template-columns:1fr !important; }
          .con-wrap{ display:none !important; }
          .skl-mobile{ display:flex !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>Technical arsenal</span>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(40px,6vw,64px)', lineHeight: 1.04, letterSpacing: '-.01em', color: 'var(--ink)', margin: '12px 0 0' }}>What I know.</h2>

        <div className="skl-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 48, alignItems: 'center', marginTop: 44 }}>
          {/* category list */}
          <div style={{ borderTop: '1px solid var(--line)' }}>
            {skills.map((sg, i) => {
              const on = active === i
              return (
                <div
                  key={sg.id ?? sg.category}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 2px', borderBottom: '1px solid var(--line)', cursor: 'pointer', color: on ? 'var(--ink)' : 'var(--ink-soft)', transition: 'color .3s ease', position: 'relative' }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, width: 24, flexShrink: 0, opacity: .7 }}>{ROMANS[i] || i + 1}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 500, letterSpacing: '-.01em' }}>{sg.category}</span>
                  <span style={{ position: 'absolute', left: 0, bottom: -1, height: 2, width: '100%', background: 'var(--ink)', transform: on ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform .4s cubic-bezier(.22,1,.36,1)' }} />
                </div>
              )
            })}
          </div>

          {/* constellation */}
          <div ref={wrapRef} className="con-wrap" style={{ perspective: 1000, height: 480 }}>
            <div ref={stageRef} style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform .35s ease' }}>
              {/* connector lines */}
              {slots.map((_, k) => {
                const show = k < n
                const ang = (-90 + k * 360 / n) * Math.PI / 180
                const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R
                const dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy), aDeg = Math.atan2(dy, dx) * 180 / Math.PI
                return (
                  <div key={'l' + k} style={{
                    position: 'absolute', left: cx, top: cy, height: 1, width: show ? dist : 0,
                    background: 'linear-gradient(90deg, rgba(17,17,17,.05), rgba(17,17,17,.4))',
                    transformOrigin: '0 50%', transform: `translateZ(${(DEPTHS[k] || 30) * 0.5}px) rotate(${aDeg}deg)`,
                    opacity: show ? 1 : 0, pointerEvents: 'none',
                    transition: 'width .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1), opacity .5s ease',
                  }} />
                )
              })}

              {/* skill nodes (name only) */}
              {slots.map((_, k) => {
                const show = k < n
                const it = items[k]
                const ang = (-90 + k * 360 / n) * Math.PI / 180
                const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R
                const isTop = y < cy - 20 // node is in the upper portion — place label above
                return (
                  <div key={'n' + k} className="con-node" style={{
                    position: 'absolute', left: x, top: y, width: 58, height: 58,
                    transform: `translate(-50%,-50%) translateZ(${DEPTHS[k] || 30}px)`,
                    opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none', cursor: 'pointer',
                    transition: 'left .6s cubic-bezier(.22,1,.36,1), top .6s cubic-bezier(.22,1,.36,1), opacity .5s ease',
                  }}>
                    <div className="con-float" style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '50%', transition: 'transform .35s cubic-bezier(.34,1.56,.64,1)' }}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid var(--ink)', opacity: .22 }} />
                      <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,.10)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink)' }} />
                      </div>
                    </div>
                    <div className="con-label" style={{
                      position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap',
                      fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)',
                      transition: 'color .3s ease, font-weight .3s ease', pointerEvents: 'none',
                      ...(isTop
                        ? { bottom: 'calc(100% + 14px)' }
                        : { top: 'calc(100% + 14px)' }),
                    }}>
                      {it?.name}
                    </div>
                  </div>
                )
              })}

              {/* hub */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) translateZ(28px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 150, height: 150, borderRadius: '50%', background: 'var(--ink)', color: '#F7F7F5', textAlign: 'center', zIndex: 6, boxShadow: '0 24px 50px rgba(0,0,0,.22)' }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 21, lineHeight: 1.05, padding: '0 16px' }}>{skills[active]?.category}</span>
                <span style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1px solid var(--ink)', opacity: .25, animation: 'conPulse 3.4s ease-in-out infinite' }} />
              </div>
            </div>
          </div>
        </div>

        {/* mobile fallback — plain pills for the active category */}
        <div className="skl-mobile" style={{ display: 'none', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
          {items.map(it => (
            <span key={it.name} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 999, padding: '9px 16px', fontSize: 14, color: 'var(--ink)' }}>{it.name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
