import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CurriculumPage from './pages/CurriculumPage'
import LessonPage from './pages/LessonPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/lessons" element={<LessonPage />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
