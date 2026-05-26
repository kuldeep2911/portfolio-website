interface LoadingScreenProps {
  isLoaded: boolean
  progress: number // 0–100
}

export default function LoadingScreen({ isLoaded, progress }: LoadingScreenProps) {
  return (
    <>
      {/* ── Keyframe animations injected once ── */}
      <style>{`
        @keyframes ls-pulse-0 {
          0%, 100% { transform: scale(1);   opacity: 1;    }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes ls-pulse-1 {
          0%, 100% { transform: scale(1);   opacity: 1;    }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes ls-pulse-2 {
          0%, 100% { transform: scale(1);   opacity: 1;    }
          50%       { transform: scale(1.15); opacity: 0.7; }
        }
        .ls-dot-0 { animation: ls-pulse-0 1.5s ease-in-out 0.0s infinite; transform-origin: center; }
        .ls-dot-1 { animation: ls-pulse-1 1.5s ease-in-out 0.3s infinite; transform-origin: center; }
        .ls-dot-2 { animation: ls-pulse-2 1.5s ease-in-out 0.6s infinite; transform-origin: center; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          background: '#050508',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? 'none' : 'all',
          transition: 'opacity 0.7s ease',
        }}
      >
        {/* ── Neural network SVG icon ── */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Connecting lines — drawn first so circles render on top */}
          <line x1="12" y1="12" x2="30" y2="30" stroke="#E0003C" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="48" y1="12" x2="30" y2="30" stroke="#E0003C" strokeWidth="1.5" strokeLinecap="round" />
          {/* Line from centre dot down-right — implies third connection */}
          <line x1="30" y1="30" x2="48" y2="48" stroke="#E0003C" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />

          {/* Dot 0 — top-left */}
          <circle className="ls-dot-0" cx="12" cy="12" r="8" fill="#E0003C" />
          {/* Dot 1 — top-right */}
          <circle className="ls-dot-1" cx="48" cy="12" r="8" fill="#E0003C" />
          {/* Dot 2 — centre */}
          <circle className="ls-dot-2" cx="30" cy="30" r="8" fill="#E0003C" />
        </svg>

        {/* ── Label ── */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem',
            letterSpacing: '0.4em',
            color: '#E0003C',
            marginTop: '1.5rem',
            textTransform: 'uppercase',
          }}
        >
          Loading Frames
        </p>

        {/* ── Progress bar ── */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'rgba(224,0,60,0.15)',
            borderRadius: '999px',
            marginTop: '1rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#E0003C',
              borderRadius: '999px',
              width: `${progress}%`,
              transition: 'width 0.1s ease',
            }}
          />
        </div>

        {/* ── Percentage text ── */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: 'rgba(224,0,60,0.5)',
            marginTop: '0.5rem',
            letterSpacing: '0.1em',
          }}
        >
          {Math.round(progress)}%
        </p>
      </div>
    </>
  )
}
