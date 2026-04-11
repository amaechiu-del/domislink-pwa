import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" aria-label="Domislink Academy home">
        <span className="brand-icon">🎓</span>
        <span className="brand-name">Domislink</span>
      </Link>
      <ul className="navbar-links" role="list">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={`nav-link${pathname === to ? ' active' : ''}`}
              aria-current={pathname === to ? 'page' : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
