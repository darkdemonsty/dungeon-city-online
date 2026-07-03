import { db } from './client'
import { history, items, update_logs } from './db'
import { eq } from 'drizzle-orm'

const seed = async () => {
  const existingHistory = await db.select().from(history).limit(1)
  if (existingHistory.length > 0) return

  await db.insert(history).values([
    {
      title: 'The Great Blackout',
      era: 'Year 0',
      content: 'In Year 0, the global networks collapsed. What remained was the Grid - a fragmented digital wasteland where data brokers and net-runners carved out their territories. The age of information ended, replaced by an age of survival.'
    },
    {
      title: 'Rise of the Ghost Protocol',
      era: 'Year 3',
      content: 'A shadow collective emerged, leaving no digital trace. The Ghost Protocol became legend - whispers of hackers who could vanish from any system.'
    },
    {
      title: 'The Dungeon Wars',
      era: 'Year 7',
      content: 'Corporate wars spilled into the digital realm. The mega-cities became fortresses, their inhabitants trapped in virtual realities while AI armies clashed in cyberspace.'
    },
    {
      title: 'Neon Accords',
      era: 'Year 12',
      content: 'The great treaty was signed. Nations became corps. Freedom became currency. Neon signs lit the perpetual night of the new world order.'
    },
    {
      title: 'Digital Reckoning',
      era: 'Year 15',
      content: 'The present era. Dungeon City stands as the last free node on the Grid. Hackers, mercs, and runners fight for control of the neon-soaked streets.'
    }
  ])

  await db.insert(items).values([
    { name: 'Neural Jack', description: 'Basic net interface implant', type: 'implant', rarity: 'uncommon', effect: 'Neural link' },
    { name: 'Phantom Blade', description: 'Monomolecular edge weapon', type: 'weapon', rarity: 'rare', effect: '+15 damage' },
    { name: 'Kevlar Weave', description: 'Standard street protection', type: 'armor', rarity: 'common', effect: '+10 defense' },
    { name: 'Ghost Protocol', description: 'Full anonymity suite', type: 'implant', rarity: 'legendary', effect: 'Invisible to scans' },
    { name: 'BTC Miner Rig', description: 'Passive BTC generation module', type: 'misc', rarity: 'uncommon', effect: '+5 BTC/hour' },
    { name: 'Void Pistol', description: 'Silent electro rounds', type: 'weapon', rarity: 'rare', effect: 'Silent shot' },
    { name: 'Chrome Fist', description: 'Hydraulic punch augment', type: 'weapon', rarity: 'uncommon', effect: '+25 melee' },
    { name: 'Stealth Cloak', description: 'Active camouflage system', type: 'armor', rarity: 'legendary', effect: 'Invisible 30s' },
    { name: 'Memory Shard', description: 'Stores one backup memory', type: 'misc', rarity: 'common' },
    { name: "Darkdevil's Eye", description: 'Rumored admin tool', type: 'implant', rarity: 'mythic', effect: 'Unknown' }
  ])

  await db.insert(update_logs).values([
    { version: '1.0.0', title: 'System Online', content: 'Dungeon City Online is now live. Welcome to the Grid.' }
  ])
}

seed().catch(console.error)