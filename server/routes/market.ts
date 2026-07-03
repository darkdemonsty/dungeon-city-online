import { Router } from 'express'
import { eq, and } from 'drizzle-orm'
import { db } from '../lib/client'
import { market_listings, users, inventory, items } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/', requireAuth, async (req, res) => {
  const listings = await db.select({
    id: market_listings.id,
    quantity: market_listings.quantity,
    price: market_listings.price,
    status: market_listings.status,
    created_at: market_listings.created_at,
    seller_id: market_listings.seller_id,
    item: items
  }).from(market_listings).leftJoin(items, eq(market_listings.item_id, items.id))
  .where(eq(market_listings.status, 'active'))
  
  res.json(listings)
})

router.post('/', requireAuth, async (req, res) => {
  const { item_id, quantity, price } = req.body
  
  const playerInv = await db.select().from(inventory)
    .where(and(
      eq(inventory.player_id, req.session.player_id),
      eq(inventory.item_id, item_id),
      eq(inventory.equipped, false)
    ))
  
  if (!playerInv.length || playerInv[0].quantity < quantity) {
    return res.status(400).json({ error: 'Not enough items' })
  }
  
  await db.insert(market_listings).values({
    seller_id: req.session.player_id,
    item_id,
    quantity,
    price
  })
  
  res.json({ ok: true })
})

router.post('/:id/buy', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const listing = await db.select().from(market_listings).where(eq(market_listings.id, parseInt(id))).limit(1)
  if (!listing.length || listing[0].status !== 'active') {
    return res.status(404).json({ error: 'Listing not found' })
  }
  
  const buyer = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  if (buyer[0].btc < listing[0].price) {
    return res.status(400).json({ error: 'Not enough BTC' })
  }
  
  const seller = await db.select().from(users).where(eq(users.player_id, listing[0].seller_id)).limit(1)
  
  await db.transaction(async (tx) => {
    await tx.update(users).set({ btc: buyer[0].btc - listing[0].price })
      .where(eq(users.player_id, req.session.player_id))
    
    await tx.update(users).set({ btc: seller[0].btc + listing[0].price })
      .where(eq(users.player_id, listing[0].seller_id))
    
    await tx.insert(inventory).values({
      player_id: req.session.player_id,
      item_id: listing[0].item_id,
      quantity: listing[0].quantity
    })
    
    await tx.update(market_listings).set({ status: 'sold' }).where(eq(market_listings.id, parseInt(id)))
  })
  
  res.json({ ok: true })
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  
  const listing = await db.select().from(market_listings).where(eq(market_listings.id, parseInt(id))).limit(1)
  if (!listing.length || (listing[0].seller_id !== req.session.player_id && !req.session.is_admin)) {
    return res.status(403).json({ error: 'Not authorized' })
  }
  
  await db.update(market_listings).set({ status: 'cancelled' }).where(eq(market_listings.id, parseInt(id)))
  res.json({ ok: true })
})

export default router