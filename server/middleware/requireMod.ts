import { Request, Response, NextFunction } from 'express'
import { db } from '../../lib/client'
import { users } from '../../lib/db'
import { eq } from 'drizzle-orm'

export const requireMod = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.player_id) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  
  const user = await db.select().from(users).where(eq(users.player_id, req.session.player_id)).limit(1)
  const player = user[0]
  
  if (!player?.is_admin && !player?.is_moderator) {
    return res.status(403).json({ error: 'Moderator access required' })
  }
  
  next()
}