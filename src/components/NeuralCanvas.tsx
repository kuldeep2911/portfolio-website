import { useEffect, useRef } from 'react'

// 2D neural constellation — drifting nodes linked by faint lines.
// Used as an accent inside cards (About, Building, Contact).
export default function NeuralCanvas({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0, h = 0
    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = []

    function size() {
      const c = cv!
      w = c.clientWidth || c.parentElement!.clientWidth
      h = c.clientHeight || c.parentElement!.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(18, Math.round((w * h) / 9000))
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.8,
      }))
    }
    size()
    window.addEventListener('resize', size, { passive: true })

    let raf = 0
    function loop() {
      raf = requestAnimationFrame(loop)
      ctx!.clearRect(0, 0, w, h)
      pts.forEach(pt => {
        pt.x += pt.vx; pt.y += pt.vy
        if (pt.x < 0 || pt.x > w) pt.vx *= -1
        if (pt.y < 0 || pt.y > h) pt.vy *= -1
      })
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 92) {
          ctx!.strokeStyle = `rgba(17,17,17,${(1 - d / 92) * 0.16})`
          ctx!.lineWidth = 1
          ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke()
        }
      }
      ctx!.fillStyle = 'rgba(17,17,17,0.55)'
      pts.forEach(pt => { ctx!.beginPath(); ctx!.arc(pt.x, pt.y, pt.r, 0, 7); ctx!.fill() })
    }
    loop()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size) }
  }, [])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', ...style }} />
}
