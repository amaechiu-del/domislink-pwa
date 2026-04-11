import { useState } from 'react'
import './Courses.css'

const ALL_COURSES = [
  { id: 1, title: 'Web Development Fundamentals', level: 'Beginner', duration: '8 weeks', category: 'Development', emoji: '🌐', description: 'Master HTML, CSS, and JavaScript from the ground up.' },
  { id: 2, title: 'React & Modern JavaScript', level: 'Intermediate', duration: '10 weeks', category: 'Development', emoji: '⚛️', description: 'Build dynamic UIs with React, hooks, and state management.' },
  { id: 3, title: 'UI/UX Design Principles', level: 'Beginner', duration: '6 weeks', category: 'Design', emoji: '🎨', description: 'Create intuitive, accessible, and beautiful user interfaces.' },
  { id: 4, title: 'Python for Data Science', level: 'Intermediate', duration: '12 weeks', category: 'Data Science', emoji: '🐍', description: 'Analyze data, build models, and create visualizations with Python.' },
  { id: 5, title: 'Node.js & Backend APIs', level: 'Intermediate', duration: '8 weeks', category: 'Development', emoji: '🔧', description: 'Build scalable REST APIs with Node.js, Express, and databases.' },
  { id: 6, title: 'Digital Marketing Strategy', level: 'Beginner', duration: '5 weeks', category: 'Marketing', emoji: '📈', description: 'Grow your brand online with SEO, social media, and content strategy.' },
  { id: 7, title: 'Machine Learning Basics', level: 'Advanced', duration: '14 weeks', category: 'Data Science', emoji: '🤖', description: 'Understand and apply foundational ML algorithms and frameworks.' },
  { id: 8, title: 'Graphic Design with Figma', level: 'Beginner', duration: '7 weeks', category: 'Design', emoji: '✏️', description: 'Design stunning visuals and prototypes with Figma.' },
  { id: 9, title: 'DevOps & CI/CD', level: 'Advanced', duration: '10 weeks', category: 'Development', emoji: '🚀', description: 'Automate deployments, manage containers, and build pipelines.' },
]

const CATEGORIES = ['All', 'Development', 'Design', 'Data Science', 'Marketing']
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Courses() {
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ALL_COURSES.filter((c) => {
    const matchCat = category === 'All' || c.category === category
    const matchLevel = level === 'All' || c.level === level
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchLevel && matchSearch
  })

  return (
    <main className="courses-page">
      <header className="courses-header">
        <h1>All Courses</h1>
        <p>Find the right course to accelerate your career.</p>
      </header>

      <div className="courses-controls">
        <input
          className="search-input"
          type="search"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search courses"
        />
        <div className="filter-group">
          <span className="filter-label">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${category === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Level:</span>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              className={`filter-btn${level === lvl ? ' active' : ''}`}
              onClick={() => setLevel(lvl)}
              aria-pressed={level === lvl}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">No courses match your filters. Try broadening your search.</p>
      ) : (
        <div className="courses-list">
          {filtered.map((course) => (
            <article key={course.id} className="course-card-full">
              <div className="course-emoji-lg" aria-hidden="true">{course.emoji}</div>
              <div className="course-info">
                <div className="course-meta">
                  <span className="course-level">{course.level}</span>
                  <span className="course-category">{course.category}</span>
                  <span className="course-duration">⏱ {course.duration}</span>
                </div>
                <h2 className="course-title">{course.title}</h2>
                <p className="course-desc">{course.description}</p>
              </div>
              <button className="btn btn-primary btn-sm" aria-label={`Enroll in ${course.title}`}>
                Enroll Now
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
