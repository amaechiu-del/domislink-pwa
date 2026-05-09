import { Router } from 'express'
import pb, { ensureAuth } from '../pb.js'

const router = Router()

// GET /api/lessons
router.get('/', async (req, res) => {
  try {
    await ensureAuth()
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 50
    const subject = req.query.subject
    const filter = subject ? `subject = "${subject}"` : ''
    const result = await pb.collection('lessons').getList(page, perPage, { filter, sort: 'subject,topic' })
    res.json(result)
  } catch (e) {
    console.error('[GET /api/lessons]', e)
    res.status(500).json({ error: e.message })
  }
})

// GET /api/lessons/:id
router.get('/:id', async (req, res) => {
  try {
    await ensureAuth()
    const record = await pb.collection('lessons').getOne(req.params.id)
    res.json(record)
  } catch (e) {
    console.error('[GET /api/lessons/:id]', e)
    const status = e.status === 404 ? 404 : 500
    res.status(status).json({ error: e.message })
  }
})

export default router
