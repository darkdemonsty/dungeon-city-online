import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { history } from '../lib/db'

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const entries = await db.select().from(history)
  res.json(entries)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const entry = await db.select().from(history).where(eq(history.id, parseInt(id))).limit(1)
  
  if (!entry.length) {
    return res.status(404).json({ error: 'Entry not found' })
  }
  
  res.json(entry[0])
})

export default router