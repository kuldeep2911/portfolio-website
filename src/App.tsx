import { useEffect, useState } from 'react'
import './styles/globals.css'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import RobotIntroSection from './components/RobotIntroSection'
import BrainMapSection from './components/BrainMapSection'

export default function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    // No background/position here — the fixed canvas handles the background.
    // A positioned opaque ancestor can obscure fixed children in some browsers.
    <div>
      <Navbar scrollY={scrollY} />
      <HeroSection />

      {/* Content section that lives below the 300vh hero scroll container */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <RobotIntroSection />
        <BrainMapSection />
      </div>
    </div>
  )
}
