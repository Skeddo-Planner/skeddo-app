import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './Skeddo.jsx'

const isStaging = import.meta.env.VITE_ENV === 'staging'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Capture 10% of transactions for performance monitoring (free tier friendly)
  tracesSampleRate: 0.1,
  // Only record session replays when an error occurs
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong. Please refresh the page.</p>}>
      {isStaging && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
          background: '#f59e0b', color: '#000', textAlign: 'center',
          padding: '4px 8px', fontSize: '12px', fontWeight: 700,
          letterSpacing: '0.08em', fontFamily: 'monospace',
        }}>
          STAGING — staging.skeddo.ca — not production
        </div>
      )}
      <div style={isStaging ? { paddingTop: '24px' } : undefined}>
        <App />
      </div>
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
