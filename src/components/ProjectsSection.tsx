import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { usePortfolioData, type ProjectData } from '../data/usePortfolioData';

// Neutral light gradients for the bento placeholders (varies subtly by index).
function getGradients(index: number) {
  const m = index % 3;
  if (m === 0) {
    return [
      'linear-gradient(135deg, #F4F4F1 0%, #E3E3DD 100%)',
      'linear-gradient(135deg, #FFFFFF 0%, #EFEFEA 100%)',
      'linear-gradient(135deg, #ECECE6 0%, #D7D7D0 100%)',
    ];
  } else if (m === 1) {
    return [
      'linear-gradient(135deg, #F1F1EE 0%, #E0E0DA 100%)',
      'linear-gradient(135deg, #FBFBF9 0%, #ECECE6 100%)',
      'linear-gradient(135deg, #E7E7E1 0%, #D2D2CB 100%)',
    ];
  } else {
    return [
      'linear-gradient(135deg, #F5F5F2 0%, #E5E5DF 100%)',
      'linear-gradient(135deg, #FFFFFF 0%, #F0F0EB 100%)',
      'linear-gradient(135deg, #EAEAE4 0%, #D5D5CE 100%)',
    ];
  }
}

const ProjectCard = ({ project, index, scrollYProgress, totalProjects }: { project: ProjectData, index: number, scrollYProgress: MotionValue<number>, totalProjects: number }) => {
  const grads = getGradients(index);
  const numberStr = String(index + 1).padStart(2, '0');

  const getBentoText = (idx: number, fallback: string) => {
    const val = project.bento_texts?.[idx];
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') return (val as any).value || (val as any).label || fallback; // eslint-disable-line @typescript-eslint/no-explicit-any
    return fallback;
  };

  const step = totalProjects > 1 ? 1 / (totalProjects - 1) : 1;
  const input: number[] = [];
  const scaleOutput: number[] = [];
  const opacityOutput: number[] = [];

  if (index > 0) { input.push((index - 1) * step); scaleOutput.push(0.6); opacityOutput.push(0.1); }
  input.push(index * step); scaleOutput.push(1); opacityOutput.push(1);
  if (index < totalProjects - 1) { input.push((index + 1) * step); scaleOutput.push(0.6); opacityOutput.push(0.1); }
  if (input.length === 1) { input.push(2); scaleOutput.push(1); opacityOutput.push(1); }

  const scale = useTransform(scrollYProgress, input, scaleOutput);
  const opacity = useTransform(scrollYProgress, input, opacityOutput);

  return (
    <motion.div style={{ width: '100vw', display: 'flex', justifyContent: 'center', flexShrink: 0, scale, opacity }}>
      <div
        style={{
          width: '86vw',
          maxWidth: '980px',
          background: '#FFFFFF',
          border: '1px solid #E5E5E0',
          borderRadius: 'clamp(18px, 2vw, 34px)',
          padding: 'clamp(1.25rem, 2.4vw, 2rem)',
          height: 'fit-content',
          boxShadow: '0 -24px 40px rgba(247,247,245,0.92), 0 20px 50px -32px rgba(17,17,17,0.2)',
        }}
      >
        {/* CARD TOP ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
                fontWeight: 400,
                color: '#111111',
                lineHeight: 1,
              }}
            >
              {numberStr}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.62rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#5A5A5A',
                  background: '#F1F1EE',
                  border: '1px solid #E5E5E0',
                  borderRadius: '999px',
                  padding: '4px 11px',
                }}
              >
                {project.category}
              </span>

              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 600, color: '#111111', margin: 0 }}>
                {project.title}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.status && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  background: '#F1F1EE',
                  border: '1px solid #E5E5E0',
                  borderRadius: '8px',
                  padding: '5px 12px',
                }}
              >
                {project.status}
              </span>
            )}

            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                className="proj-link"
                style={{ border: '1px solid #111111', borderRadius: '999px', padding: '0.5rem 1.1rem', color: '#111111', fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '0.78rem', letterSpacing: '0.02em', textDecoration: 'none', transition: 'background 200ms, color 200ms', whiteSpace: 'nowrap' }}>
                View on GitHub →
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                className="proj-link"
                style={{ border: '1px solid #111111', borderRadius: '999px', padding: '0.5rem 1.1rem', color: '#111111', fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '0.78rem', letterSpacing: '0.02em', textDecoration: 'none', transition: 'background 200ms, color 200ms', whiteSpace: 'nowrap' }}>
                Live demo →
              </a>
            )}
            {project.video_url && (
              <a href={project.video_url} target="_blank" rel="noopener noreferrer"
                className="proj-link"
                style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #111111', borderRadius: '999px', padding: '0.5rem 1.1rem', color: '#111111', fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '0.78rem', letterSpacing: '0.02em', textDecoration: 'none', transition: 'background 200ms, color 200ms', whiteSpace: 'nowrap' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Watch demo
              </a>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(0.85rem, 1.1vw, 0.98rem)', color: '#5A5A5A', lineHeight: 1.65, maxWidth: '75%', marginTop: '1rem', marginBottom: '0.75rem' }}>
          {project.description}
        </p>

        {/* TECH TAGS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
          {(project.tags || []).map((tag) => (
            <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: '#5A5A5A', background: '#F1F1EE', border: '1px solid #E5E5E0', borderRadius: '999px', padding: '3px 10px' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* BENTO IMAGE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 'clamp(8px, 1vw, 14px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vw, 12px)' }}>
            <div style={{ height: '74px', borderRadius: 'clamp(12px, 1.5vw, 18px)', width: '100%', background: grads[0], display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', textAlign: 'center', border: '1px solid #E5E5E0' }}>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)', fontWeight: 600, color: '#111111', lineHeight: 1.3 }}>{getBentoText(0, 'Box 1 Text')}</span>
            </div>
            <div style={{ height: '84px', borderRadius: 'clamp(12px, 1.5vw, 18px)', width: '100%', background: grads[1], display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', textAlign: 'center', border: '1px solid #E5E5E0' }}>
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)', fontWeight: 600, color: '#111111', lineHeight: 1.3 }}>{getBentoText(1, 'Box 2 Text')}</span>
            </div>
          </div>

          <div style={{ height: '100%', borderRadius: 'clamp(12px, 1.5vw, 18px)', width: '100%', background: grads[2], display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', border: '1px solid #E5E5E0' }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(1.2rem, 1.7vw, 1.9rem)', fontWeight: 400, color: '#111111', lineHeight: 1.25 }}>{getBentoText(2, 'Box 3 Text')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProjectsSection() {
  const { projects: dbProjects } = usePortfolioData();
  const projects = dbProjects || [];

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const maxScroll = projects.length > 1 ? (projects.length - 1) * 100 : 0;
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${maxScroll}vw`]);

  return (
    <section id="projects" style={{ background: 'var(--bg)', position: 'relative', zIndex: 10, scrollMarginTop: 80 }}>
      <style>{`.proj-link:hover { background: #111111 !important; color: #F7F7F5 !important; }`}</style>

      <div ref={targetRef} style={{ height: `${projects.length * 100}vh`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          {/* section heading — matches the other sections (eyebrow + serif ink) */}
          <div style={{ position: 'absolute', top: 'clamp(84px, 13vh, 120px)', left: 'clamp(20px,6vw,80px)', zIndex: 5 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>Selected work</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(40px,6vw,76px)', lineHeight: 1.04, letterSpacing: '-.01em', color: 'var(--ink)', margin: '14px 0 0' }}>Projects.</h2>
          </div>

          <motion.div style={{ x, display: 'flex', gap: 0, zIndex: 10, marginTop: '150px' }}>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} scrollYProgress={scrollYProgress} totalProjects={projects.length} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
