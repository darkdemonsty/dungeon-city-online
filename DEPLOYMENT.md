# Dungeon City Online [DC] — Deployment Guide

## Quick Start (Vercel + Neon PostgreSQL)

### 1. Set Up PostgreSQL Database
- Go to [neon.tech](https://neon.tech) and create a free account
- Create a new project and copy the connection string
- Save it as `DATABASE_URL` in your `.env` file

### 2. Generate Session Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and save as `SESSION_SECRET` in `.env`

### 3. Local Development
```bash
npm install
npm run db:push  # Run database migrations
npm run dev      # Start frontend + backend
```
App runs at `http://localhost:5173`

### 4. Deploy to Vercel
```bash
git push origin main
```
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repo
- Add environment variables in Vercel dashboard:
  - `DATABASE_URL` — your Neon connection string
  - `SESSION_SECRET` — your random secret
  - `NODE_ENV` — set to `production`
- Deploy

### 5. Post-Deployment
After Vercel build completes:
```bash
# Create sessions table in your database
npx drizzle-kit push
```

## Project Structure

```
/
├── api/index.ts              ← Vercel serverless entry point
├── dist/public/              ← Built frontend (Vite output)
├── src/                       ← React frontend
├── server/                    ← Express backend
├── lib/
│   ├── db/                   ← Drizzle schema + database
│   └── server/               ← Express app + routes
├── vercel.json               ← Routing config
├── package.json              ← Scripts & dependencies
└── .env.example              ← Template for env vars
```

## Environment Variables

**Required for production (set in Vercel):**
- `DATABASE_URL` — PostgreSQL connection (with ?sslmode=require for Neon)
- `SESSION_SECRET` — 32+ character random string
- `NODE_ENV` — set to `production`

**Local development (.env file):**
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
NODE_ENV=development
```

## Common Issues & Fixes

### Login not working
- Check browser DevTools Console (F12) for errors
- Verify `DATABASE_URL` in Vercel environment
- Ensure `/api` requests are reaching the backend

### Frontend showing backend code
- Vercel routes `/` to `index.html` (handled by `vercel.json`)
- Clear browser cache and refresh

### Database connection failed
- Test the connection string locally first
- Ensure sslmode=require for Neon
- Check DATABASE_URL environment variable is set in Vercel

### Session not persisting
- Sessions are stored in PostgreSQL (not memory)
- Verify connect-pg-simple is installed
- Check DATABASE_URL is correct

## Useful Commands

```bash
# Development
npm run dev                    # Frontend + Backend
npm run dev:web              # Frontend only
npm run dev:api              # Backend only (port 3000)

# Database
npm run db:push              # Apply migrations
npm run db:studio            # Visual DB editor

# Production
npm run build                # Build frontend
npm run typecheck            # TypeScript check
```

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind, React Query, Framer Motion
- **Backend:** Express, Drizzle ORM, PostgreSQL
- **Hosting:** Vercel (serverless functions)
- **Database:** PostgreSQL (Neon/Supabase)
- **Authentication:** Express sessions (database-backed)

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Log in
- `POST /api/auth/logout` — Log out
- `GET /api/auth/me` — Current user

### Players
- `GET /api/players/search?q=` — Search players
- `GET /api/players/:id` — Get player profile
- `PATCH /api/players/me/stats` — Update stats

### Gangs
- `GET /api/gangs` — List all gangs
- `POST /api/gangs` — Create gang
- `POST /api/gangs/:id/join` — Join gang
- `POST /api/gangs/:id/leave` — Leave gang

### Chat
- `GET /api/chat/global` — Global messages
- `POST /api/chat/global` — Send global message
- `GET /api/chat/mail` — Get mail
- `POST /api/chat/mail` — Send mail

### More
- `/api/notifications` — Notifications
- `/api/memories` — Player memories
- `/api/items` — Items & inventory
- `/api/market` — Black market listings
- `/api/bounties` — Bounty board
- `/api/achievements` — Achievements
- `/api/admin/*` — Admin tools (require is_admin=true)

## Support

For issues, check:
1. Vercel deployment logs
2. Browser console errors (F12)
3. Database connection status
4. Environment variables are set correctly
