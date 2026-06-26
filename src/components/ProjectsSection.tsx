import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { usePortfolioData, type ProjectData } from '../data/usePortfolioData';

const pad = (n: number) => String(n).padStart(2, '0');
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
function titleCase(s: string) { return s.replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase()); }

function highlightsOf(p: ProjectData): string[] {
  return (p.bento_texts || [])
    .map(v => (typeof v === 'string' ? v : (v && typeof v === 'object' ? ((v as any).value || (v as any).label || '') : ''))) // eslint-disable-line @typescript-eslint/no-explicit-any
    .filter(Boolean);
}

const actionStyle: CSSProperties = {
  border: '1px solid var(--ink)', borderRadius: 999, padding: '8px 16px', color: 'var(--ink)',
  fontFamily: 'var(--sans)', fontSize: 12.5, textDecoration: 'none', whiteSpace: 'nowrap', background: 'var(--surface)',
};

export default function ProjectsSection() {
  const { projects: dbProjects } = usePortfolioData();
  const projects = dbProjects || [];
  const N = projects.length;

  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Signature of the current project set — re-run the animation whenever the
  // list changes (e.g. static fallback → live Supabase data), not just on count.
  const idsKey = projects.map(p => p.id).join('|');

  useLayoutEffect(() => {
    const wrap = wrapRef.current, pin = pinRef.current;
    if (!wrap || !pin) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      // Read refs LIVE each frame so newly-mounted cards are always positioned.
      const cards = cardRefs.current.slice(0, N).filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;
      const count = cards.length;
      const total = wrap.offsetHeight - window.innerHeight;
      const scrolled = clamp(-wrap.getBoundingClientRect().top, 0, total);
      const p = total > 0 ? (scrolled / total) * (count - 1) : 0;

      // Space cards by their actual width + a gap so they never overlap.
      const cardW = cards[0].offsetWidth;
      const gap = Math.max(96, pin.clientWidth * 0.14);
      const step = cardW + gap;

      cards.forEach((card, i) => {
        const off = i - p;            // 0 = centered, +1 = one to the right
        const a = Math.abs(off);
        const scale = 1 - clamp(a, 0, 1.5) * 0.12;
        const rot = clamp(off, -1.2, 1.2) * -7;   // subtle 3D swing
        card.style.transform = `translate(-50%, -50%) translateX(${off * step}px) scale(${scale}) rotateY(${rot}deg)`;
        card.style.opacity = clamp(1.18 - a, 0, 1).toFixed(3);
        card.style.zIndex = String(100 - Math.round(a * 10));
        card.style.pointerEvents = a < 0.5 ? 'auto' : 'none';
      });

      const active = clamp(Math.round(p), 0, count - 1);
      if (countRef.current) countRef.current.textContent = pad(active + 1);
      dotRefs.current.slice(0, N).forEach((d, i) => {
        if (!d) return;
        const on = i === active;
        d.style.background = on ? 'var(--ink)' : 'transparent';
        d.style.transform = on ? 'scale(1.35)' : 'scale(1)';
      });
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    const r2 = requestAnimationFrame(update); // re-run next frame after layout/fonts settle
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(r2);
    };
  }, [N, idsKey]);

  return (
    <section id="projects" style={{ background: 'var(--bg)', position: 'relative', zIndex: 10, scrollMarginTop: 80 }}>
      <style>{`
        @keyframes livePulse { 0%,100%{ transform:scale(1); opacity:1 } 50%{ transform:scale(.5); opacity:.4 } }
        .pl { transition: background .2s ease, color .2s ease; }
        .pl:hover { background:#111 !important; color:#F7F7F5 !important; }
        .hl-row { transition: background .25s ease; }
        .hl-row:hover { background:#F1F1EE; }
        @media (max-width:760px){
          .pcard{ grid-template-columns:1fr !important; }
          .pcard-left{ border-right:none !important; border-bottom:1px solid var(--line); }
          .pcard-right{ padding-top:28px !important; justify-content:flex-start !important; }
          .pcard-actions{ position:static !important; padding:18px 24px 0; justify-content:flex-start; }
        }
      `}</style>

      {/* intro — scrolls away as the swipe pins */}
      <div style={{ padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px) clamp(36px,5vh,60px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>Selected work</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(40px,6vw,76px)', lineHeight: 1.04, letterSpacing: '-.01em', color: 'var(--ink)', margin: '14px 0 0' }}>Projects.</h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-soft)', margin: '14px 0 0' }}>Keep scrolling — each card slides in from the right while the previous glides off to the left.</p>
        </div>
      </div>

      {/* pinned horizontal swipe */}
      <div ref={wrapRef} style={{ position: 'relative', height: `${Math.max(2, N) * 100}vh` }}>
        <div ref={pinRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: 1600 }}>
          {/* counter */}
          <div style={{ position: 'absolute', top: 40, right: 'clamp(20px,6vw,64px)', zIndex: 50, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-soft)', letterSpacing: '.1em', pointerEvents: 'none' }}>
            <span ref={countRef} style={{ color: 'var(--ink)', fontSize: 16 }}>01</span> / {pad(N)}
          </div>

          {/* cards */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {projects.map((project, index) => {
              const highlights = highlightsOf(project);
              return (
                <div
                  key={index}
                  ref={el => { cardRefs.current[index] = el; }}
                  style={{ position: 'absolute', top: '50%', left: '50%', width: 'min(1060px, 86vw)', transform: 'translate(-50%, -50%)', willChange: 'transform, opacity' }}
                >
                  <div className="pcard" style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 24, boxShadow: '0 40px 90px -50px rgba(17,17,17,.5)', display: 'grid', gridTemplateColumns: 'minmax(280px, 420px) 1fr', overflow: 'hidden', minHeight: 380 }}>
                    {/* actions */}
                    <div className="pcard-actions" style={{ position: 'absolute', top: 24, right: 26, display: 'flex', gap: 10, zIndex: 4 }}>
                      {project.github_url && <a className="pl" href={project.github_url} target="_blank" rel="noopener noreferrer" style={actionStyle}>GitHub →</a>}
                      {project.demo_url && <a className="pl" href={project.demo_url} target="_blank" rel="noopener noreferrer" style={actionStyle}>Live demo →</a>}
                      {project.video_url && <a className="pl" href={project.video_url} target="_blank" rel="noopener noreferrer" style={actionStyle}>Demo video →</a>}
                    </div>

                    {/* left — identity */}
                    <div className="pcard-left" style={{ padding: '36px 34px', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                        <span style={{ fontFamily: 'var(--serif)', fontSize: 54, lineHeight: .82, color: 'var(--ink)' }}>{pad(index + 1)}</span>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 6 }}>
                          {project.status && project.status.trim() !== '' && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 999, padding: '4px 11px' }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ink)', animation: 'livePulse 1.8s ease-in-out infinite' }} />
                              {titleCase(project.status)}
                            </span>
                          )}
                          {project.category && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: 999, padding: '4px 11px' }}>{project.category.toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <h3 style={{ fontFamily: 'var(--sans)', fontSize: 25, fontWeight: 600, letterSpacing: '-.015em', color: 'var(--ink)', margin: '22px 0 0', lineHeight: 1.2 }}>{project.title}</h3>
                      <p style={{ fontFamily: 'var(--sans)', fontSize: 15, lineHeight: 1.55, color: 'var(--ink-soft)', margin: '13px 0 0' }}>{project.description}</p>
                      <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                        {(project.tags || []).map(t => <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)', background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 999, padding: '3px 11px' }}>{t}</span>)}
                      </div>
                    </div>

                    {/* right — highlights */}
                    <div className="pcard-right" style={{ padding: '60px 38px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg)' }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>What it does</div>
                      {highlights.length === 0 ? (
                        <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{project.long_description || project.description}</p>
                      ) : highlights.map((h, i) => (
                        <div key={i} className="hl-row" style={{ display: 'flex', gap: 18, alignItems: 'baseline', padding: '16px 12px', borderRadius: 12, borderBottom: i < highlights.length - 1 ? '1px solid var(--line)' : 'none' }}>
                          <span style={{ fontFamily: 'var(--serif)', fontSize: 21, color: '#bdbdb4', width: 28, flexShrink: 0 }}>{pad(i + 1)}</span>
                          <span style={{ fontFamily: 'var(--sans)', fontSize: 15.5, lineHeight: 1.5, color: 'var(--ink)', flex: 1 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* progress dots */}
          <div style={{ position: 'absolute', bottom: 46, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 50 }}>
            {projects.map((_, i) => (
              <span key={i} ref={el => { dotRefs.current[i] = el; }} style={{ width: 9, height: 9, borderRadius: '50%', border: '1px solid var(--ink)', background: 'transparent', transition: 'background .25s ease, transform .25s ease' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
