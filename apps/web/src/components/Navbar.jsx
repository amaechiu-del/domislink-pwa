import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <span className="brand">DomisLink</span>
      <Link to="/">Home</Link>
      <Link to="/curriculum">Curriculum</Link>
      <Link to="/lessons">Lessons</Link>
    </nav>
  )
}
