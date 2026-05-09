import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || ''

function QuizQuestion({ question, index }) {
  const [selected, setSelected] = useState(null)

  const options = question.options || []
  const correct = question.answer ?? question.correct_answer

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <p style={{ fontWeight: 600, marginBottom: '.5rem' }}>
        {index + 1}. {question.question}
      </p>
      {options.map((opt, i) => {
        let cls = 'quiz-option'
        if (selected !== null) {
          if (opt === correct) cls += ' correct'
          else if (opt === selected) cls += ' wrong'
        }
        return (
          <button key={i} className={cls} onClick={() => selected === null && setSelected(opt)}>
            {opt}
          </button>
        )
      })}
      {selected !== null && (
        <p style={{ marginTop: '.5rem', color: selected === correct ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
          {selected === correct ? '✅ Correct!' : `❌ Correct answer: ${correct}`}
        </p>
      )}
    </div>
  )
}

function LessonDetail({ lesson }) {
  const quiz = Array.isArray(lesson.quiz) ? lesson.quiz : []
  return (
    <div>
      <Link to="/lessons" style={{ color: '#1e40af', display: 'block', marginBottom: '1rem' }}>← Back to lessons</Link>
      <div className="card">
        <div style={{ marginBottom: '.5rem' }}>
          <span className="badge">{lesson.class}</span>
          <span className="badge">{lesson.subject}</span>
          <span className="badge">{lesson.topic}</span>
          {lesson.subtopic && <span className="badge">{lesson.subtopic}</span>}
        </div>
        <h1>{lesson.title}</h1>
        <pre className="lesson-content" style={{ marginTop: '1rem' }}>{lesson.content}</pre>
      </div>

      {quiz.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📝 Quiz</h2>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>Answer the questions below to test your understanding.</p>
          {quiz.map((q, i) => <QuizQuestion key={i} question={q} index={i} />)}
        </div>
      )}
    </div>
  )
}

function LessonList({ lessons }) {
  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>All Lessons</h1>
      {lessons.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: '#64748b' }}>
          No lessons found. <Link to="/curriculum">Generate curriculum</Link> first.
        </div>
      )}
      <div className="grid">
        {lessons.map((l) => (
          <Link to={`/lessons/${l.id}`} key={l.id} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow .15s' }}>
              <div style={{ marginBottom: '.4rem' }}>
                <span className="badge">{l.subject}</span>
                <span className="badge">{l.class}</span>
              </div>
              <h3 style={{ color: '#1e293b' }}>{l.title}</h3>
              <p style={{ color: '#64748b', fontSize: '.9rem', marginTop: '.3rem' }}>{l.topic}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function LessonPage() {
  const { id } = useParams()
  const [lessons, setLessons] = useState([])
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const url = id ? `${API_BASE}/api/lessons/${id}` : `${API_BASE}/api/lessons`

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (id) setLesson(data)
        else setLessons(data.items || data || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">⏳ Loading lessons…</div>
  if (error) return <div className="error" style={{ margin: '2rem' }}>❌ Error: {error}</div>
  if (id) return lesson ? <LessonDetail lesson={lesson} /> : <div className="loading">No lesson found.</div>
  return <LessonList lessons={lessons} />
}
