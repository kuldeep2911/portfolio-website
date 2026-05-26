import { useEffect, useState } from 'react'
import './styles/globals.css'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import RobotIntroSection from './components/RobotIntroSection'
import BrainMapSection from './components/BrainMapSection'
import ProjectsSection from './components/ProjectsSection'
import SkillsSection from './components/SkillsSection'
import OngoingSection from './components/OngoingSection'
import ContactSection from './components/ContactSection'

export default function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'

    // Load Spline viewer script dynamically
    const scriptId = 'spline-viewer-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'module'
      script.src = 'https://unpkg.com/@splinetool/viewer@1.0.76/build/spline-viewer.js'
      document.head.appendChild(script)
    }

    // Track scroll
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div style={{ background: '#050508', minHeight: '100vh' }}>
      <Navbar scrollY={scrollY} />
      
      <HeroSection />

      {/* Content section that lives below the 300vh hero scroll container */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <RobotIntroSection />
        <BrainMapSection />
        <ProjectsSection />
        <SkillsSection />
        <OngoingSection />
        <ContactSection />
      </div>
    </div>
  )
}
