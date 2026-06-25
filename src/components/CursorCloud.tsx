import { useEffect, useRef } from 'react'

// Global soft scatter cloud that trails the cursor — ported from portfolio2.html.
export default function CursorCloud() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = window.innerWidth, h = window.innerHeight

    function size() {
      w = window.innerWidth; h = window.innerHeight
      cv!.width = w * dpr; cv!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    window.addEventListener('resize', size, { passive: true })

    let mx = w / 2, my = h / 2, active = false
    const parts: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = []
    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY; active = true
      for (let k = 0; k < 2; k++) {
        parts.push({
          x: mx + (Math.random() - 0.5) * 10, y: my + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
          life: 1, size: Math.random() * 2.0 + 0.6,
        })
      }
      if (parts.length > 260) parts.splice(0, parts.length - 260)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    function loop() {
      raf = requestAnimationFrame(loop)
      ctx!.clearRect(0, 0, w, h)
      if (!active) return
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95; p.life -= 0.02
        if (p.life <= 0) { parts.splice(i, 1); continue }
        ctx!.fillStyle = `rgba(17,17,17,${0.20 * p.life})`
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.size, 0, 7); ctx!.fill()
      }
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 95 }}
    />
  )
}
