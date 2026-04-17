import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import lessonsRouter from './routes/lessons.js'
import curriculumRouter from './routes/curriculum.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/lessons', lessonsRouter)
app.use('/api/curriculum', curriculumRouter)

app.use((err, _req, res, _next) => {
  console.error('[API Error]', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`API listening on port ${PORT}`))
