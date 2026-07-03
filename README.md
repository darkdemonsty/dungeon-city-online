# Dungeon City Online [DC]

A full-stack cyberpunk text-based MMO web application.

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript, TailwindCSS v4, TanStack Query v5, Wouter, Framer Motion
- **Backend**: Node.js + Express 5 + TypeScript, PostgreSQL + Drizzle ORM
- **Authentication**: express-session + pbkdf2

## Setup

```bash
# Install dependencies
npm install

# Set environment variables (.env)
DATABASE_URL=postgresql://postgres:password@localhost:5432/dungeon_city
SESSION_SECRET=your-secret-key

# Run dev server
npm run dev
```

## Project Structure

```
dungeon-city-online/
├── src/
│   ├── pages/           # AuthPage, HomePage, SettingsPage, AdminPage
│   ├── components/
│   │   ├── ui/          # Button, Input, Modal, Card, Badge, Skeleton, Toaster
│   │   ├── map/         # HistoryBrowser, PlayerSearch, GangDirectory, MemoryLog, BountyBoard, Market, Leaderboard
│   │   ├── chat/        # GlobalChat, GangChat, Mail, Notifications
│   │   ├── profile/     # StatGrid, InventoryGrid, AchievementList
│   │   └── layout/      # ThemeProvider
│   ├── hooks/           # use-auth, use-theme, use-toast
│   └── lib/             # api.ts, utils.ts
├── server/
│   ├── routes/          # auth, players, gangs, chat, items, market, bounties, achievements, admin
│   ├── middleware/      # requireAuth, requireMod, requireAdmin
│   └── lib/             # db, client, logger, seed
```

## Features

- Cyberpunk neon aesthetic with 6 switchable themes
- Session-based authentication with master password support
- Player profiles with inline-editable stats
- Gang system (create, join, leave, manage)
- Global and gang chat with 5s polling
- Personal encrypted memories
- Bounty board for player contracts
- Black market item trading with BTC
- Achievement system
- Admin/moderator panel
- Animated boot sequence on first visit