import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getAdminPlayers, getAdminReports, getUpdateLogs } from '../lib/api'
import { useAuth } from '../hooks/use-auth'
import { Card } from '../components/ui/Card'

export default function AdminPage() {
  const { player } = useAuth()
  const [panel, setPanel] = useState<'players' | 'items' | 'history' | 'reports' | 'notifications' | 'updates' | 'code'>('players')
  
  if (!player?.is_admin && !player?.is_moderator) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-destructive text-3xl font-orbitron glow-text-accent">ACCESS DENIED</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-14">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-primary text-2xl font-orbitron glow-text mb-6">ADMIN PANEL</h1>
        
        <nav className="flex gap-2 border-b border-secondary mb-4">
          {['players', 'items', 'history', 'reports', 'notifications', 'updates', 'code'].map(p => (
            <button
              key={p}
              onClick={() => setPanel(p as any)}
              className={`px-3 py-2 font-orbitron text-sm ${
                panel === p ? 'text-primary glow-text' : 'text-secondary'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </nav>
        
        <div>
          {panel === 'players' && <PlayersPanel />}
          {panel === 'items' && <ItemsPanel />}
          {panel === 'history' && <HistoryPanel />}
          {panel === 'reports' && <ReportsPanel />}
          {panel === 'notifications' && <NotificationsPanel />}
          {panel === 'updates' && <UpdatesPanel />}
          {panel === 'code' && player?.is_admin && <CodePanel />}
        </div>
      </div>
    </div>
  )
}

function PlayersPanel() {
  const { data: players, isLoading } = useQuery(['admin-players'], getAdminPlayers)
  
  if (isLoading) return <div className="text-primary">LOADING...</div>
  
  return (
    <div className="space-y-2">
      {players?.map((p: any) => (
        <Card key={p.player_id}>
          <div className="flex justify-between items-center">
            <span className="text-primary font-tech">{p.player_id}</span>
            <span className="text-secondary">LVL {p.level}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ItemsPanel() {
  return <div className="text-secondary">ITEMS PANEL - CRUD interface</div>
}

function HistoryPanel() {
  return <div className="text-secondary">HISTORY PANEL - Lore management</div>
}

function ReportsPanel() {
  const { data: reports, isLoading } = useQuery(['admin-reports'], getAdminReports)
  
  if (isLoading) return <div className="text-primary">LOADING...</div>
  
  return (
    <div className="space-y-2">
      {reports?.map((r: any) => (
        <Card key={r.id}>
          <div className="text-primary">{r.reporter_id} → {r.reported_id}</div>
          <div className="text-secondary text-sm">{r.reason}</div>
        </Card>
      ))}
    </div>
  )
}

function NotificationsPanel() {
  return <div className="text-secondary">NOTIFICATIONS PANEL - Broadcast system</div>
}

function UpdatesPanel() {
  const { data: updates, isLoading } = useQuery(['update-logs'], getUpdateLogs)
  
  if (isLoading) return <div className="text-primary">LOADING...</div>
  
  return (
    <div className="space-y-2">
      {updates?.map((u: any) => (
        <Card key={u.id}>
          <span className="text-primary font-orbitron">v{u.version}</span>
          <span className="text-secondary ml-2">{u.title}</span>
        </Card>
      ))}
    </div>
  )
}

function CodePanel() {
  return (
    <Card>
      <div className="font-tech text-secondary space-y-2">
        <div>MASTER PASSWORD HINT: Look deeper</div>
        <div>SYSTEM STATUS: ONLINE</div>
      </div>
    </Card>
  )
}