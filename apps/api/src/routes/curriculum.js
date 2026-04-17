import { Router } from 'express'
import { generateCurriculumFast } from '../curriculum/generator.js'
import pb, { ensureAuth } from '../pb.js'

const router = Router()

// POST /api/curriculum/generate
router.post('/generate', async (req, res) => {
  let created = 0
  let errors = 0
  try {
    await ensureAuth()
    const lessons = await generateCurriculumFast()
    console.log(`[curriculum/generate] Generated ${lessons.length} lessons, saving…`)

    const results = await Promise.allSettled(
      lessons.map((lesson) =>
        pb.collection('lessons').create(lesson).then(() => { created++ })
      )
    )

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        errors++
        console.error(`[curriculum/generate] Failed lesson ${i}:`, r.reason?.message || r.reason)
      }
    })

    console.log(`[curriculum/generate] Done. created=${created} errors=${errors}`)
    res.json({ success: true, created, errors, total: lessons.length })
  } catch (e) {
    console.error('[POST /api/curriculum/generate]', e)
    res.status(500).json({ success: false, error: e.message, created, errors })
  }
})

export default router
