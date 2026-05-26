import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Starfield from './Starfield';
import { usePortfolioData } from '../data/usePortfolioData';
import type { Project } from '../data/portfolio';

// Generates the theme gradients for the image placeholders based on index
function getGradients(index: number) {
  const m = index % 3;
  if (m === 0) {
    return [
      'linear-gradient(135deg, #1A0008 0%, #3D0018 100%)',
      'linear-gradient(135deg, #0D0008 0%, #2A0010 100%)',
      'linear-gradient(135deg, #3D0018 0%, #7B0030 100%)'
    ];
  } else if (m === 1) {
    return [
      'linear-gradient(135deg, #1A0035 0%, #2A0050 100%)',
      'linear-gradient(135deg, #0D0015 0%, #1A0030 100%)',
      'linear-gradient(135deg, #2A0050 0%, #4A0080 100%)'
    ];
  } else {
    return [
      'linear-gradient(135deg, #001020 0%, #002040 100%)',
      'linear-gradient(135deg, #000810 0%, #001020 100%)',
      'linear-gradient(135deg, #002040 0%, #004080 100%)'
    ];
  }
}

const ProjectCard = ({ project, index, totalProjects }: { project: Project, index: number, totalProjects: number }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // Start scaling when the top of this card hits its sticky position, 
    // finish scaling when the bottom of its wrapper leaves the viewport.
    offset: ["start start", "end start"]
  });

  const targetScale = 1 - (totalProjects - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  const grads = getGradients(index);
  const statLabel = project.metrics?.[0]?.value || "92%";
  const numberStr = String(index + 1).padStart(2, '0');

  return (
    <div ref={wrapperRef} style={{ height: '85vh', position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <motion.div
        style={{
          position: 'sticky',
          top: `calc(96px + ${index * 28}px)`,
          scale,
          background: '#0D0D14',
          border: '2px solid rgba(224, 0, 60, 0.18)',
          borderRadius: 'clamp(20px, 2.5vw, 42px)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          width: '90vw',
          maxWidth: '1200px',
          height: 'fit-content', // Ensures the card isn't artificially tall
          overflow: 'hidden',
          transformOrigin: 'top center',
          boxShadow: '0 -30px 50px rgba(5,5,8,0.95), 0 -10px 20px rgba(224,0,60,0.08)',
        }}
      >
        {/* CARD TOP ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>

          {/* LEFT GROUP */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 800,
                background: 'linear-gradient(180deg, #1A0008 0%, #E0003C 70%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}
            >
              {numberStr}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.62rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#E0003C',
                  background: 'rgba(224, 0, 60, 0.09)',
                  border: '1px solid rgba(224, 0, 60, 0.22)',
                  borderRadius: '999px',
                  padding: '3px 10px',
                }}
              >
                {project.category}
              </span>

              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  fontWeight: 600,
                  color: '#F0EEF8',
                  margin: 0,
                }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          {/* RIGHT GROUP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.82rem',
                color: '#FF4D6D',
                background: 'rgba(224, 0, 60, 0.1)',
                border: '1px solid rgba(224, 0, 60, 0.28)',
                borderRadius: '8px',
                padding: '5px 12px',
              }}
            >
              {statLabel}
            </span>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: '1.5px solid rgba(240, 238, 248, 0.25)',
                  borderRadius: '999px',
                  padding: '0.55rem 1.3rem',
                  color: '#F0EEF8',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  transition: 'background 200ms, border-color 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(240,238,248,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(240,238,248,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(240, 238, 248, 0.25)';
                }}
              >
                View on GitHub
              </a>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
            color: '#8B8B9E',
            lineHeight: 1.65,
            maxWidth: '75%',
            marginTop: '1rem',
            marginBottom: '0.75rem',
          }}
        >
          {project.description}
        </p>

        {/* TECH TAGS ROW */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.68rem',
                color: 'rgba(224,0,60,0.75)',
                background: 'rgba(224,0,60,0.07)',
                border: '1px solid rgba(224,0,60,0.18)',
                borderRadius: '999px',
                padding: '3px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* IMAGE GRID - Made much shorter horizontally */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: 'clamp(8px, 1vw, 14px)',
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vw, 14px)' }}>
            <div
              style={{
                height: '100px',
                borderRadius: 'clamp(12px, 1.5vw, 20px)',
                width: '100%',
                background: grads[0],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, color: 'rgba(224,0,60,0.3)' }}>{statLabel}</span>
            </div>
            <div
              style={{
                height: '114px',
                borderRadius: 'clamp(12px, 1.5vw, 20px)',
                width: '100%',
                background: grads[1],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, color: 'rgba(224,0,60,0.3)' }}>{statLabel}</span>
            </div>
          </div>

          {/* Right column */}
          <div
            style={{
              height: '100%',
              borderRadius: 'clamp(12px, 1.5vw, 20px)',
              width: '100%',
              background: grads[2],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 700, color: 'rgba(224,0,60,0.3)' }}>{statLabel}</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default function ProjectsSection() {
  const { projects: dbProjects } = usePortfolioData()
  // Map DB shape (snake_case) back to component shape (camelCase)
  const projects = dbProjects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    longDescription: p.long_description,
    tags: p.tags,
    category: p.category as 'ml' | 'nlp' | 'cv' | 'llm' | 'data',
    status: p.status as 'production' | 'research' | 'open-source',
    metrics: p.metrics,
    githubUrl: p.github_url,
    demoUrl: p.demo_url,
    featured: p.featured,
    year: p.year,
  }))
  return (
    <section
      id="projects"
      style={{
        background: '#050508',
        borderRadius: '50px 50px 0 0',
        paddingTop: '80px',
        paddingBottom: '40px',
        paddingLeft: '5vw',
        paddingRight: '5vw',
        marginTop: '-40px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Starfield />
      <div style={{ position: 'relative', zIndex: 10 }}>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(3rem, 10vw, 9rem)',
          fontWeight: 700,
          margin: 0,
          background: 'linear-gradient(180deg, #3D1520 0%, #E0003C 60%, #FF4D6D 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
          lineHeight: 1,
        }}
      >
        PROJECTS
      </h2>

      {/* Renders all projects as sticky stacking cards */}
      <div>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            totalProjects={projects.length}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
