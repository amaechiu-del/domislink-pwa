import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import lessonsRouter from './routes/lessons.js'
import curriculumRouter from './routes/curriculum.js'

const app = express()
const PORT = process.env.PORT || 3001

// CORS — restrict by origin in production if CORS_ORIGIN is set
const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) }
  : {}
app.use(cors(corsOptions))
app.use(express.json())

const healthHandler = (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() })
app.get('/health', healthHandler)
app.get('/api/health', healthHandler)
app.use('/api/lessons', lessonsRouter)
app.use('/api/curriculum', curriculumRouter)

app.use((err, _req, res, _next) => {
  console.error('[API Error]', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`API listening on port ${PORT}`))
