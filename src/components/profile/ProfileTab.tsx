import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getPlayer, updatePlayerStats, getPlayerInventory, getAchievements } from '../../lib/api'
import { useAuth } from '../../hooks/use-auth'
import { Card } from '../ui/Card'
import { formatNumber } from '../../lib/utils'
import { useState, useRef } from 'react'

export default function ProfileTab() {
  const { player } = useAuth()
  const queryClient = useQueryClient()
  
  const { data: inventory } = useQuery(['inventory', player?.player_id], () => getPlayerInventory(player?.player_id || ''))
  const { data: achievements } = useQuery(['achievements', player?.player_id], () => getAchievements(player?.player_id || ''))
  
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [status, setStatus] = useState(player?.status || 'online')
  
  const updateMutation = useMutation(updatePlayerStats, {
    onSuccess: () => {
      queryClient.invalidateQueries(['me'])
      setEditing(null)
    }
  })

  const startEdit = (field: string, value: string) => {
    setEditing(field)
    setEditValue(value)
  }

  const endEdit = () => {
    if (editing && editValue !== player?.[editing as keyof typeof player]) {
      updateMutation.mutate({ [editing]: editValue.trim() })
    }
    setEditing(null)
  }

  const updateStatus = useMutation(() => fetch('/api/players/me/stats', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json()), {
    onSuccess: () => queryClient.invalidateQueries(['me'])
  })

  if (!player) return <div className="text-primary">LOADING...</div>

  const StatField = ({ label, field, value }: { label: string; field: string; value: any }) => (
    <div className="border-b border-secondary pb-2">
      <span className="text-secondary text-xs font-tech">{label}</span>
      {editing === field ? (
        <input
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={endEdit}
          onKeyDown={e => e.key === 'Enter' && endEdit()}
          autoFocus
          className="w-full bg-transparent text-primary font-orbitron outline-none"
        />
      ) : (
        <div onClick={() => startEdit(field, value)} className="text-primary font-orbitron cursor-pointer hover:glow-text">
          {value || '—'}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-primary glow-text font-orbitron mb-4">STATS</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatField label="PLAYER ID" field="player_id" value={player.player_id} />
          <StatField label="ALIAS" field="alias" value={player.alias} />
          <StatField label="TITLE" field="title" value={player.title} />
          <StatField label="LEVEL" field="level" value={player.level} />
          <StatField label="STREET CRED" field="street_cred" value={formatNumber(player.street_cred)} />
          <StatField label="GEAR SCORE" field="gear_score" value={player.gear_score} />
          <StatField label="BTC" field="btc" value={formatNumber(player.btc)} />
          <StatField label="PRINT" field="print" value={player.print} />
          <StatField label="MIDI" field="midi" value={player.midi} />
          <StatField label="AMMO" field="ammo" value={player.ammo} />
          <StatField label="SKILL" field="skill" value={player.skill} />
          <StatField label="MINING" field="mining" value={player.mining} />
        </div>
        
        <div className="mt-4">
          <span className="text-secondary text-xs font-tech">STATUS</span>
          <select
            value={status}
            onChange={e => {
              setStatus(e.target.value)
              updateStatus.mutate()
            }}
            className="w-full bg-black border border-primary rounded glow-border text-primary font-orbitron mt-1"
          >
            <option value="online">ONLINE</option>
            <option value="away">AWAY</option>
            <option value="busy">BUSY</option>
            <option value="offline">OFFLINE</option>
          </select>
        </div>
      </Card>

      <Card>
        <h2 className="text-primary glow-text font-orbitron mb-4">INVENTORY</h2>
        <div className="grid grid-cols-4 gap-2">
          {inventory?.map((item: any) => (
            <div key={item.id} className="border border-secondary rounded p-2 text-center">
              <div className={`text-xs rarity-${item.item?.rarity || 'common'}`}>{item.item?.name}</div>
              <div className="text-secondary text-xs">x{item.quantity}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-primary glow-text font-orbitron mb-4">ACHIEVEMENTS</h2>
        <div className="flex flex-wrap gap-2">
          {achievements?.map((a: any) => (
            <span key={a.id} className="text-xs border border-accent rounded px-2 py-1 text-accent">
              {a.icon} {a.name}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}