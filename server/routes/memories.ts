import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { memories } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/', requireAuth, async (req, res) => {
  const mems = await db.select().from(memories)
    .where(eq(memories.player_id, req.session.player_id))
    .orderBy(eq(memories.created_at))
  
  res.json(mems)
})

router.post('/', requireAuth, async (req, res) => {
  const { title, content } = req.body
  
  const memory = await db.insert(memories).values({
    player_id: req.session.player_id,
    title: title.trim(),
    content: content.trim()
  }).returning()
  
  res.json(memory[0])
})

router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { title, content, is_pinned } = req.body
  
  const memory = await db.select().from(memories).where(eq(memories.id, parseInt(id))).limit(1)
  if (!memory.length || memory[0].player_id !== req.session.player_id) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  const updates: any = {}
  if (title !== undefined) updates.title = title.trim()
  if (content !== undefined) updates.content = content.trim()
  if (is_pinned !== undefined) updates.is_pinned = is_pinned
  
  const updated = await db.update(memories).set(updates).where(eq(memories.id, parseInt(id))).returning()
  res.json(updated[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const memory = await db.select().from(memories).where(eq(memories.id, parseInt(id))).limit(1)
  if (!memory.length || memory[0].player_id !== req.session.player_id) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  await db.delete(memories).where(eq(memories.id, parseInt(id)))
  res.json({ ok: true })
})

export default router