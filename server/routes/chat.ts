import { Router } from 'express'
import { eq, and, or, desc, inArray } from 'drizzle-orm'
import { db } from '../lib/client'
import { users, chat, gangs } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

router.get('/global', requireAuth, async (req, res) => {
  const messages = await db.select({
    id: chat.id,
    sender_id: chat.sender_id,
    content: chat.content,
    created_at: chat.created_at
  }).from(chat).where(eq(chat.channel, 'global')).orderBy(desc(chat.created_at)).limit(50)
  
  res.json(messages.reverse())
})

router.post('/global', requireAuth, async (req, res) => {
  const { content } = req.body
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  if (player[0].is_muted) {
    return res.status(403).json({ error: 'You are muted' })
  }
  
  const message = await db.insert(chat).values({
    sender_id: req.session.player_id,
    channel: 'global',
    content: content.trim()
  }).returning()
  
  res.json(message[0])
})

router.get('/gang', requireAuth, async (req, res) => {
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  
  if (!player[0].gang_id) {
    return res.status(403).json({ error: 'Not in a gang' })
  }
  
  const messages = await db.select({
    id: chat.id,
    sender_id: chat.sender_id,
    content: chat.content,
    created_at: chat.created_at
  }).from(chat).where(and(eq(chat.channel, 'gang'), eq(chat.gang_id, player[0].gang_id))).orderBy(desc(chat.created_at)).limit(50)
  
  res.json(messages.reverse())
})

router.post('/gang', requireAuth, async (req, res) => {
  const { content } = req.body
  
  const player = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  if (player[0].is_muted) {
    return res.status(403).json({ error: 'You are muted' })
  }
  
  if (!player[0].gang_id) {
    return res.status(403).json({ error: 'Not in a gang' })
  }
  
  const message = await db.insert(chat).values({
    sender_id: req.session.player_id,
    channel: 'gang',
    gang_id: player[0].gang_id,
    content: content.trim()
  }).returning()
  
  res.json(message[0])
})

router.get('/mail', requireAuth, async (req, res) => {
  const messages = await db.select({
    id: chat.id,
    sender_id: chat.sender_id,
    recipient_id: chat.recipient_id,
    content: chat.content,
    created_at: chat.created_at
  }).from(chat).where(or(eq(chat.sender_id, req.session.player_id), eq(chat.recipient_id, req.session.player_id)))
  .orderBy(desc(chat.created_at))
  
  res.json(messages)
})

router.post('/mail', requireAuth, async (req, res) => {
  const { recipient_id, content } = req.body
  
  const recipient = await db.select().from(users).where(eq(users.player_id, recipient_id)).limit(1)
  if (!recipient.length) {
    return res.status(404).json({ error: 'Recipient not found' })
  }
  
  const message = await db.insert(chat).values({
    sender_id: req.session.player_id,
    channel: 'mail',
    recipient_id: recipient_id.trim(),
    content: content.trim()
  }).returning()
  
  res.json(message[0])
})

export default router