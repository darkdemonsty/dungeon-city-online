import express from 'express'
import session from 'express-session'
import cors from 'cors'
import { httpLogger } from './lib/logger'
import authRoutes from './routes/auth'
import playerRoutes from './routes/players'
import gangRoutes from './routes/gangs'
import historyRoutes from './routes/history'
import chatRoutes from './routes/chat'
import notificationRoutes from './routes/notifications'
import memoryRoutes from './routes/memories'
import itemRoutes from './routes/items'
import marketRoutes from './routes/market'
import bountyRoutes from './routes/bounties'
import achievementRoutes from './routes/achievements'
import adminRoutes from './routes/admin'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(httpLogger)
app.use(express.json())

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

export default app