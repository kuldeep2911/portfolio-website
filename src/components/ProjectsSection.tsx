import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Starfield from './Starfield';
import { usePortfolioData, type ProjectData } from '../data/usePortfolioData';

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

import { MotionValue } from 'framer-motion';

const ProjectCard = ({ project, index, scrollYProgress, totalProjects }: { project: ProjectData, index: number, scrollYProgress: MotionValue<number>, totalProjects: number }) => {
  const grads = getGradients(index);
  const numberStr = String(index + 1).padStart(2, '0');

  // Safely extract string from bento_texts (handles old metrics objects to prevent React crash)
  const getBentoText = (idx: number, fallback: string) => {
    const val = project.bento_texts?.[idx];
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object') return (val as any).value || (val as any).label || fallback;
    return fallback;
  };

  // Calculate shrink and fade based on scroll progress
  const step = totalProjects > 1 ? 1 / (totalProjects - 1) : 1;

  const input = [];
  const scaleOutput = [];
  const opacityOutput = [];

  if (index > 0) {
    input.push((index - 1) * step);
    scaleOutput.push(0.6);
    opacityOutput.push(0.1);
  }

  input.push(index * step);
  scaleOutput.push(1);
  opacityOutput.push(1);

  if (index < totalProjects - 1) {
    input.push((index + 1) * step);
    scaleOutput.push(0.6);
    opacityOutput.push(0.1);
  }

  // Fallback for single project to ensure useTransform has at least 2 points
  if (input.length === 1) {
    input.push(2); // this will never be reached in scrollYProgress [0,1]
    scaleOutput.push(1);
    opacityOutput.push(1);
  }

  const scale = useTransform(scrollYProgress, input, scaleOutput);
  const opacity = useTransform(scrollYProgress, input, opacityOutput);

  return (
    <motion.div
      style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0,
        scale,
        opacity,
      }}
    >
      <div
        style={{
          width: '90vw',
          maxWidth: '1200px',
          background: '#0D0D14',
          border: '2px solid rgba(224, 0, 60, 0.18)',
          borderRadius: 'clamp(20px, 2.5vw, 42px)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          height: 'fit-content',
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
            {project.status && (
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
                {project.status.toUpperCase()}
              </span>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
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
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(224, 0, 60, 0.4)',
                  borderRadius: '999px',
                  padding: '0.55rem 1.3rem',
                  color: '#E0003C',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  transition: 'background 200ms, border-color 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(224, 0, 60, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(224, 0, 60, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(224, 0, 60, 0.4)';
                }}
              >
                Live Demo
              </a>
            )}
            {project.video_url && (
              <a
                href={project.video_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(224, 0, 60, 0.1)',
                  border: '1px solid rgba(224, 0, 60, 0.5)',
                  borderRadius: '999px',
                  padding: '0.55rem 1.3rem',
                  color: '#E0003C',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  transition: 'all 200ms',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(224, 0, 60, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(224, 0, 60, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(224, 0, 60, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(224, 0, 60, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Watch Demo
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
          {(project.tags || []).map((tag) => (
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
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(0.9rem, 1.2vw, 1.2rem)', fontWeight: 600, color: '#F0EEF8', lineHeight: 1.3 }}>{getBentoText(0, 'Box 1 Text')}</span>
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
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(0.9rem, 1.2vw, 1.2rem)', fontWeight: 600, color: '#F0EEF8', lineHeight: 1.3 }}>{getBentoText(1, 'Box 2 Text')}</span>
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
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.2rem, 1.8vw, 2rem)', fontWeight: 600, color: '#F0EEF8', lineHeight: 1.3 }}>{getBentoText(2, 'Box 3 Text')}</span>
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

  // Track scroll progress of the entire huge container
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // We translate the x-axis to exactly -100vw per card so one card is perfectly centered per step
  const maxScroll = projects.length > 1 ? (projects.length - 1) * 100 : 0;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${maxScroll}vw`]);

  return (
    <section
      id="projects"
      style={{
        background: '#050508',
        borderRadius: '50px 50px 0 0',
        marginTop: '-40px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Huge container to create vertical scroll space. 100vh per project. */}
      <div ref={targetRef} style={{ height: `${projects.length * 100}vh`, position: 'relative' }}>
        
        {/* Sticky container that locks to the screen */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center', // Centers cards vertically
          }}
        >
          <Starfield />
          
          {/* Section Title stays fixed in the background/foreground */}
          <h2
            style={{
              position: 'absolute',
              top: '60px', // Pushed down to prevent clipping at the top
              left: '0',
              width: '100%',
              textAlign: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(180deg, #3D1520 0%, #E0003C 60%, #FF4D6D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              zIndex: 0, // Behind the sliding cards
              opacity: 0.8,
            }}
          >
            PROJECTS
          </h2>

          {/* The horizontally sliding track of cards */}
          <motion.div
            style={{
              x,
              display: 'flex',
              gap: 0,
              paddingLeft: 0,
              paddingRight: 0,
              zIndex: 10, // In front of the title
              marginTop: '100px', // Push the cards down to create a larger gap from the heading
            }}
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                scrollYProgress={scrollYProgress}
                totalProjects={projects.length}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
