'use client';

// Last-resort boundary: only triggers if the root layout itself throws.
// Must render its own <html>/<body> since it replaces the whole document.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: '#0d1117', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '3rem 1rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Erreur critique / Critical error</h1>
          <p style={{ color: '#8b949e', maxWidth: 28 + 'rem' }}>
            Ta progression est sauvegardée dans ton navigateur. Your progress is saved in your browser.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: '#7ee787',
              color: '#0d1117',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ↻ Réessayer / Retry
          </button>
        </div>
      </body>
    </html>
  );
}
