import { useEffect, useRef, useState } from 'react'
import LoadingScreen from './LoadingScreen'

// ── Config ────────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 240
const FRAME_FOLDER = '/ezgif-6a023c42befa4775-jpg'
const FRAME_PREFIX = 'ezgif-frame-'

// How many viewport-heights of scroll it takes to play all 240 frames.
// 3.5 = animation completes after scrolling 3.5 × viewport height — cinematic pace.
// The 300vh scroll container still exists, so content beyond the animation is reachable.
const HERO_SCROLL_VH = 2.5

// Frame window during which the text overlay is visible (1-indexed, inclusive)
const TEXT_FRAME_IN = 0         // heroP at which text starts fading in
const TEXT_FRAME_OUT = 100 / 239  // heroP at which text finishes fading out (~frame 80)

function pad3(n: number) {
  return String(n).padStart(3, '0')
}

// ── object-fit:cover equivalent for canvas ────────────────────────────────────
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  if (!iw || !ih) return

  // Scale so the image FILLS the canvas (cover, not contain)
  const scale = Math.max(cw / iw, ch / ih)
  const sw = cw / scale          // source width after scaling
  const sh = ch / scale          // source height after scaling
  const sx = (iw - sw) / 2      // center-crop x
  const sy = (ih - sh) / 2      // center-crop y

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const isReadyRef = useRef(false)
  const lastIdxRef = useRef(-1)

  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // ── Set canvas pixel dimensions to match viewport ──────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Re-draw current frame at new resolution
      const idx = Math.max(lastIdxRef.current, 0)
      const img = framesRef.current[idx]
      if (img?.naturalWidth) {
        const ctx = canvas.getContext('2d')
        if (ctx) drawCover(ctx, img, canvas.width, canvas.height)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Preload all frames ─────────────────────────────────────────────────────
  useEffect(() => {
    const images: HTMLImageElement[] = Array.from({ length: TOTAL_FRAMES }, () => new Image())
    let done = 0

    images.forEach((img, i) => {
      img.onload = img.onerror = () => {
        done++
        setProgress(Math.round((done / TOTAL_FRAMES) * 100))

        if (done === TOTAL_FRAMES) {
          framesRef.current = images
          isReadyRef.current = true

          // Draw frame 0 before the loading screen fades so canvas isn't blank
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          if (ctx && canvas && images[0]?.naturalWidth) {
            drawCover(ctx, images[0], canvas.width, canvas.height)
          }

          setIsLoaded(true)
        }
      }
      img.src = `${FRAME_FOLDER}/${FRAME_PREFIX}${pad3(i + 1)}.jpg`
    })

    // No cleanup needed — image loading is idempotent on re-mount
  }, [])

  // ── Scroll → canvas render (pure DOM, zero React re-renders) ───────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf = 0

    const render = () => {
      if (!isReadyRef.current) return

      const scrollY = window.scrollY
      const vh = window.innerHeight

      // Progress: 0 → 1 over the first HERO_SCROLL_VH viewport-heights of scroll
      const raw = scrollY / (vh * HERO_SCROLL_VH)
      const heroP = Math.min(Math.max(raw, 0), 1)

      // ── Text overlay opacity: visible frames 1–80, then gone ──────────────
      const overlay = overlayRef.current
      if (overlay) {
        const fadeInEnd = TEXT_FRAME_IN + (10 / 239)   // fade in over first 10 frames
        const fadeOutStart = TEXT_FRAME_OUT - (12 / 239) // start fading out 12 frames before frame 80
        let op = 0
        if (heroP <= TEXT_FRAME_IN) {
          op = 0
        } else if (heroP < fadeInEnd) {
          op = (heroP - TEXT_FRAME_IN) / (fadeInEnd - TEXT_FRAME_IN)
        } else if (heroP < fadeOutStart) {
          op = 1
        } else if (heroP < TEXT_FRAME_OUT) {
          op = 1 - (heroP - fadeOutStart) / (TEXT_FRAME_OUT - fadeOutStart)
        } else {
          op = 0
        }
        overlay.style.opacity = String(Math.max(0, Math.min(1, op)))
      }

      // ── Draw the correct frame ─────────────────────────────────────────────
      const idx = Math.min(Math.floor(heroP * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
      const frame = framesRef.current[idx]

      if (idx !== lastIdxRef.current && frame?.naturalWidth) {
        lastIdxRef.current = idx
        const ctx = canvas.getContext('2d')
        if (ctx) drawCover(ctx, frame, canvas.width, canvas.height)
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(render)
    }

    // Render as soon as frames are ready (handles the page-load / zero-scroll case)
    const pollReady = () => {
      if (isReadyRef.current) {
        render()
      } else {
        raf = requestAnimationFrame(pollReady)
      }
    }
    pollReady()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, []) // runs once — all mutable state lives in refs

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <>
      <LoadingScreen isLoaded={isLoaded} progress={progress} />

      {/* Canvas: fixed, full-screen, behind everything */}
      <canvas
        ref={canvasRef}
        id="hero-canvas"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          display: 'block',
        }}
      />

      {/* Gradient vignette overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, transparent 30%, transparent 70%, rgba(5,5,8,0.9) 100%)',
        }}
      />

      {/*
        Scroll spacer — 300vh tall so the page is scrollable.
        position:relative keeps it in normal flow so it contributes to page height.
      */}
      <div
        id="hero-scroll-container"
        style={{ position: 'relative', height: '300vh', zIndex: 1 }}
        aria-label="Hero scroll section"
      />

      {/*
        Quote overlay — pinned to the LEFT side of the viewport so it never
        overlaps the brain (which sits centre/right in the frame).
        Opacity is driven entirely by DOM mutation — no React re-renders.
      */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '5vw',
          transform: 'translateY(-50%)',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'opacity',
          maxWidth: '38vw',   // keeps text well left of the brain
        }}
      >
        {/* Futuristic accent line above */}
        <div
          style={{
            width: '48px',
            height: '2px',
            background: 'linear-gradient(90deg, #E0003C, transparent)',
            marginBottom: '1.2rem',
          }}
        />

        {/* Main quote */}
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#F0EEF8',
            textShadow: '0 0 40px rgba(224,0,60,0.45), 0 0 80px rgba(224,0,60,0.2)',
          }}
        >
          Everything<br />
          begins<br />
          in the<br />
          mind.
        </p>

        {/* Futuristic sub-label */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.6rem, 0.9vw, 0.8rem)',
            fontWeight: 400,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#E0003C',
            margin: '1.4rem 0 0',
            opacity: 0.85,
          }}
        >
          AI / ML · KULDEEP KUMAR
        </p>

        {/* Vertical accent rule */}
        <div
          style={{
            width: '1px',
            height: '56px',
            background: 'linear-gradient(to bottom, #E0003C, transparent)',
            marginTop: '1.2rem',
          }}
        />
      </div>
    </>
  )
}
