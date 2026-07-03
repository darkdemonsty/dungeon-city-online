import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { users, reports, history, items, gangs, update_logs, notifications, chat, inventory } from '../lib/db'
import { requireMod } from '../middleware/requireMod'
import { requireAdmin } from '../middleware/requireAdmin'

const router = Router({ mergeParams: true })

router.get('/players', requireMod, async (req, res) => {
  const allPlayers = await db.select({
    player_id: users.player_id,
    alias: users.alias,
    level: users.level,
    gang_id: users.gang_id,
    is_admin: users.is_admin,
    is_moderator: users.is_moderator,
    is_muted: users.is_muted,
    created_at: users.created_at
  }).from(users)
  res.json(allPlayers)
})

router.patch('/players/:id/stats', requireMod, async (req, res) => {
  const { id } = req.params
  const { btc, gear_score, street_cred, level, print, midi, ammo, skill, mining } = req.body
  
  const updates: any = {}
  if (btc !== undefined) updates.btc = btc
  if (gear_score !== undefined) updates.gear_score = gear_score
  if (street_cred !== undefined) updates.street_cred = street_cred
  if (level !== undefined) updates.level = level
  if (print !== undefined) updates.print = print
  if (midi !== undefined) updates.midi = midi
  if (ammo !== undefined) updates.ammo = ammo
  if (skill !== undefined) updates.skill = skill
  if (mining !== undefined) updates.mining = mining
  
  const updated = await db.update(users).set(updates).where(eq(users.player_id, id)).returning()
  const { password_hash, ...userWithoutPassword } = updated[0]
  res.json(userWithoutPassword)
})

router.post('/players/:id/mute', requireMod, async (req, res) => {
  const { id } = req.params
  await db.update(users).set({ is_muted: true }).where(eq(users.player_id, id))
  res.json({ ok: true })
})

router.post('/players/:id/unmute', requireMod, async (req, res) => {
  const { id } = req.params
  await db.update(users).set({ is_muted: false }).where(eq(users.player_id, id))
  res.json({ ok: true })
})

router.post('/players/:id/inventory', requireAdmin, async (req, res) => {
  const { id } = req.params
  const { item_id, quantity } = req.body
  
  const newItem = await db.insert(inventory).values({
    player_id: id,
    item_id,
    quantity
  }).returning()
  
  res.json(newItem[0])
})

router.delete('/players/:id/inventory/:iid', requireAdmin, async (req, res) => {
  const { iid } = req.params
  await db.delete(inventory).where(eq(inventory.id, parseInt(iid)))
  res.json({ ok: true })
})

router.get('/reports', requireMod, async (req, res) => {
  const allReports = await db.select().from(reports).orderBy(eq(reports.created_at))
  res.json(allReports)
})

router.patch('/reports/:id', requireMod, async (req, res) => {
  const { id } = req.params
  const { status, admin_notes } = req.body
  
  const updated = await db.update(reports).set({ status, admin_notes }).where(eq(reports.id, parseInt(id))).returning()
  res.json(updated[0])
})

router.get('/updates', requireMod, async (req, res) => {
  const updates = await db.select().from(update_logs).orderBy(eq(update_logs.created_at))
  res.json(updates)
})

router.post('/updates', requireAdmin, async (req, res) => {
  const { version, title, content } = req.body
  
  const update = await db.insert(update_logs).values({
    version: version.trim(),
    title: title.trim(),
    content: content.trim()
  }).returning()
  
  res.json(update[0])
})

router.post('/history', requireAdmin, async (req, res) => {
  const { title, era, content } = req.body
  
  const entry = await db.insert(history).values({
    title: title.trim(),
    era: era.trim(),
    content: content.trim()
  }).returning()
  
  res.json(entry[0])
})

router.patch('/history/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const { title, era, content } = req.body
  
  const updates: any = {}
  if (title !== undefined) updates.title = title.trim()
  if (era !== undefined) updates.era = era.trim()
  if (content !== undefined) updates.content = content.trim()
  
  const updated = await db.update(history).set(updates).where(eq(history.id, parseInt(id))).returning()
  res.json(updated[0])
})

router.delete('/history/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  await db.delete(history).where(eq(history.id, parseInt(id)))
  res.json({ ok: true })
})

router.post('/items', requireAdmin, async (req, res) => {
  const { name, description, type, rarity, effect, lore, image_url } = req.body
  
  const item = await db.insert(items).values({
    name: name.trim(),
    description: description.trim(),
    type: type.trim(),
    rarity: rarity.trim(),
    effect: effect?.trim(),
    lore: lore?.trim(),
    image_url: image_url?.trim()
  }).returning()
  
  res.json(item[0])
})

router.post('/gangs', requireAdmin, async (req, res) => {
  const { name, tag, description } = req.body
  
  const cleanTag = tag ? tag.trim().toUpperCase() : null
  
  const newGang = await db.insert(gangs).values({
    name: name.trim(),
    tag: cleanTag,
    description: description.trim()
  }).returning()
  
  res.json(newGang[0])
})

router.post('/notifications', requireMod, async (req, res) => {
  const { player_id, title, content } = req.body
  
  const notif = await db.insert(notifications).values({
    player_id: player_id.trim(),
    title: title.trim(),
    content: content.trim()
  }).returning()
  
  res.json(notif[0])
})

router.get('/stats', requireAdmin, async (req, res) => {
  const playerCount = await db.select().from(users)
  const gangCount = await db.select().from(gangs)
  const messageCount = await db.select().from(chat)
  
  res.json({
    playerCount: playerCount.length,
    gangCount: gangCount.length,
    messageCount: messageCount.length
  })
})

export default router