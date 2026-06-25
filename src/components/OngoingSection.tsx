import React, { useEffect, useRef, useState } from 'react'
import { Check, Microscope, Music, Cpu, Network, Bot, Brain, Code, Database, Activity, Server, Eye } from 'lucide-react'
import { usePortfolioData } from '../data/usePortfolioData'

const ICON_MAP: Record<string, React.ReactNode> = {
  Microscope: <Microscope size={20} color="#111111" />,
  Music: <Music size={20} color="#111111" />,
  Cpu: <Cpu size={20} color="#111111" />,
  Network: <Network size={20} color="#111111" />,
  Bot: <Bot size={20} color="#111111" />,
  Brain: <Brain size={20} color="#111111" />,
  Code: <Code size={20} color="#111111" />,
  Database: <Database size={20} color="#111111" />,
  Activity: <Activity size={20} color="#111111" />,
  Server: <Server size={20} color="#111111" />,
  Eye: <Eye size={20} color="#111111" />,
}

export default function OngoingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { ongoing } = usePortfolioData()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (containerRef.current) observer.unobserve(containerRef.current)
        }
      },
      { rootMargin: '-80px', threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="building" style={{ background: 'var(--bg)', scrollMarginTop: 80, padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(40px,6vw,76px)', fontWeight: 400, color: '#111111', margin: 0, lineHeight: 1.04, letterSpacing: '-.01em' }}>
            Currently building.
          </h2>
          <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(24px,3vw,40px)', fontWeight: 400, color: '#5A5A5A', margin: '6px 0 0', lineHeight: 1.12 }}>
            Pushing the boundaries of what AI can do.
          </p>
        </div>

        {/* CARD GRID */}
        <div ref={containerRef} className="ongoing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <style>{`
            @media (min-width: 1024px) { .ongoing-grid { grid-template-columns: repeat(4, 1fr) !important; height: 480px; } }
            @media (min-width: 768px) and (max-width: 1023px) { .ongoing-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            .ongoing-card { opacity: 0; transform: scale(0.95); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
            .ongoing-card.visible { opacity: 1; transform: scale(1); }
          `}</style>

          {/* CARD 1 — VISUAL */}
          <div className={`ongoing-card ${isVisible ? 'visible' : ''}`}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', height: '100%', minHeight: '350px', background: '#FFFFFF', border: '1px solid #E5E5E0', transitionDelay: '0s' }}>
            <div style={{ backgroundImage: "url('/ongoing.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(247,247,245,0.96) 0%, rgba(247,247,245,0.45) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontFamily: "'Instrument Serif', serif", fontSize: '1.4rem', fontWeight: 400, color: '#111111', zIndex: 2 }}>
              Building minds,<br />not just models.
            </div>
          </div>

          {/* CARDS 2-4 — FEATURE */}
          {ongoing.map((project, index) => {
            const delay = (index + 1) * 0.12
            return (
              <div key={project.id} className={`ongoing-card ${isVisible ? 'visible' : ''}`}
                style={{ background: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', height: '100%', minHeight: '350px', transitionDelay: `${delay}s` }}>
                {/* top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: '#F1F1EE', border: '1px solid #E5E5E0', borderRadius: '10px', padding: '8px', width: 'fit-content' }}>
                    {ICON_MAP[project.icon] || <Cpu size={20} color="#111111" />}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#5A5A5A', background: '#F7F7F5', border: '1px solid #E5E5E0', borderRadius: '4px', padding: '2px 7px' }}>
                    0{index + 1}
                  </div>
                </div>

                {/* title */}
                <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 600, color: '#111111', marginTop: '1rem', marginBottom: '1rem', paddingRight: project.status ? '90px' : '0' }}>
                  {project.title}.
                </h3>

                {/* status badge */}
                {project.status && project.status.trim() !== '' && (
                  <div style={{ position: 'absolute', top: '1.25rem', left: '50%', transform: 'translateX(-50%)', background: '#F1F1EE', border: '1px solid #E5E5E0', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: '#111111', borderRadius: '999px', padding: '3px 9px', textTransform: 'uppercase', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                    {project.status.replace(/_/g, ' ')}
                  </div>
                )}

                {/* checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
                  {project.highlights.map((highlight, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Check size={13} color="#111111" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '0.82rem', color: '#5A5A5A', lineHeight: 1.5 }}>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
