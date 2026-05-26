import React from 'react'

interface NavbarProps {
  scrollY: number
}

const NAV_LINKS = ['About', 'Projects', 'Skills', 'Contact'] as const

export default function Navbar({ scrollY }: NavbarProps) {
  // ── Visibility: fade in after ~95 vh of scroll ───────────────────────────
  const heroVh = typeof window !== 'undefined' ? window.innerHeight * 0.95 : 0
  const rawOpacity = Math.min((scrollY - heroVh) / (heroVh * 0.15), 1)
  const navOpacity = Math.max(rawOpacity, 0)

  // ── Background: kick in after the 300vh hero scroll container ────────────
  const heroPx = typeof window !== 'undefined' ? window.innerHeight * 3 : 0
  const hasBg = scrollY > heroPx

  return (
    <nav
      id="navbar"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1.25rem 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: navOpacity,
        pointerEvents: navOpacity < 0.05 ? 'none' : 'all',
        transition: 'opacity 0.3s ease, background 0.4s ease, backdrop-filter 0.4s ease',
        background: hasBg ? 'rgba(5,5,8,0.88)' : 'transparent',
        backdropFilter: hasBg ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: hasBg ? 'blur(16px)' : 'none',
        borderBottom: hasBg ? '1px solid rgba(224,0,60,0.08)' : 'none',
      }}
    >
      {/* ── Logotype ── */}
      <a
        href="#"
        aria-label="Kuldeep Kumar — home"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#E0003C',
          textDecoration: 'none',
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        KK
      </a>

      {/* ── Nav links ── */}
      <ul
        style={{
          display: 'flex',
          gap: '2.5rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {NAV_LINKS.map((label) => (
          <li key={label}>
            <NavLink label={label} href={`#${label.toLowerCase()}`} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ── Sub-component: individual nav link with hover state ──────────────────────
function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.78rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: hovered ? '#F0EEF8' : '#8B8B9E',
        textDecoration: 'none',
        transition: 'color 200ms ease',
      }}
    >
      {label}
    </a>
  )
}
