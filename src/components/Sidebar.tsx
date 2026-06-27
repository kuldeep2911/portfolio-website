import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'focus', label: 'Interests' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'building', label: 'Ongoing' },
  { id: 'contact', label: 'Contact' },
]

export default function Sidebar() {
  const [active, setActive] = useState('hero')
  const [hovered, setHovered] = useState<string | null>(null)

  // Track which section is centered in the viewport.
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (!el) return
      const io = new IntersectionObserver(
        es => { if (es[0].isIntersecting) setActive(s.id) },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      )
      io.observe(el)
      observers.push(io)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  // The Projects section is a horizontal scroll-jack — hide the rail there so
  // the expanding labels can't overlap the sliding cards.
  const railHidden = active === 'projects'

  return (
    <>
      {/* monogram, top-left */}
      <a
        href="#hero"
        onClick={e => { e.preventDefault(); go('hero') }}
        style={{ position: 'fixed', top: 22, left: 24, zIndex: 110, textDecoration: 'none', color: 'var(--ink)', fontFamily: 'var(--mono)', fontWeight: 500, fontSize: 15, letterSpacing: '.18em' }}
      >
        KD
      </a>

      <nav
        aria-label="Section navigation"
        style={{
          position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 100,
          display: 'flex', flexDirection: 'column', gap: 4,
          padding: '14px 12px 14px 18px',
          opacity: railHidden ? 0 : 1,
          pointerEvents: railHidden ? 'none' : 'auto',
          transition: 'opacity .45s ease, transform .45s ease',
        }}
      >
        {SECTIONS.map(s => {
          const isActive = active === s.id
          const isHover = hovered === s.id
          const show = isHover // label appears on hover
          return (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={s.label}
              aria-current={isActive ? 'true' : undefined}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 12,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '9px 6px', height: 30,
              }}
            >
              {/* the bar */}
              <span
                style={{
                  display: 'block', height: isActive ? 3 : 2, borderRadius: 3,
                  width: isActive ? 30 : (isHover ? 24 : 14),
                  background: isActive ? 'var(--ink)' : (isHover ? 'var(--ink)' : '#B6B6AE'),
                  transition: 'width .3s cubic-bezier(.2,.7,.3,1), height .3s, background .3s',
                }}
              />
              {/* hover label pill */}
              <span
                style={{
                  position: 'absolute', left: 'calc(100% + 2px)', top: '50%',
                  transform: show ? 'translate(0,-50%)' : 'translate(-6px,-50%)',
                  opacity: show ? 1 : 0,
                  pointerEvents: 'none', whiteSpace: 'nowrap',
                  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase',
                  color: 'var(--ink)',
                  background: 'rgba(255,255,255,.9)', border: '1px solid #E5E5E0',
                  borderRadius: 999, padding: '6px 12px',
                  boxShadow: '0 8px 20px -12px rgba(17,17,17,.3)',
                  transition: 'opacity .25s ease, transform .25s ease',
                }}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
