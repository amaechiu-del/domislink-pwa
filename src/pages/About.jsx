import './About.css'

const TEAM = [
  { name: 'Dr. Amara Osei', role: 'Founder & CEO', emoji: '👩🏾‍💼' },
  { name: 'James Nwosu', role: 'Head of Curriculum', emoji: '👨🏿‍🏫' },
  { name: 'Sofia Linares', role: 'Lead Instructor', emoji: '👩🏽‍💻' },
  { name: 'David Park', role: 'UX & Product', emoji: '👨🏻‍🎨' },
]

const STATS = [
  { value: '100+', label: 'Courses Available' },
  { value: '10k+', label: 'Active Students' },
  { value: '50+', label: 'Expert Instructors' },
  { value: '95%', label: 'Satisfaction Rate' },
]

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-heading">
        <h1 id="about-heading">
          About <span className="gradient-text">Domislink Academy</span>
        </h1>
        <p>
          We believe that quality education should be accessible to everyone,
          everywhere. Domislink Academy was built to bridge the gap between
          ambition and opportunity — one course at a time.
        </p>
      </section>

      <section className="stats-section" aria-label="Key statistics">
        <div className="stats-grid">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-card">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mission-section" aria-labelledby="mission-heading">
        <h2 id="mission-heading">Our Mission</h2>
        <div className="mission-cards">
          {[
            { icon: '🌍', title: 'Accessible Learning', desc: 'No matter where you are in the world, our courses are available 24/7 on any device.' },
            { icon: '💡', title: 'Practical Skills', desc: 'Every course is designed with real-world projects so you learn by building, not just watching.' },
            { icon: '🤝', title: 'Community First', desc: 'Join a thriving community of learners, mentors, and graduates who support each other.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="mission-card">
              <span className="mission-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section" aria-labelledby="team-heading">
        <h2 id="team-heading">Meet the Team</h2>
        <div className="team-grid">
          {TEAM.map(({ name, role, emoji }) => (
            <div key={name} className="team-card">
              <span className="team-avatar">{emoji}</span>
              <h3 className="team-name">{name}</h3>
              <p className="team-role">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pwa-section" aria-labelledby="pwa-heading">
        <div className="pwa-badge">📱 Progressive Web App</div>
        <h2 id="pwa-heading">Learn Even Offline</h2>
        <p>
          Domislink Academy is a fully-featured Progressive Web App. Install it
          on your phone or desktop for a native app experience — including
          offline access to your saved lessons.
        </p>
      </section>
    </main>
  )
}
