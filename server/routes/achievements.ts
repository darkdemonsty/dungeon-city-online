import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../lib/client'
import { achievements, users, chat } from '../lib/db'
import { requireAuth } from '../middleware/requireAuth'

const router = Router({ mergeParams: true })

const checkAndGrantAchievements = async (player_id: string) => {
  const player = await db.select().from(users).where(eq(users.player_id, player_id)).limit(1)
  if (!player.length) return
  
  const existingAch = await db.select().from(achievements).where(eq(achievements.player_id, player_id))
  const unlockedNames = existingAch.map(a => a.name)
  
  const newAchievements = []
  
  if (player[0].btc >= 10000 && !unlockedNames.includes('Loaded')) {
    newAchievements.push({ player_id, name: 'Loaded', description: 'Reach 10,000 BTC', icon: '💰' })
  }
  
  if (player[0].gear_score >= 999 && !unlockedNames.includes('Max Gear')) {
    newAchievements.push({ player_id, name: 'Max Gear', description: 'Reach max gear score', icon: '⚙️' })
  }
  
  if (player[0].street_cred >= 1000 && !unlockedNames.includes('Street Legend')) {
    newAchievements.push({ player_id, name: 'Street Legend', description: 'Reach 1000 street cred', icon: '🏆' })
  }
  
  if (player[0].level >= 1 && !unlockedNames.includes('First Jack In')) {
    newAchievements.push({ player_id, name: 'First Jack In', description: 'First login', icon: '🔌' })
  }
  
  if (player[0].gang_id && !unlockedNames.includes('Gang Up')) {
    newAchievements.push({ player_id, name: 'Gang Up', description: 'Join a gang', icon: '👥' })
  }
  
  if (newAchievements.length > 0) {
    await db.insert(achievements).values(newAchievements)
  }
}

router.get('/players/:id', async (req, res) => {
  const { id } = req.params
  const ach = await db.select().from(achievements).where(eq(achievements.player_id, id))
  res.json(ach)
})

export default router
export { checkAndGrantAchievements }