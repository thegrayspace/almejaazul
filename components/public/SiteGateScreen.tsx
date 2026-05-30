export default function SiteGateScreen({ invalid }: { invalid?: boolean }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a2530',
        color: '#f0ece3',
        padding: '24px',
        fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontWeight: 400,
            fontSize: 36,
            margin: '0 0 8px',
            letterSpacing: '0.02em',
          }}
        >
          Almeja Azul
        </h1>
        <p style={{ opacity: 0.75, fontSize: 14, margin: '0 0 28px' }}>
          The site is in pre-launch. Enter the access password to continue.
        </p>

        <form method="POST" action="/api/site-gate">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            autoFocus
            required
            placeholder="Access password"
            aria-invalid={invalid || undefined}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: 15,
              borderRadius: 6,
              border: invalid ? '1px solid #e07a7a' : '1px solid rgba(240, 236, 227, 0.25)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f0ece3',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {invalid ? (
            <p style={{ color: '#e07a7a', fontSize: 13, margin: '10px 0 0' }}>
              Incorrect password.
            </p>
          ) : null}
          <button
            type="submit"
            style={{
              marginTop: 16,
              width: '100%',
              padding: '12px 14px',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 6,
              border: 'none',
              background: '#4BBFE0',
              color: '#1a2530',
              cursor: 'pointer',
            }}
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
