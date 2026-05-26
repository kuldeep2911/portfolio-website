import { useEffect, useRef } from 'react'
import { skills } from '../data/portfolio'

export default function SkillsSection() {
  const rightRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<(HTMLDivElement | null)[]>([])

  // ── Intersection Observer stagger animation for skill rows ───────────────
  useEffect(() => {
    const rows = rowsRef.current.filter(Boolean) as HTMLDivElement[]

    rows.forEach((row) => {
      row.style.opacity = '0'
      row.style.transform = 'translateX(-25px)'
      row.style.transition = 'none'
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          rows.forEach((row, i) => {
            const delay = i * 0.1
            requestAnimationFrame(() => {
              row.style.transition = `opacity 0.55s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform 0.55s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`
              row.style.opacity = '1'
              row.style.transform = 'translateX(0px)'
            })
          })
          observer.disconnect()
        }
      },
      { rootMargin: '-80px 0px', threshold: 0 }
    )

    if (rightRef.current) observer.observe(rightRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      style={{
        minHeight: '100vh',
        background: '#050508',
        padding: '80px 5vw',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: '4rem',
        alignItems: 'center',
      }}
    >
      {/* ── LEFT: Spline 3D Accordion ── */}
      <div
        style={{
          width: '100%',
          minHeight: '500px',
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(13, 13, 20, 0.5)',
        }}
      >
        <iframe
          src="https://my.spline.design/verticallayoutaccordioncopycopy-lSyu035aDwVtX6cjAfcp5n2Z-O7g/"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ minHeight: '500px', borderRadius: '24px' }}
        />
      </div>

      {/* ── RIGHT: Skill Categories ── */}
      <div
        ref={rightRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              color: '#E0003C',
              display: 'block',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            TECHNICAL ARSENAL
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.05,
              background: 'linear-gradient(180deg, #3D1520 0%, #E0003C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            WHAT I KNOW
          </h2>
        </div>

        {/* Skill category rows — stagger animated via IntersectionObserver */}
        <div>
          {skills.map((skillGroup, i) => (
            <div
              key={skillGroup.category}
              ref={(el) => { rowsRef.current[i] = el }}
              style={{
                padding: '1.1rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Category label */}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.62rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(224, 0, 60, 0.65)',
                  display: 'block',
                  marginBottom: '0.6rem',
                }}
              >
                {skillGroup.category}
              </span>

              {/* Skill pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill.name}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8rem',
                      color: '#F0EEF8',
                      background: 'rgba(224, 0, 60, 0.06)',
                      border: '1px solid rgba(224, 0, 60, 0.16)',
                      borderRadius: '999px',
                      padding: '4px 13px',
                      cursor: 'default',
                      transition: 'all 200ms',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(224,0,60,0.14)'
                      e.currentTarget.style.borderColor = 'rgba(224,0,60,0.45)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(224, 0, 60, 0.06)'
                      e.currentTarget.style.borderColor = 'rgba(224, 0, 60, 0.16)'
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
