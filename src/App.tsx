import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'
import Sidebar from './components/Sidebar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import BrainMapSection from './components/BrainMapSection'
import ProjectsSection from './components/ProjectsSection'
import SkillsSection from './components/SkillsSection'
import OngoingSection from './components/OngoingSection'
import ContactSection from './components/ContactSection'
import CursorCloud from './components/CursorCloud'
import ErrorBoundary from './components/ErrorBoundary'
import AdminPage from './pages/AdminPage'

function Portfolio() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Sidebar />
      <HeroSection />
      <AboutSection />
      <BrainMapSection />
      <ProjectsSection />
      <SkillsSection />
      <OngoingSection />
      <ContactSection />
      <CursorCloud />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
