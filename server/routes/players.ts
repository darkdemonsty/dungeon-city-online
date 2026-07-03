import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { users, gangs } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/search', async (req, res) => {
  const { q } = req.query
  const query = (q as string || '').trim()
  
  if (!query) {
    return res.json([])
  }
  
  const results = await db.select({
    player_id: users.player_id,
    alias: users.alias,
    level: users.level,
    street_cred: users.street_cred,
    gang_tag: gangs.tag
  })
  .from(users)
  .leftJoin(gangs, eq(users.gang_id, gangs.id))
  .where(eq(users.player_id, query))
  
  res.json(results)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  
  const player = await db.select({
    player_id: users.player_id,
    alias: users.alias,
    title: users.title,
    bio: users.bio,
    profile_picture_url: users.profile_picture_url,
    btc: users.btc,
    gear_score: users.gear_score,
    street_cred: users.street_cred,
    level: users.level,
    print: users.print,
    midi: users.midi,
    ammo: users.ammo,
    skill: users.skill,
    mining: users.mining,
    status: users.status,
    gang_id: users.gang_id,
    created_at: users.created_at
  }).from(users).where(eq(users.player_id, id)).limit(1)
  
  if (!player.length) {
    return res.status(404).json({ error: 'Player not found' })
  }
  
  const gang = player[0].gang_id 
    ? await db.select().from(gangs).where(eq(gangs.id, player[0].gang_id)).limit(1)
    : []
  
  res.json({ ...player[0], gang_tag: gang[0]?.tag, gang_name: gang[0]?.name })
})

router.patch('/me/stats', requireAuth, async (req, res) => {
  const { alias, title, bio, profile_picture_url, btc, gear_score, street_cred, level, print, midi, ammo, skill, mining, status } = req.body
  
  const updates: any = {}
  if (alias !== undefined) updates.alias = alias.trim()
  if (title !== undefined) updates.title = title.trim()
  if (bio !== undefined) updates.bio = bio.trim()
  if (profile_picture_url !== undefined) updates.profile_picture_url = profile_picture_url.trim()
  if (btc !== undefined) updates.btc = btc
  if (gear_score !== undefined) updates.gear_score = gear_score
  if (street_cred !== undefined) updates.street_cred = street_cred
  if (level !== undefined) updates.level = level
  if (print !== undefined) updates.print = print
  if (midi !== undefined) updates.midi = midi
  if (ammo !== undefined) updates.ammo = ammo
  if (skill !== undefined) updates.skill = skill
  if (mining !== undefined) updates.mining = mining
  if (status !== undefined) updates.status = status
  
  const updated = await db.update(users).set(updates).where(eq(users.player_id, req.session.player_id)).returning()
  const { password_hash, ...userWithoutPassword } = updated[0]
  res.json(userWithoutPassword)
})

export default router