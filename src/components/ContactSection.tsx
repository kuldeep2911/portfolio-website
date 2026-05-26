import React, { useEffect, useRef, useState } from 'react'
import { Github, Linkedin, FileText } from 'lucide-react'
import { socialLinks } from '../data/portfolio'

const githubLink = socialLinks.find(s => s.platform === 'GitHub')?.url || '#'
const linkedinLink = socialLinks.find(s => s.platform === 'LinkedIn')?.url || '#'

const SOCIAL_LINKS = [
  { 
    icon: Github, 
    label: 'GitHub', 
    sub: 'github.com/kuldeep',
    href: githubLink,
    download: false,
  },
  { 
    icon: Linkedin, 
    label: 'LinkedIn',
    sub: 'kuldeep-kumar-99717031a',
    href: linkedinLink,
    download: false,
  },
  { 
    icon: FileText, 
    label: 'Resume',
    sub: 'Download PDF',
    href: '/resume.pdf',
    download: true,
  },
];

export default function ContactSection() {
  const robotRef = useRef<HTMLDivElement>(null)
  const [bubbleVisible, setBubbleVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBubbleVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (robotRef.current) {
      observer.observe(robotRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    alert('Message sent! (Demo)')
  }

  return (
    <section
      id="contact"
      style={{
        background: '#050508',
        padding: '100px 5vw 0',
        position: 'relative',
      }}
    >
      {/* ── TOP HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            color: '#E0003C',
            marginBottom: '0.75rem',
          }}
        >
          GET IN TOUCH
        </div>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
            fontWeight: 700,
            color: '#F0EEF8',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Let's build something
        </h2>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            background: 'linear-gradient(135deg, #E0003C 0%, #FF4D6D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          remarkable together.
        </h2>
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <div className="contact-grid" style={{ display: 'grid', gap: '4rem', alignItems: 'start' }}>
        <style>
          {`
            .contact-grid {
              grid-template-columns: 1fr;
            }
            @media (min-width: 768px) {
              .contact-grid {
                grid-template-columns: 45% 55%;
              }
            }
            .contact-input {
              width: 100%;
              background: rgba(13,13,20,0.8);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 10px;
              color: #F0EEF8;
              font-family: 'Inter', sans-serif;
              font-size: 0.9rem;
              padding: 0 1rem;
              outline: none;
              transition: 200ms;
              box-sizing: border-box;
            }
            .contact-input:focus {
              border-color: rgba(224,0,60,0.45);
              box-shadow: 0 0 0 3px rgba(224,0,60,0.07);
            }
            .submit-btn {
              width: 100%;
              height: 52px;
              border-radius: 10px;
              background: linear-gradient(123deg, #4A1280 0%, #E0003C 50%, #FF4D6D 100%);
              color: white;
              font-family: 'Space Grotesk', sans-serif;
              font-size: 0.88rem;
              font-weight: 600;
              letter-spacing: 0.08em;
              border: none;
              cursor: pointer;
              transition: all 200ms;
            }
            .submit-btn:hover {
              filter: brightness(1.1);
              transform: scale(1.015);
              box-shadow: 0 8px 24px rgba(224,0,60,0.25);
            }
            .submit-btn:active {
              transform: scale(0.99);
            }
            .social-link {
              background: rgba(13,13,20,0.6);
              border: 1px solid rgba(255,255,255,0.07);
              border-radius: 14px;
              padding: 1.25rem 2rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.4rem;
              text-decoration: none;
              transition: 250ms;
              min-width: 150px;
              flex: 1;
              max-width: 250px;
            }
            .social-link:hover {
              border-color: rgba(224,0,60,0.32);
              background: rgba(13,13,20,0.9);
            }
            .social-link:hover .social-icon {
              color: #E0003C !important;
            }
          `}
        </style>

        {/* LEFT SIDE: ROBOT */}
        <div ref={robotRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Speech Bubble */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(13, 13, 20, 0.9)',
              border: '1.5px solid rgba(224, 0, 60, 0.3)',
              borderRadius: '16px 16px 16px 4px',
              padding: '1rem 1.25rem',
              maxWidth: '280px',
              marginBottom: '0.5rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              fontStyle: 'italic',
              color: 'rgba(240, 238, 248, 0.85)',
              opacity: bubbleVisible ? 1 : 0,
              transform: bubbleVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
            }}
          >
            "I'll make sure Kuldeep reads your message first."
          </div>

          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '500px', 
            overflow: 'hidden', 
            borderRadius: '16px' 
          }}>
            <div style={{ position: 'absolute', top: '-70px', left: 0, width: '100%', height: 'calc(100% + 140px)' }}>
              {/* @ts-ignore - custom element */}
              <spline-viewer
                url="https://prod.spline.design/VyeGLhLqmm9Ly0l1/scene.splinecode"
                style={{ width: '100%', height: '100%', background: 'transparent' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CONTACT FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                color: '#8B8B9E',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              YOUR NAME
            </label>
            <input
              type="text"
              className="contact-input"
              style={{ height: '52px' }}
              required
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                color: '#8B8B9E',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              YOUR EMAIL
            </label>
            <input
              type="email"
              className="contact-input"
              style={{ height: '52px' }}
              required
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                color: '#8B8B9E',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              YOUR MESSAGE
            </label>
            <textarea
              className="contact-input"
              style={{ height: '140px', padding: '0.85rem 1rem', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            SEND MESSAGE
          </button>
        </form>
      </div>

      {/* ── SOCIAL LINKS ROW ── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '3rem',
          marginTop: '4rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        {SOCIAL_LINKS.map((link, idx) => {
          const Icon = link.icon
          return (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              download={link.download ? true : undefined}
              className="social-link"
            >
              <Icon className="social-icon" size={20} color="#8B8B9E" style={{ transition: 'color 250ms' }} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#F0EEF8',
                  marginTop: '0.2rem',
                }}
              >
                {link.label}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.72rem',
                  color: '#8B8B9E',
                }}
              >
                {link.sub}
              </span>
            </a>
          )
        })}
      </div>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: '2rem 0',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.06em',
          marginTop: '2rem',
        }}
      >
        © 2025 Kuldeep Kumar · AI/ML Engineer · Built with intelligence.
      </footer>
    </section>
  )
}
