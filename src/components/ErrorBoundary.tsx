import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

// Catches render-time errors anywhere below it and shows the message,
// so a crash surfaces as readable text instead of a blank white screen.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Caught by ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
          <div style={{ maxWidth: 640, background: '#141414', border: '1px solid #333', borderRadius: 12, padding: 28 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#ff6b8a' }}>Something went wrong</h2>
            <p style={{ margin: '0 0 16px', color: '#aaa', fontSize: 14 }}>The page hit a runtime error. Details below:</p>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#0a0a0a', padding: 14, borderRadius: 8, fontSize: 12.5, color: '#ddd', maxHeight: 300, overflow: 'auto' }}>
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
            <button
              onClick={() => { this.setState({ error: null }); location.reload() }}
              style={{ marginTop: 16, background: '#E0003C', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontSize: 14 }}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
