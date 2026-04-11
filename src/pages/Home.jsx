import { Link } from 'react-router-dom'
import './Home.css'

const FEATURED_COURSES = [
  {
    id: 1,
    title: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, and JavaScript from the ground up.',
    duration: '8 weeks',
    level: 'Beginner',
    emoji: '🌐',
  },
  {
    id: 2,
    title: 'React & Modern JavaScript',
    description: 'Build dynamic UIs with React, hooks, and state management.',
    duration: '10 weeks',
    level: 'Intermediate',
    emoji: '⚛️',
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Create intuitive, accessible, and beautiful user interfaces.',
    duration: '6 weeks',
    level: 'Beginner',
    emoji: '🎨',
  },
]

export default function Home() {
  return (
    <main className="home">
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-content">
          <span className="hero-badge">🎓 Online Learning Platform</span>
          <h1 id="hero-heading">
            Learn Skills That<br />
            <span className="gradient-text">Shape Your Future</span>
          </h1>
          <p className="hero-subtitle">
            Domislink Academy offers expert-led courses designed to take you from
            beginner to professional at your own pace.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-glow"></div>
          <div className="hero-card floating">
            <span className="hero-card-icon">📚</span>
            <span>100+ Courses</span>
          </div>
          <div className="hero-card floating delay-1">
            <span className="hero-card-icon">👥</span>
            <span>10k+ Students</span>
          </div>
          <div className="hero-card floating delay-2">
            <span className="hero-card-icon">⭐</span>
            <span>4.9 Rating</span>
          </div>
        </div>
      </section>

      <section className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">Why Choose Domislink?</h2>
        <div className="features-grid">
          {[
            { icon: '🎯', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
            { icon: '📱', title: 'Learn Anywhere', desc: 'Access courses on any device, even offline with our PWA.' },
            { icon: '🏆', title: 'Earn Certificates', desc: 'Get recognized certifications upon course completion.' },
            { icon: '🤝', title: 'Community Support', desc: 'Join a vibrant community of learners and mentors.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <span className="feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="courses-section" aria-labelledby="featured-heading">
        <div className="section-header">
          <h2 id="featured-heading" className="section-title">Featured Courses</h2>
          <Link to="/courses" className="view-all-link">View all →</Link>
        </div>
        <div className="courses-grid">
          {FEATURED_COURSES.map((course) => (
            <article key={course.id} className="course-card">
              <div className="course-emoji" aria-hidden="true">{course.emoji}</div>
              <div className="course-meta">
                <span className="course-level">{course.level}</span>
                <span className="course-duration">⏱ {course.duration}</span>
              </div>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              <button className="btn btn-primary btn-sm">Enroll Now</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
