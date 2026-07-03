import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { items, inventory, users } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'
import { requireAdmin } from '../middleware/requireAdmin'

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  const allItems = await db.select().from(items)
  res.json(allItems)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const item = await db.select().from(items).where(eq(items.id, parseInt(id))).limit(1)
  
  if (!item.length) {
    return res.status(404).json({ error: 'Item not found' })
  }
  
  res.json(item[0])
})

router.get('/players/:id/inventory', requireAuth, async (req, res) => {
  const { id } = req.params
  const sessionPlayer = req.session.player_id
  
  const player = await db.select().from(users).where(eq(users.player_id, sessionPlayer)).limit(1)
  const isAdmin = player[0].is_admin || player[0].is_moderator
  
  if (id !== sessionPlayer && !isAdmin) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  const inv = await db.select({
    id: inventory.id,
    quantity: inventory.quantity,
    equipped: inventory.equipped,
    acquired_at: inventory.acquired_at,
    item: items
  }).from(inventory).leftJoin(items, eq(inventory.item_id, items.id)).where(eq(inventory.player_id, id))
  
  res.json(inv)
})

router.post('/', requireAdmin, async (req, res) => {
  const { name, description, type, rarity, effect, lore, image_url } = req.body
  
  const item = await db.insert(items).values({
    name: name.trim(),
    description: description.trim(),
    type: type.trim(),
    rarity: rarity.trim(),
    effect: effect.trim(),
    lore: lore.trim(),
    image_url: image_url.trim()
  }).returning()
  
  res.json(item[0])
})

router.patch('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  const { name, description, type, rarity, effect, lore, image_url } = req.body
  
  const updates: any = {}
  if (name !== undefined) updates.name = name.trim()
  if (description !== undefined) updates.description = description.trim()
  if (type !== undefined) updates.type = type.trim()
  if (rarity !== undefined) updates.rarity = rarity.trim()
  if (effect !== undefined) updates.effect = effect.trim()
  if (lore !== undefined) updates.lore = lore.trim()
  if (image_url !== undefined) updates.image_url = image_url.trim()
  
  const updated = await db.update(items).set(updates).where(eq(items.id, parseInt(id))).returning()
  res.json(updated[0])
})

router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params
  await db.delete(items).where(eq(items.id, parseInt(id)))
  res.json({ ok: true })
})

export default router