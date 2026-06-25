import React from 'react'
import { Network, Bot, Cpu, Brain, Code, Database, Activity, Server, Eye } from 'lucide-react'
import { usePortfolioData } from '../data/usePortfolioData'

const ICONS: Record<string, React.ElementType> = {
  Network, Bot, Cpu, Brain, Code, Database, Activity, Server, Eye,
}

// Currently Building · Expanding Focus. Cards share a row; hovering one expands
// it and reveals its highlights. Content is driven by the `ongoing` CMS data.
export default function OngoingSection() {
  const { ongoing } = usePortfolioData()
  const delays = ['0s', '.8s', '1.6s', '2.4s']

  return (
    <section id="building" style={{ background: 'var(--bg)', scrollMarginTop: 80, padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)' }}>
      <style>{`
        @keyframes livePulse { 0%,100%{ transform:scale(1); opacity:1 } 50%{ transform:scale(.55); opacity:.4 } }
        @keyframes scan { 0%{ transform:translateY(-120%) } 100%{ transform:translateY(820%) } }
        .obx-card { transition: flex-grow .55s cubic-bezier(.22,1,.36,1); }
        .obx-row:hover .obx-card { flex-grow:.62; }
        .obx-row .obx-card:hover { flex-grow:2.6; }
        .obx-card:hover .obx-scan { opacity:1; }
        .obx-card:hover .obx-body { opacity:1; transform:translateY(0); }
        @media (max-width:860px){
          .obx-row{ flex-direction:column; height:auto !important; }
          .obx-card{ flex:none !important; min-height:230px; }
          .obx-row:hover .obx-card, .obx-row .obx-card:hover { flex-grow:0; }
          .obx-body{ opacity:1 !important; transform:none !important; }
          .obx-body span{ white-space:normal !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px,6vw,64px)', fontWeight: 400, color: 'var(--ink)', margin: 0, lineHeight: 1.04, letterSpacing: '-.01em' }}>Currently building.</h2>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 400, color: 'var(--ink-soft)', margin: '6px 0 0', lineHeight: 1.12 }}>Pushing the boundaries of what AI can do.</p>

        <div className="obx-row" style={{ display: 'flex', gap: 14, marginTop: 40, height: 440 }}>
          {/* image card */}
          <div className="obx-card" style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, border: '1px solid var(--line)', flex: 1, minWidth: 0 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/ongoing.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(247,247,245,.96) 0%, rgba(247,247,245,.4) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, fontFamily: 'var(--serif)', fontSize: 23, lineHeight: 1.15, color: 'var(--ink)' }}>Building minds,<br />not just models.</div>
          </div>

          {/* feature cards from CMS data */}
          {ongoing.map((o, i) => {
            const Icon = ICONS[o.icon] || Cpu
            const planning = (o.status || '').toLowerCase().includes('plan')
            const statusLabel = (o.status || '').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())
            return (
              <div key={o.id} className="obx-card" style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, flex: 1, minWidth: 0, cursor: 'pointer' }}>
                <div className="obx-scan" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '38%', background: 'linear-gradient(to bottom, transparent, rgba(17,17,17,.05))', opacity: 0, transition: 'opacity .4s ease', animation: `scan 3.4s linear infinite ${delays[i] || '0s'}`, pointerEvents: 'none' }} />
                <div style={{ position: 'relative', height: '100%', padding: 26, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 11, padding: 9, display: 'flex' }}>
                      <Icon size={20} color="#111" strokeWidth={1.6} />
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)' }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  {o.status && o.status.trim() !== '' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start', marginTop: 18, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', color: planning ? 'var(--ink-soft)' : 'var(--ink)', background: planning ? 'var(--bg)' : 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 999, padding: '4px 10px' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: planning ? 'transparent' : 'var(--ink)', border: planning ? '1px solid var(--ink-soft)' : 'none', animation: planning ? 'none' : 'livePulse 1.6s ease-in-out infinite' }} />
                      {statusLabel}
                    </span>
                  )}

                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 27, fontWeight: 400, color: 'var(--ink)', margin: '16px 0 0', lineHeight: 1.1 }}>{o.title}</h3>

                  <div className="obx-body" style={{ opacity: 0, transform: 'translateY(10px)', transition: 'opacity .45s ease .1s, transform .45s ease .1s', display: 'flex', flexDirection: 'column', gap: 11, marginTop: 18 }}>
                    {o.highlights.map((h, hi) => (
                      <div key={hi} style={{ display: 'flex', gap: 9 }}>
                        <span style={{ color: 'var(--ink)', fontSize: 12, marginTop: 1 }}>—</span>
                        <span style={{ fontFamily: 'var(--sans)', fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, whiteSpace: 'nowrap' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
