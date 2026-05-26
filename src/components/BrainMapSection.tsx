import React, { useEffect, useRef, useState } from 'react'
import { Brain, Database, Activity, Network, MessageSquare, FileText } from 'lucide-react'
import Starfield from './Starfield'
import { usePortfolioData } from '../data/usePortfolioData'


export default function BrainMapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { brainNodes } = usePortfolioData()

  const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
    Brain, Database, Activity, Network, MessageSquare, FileText
  }

  // Map DB nodes to the shape the rest of the component expects
  const NODES = brainNodes.map((n, idx) => ({
    id: n.id ?? idx + 1,
    label: n.label,
    icon: ICON_MAP[n.icon] ?? Brain,
    x: n.x, y: n.y, cx: n.cx, cy: n.cy, dur: n.dur
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (sectionRef.current) observer.unobserve(sectionRef.current)
        }
      },
      { rootMargin: '-100px 0px', threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: '#050508',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 5vw',
      }}
    >
      <Starfield />
      <style>{`
        @keyframes flowWire {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -300; }
        }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginBottom: '60px',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            color: '#E0003C',
            display: 'block',
            marginBottom: '0.75rem',
          }}
        >
          KULDEEP'S NEURAL MAP
        </span>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            color: '#F0EEF8',
            margin: 0,
          }}
        >
          THE MIND AT WORK
        </h2>
      </div>

      {/* BRAIN BACKGROUND IMAGE */}
      <img
        src="/brain.png"
        alt="Neural Brain Map"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -45%)',
          width: 'clamp(500px, 65vw, 900px)',
          objectFit: 'contain',
          opacity: 0.5,
          zIndex: 1,
        }}
      />
      {/* Radial Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -45%)',
          width: 'clamp(500px, 65vw, 900px)',
          height: 'clamp(500px, 65vw, 900px)', // maintain square aspect ratio for gradient
          background: 'radial-gradient(ellipse at center, rgba(5,5,8,0.1) 30%, rgba(5,5,8,0.85) 85%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* SVG WIRE LAYER */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
      >
        {/* Define masks for the drawing animation */}
        <defs>
          {NODES.map((node, i) => (
            <mask id={`wipe-mask-${node.id}`} key={`mask-${node.id}`}>
              <path
                d={`M 50% 48% Q ${node.cx}% ${node.cy}% ${node.x}% ${node.y}%`}
                stroke="white"
                strokeWidth="10" // Extra thick to ensure full coverage
                fill="none"
                strokeDasharray="1000 1000"
                strokeDashoffset={isVisible ? 0 : 1000}
                style={{
                  transition: `stroke-dashoffset 0.8s ease ${0.3 * i}s`,
                }}
              />
            </mask>
          ))}
        </defs>

        {NODES.map((node, i) => (
          <g key={`wire-group-${node.id}`}>
            {/* The actual dashed flowing wire, revealed by the mask */}
            <path
              d={`M 50% 48% Q ${node.cx}% ${node.cy}% ${node.x}% ${node.y}%`}
              stroke="rgba(224, 0, 60, 0.45)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="6 4"
              mask={`url(#wipe-mask-${node.id})`}
              style={{
                animation: `flowWire ${node.dur}s linear infinite`,
              }}
            />
            {/* The endpoint circle, scaling in when the wire finishes drawing */}
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="4"
              fill="#E0003C"
              filter="drop-shadow(0 0 6px #E0003C)"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `scale(${isVisible ? 1 : 0})`,
                transformOrigin: `${node.x}% ${node.y}%`,
                transition: `all 0.4s ease ${0.3 * i + 0.8}s`,
              }}
            />
          </g>
        ))}
      </svg>

      {/* NODE LABELS */}
      {NODES.map((node, i) => {
        const Icon = node.icon
        return (
          <div
            key={`node-label-${node.id}`}
            style={{
              position: 'absolute',
              top: `${node.y}%`,
              left: `${node.x}%`,
              // Center the node perfectly on the endpoint, but shift slightly so it doesn't overlap the circle
              transform: `translate(${node.x > 50 ? '15px' : 'calc(-100% - 15px)'}, -50%) scale(${isVisible ? 1 : 0.8})`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(13, 13, 20, 0.88)',
              border: '1px solid rgba(224, 0, 60, 0.28)',
              borderRadius: '10px',
              padding: '0.55rem 1rem',
              zIndex: 10,
              cursor: 'default',
              opacity: isVisible ? 1 : 0,
              transition: `opacity 0.4s ease ${0.3 * i + 0.2}s, transform 0.4s ease ${0.3 * i + 0.2}s, border-color 250ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(224,0,60,0.65)'
              e.currentTarget.style.transform = `translate(${node.x > 50 ? '15px' : 'calc(-100% - 15px)'}, -50%) scale(1.06)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(224, 0, 60, 0.28)'
              e.currentTarget.style.transform = `translate(${node.x > 50 ? '15px' : 'calc(-100% - 15px)'}, -50%) scale(1)`
            }}
          >
            <Icon size={14} color="#E0003C" />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#F0EEF8',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </span>
          </div>
        )
      })}
    </section>
  )
}
