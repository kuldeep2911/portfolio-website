import { useEffect, useRef, useState } from 'react'
import Starfield from './Starfield'
import { usePortfolioData } from '../data/usePortfolioData'



function SpeechBubble({ isVisible, lines }: { isVisible: boolean; lines: string[] }) {
  const [currentLineIdx, setCurrentLineIdx] = useState(0)
  const [currentCharIdx, setCurrentCharIdx] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    if (currentLineIdx >= lines.length) return // All done

    const currentLineText = lines[currentLineIdx]

    if (currentCharIdx < currentLineText.length) {
      // Type next character
      const timer = setTimeout(() => {
        setCurrentCharIdx((prev) => prev + 1)
      }, 25)
      return () => clearTimeout(timer)
    } else {
      // Line finished, wait before starting next line
      const timer = setTimeout(() => {
        setCurrentLineIdx((prev) => prev + 1)
        setCurrentCharIdx(0)
      }, 1400)
      return () => clearTimeout(timer)
    }
  }, [isVisible, currentLineIdx, currentCharIdx])

  return (
    <>
      <style>{`
        @keyframes typing-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blinking-cursor {
          color: #E0003C;
          animation: typing-blink 0.7s step-end infinite;
          margin-left: 2px;
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          background: 'rgba(13, 13, 20, 0.92)',
          border: '1.5px solid rgba(224, 0, 60, 0.3)',
          borderRadius: '20px 20px 20px 4px',
          padding: '1.75rem 2rem',
          maxWidth: '500px',
          boxShadow: '0 0 40px rgba(224, 0, 60, 0.07), 0 0 0 1px rgba(224,0,60,0.05)',
        }}
      >
        {/* CSS Triangle Pointer */}
        <div
          style={{
            position: 'absolute',
            bottom: '-12px',
            left: '24px',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '12px 12px 0 0',
            borderColor: 'rgba(224, 0, 60, 0.3) transparent transparent transparent',
          }}
        >
          {/* Inner cover to hide border overlap */}
          <div
            style={{
              position: 'absolute',
              top: '-13px',
              left: '1px',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '11px 10px 0 0',
              borderColor: '#0D0D14 transparent transparent transparent',
            }}
          />
        </div>

        {lines.map((line, idx) => {
          // If we haven't reached this line yet, don't render it at all
          if (idx > currentLineIdx) return null

          const isCurrentLine = idx === currentLineIdx
          const textToShow = isCurrentLine ? line.slice(0, currentCharIdx) : line

          return (
            <p
              key={idx}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: '#F0EEF8',
                opacity: isCurrentLine ? 1 : 0.55,
                margin: idx === 0 ? 0 : '0.5rem 0 0 0',
                minHeight: '1.75rem',
              }}
            >
              {textToShow}
              {isCurrentLine && <span className="blinking-cursor">|</span>}
            </p>
          )
        })}
        {/* Final blinking cursor when everything is typed */}
        {currentLineIdx >= lines.length && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.95rem',
              lineHeight: 1.75,
              color: '#F0EEF8',
              margin: '0.5rem 0 0 0',
              opacity: 1,
            }}
          >
            <span className="blinking-cursor">|</span>
          </p>
        )}
      </div>
    </>
  )
}

const DEFAULT_STATS = [
  { value: "8.56 GPA", label: "Academic Score" },
  { value: "2 Publications", label: "Research Output" },
  { value: "3 Projects", label: "Built & Shipped" }
]

export default function RobotIntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { profile } = usePortfolioData()

  const robotLines = profile?.robot_lines?.length ? profile.robot_lines : [
    "Oh hey — you must be here to learn about Kuldeep.",
    "He's a third-year AI & ML engineer at Manipal University — GPA 8.56, published researcher, and patent holder.",
    "He builds things that think: LLMs, RAG systems, neural networks. The kind of work that gets noticed."
  ]
  const stats = profile?.stats?.length ? profile.stats : DEFAULT_STATS

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, we can stop observing
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
      id="about"
      style={{
        minHeight: '100vh',
        background: '#050508',
        padding: '80px 5vw',
        overflow: 'hidden', // prevent horizontal scroll from animations
        position: 'relative',
      }}
    >
      <Starfield />
      <div
        className="max-w-7xl mx-auto w-full"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          // Mobile: column (reversed below in CSS), Desktop: 2 columns
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
          minHeight: 'calc(100vh - 160px)',
        }}
      >
        {/* LEFT SIDE (Text) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
          className="order-2 md:order-1 lg:w-[110%]" // mobile reversed
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              color: '#E0003C',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            Hello, World.
          </p>

          <SpeechBubble isVisible={isVisible} lines={robotLines} />

          {/* Stats Row */}
          <div
            style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '2.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              flexWrap: 'wrap',
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                  opacity: isVisible ? 1 : 0,
                  transition: `transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.4 + i * 0.1}s, opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${0.4 + i * 0.1}s`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: '#F0EEF8',
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    color: '#8B8B9E',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginTop: '0.25rem',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (Robot) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '500px',
            transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s, opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s',
            position: 'relative',
            overflow: 'hidden', // Crops the overflown inner container
            borderRadius: '16px'
          }}
          className="order-1 md:order-2" // mobile reversed
        >
          {/* Inner container made taller to push the bottom UI out of the visible bounds, keeping the robot centered */}
          <div style={{ position: 'absolute', top: '-70px', left: 0, width: '100%', height: 'calc(100% + 140px)' }}>
            {/* @ts-ignore - Web component loaded via index.html script */}
            <spline-viewer 
              url="https://prod.spline.design/VyeGLhLqmm9Ly0l1/scene.splinecode" 
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
