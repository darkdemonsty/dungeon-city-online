import { useState } from 'react'
import { useMutation } from 'react-query'
import { searchPlayers } from '../../lib/api'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatNumber } from '../../lib/utils'

export default function PlayerSearch() {
  const [query, setQuery] = useState('')
  
  const searchMutation = useMutation(searchPlayers)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) searchMutation.mutate(query.trim())
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search player ID..."
          className="flex-1 px-3 py-2 bg-black border border-primary rounded glow-border font-tech"
        />
        <button type="submit" className="px-4 py-2 border border-primary text-primary glow-border hover:bg-primary hover:text-black">
          SEARCH
        </button>
      </form>
      
      {searchMutation.data && (
        <div className="space-y-2">
          {searchMutation.data.map((player: any) => (
            <Card key={player.player_id}>
              <div className="flex justify-between items-center">
                <span className="font-tech text-primary">{player.player_id}</span>
                <Badge status={player.status}>{player.status}</Badge>
              </div>
              <div className="text-secondary text-sm mt-1">
                {player.alias && <span>{player.alias} • </span>}
                LVL {player.level} • SC {formatNumber(player.street_cred)}
                {player.gang_tag && <span> • [{player.gang_tag}]</span>}
              </div>
            </Card>
          ))}
          {searchMutation.data.length === 0 && (
            <div className="text-center py-4 text-secondary">NO MATCHES FOUND</div>
          )}
        </div>
      )}
    </div>
  )
}