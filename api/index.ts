import type { VercelRequest, VercelResponse } from '@vercel/node'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { httpLogger } from '../server/lib/logger'
import authRoutes from '../server/routes/auth'
import playerRoutes from '../server/routes/players'
import gangRoutes from '../server/routes/gangs'
import historyRoutes from '../server/routes/history'
import chatRoutes from '../server/routes/chat'
import notificationRoutes from '../server/routes/notifications'
import memoryRoutes from '../server/routes/memories'
import itemRoutes from '../server/routes/items'
import marketRoutes from '../server/routes/market'
import bountyRoutes from '../server/routes/bounties'
import achievementRoutes from '../server/routes/achievements'
import adminRoutes from '../server/routes/admin'

const app = express()

// CORS configuration for Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? /\.vercel\.app$|^https:\/\/dungeon-city-online\.vercel\.app$/
    : true,
  credentials: true
}))

app.use(httpLogger)
app.use(express.json())

// Session configuration for Vercel (stateless)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/players', playerRoutes)
app.use('/api/gangs', gangRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/memories', memoryRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/bounties', bountyRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Remove /api prefix for Express routing
  req.url = req.url?.replace(/^\/api/, '') || '/'
  return app(req as any, res as any)
}
