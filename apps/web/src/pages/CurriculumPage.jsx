import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function CurriculumPage() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function generate() {
    setStatus('loading')
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/curriculum/generate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data)
      setStatus('success')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: '1.5rem' }}>Curriculum Generator</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Generate full WAEC curriculum lessons and save them to the database.
      </p>

      <button className="btn btn-primary" onClick={generate} disabled={status === 'loading'}>
        {status === 'loading' ? '⏳ Generating…' : '🚀 Generate Curriculum'}
      </button>

      {status === 'loading' && (
        <div className="loading" style={{ marginTop: '2rem' }}>
          Generating lessons with AI — this may take a moment…
        </div>
      )}

      {status === 'error' && (
        <div className="error" style={{ marginTop: '1.5rem' }}>
          ❌ {error}
        </div>
      )}

      {status === 'success' && result && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2>✅ Generation Complete</h2>
          <p>Created: <strong>{result.created}</strong> lessons</p>
          {result.errors > 0 && <p style={{ color: '#b45309' }}>⚠️ Errors: {result.errors}</p>}
          <p style={{ color: '#64748b', marginTop: '.5rem' }}>
            <a href="/lessons">→ View all lessons</a>
          </p>
        </div>
      )}
    </div>
  )
}
