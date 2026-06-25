import React, { useState } from 'react'
import { Github, Linkedin, FileText, Twitter, Globe } from 'lucide-react'
import { usePortfolioData } from '../data/usePortfolioData'
import { supabase } from '../lib/supabase'
import Robot3D from './Robot3D'

const ICON_MAP: Record<string, React.ElementType> = {
  GitHub: Github, LinkedIn: Linkedin, Resume: FileText, Twitter, HuggingFace: Globe,
}

export default function ContactSection() {
  const { socialLinks, profile } = usePortfolioData()

  const links = socialLinks.map(l => ({
    Icon: ICON_MAP[l.platform] ?? Globe,
    label: l.platform,
    sub: l.handle,
    href: (!l.url.startsWith('http') && !l.url.startsWith('/') && !l.url.startsWith('mailto:')) ? `https://${l.url}` : l.url,
    download: l.platform === 'Resume',
  }))

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const { error } = await supabase.from('messages').insert([{ name, email, message }])
      if (error) throw error

      const web3FormsKey = import.meta.env.VITE_WEB3FORMS_KEY
      if (web3FormsKey) {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: `New Portfolio Message from ${name}`,
            from_name: name, email, message,
          }),
        })
      }

      setStatus('success')
      setName(''); setEmail(''); setMessage('')
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: 12,
    padding: '15px 16px', fontSize: 16, color: 'var(--ink)', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color .25s ease', width: '100%',
  }
  const labelTextStyle: React.CSSProperties = {
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.18em', color: 'var(--ink-soft)', textTransform: 'uppercase',
  }

  return (
    <section id="contact" style={{
      background: 'var(--bg-soft)', scrollMarginTop: 80, borderTop: '1px solid #E5E5E0',
      padding: 'clamp(80px,12vh,150px) clamp(20px,6vw,80px)',
    }}>
      <style>{`
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(300px,1fr)); gap: clamp(36px,5vw,72px); }
        .form-input:focus, .form-textarea:focus { border-color: #111111 !important; }
        .form-submit:hover { opacity: .85; }
        .social-link:hover { border-color: #111111 !important; transform: translateY(-2px); }
        .social-link:hover .social-icon { color: #111111 !important; }
        .social-row { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.32em', color: 'var(--ink-soft)', textTransform: 'uppercase', display: 'block' }}>Get in touch</span>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(40px,6.5vw,86px)', lineHeight: 1.03, letterSpacing: '-.015em', color: 'var(--ink)', margin: '16px 0 clamp(44px,7vh,72px)', maxWidth: '16ch' }}>
          Let's build something remarkable together.
        </h2>

        <div className="contact-grid">
          {/* visual */}
          <div style={{ position: 'relative', minHeight: 380, border: '1px solid #E5E5E0', borderRadius: 20, background: 'radial-gradient(circle at 50% 40%, #F4F3F0 0%, #ECEBE6 100%)', overflow: 'hidden', boxShadow: '0 24px 60px -40px rgba(17,17,17,.24)' }}>
            <Robot3D />

            {/* speech bubble — tucked into the top-left corner so it never overlaps the
                centered robot; tail points down-right toward it. Glassmorphism + blur,
                auto-sizes to the text (wraps for longer messages). */}
            <div
              className="speech-bubble"
              style={{
                position: 'absolute', top: '5%', left: '5%',
                width: 'max-content', maxWidth: 'min(34%, 210px)', zIndex: 3,
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px) saturate(180%)', WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.65)', borderRadius: '16px 16px 4px 16px',
                padding: '12px 15px', boxShadow: '0 16px 34px -18px rgba(17,17,17,.35)',
                fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink)', fontStyle: 'italic', textAlign: 'left',
              }}
            >
              “{profile?.contact_text || 'Every great system starts with a conversation.'}”
              {/* tail pointing down-right, toward the robot's face */}
              <span style={{
                position: 'absolute', bottom: -7, right: 20, transform: 'rotate(45deg)',
                width: 14, height: 14,
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px) saturate(180%)', WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                borderRight: '1px solid rgba(255,255,255,0.65)', borderBottom: '1px solid rgba(255,255,255,0.65)',
              }} />
            </div>

            <span style={{ position: 'absolute', bottom: 22, left: 24, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.22em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
              AI companion
            </span>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={labelTextStyle}>Your name</span>
              <input className="form-input" style={inputStyle} type="text" required value={name} onChange={e => setName(e.target.value)} disabled={status === 'sending'} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={labelTextStyle}>Your email</span>
              <input className="form-input" style={inputStyle} type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={status === 'sending'} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={labelTextStyle}>Your message</span>
              <textarea className="form-textarea" style={{ ...inputStyle, resize: 'vertical' }} rows={5} required value={message} onChange={e => setMessage(e.target.value)} disabled={status === 'sending'} />
            </label>
            <button type="submit" className="form-submit" disabled={status === 'sending'} style={{
              background: 'var(--ink)', color: 'var(--bg)', border: 'none', borderRadius: 12,
              padding: 17, fontSize: 15, letterSpacing: '.04em', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .25s ease',
            }}>
              {status === 'sending' ? 'Sending…' : status === 'success' ? 'Message sent ✓' : status === 'error' ? 'Error — try again' : 'Send message'}
            </button>
          </form>
        </div>

        {/* social links */}
        {links.length > 0 && (
          <div className="social-row" style={{ borderTop: '1px solid #E5E5E0', paddingTop: 'clamp(36px,5vh,56px)', marginTop: 'clamp(44px,7vh,72px)' }}>
            {links.map((l, i) => {
              const Icon = l.Icon
              return (
                <a key={i} href={l.href} target="_blank" rel="noreferrer" download={l.download ? true : undefined}
                  className="social-link"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    textDecoration: 'none', background: '#FFFFFF', border: '1px solid #E5E5E0',
                    borderRadius: 16, padding: '20px 28px', minWidth: 150, flex: 1, maxWidth: 240,
                    transition: 'border-color .25s ease, transform .25s ease',
                  }}>
                  <Icon className="social-icon" size={20} color="#5A5A5A" style={{ transition: 'color .25s ease' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{l.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-soft)' }}>{l.sub}</span>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* footer */}
      <footer style={{
        borderTop: '1px solid #E5E5E0', marginTop: 'clamp(48px,8vh,80px)',
        padding: '40px clamp(20px,6vw,80px) 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '.18em', color: 'var(--ink)' }}>
          {(profile?.name || 'KULDEEP KUMAR').toUpperCase()}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-soft)' }}>© 2026 · AI / ML Engineer</span>
      </footer>
    </section>
  )
}
