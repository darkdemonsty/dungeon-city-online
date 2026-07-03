import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { users, gangs, gang_wars } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const allGangs = await db.select().from(gangs)
  res.json(allGangs)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  
  const gang = await db.select().from(gangs).where(eq(gangs.id, parseInt(id))).limit(1)
  if (!gang.length) {
    return res.status(404).json({ error: 'Gang not found' })
  }
  
  const members = await db.select({
    player_id: users.player_id,
    alias: users.alias,
    level: users.level,
    street_cred: users.street_cred,
    status: users.status
  }).from(users).where(eq(users.gang_id, parseInt(id)))
  
  const wars = await db.select({
    id: gang_wars.id,
    challenger_id: gang_wars.challenger_id,
    defender_id: gang_wars.defender_id,
    status: gang_wars.status,
    started_at: gang_wars.started_at,
    challenger_name: gangs.name
  }).from(gang_wars).where(eq(gang_wars.status, 'active')).then(async (wars) => {
    const challengers = await db.select({ id: gangs.id, name: gangs.name }).from(gangs)
    return wars.map(w => ({
      ...w,
      challenger_name: challengers.find(g => g.id === w.challenger_id)?.name,
      defender_name: challengers.find(g => g.id === w.defender_id)?.name
    }))
  })
  
  res.json({ ...gang[0], members, wars })
})

router.post('/', requireAuth, async (req, res) => {
  const { name, tag, description } = req.body
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  const existingGang = player[0]?.gang_id
  
  if (existingGang) {
    return res.status(400).json({ error: 'Already in a gang' })
  }
  
  const cleanTag = tag ? tag.trim().toUpperCase() : null
  
  const newGang = await db.insert(gangs).values({
    name: name.trim(),
    tag: cleanTag,
    description: description.trim()
  }).returning()
  
  await db.update(users).set({ gang_id: newGang[0].id }).where(eq(users.player_id, req.session.player_id))
  
  res.json(newGang[0])
})

router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { description, banner_url } = req.body
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  const gang = await db.select().from(gangs).where(eq(gangs.id, parseInt(id))).limit(1)
  
  if (!gang.length) return res.status(404).json({ error: 'Gang not found' })
  if (gang[0].leader_id !== req.session.player_id && !player[0].is_admin && !player[0].is_moderator) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  const updated = await db.update(gangs).set({
    description: description.trim(),
    banner_url: banner_url?.trim()
  }).where(eq(gangs.id, parseInt(id))).returning()
  
  res.json(updated[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  if (!player[0].is_admin) {
    return res.status(403).json({ error: 'Admin only' })
  }
  
  await db.delete(gangs).where(eq(gangs.id, parseInt(id)))
  res.json({ ok: true })
})

router.post('/:id/join', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  if (player[0].gang_id) {
    return res.status(400).json({ error: 'Already in a gang' })
  }
  
  await db.update(users).set({ gang_id: parseInt(id) }).where(eq(users.player_id, req.session.player_id))
  res.json({ ok: true })
})

router.post('/:id/leave', requireAuth, async (req, res) => {
  await db.update(users).set({ gang_id: null }).where(eq(users.player_id, req.session.player_id))
  res.json({ ok: true })
})

router.delete('/:id/members/:pid', requireAuth, async (req, res) => {
  const { id, pid } = req.params
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  const gang = await db.select().from(gangs).where(eq(gangs.id, parseInt(id))).limit(1)
  
  if (!gang.length) return res.status(404).json({ error: 'Gang not found' })
  if (gang[0].leader_id !== req.session.player_id && !player[0].is_admin && !player[0].is_moderator) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  await db.update(users).set({ gang_id: null }).where(eq(users.player_id, pid))
  res.json({ ok: true })
})

export default router