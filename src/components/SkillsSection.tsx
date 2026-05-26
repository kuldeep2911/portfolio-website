import { useState } from 'react'
import { Plus } from 'lucide-react'
import Starfield from './Starfield'
import { usePortfolioData } from '../data/usePortfolioData'

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V']

export default function SkillsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { skills: dbSkills } = usePortfolioData()
  const skills = dbSkills

  return (
    <section
      id="skills"
      style={{
        minHeight: '100vh',
        background: '#050508',
        padding: '120px 5vw 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Starfield />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            color: '#E0003C',
            display: 'block',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
          }}
        >
          TECHNICAL ARSENAL
        </span>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.05,
            background: 'linear-gradient(180deg, #3D1520 0%, #E0003C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          WHAT I KNOW
        </h2>
      </div>

      <div style={{ 
        width: '100%', 
        maxWidth: '1100px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem'
      }}>
        <style>
          {`
            .accordion-item {
              background: linear-gradient(145deg, rgba(25, 25, 30, 0.4), rgba(10, 10, 15, 0.4));
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
              transition: border-color 0.3s ease, background 0.3s ease;
            }
            .accordion-item:hover {
              border-color: rgba(224, 0, 60, 0.2);
              background: linear-gradient(145deg, rgba(30, 30, 35, 0.5), rgba(15, 15, 20, 0.5));
            }
            .accordion-item.active {
              border-color: rgba(224, 0, 60, 0.4);
            }
            .accordion-header {
              padding: 1.5rem 2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              user-select: none;
            }
            .accordion-title {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 1.1rem;
              font-weight: 500;
              color: #F0EEF8;
              display: flex;
              align-items: center;
              gap: 1rem;
            }
            .accordion-icon {
              transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
              color: rgba(255, 255, 255, 0.4);
            }
            .accordion-item.active .accordion-icon {
              transform: rotate(45deg);
              color: #E0003C;
            }
            .accordion-content-wrapper {
              display: grid;
              grid-template-rows: 0fr;
              transition: grid-template-rows 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .accordion-item.active .accordion-content-wrapper {
              grid-template-rows: 1fr;
            }
            .accordion-content {
              overflow: hidden;
            }
            .accordion-inner {
              padding: 0 2rem 1.5rem 2rem;
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              opacity: 0;
              transform: translateY(-10px);
              transition: opacity 0.3s ease, transform 0.3s ease;
            }
            .accordion-item.active .accordion-inner {
              opacity: 1;
              transform: translateY(0);
              transition-delay: 0.1s;
            }
            .skill-pill {
              font-family: 'Inter', sans-serif;
              font-size: 0.85rem;
              color: #F0EEF8;
              background: rgba(224, 0, 60, 0.06);
              border: 1px solid rgba(224, 0, 60, 0.16);
              border-radius: 999px;
              padding: 6px 16px;
              cursor: default;
              transition: all 200ms;
            }
            .skill-pill:hover {
              background: rgba(224, 0, 60, 0.14);
              border-color: rgba(224, 0, 60, 0.45);
              transform: translateY(-2px);
            }
          `}
        </style>

        {skills.map((skillGroup, index) => {
          const isActive = openIndex === index
          return (
            <div key={skillGroup.category} className={`accordion-item ${isActive ? 'active' : ''}`}>
              <div 
                className="accordion-header"
                onMouseEnter={() => setOpenIndex(index)}
              >
                <div className="accordion-title">
                  <span style={{ color: '#8B8B9E', fontSize: '0.9rem', width: '24px' }}>
                    {ROMAN_NUMERALS[index] || index + 1}.
                  </span>
                  {skillGroup.category}
                </div>
                <Plus size={20} className="accordion-icon" />
              </div>

              <div className="accordion-content-wrapper">
                <div className="accordion-content">
                  <div className="accordion-inner">
                    {skillGroup.items.map((skill) => (
                      <span key={skill.name} className="skill-pill">
                        {skill.name}
                      </span>
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
