import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { notifications } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/', requireAuth, async (req, res) => {
  const notifs = await db.select().from(notifications)
    .where(eq(notifications.player_id, req.session.player_id))
    .orderBy(eq(notifications.created_at))
  
  res.json(notifs)
})

router.patch('/:id/read', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const updated = await db.update(notifications).set({ read: true })
    .where(eq(notifications.id, parseInt(id)))
    .returning()
  
  res.json(updated[0])
})

export default router