# Dungeon City Online [DC]

**A full-stack cyberpunk text-based MMO web application**

Experience a neon-soaked digital dystopia. Create your character, join gangs, raid the black market, complete bounties, and compete on the leaderboard in this immersive cyberpunk MMO.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS 4 (styling)
- React Query 3 (data fetching)
- Framer Motion (animations)
- Wouter (routing)

**Backend:**
- Node.js + Express 5
- PostgreSQL (database)
- Drizzle ORM (type-safe queries)
- Express Sessions (authentication)

**Hosting:**
- Vercel (serverless deployment)
- Neon or Supabase (PostgreSQL)

## Features

- **User System** — Registration, authentication, profiles with stats
- **Gangs** — Create/join gangs, gang chat, gang wars
- **Exploration** — Player search, gang directory, memory logs
- **Economy** — Black market for buying/selling gear
- **Social** — Global chat, gang chat, private mail, notifications
- **Progression** — Level up, earn street cred, unlock achievements
- **Bounties** — Place bounties on other players
- **Admin Tools** — Moderation, game management, update logs

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment (.env)
DATABASE_URL=postgresql://...
SESSION_SECRET=your-random-secret

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Deploy to Vercel

1. Push to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) and import repository
3. Add environment variables (DATABASE_URL, SESSION_SECRET, NODE_ENV=production)
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
dungeon-city-online/
├── src/              ← React frontend
│   ├── pages/        ← Auth, Home, Admin, Settings
│   ├── components/   ← UI, Map, Chat, Profile
│   ├── hooks/        ← use-auth, use-theme
│   └── lib/          ← api.ts, utils.ts
├── server/           ← Express API
│   ├── routes/       ← Auth, Players, Gangs, Chat, etc.
│   ├── middleware/   ← Auth, Admin, Mod
│   └── lib/          ← DB, Logger, Utilities
├── lib/
│   ├── db/          ← Drizzle schema & migrations
│   └── server/      ← Database setup
├── api/index.ts     ← Vercel serverless handler
├── vercel.json      ← Deployment config
└── package.json     ← Dependencies & scripts
```

## Development Commands

```bash
# Full dev server (frontend + backend)
npm run dev

# Frontend only (port 5173)
npm run dev:web

# Backend only (port 3000)
npm run dev:api

# Database
npm run db:push       # Apply migrations
npm run db:studio     # Visual DB editor

# Production
npm run build         # Build frontend
npm run typecheck     # TypeScript validation
```

## Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
SESSION_SECRET=your-32-character-random-secret-key
NODE_ENV=development
```

## API Endpoints

All API routes prefixed with `/api/`:

**Authentication**
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Log in
- `POST /api/auth/logout` — Log out
- `GET /api/auth/me` — Current user

**Players**
- `GET /api/players/search?q=` — Search players
- `GET /api/players/:id` — Get profile
- `PATCH /api/players/me` — Update profile

**Gangs**
- `GET /api/gangs` — List gangs
- `POST /api/gangs` — Create gang
- `POST /api/gangs/:id/join` — Join
- `POST /api/gangs/:id/leave` — Leave

**Chat**
- `GET /api/chat/global` — Global messages
- `POST /api/chat/global` — Send message
- `GET /api/chat/mail` — Messages
- `POST /api/chat/mail` — Send mail

**More:** `/api/notifications`, `/api/memories`, `/api/items`, `/api/market`, `/api/bounties`, `/api/achievements`, `/api/admin/*`

## Deployment

### On Vercel

1. Connect GitHub repository
2. Set environment variables
3. Auto-deploys on push to main

### Database Setup

```bash
# Create PostgreSQL database (Neon, Supabase, etc.)
# Get connection string and add to .env

# Run migrations
npm run db:push
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Educational and entertainment use.

---

**Ready to jack in?** Deploy on Vercel or run locally. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup.
