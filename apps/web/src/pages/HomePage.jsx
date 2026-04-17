import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
      <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h1>🎓 DomisLink AI Learning Platform</h1>
        <p style={{ fontSize: '1.1rem', color: '#475569', margin: '1rem 0' }}>
          AI-powered WAEC curriculum — study offline, anytime.
        </p>
        <Link to="/curriculum">
          <button className="btn btn-primary" style={{ marginRight: '.5rem' }}>Generate Curriculum</button>
        </Link>
        <Link to="/lessons">
          <button className="btn" style={{ background: '#e2e8f0' }}>Browse Lessons</button>
        </Link>
      </div>

      <div className="grid" style={{ marginTop: '2rem' }}>
        {['📚 WAEC Subjects', '🤖 AI-Generated', '📴 Offline Ready', '⚡ Fast'].map((feature) => (
          <div className="card" key={feature}>
            <h3>{feature}</h3>
            <p style={{ color: '#64748b' }}>
              {feature.includes('WAEC') && 'All WAEC subjects with structured lessons and quizzes.'}
              {feature.includes('AI') && 'Lessons generated with AI for accurate, relevant content.'}
              {feature.includes('Offline') && 'Service worker caches lessons for offline reading.'}
              {feature.includes('Fast') && 'Parallel generation, instant loading.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
