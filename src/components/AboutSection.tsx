import { useEffect, useRef, useState } from 'react'
import Robot3D from './Robot3D'
import { usePortfolioData } from '../data/usePortfolioData'

const serifStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3.2vw,42px)',
  lineHeight: 1.28, letterSpacing: '-.01em', color: 'var(--ink)',
}

// Types each serif line character-by-character, one after another.
function SerifTyper({ lines, start, speed = 16 }: { lines: string[]; start: boolean; speed?: number }) {
  const key = lines.join('¦')
  const [active, setActive] = useState(0)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!start || lines.length === 0) return
    setActive(0); setN(0)
    let ai = 0, ci = 0
    const id = setInterval(() => {
      const cur = lines[ai] ?? ''
      if (ci < cur.length) { ci++; setN(ci) }
      else if (ai < lines.length - 1) { ai++; ci = 0; setActive(ai); setN(0) }
      else clearInterval(id)
    }, speed)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, key, speed])

  return (
    <>
      {lines.map((line, i) => {
        const done = i < active
        const isActive = i === active
        const hidden = i > active // reserve space but stay invisible until reached
        const text = done ? line : isActive ? line.slice(0, n) : line
        return (
          <p key={i} style={{ ...serifStyle, visibility: hidden ? 'hidden' : 'visible', marginBottom: i < lines.length - 1 ? 14 : 28 }}>
            {text}
            {isActive && n < line.length && (
              <span style={{ display: 'inline-block', width: '0.06em', marginLeft: 2, background: 'var(--ink)', animation: 'tw-blink 0.7s step-end infinite' }}>&nbsp;</span>
            )}
          </p>
        )
      })}
    </>
  )
}

// Subtle darker section shade behind the robot.
const ROBOT_SURFACE = 'radial-gradient(circle at 50% 40%, #F4F3F0 0%, #ECEBE6 100%)'

export default function AboutSection() {
  const { profile } = usePortfolioData()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // All robot lines render: every line except the last is a typed serif statement,
  // the last is the grey supporting paragraph.
  const allLines = profile?.robot_lines?.filter(Boolean) ?? []
  let serifLines: string[]
  let body: string
  if (allLines.length >= 2) {
    serifLines = allLines.slice(0, -1)
    body = allLines[allLines.length - 1]
  } else if (allLines.length === 1) {
    serifLines = [allLines[0]]
    body = profile?.bio ?? ''
  } else {
    serifLines = profile?.tagline ? [profile.tagline] : []
    body = profile?.bio ?? ''
  }

  const stats = profile?.stats?.length ? profile.stats : [
    { value: '8.56 GPA', label: 'Academic score' },
    { value: '02 Publications', label: 'Research output' },
    { value: '03 Projects', label: 'Built & shipped' },
  ]

  return (
    <section ref={sectionRef} id="about" style={{ background: 'var(--bg)', scrollMarginTop: 80, padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)' }}>
      <style>{`
        @keyframes tw-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: clamp(36px,5vw,72px); align-items: center; margin-top: 36px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(190px,1fr)); gap: 1px; margin-top: clamp(48px,7vh,88px); background: #E5E5E0; border: 1px solid #E5E5E0; border-radius: 16px; overflow: hidden; }
        .stat-cell { background: #FFFFFF; padding: 30px clamp(20px,2.6vw,34px); display: flex; flex-direction: column; justify-content: flex-end; min-height: 150px; }
        .stat-num { font-family: var(--serif); font-size: clamp(24px, 2.5vw, 36px); line-height: 1.08; color: var(--ink); overflow-wrap: break-word; word-break: break-word; }
        .stat-label { font-family: var(--mono); font-size: 11px; letter-spacing: .16em; color: var(--ink-soft); text-transform: uppercase; margin-top: 12px; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>
          Hello, world
        </span>

        <div className="about-grid">
          <div>
            <SerifTyper lines={serifLines} start={visible} />
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '46ch' }}>
              {body}
            </p>
          </div>

          <div style={{
            position: 'relative', aspectRatio: '1 / 1', maxWidth: 480, width: '100%', margin: '0 auto',
            border: '1px solid #E5E5E0', borderRadius: 18, background: ROBOT_SURFACE, overflow: 'hidden',
            boxShadow: '0 24px 60px -36px rgba(17,17,17,.22)',
          }}>
            <Robot3D />
            <span style={{ position: 'absolute', bottom: 16, left: 18, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
              AI companion
            </span>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((st, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-num">{st.value}</div>
              <div className="stat-label">{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
