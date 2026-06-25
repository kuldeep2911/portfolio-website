import { useState } from 'react'
import { usePortfolioData } from '../data/usePortfolioData'

const ROMANS = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.', 'VII.', 'VIII.']

export default function SkillsSection() {
  const { skills } = usePortfolioData()
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section id="skills" style={{
      background: 'var(--bg-soft)', scrollMarginTop: 80,
      borderTop: '1px solid #E5E5E0', borderBottom: '1px solid #E5E5E0',
      padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)',
    }}>
      <style>{`
        .skill-drop { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s cubic-bezier(.25,1,.5,1); }
        .skill-drop.open { grid-template-rows: 1fr; }
        .skill-drop > div { overflow: hidden; }
        .skill-pills { padding: 0 4px 30px 52px; display: flex; flex-wrap: wrap; gap: 10px; opacity: 0; transform: translateY(-8px); transition: opacity .3s ease, transform .3s ease; }
        .skill-drop.open .skill-pills { opacity: 1; transform: translateY(0); transition-delay: .1s; }
        .skill-icon { transition: transform .3s ease; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>Technical arsenal</span>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(40px,6vw,76px)', lineHeight: 1.04, letterSpacing: '-.01em', color: 'var(--ink)', margin: '14px 0 0' }}>What I know.</h2>

        <div style={{ borderTop: '1px solid #E5E5E0', marginTop: 'clamp(40px,6vh,56px)', maxWidth: 1000 }}>
          {skills.map((sg, i) => {
            const open = openIdx === i
            return (
              <div key={sg.id ?? sg.category} style={{ borderBottom: '1px solid #E5E5E0' }}>
                <button
                  onMouseEnter={() => setOpenIdx(i)}
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  aria-expanded={open}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, padding: '26px 4px', textAlign: 'left' }}
                >
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-soft)', width: 28, flexShrink: 0 }}>{ROMANS[i] || `${i + 1}.`}</span>
                  <span style={{ flex: 1, fontSize: 'clamp(18px,2vw,23px)', fontWeight: 500, letterSpacing: '-.01em', color: 'var(--ink)' }}>{sg.category}</span>
                  <span className="skill-icon" style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--ink)', transform: open ? 'rotate(135deg)' : 'rotate(0deg)' }}>+</span>
                </button>

                <div className={`skill-drop ${open ? 'open' : ''}`}>
                  <div>
                    <div className="skill-pills">
                      {sg.items.map(it => (
                        <span key={it.name} style={{ background: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: 999, padding: '9px 16px', fontSize: 14, color: 'var(--ink)' }}>{it.name}</span>
                      ))}
                    </div>
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
