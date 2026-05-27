import React, { useEffect, useRef, useState } from 'react'
import Starfield from './Starfield'
import { Check, Microscope, Music, Cpu, Network, Bot } from 'lucide-react'
import { usePortfolioData } from '../data/usePortfolioData'

const ICON_MAP: Record<string, React.ReactNode> = {
  Microscope: <Microscope size={20} color="#E0003C" />,
  Music: <Music size={20} color="#E0003C" />,
  Cpu: <Cpu size={20} color="#E0003C" />,
  Network: <Network size={20} color="#E0003C" />,
  Bot: <Bot size={20} color="#E0003C" />,
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
          // Disconnect after triggering once
          if (containerRef.current) {
            observer.unobserve(containerRef.current)
          }
        }
      },
      {
        rootMargin: '-80px',
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      id="ongoing"
      style={{
        background: '#050508',
        padding: '80px 5vw 100px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Starfield />
      <div style={{ position: 'relative', zIndex: 10 }}>
      {/* ── HEADER ── */}
      <div style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
            fontWeight: 500,
            color: '#F0EEF8',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Currently building.
        </h2>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
            fontWeight: 500,
            color: '#8B8B9E',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Pushing the boundaries of what AI can do.
        </p>
      </div>

      {/* ── CARD GRID ── */}
      <div
        ref={containerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
        }}
        className="ongoing-grid"
      >
        <style>
          {`
            @media (min-width: 1024px) {
              .ongoing-grid {
                grid-template-columns: repeat(4, 1fr) !important;
                height: 480px;
              }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              .ongoing-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            .ongoing-card {
              opacity: 0;
              transform: scale(0.95);
              transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .ongoing-card.visible {
              opacity: 1;
              transform: scale(1);
            }
            .learn-more-arrow {
              display: inline-block;
              transition: transform 0.3s ease;
            }
            .learn-more-link:hover .learn-more-arrow {
              transform: rotate(-45deg) translateX(3px) translateY(3px);
            }
          `}
        </style>

        {/* ── CARD 1 — VISUAL CARD (large) ── */}
        <div
          className={`ongoing-card ${isVisible ? 'visible' : ''}`}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            height: '100%',
            minHeight: '350px',
            background: '#0D0D14',
            transitionDelay: '0s',
          }}
        >
          <div
            style={{
              backgroundImage: "url('/ongoing.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              inset: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5,5,8,0.9) 0%, rgba(5,5,8,0.4) 60%, transparent 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 500,
              color: '#F0EEF8',
              zIndex: 2,
            }}
          >
            Building minds, not just models.
          </div>
        </div>

        {/* ── CARDS 2, 3, 4 — FEATURE CARDS ── */}
        {ongoing.map((project, index) => {
          const delay = (index + 1) * 0.12
          return (
            <div
              key={project.id}
              className={`ongoing-card ${isVisible ? 'visible' : ''}`}
              style={{
                background: '#12121C',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                height: '100%',
                minHeight: '350px',
                transitionDelay: `${delay}s`,
              }}
            >
              {/* Card top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    background: 'rgba(224, 0, 60, 0.08)',
                    border: '1px solid rgba(224, 0, 60, 0.25)',
                    borderRadius: '10px',
                    padding: '8px',
                    width: 'fit-content',
                  }}
                >
                  {ICON_MAP[project.icon] || <Cpu size={20} color="#E0003C" />}
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.62rem',
                    color: '#8B8B9E',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '4px',
                    padding: '2px 7px',
                  }}
                >
                  0{index + 1}
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#F0EEF8',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  paddingRight: project.status === 'in_progress' ? '90px' : '0',
                }}
              >
                {project.title}.
              </h3>

              {/* Status badge */}
              {project.status && project.status.trim() !== '' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(224,0,60,0.12)',
                    border: '1px solid rgba(224,0,60,0.28)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.58rem',
                    color: '#E0003C',
                    borderRadius: '999px',
                    padding: '3px 9px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.05em',
                  }}
                >
                  {project.status}
                </div>
              )}

              {/* Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1 }}>
                {project.highlights.map((highlight, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Check size={13} color="#E0003C" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.77rem',
                        color: '#8B8B9E',
                        lineHeight: 1.5,
                      }}
                    >
                      {highlight}
                    </span>
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
