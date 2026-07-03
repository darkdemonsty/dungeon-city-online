import { pgTable, text, integer, boolean, timestamp, serial, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  player_id: text('player_id').primaryKey(),
  password_hash: text('password_hash').notNull(),
  email: text('email').notNull().unique(),
  alias: text('alias'),
  title: text('title'),
  bio: text('bio'),
  profile_picture_url: text('profile_picture_url'),
  btc: integer('btc').default(0),
  gear_score: integer('gear_score').default(0),
  street_cred: integer('street_cred').default(0),
  level: integer('level').default(1),
  print: integer('print').default(0),
  midi: integer('midi').default(0),
  ammo: integer('ammo').default(0),
  skill: integer('skill').default(0),
  mining: integer('mining').default(0),
  is_admin: boolean('is_admin').default(false).notNull(),
  is_moderator: boolean('is_moderator').default(false).notNull(),
  is_muted: boolean('is_muted').default(false).notNull(),
  status: text('status').default('offline').notNull(),
  gang_id: integer('gang_id').references(() => gangs.id),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const gangs = pgTable('gangs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  tag: varchar('tag', { length: 5 }),
  description: text('description'),
  leader_id: text('leader_id').references(() => users.player_id),
  banner_url: text('banner_url'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const history = pgTable('history', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  era: text('era'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const chat = pgTable('chat', {
  id: serial('id').primaryKey(),
  sender_id: text('sender_id').notNull().references(() => users.player_id),
  channel: text('channel').notNull(),
  content: text('content').notNull(),
  recipient_id: text('recipient_id'),
  gang_id: integer('gang_id').references(() => gangs.id),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const memories = pgTable('memories', {
  id: serial('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => users.player_id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  is_pinned: boolean('is_pinned').default(false),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  rarity: text('rarity').notNull(),
  effect: text('effect'),
  lore: text('lore'),
  image_url: text('image_url'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => users.player_id),
  item_id: integer('item_id').notNull().references(() => items.id),
  quantity: integer('quantity').default(1),
  equipped: boolean('equipped').default(false),
  acquired_at: timestamp('acquired_at').defaultNow().notNull()
})

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporter_id: text('reporter_id').notNull().references(() => users.player_id),
  reported_id: text('reported_id').notNull().references(() => users.player_id),
  reason: text('reason').notNull(),
  status: text('status').default('pending').notNull(),
  admin_notes: text('admin_notes'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => users.player_id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  read: boolean('read').default(false),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const update_logs = pgTable('update_logs', {
  id: serial('id').primaryKey(),
  version: text('version').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  player_id: text('player_id').notNull().references(() => users.player_id),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  unlocked_at: timestamp('unlocked_at').defaultNow().notNull()
})

export const bounties = pgTable('bounties', {
  id: serial('id').primaryKey(),
  poster_id: text('poster_id').notNull().references(() => users.player_id),
  target_id: text('target_id').notNull().references(() => users.player_id),
  reward: integer('reward').default(0),
  reason: text('reason'),
  status: text('status').default('active').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const market_listings = pgTable('market_listings', {
  id: serial('id').primaryKey(),
  seller_id: text('seller_id').notNull().references(() => users.player_id),
  item_id: integer('item_id').notNull().references(() => items.id),
  quantity: integer('quantity').default(1),
  price: integer('price').notNull(),
  status: text('status').default('active').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const gang_wars = pgTable('gang_wars', {
  id: serial('id').primaryKey(),
  challenger_id: integer('challenger_id').notNull().references(() => gangs.id),
  defender_id: integer('defender_id').notNull().references(() => gangs.id),
  status: text('status').default('active').notNull(),
  winner_id: integer('winner_id').references(() => gangs.id),
  started_at: timestamp('started_at').defaultNow().notNull(),
  ended_at: timestamp('ended_at')
})

export type User = typeof users.$inferSelect
export type Gang = typeof gangs.$inferSelect
export type HistoryEntry = typeof history.$inferSelect
export type ChatMessage = typeof chat.$inferSelect
export type Memory = typeof memories.$inferSelect
export type Item = typeof items.$inferSelect
export type InventoryItem = typeof inventory.$inferSelect
export type Report = typeof reports.$inferSelect
export type Notification = typeof notifications.$inferSelect
export type UpdateLog = typeof update_logs.$inferSelect
export type Achievement = typeof achievements.$inferSelect
export type Bounty = typeof bounties.$inferSelect
export type MarketListing = typeof market_listings.$inferSelect
export type GangWar = typeof gang_wars.$inferSelect