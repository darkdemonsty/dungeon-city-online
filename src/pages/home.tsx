import React, { useState, useEffect } from 'react'
import { useKey } from 'react-use'
import HistoryBrowser from '../components/map/HistoryBrowser'
import PlayerSearch from '../components/map/PlayerSearch'
import GangDirectory from '../components/map/GangDirectory'
import MemoryLog from '../components/map/MemoryLog'
import BountyBoard from '../components/map/BountyBoard'
import Market from '../components/map/Market'
import Leaderboard from '../components/map/Leaderboard'
import { GlobalChat, GangChat, Mail, Notifications } from '../components/chat/ChatTabs'
import ProfileTab from '../components/profile/ProfileTab'
import { useAuth } from '../hooks/use-auth'
import { Link } from 'wouter'
import { Bell, Settings, Copy } from 'lucide-react'
import { useQuery } from 'react-query'
import { getNotifications } from '../lib/api'
import { formatNumber } from '../lib/utils'

export default function HomePage() {
  const [tab, setTab] = useState('MAP')
  const [subTab, setSubTab] = useState('HISTORY')
  const { player, isLoading } = useAuth()

  useKey('Tab', () => {
    const tabs = ['MAP', 'CHAT', 'PROFILE']
    const idx = tabs.indexOf(tab)
    setTab(tabs[(idx + 1) % tabs.length])
  })

  const { data: notifications } = useQuery(['notifications'], getNotifications, {
    refetchInterval: 15000
  })
  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0

  const copyProfile = () => {
    if (!player) return
    const card = `
DUNGEON CITY ONLINE [DC] - PROFILE CARD
PLAYER ID: ${player.player_id}
ALIAS: ${player.alias || 'NONE'}
TITLE: ${player.title || 'NONE'}
LEVEL: ${player.level}
STREET CRED: ${formatNumber(player.street_cred)}
BTC: ${formatNumber(player.btc)}
GEAR SCORE: ${player.gear_score}
STATUS: ${player.status?.toUpperCase() || 'OFFLINE'}
    `.trim()
    navigator.clipboard.writeText(card)
  }

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary glow-text">LOADING...</div>

  const mapSubTabs = ['HISTORY', 'PLAYERS', 'GANGS', 'MEMORIES', 'BOUNTIES', 'MARKET', 'LEADERBOARDS']
  const chatSubTabs = ['GLOBAL', 'GANG', 'MAIL', 'NOTIFICATIONS']

  return (
    <div className="min-h-screen bg-black pt-14 pb-8">
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-primary bg-black flex items-center justify-between px-4 z-40 glow-border">
        <span className="text-primary font-orbitron glow-text">DUNGEON CITY ONLINE [DC]</span>
        
        <div className="flex items-center gap-4">
          {tab === 'PROFILE' && (
            <button onClick={copyProfile} className="text-primary hover:text-secondary">
              <Copy size={18} />
            </button>
          )}
          <Link href="/settings" className="text-secondary hover:text-primary">
            <Settings size={18} />
          </Link>
          <Link href="/notifications" className="relative">
            <Bell size={18} className="text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-xs flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4">
        <nav className="flex gap-2 border-b border-secondary mb-4">
          {['MAP', 'CHAT', 'PROFILE'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-orbitron ${tab === t ? 'text-primary glow-text' : 'text-secondary'}`}
            >
              {t}
            </button>
          ))}
        </nav>
        
        <div className="mt-6">
          {tab === 'MAP' && (
            <div>
              <nav className="flex gap-2 border-b border-secondary mb-4 overflow-x-auto">
                {mapSubTabs.map(st => (
                  <button
                    key={st}
                    onClick={() => setSubTab(st)}
                    className={`px-3 py-2 font-orbitron text-sm whitespace-nowrap ${
                      subTab === st ? 'text-primary glow-text' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </nav>
              
              {subTab === 'HISTORY' && <HistoryBrowser />}
              {subTab === 'PLAYERS' && <PlayerSearch />}
              {subTab === 'GANGS' && <GangDirectory />}
              {subTab === 'MEMORIES' && <MemoryLog />}
              {subTab === 'BOUNTIES' && <BountyBoard />}
              {subTab === 'MARKET' && <Market />}
              {subTab === 'LEADERBOARDS' && <Leaderboard />}
            </div>
          )}
          
          {tab === 'CHAT' && (
            <div>
              <nav className="flex gap-2 border-b border-secondary mb-4">
                {chatSubTabs.map(st => (
                  <button
                    key={st}
                    onClick={() => setSubTab(st)}
                    className={`px-3 py-2 font-orbitron text-sm ${
                      subTab === st ? 'text-primary glow-text' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </nav>
              
              {subTab === 'GLOBAL' && <GlobalChat />}
              {subTab === 'GANG' && <GangChat />}
              {subTab === 'MAIL' && <Mail />}
              {subTab === 'NOTIFICATIONS' && <Notifications />}
            </div>
          )}
          
          {tab === 'PROFILE' && <ProfileTab />}
        </div>
      </main>
    </div>
  )
}