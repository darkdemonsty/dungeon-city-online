import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { bounties, users } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/', requireAuth, async (req, res) => {
  const bountiesList = await db.select({
    id: bounties.id,
    target_id: bounties.target_id,
    reward: bounties.reward,
    reason: bounties.reason,
    status: bounties.status,
    created_at: bounties.created_at,
    poster_name: users.alias
  }).from(bounties).leftJoin(users, eq(bounties.poster_id, users.player_id))
  .where(eq(bounties.status, 'active'))
  
  res.json(bountiesList)
})

router.post('/', requireAuth, async (req, res) => {
  const { target_id, reward, reason } = req.body
  
  const target = await db.select().from(users).where(eq(users.player_id, target_id)).limit(1)
  if (!target.length) {
    return res.status(404).json({ error: 'Target not found' })
  }
  
  const bounty = await db.insert(bounties).values({
    poster_id: req.session.player_id,
    target_id: target_id.trim(),
    reward,
    reason: reason.trim()
  }).returning()
  
  res.json(bounty[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const bounty = await db.select().from(bounties).where(eq(bounties.id, parseInt(id))).limit(1)
  if (!bounty.length) {
    return res.status(404).json({ error: 'Bounty not found' })
  }
  
  if (bounty[0].poster_id !== req.session.player_id && !req.session.is_admin) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  await db.update(bounties).set({ status: 'cancelled' }).where(eq(bounties.id, parseInt(id)))
  res.json({ ok: true })
})

export default router