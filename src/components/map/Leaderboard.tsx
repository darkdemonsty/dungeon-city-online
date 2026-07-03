import { useQuery } from 'react-query'
import { getAllPlayers } from '../../lib/api'
import { Card } from '../ui/Card'
import { formatNumber } from '../../lib/utils'

export default function Leaderboard() {
  const { data: players, isLoading } = useQuery(['leaderboard'], getAllPlayers)

  if (isLoading) return <div className="text-primary glow-text">LOADING LEADERBOARDS...</div>

  const topByCred = [...(players || [])].sort((a, b) => b.street_cred - a.street_cred).slice(0, 10)
  const topByBtc = [...(players || [])].sort((a, b) => b.btc - a.btc).slice(0, 10)
  const topByLevel = [...(players || [])].sort((a, b) => b.level - a.level).slice(0, 10)

  const LeaderboardTable = ({ data, title, stat }: { data: any[]; title: string; stat: string }) => (
    <Card>
      <h3 className="text-primary glow-text font-orbitron mb-3">{title}</h3>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rank => {
          const p = data[rank - 1]
          return (
            <div key={rank} className="flex justify-between items-center">
              <span className="text-secondary font-tech">
                #{rank} {p ? p.player_id : '---'}
              </span>
              <span className="text-primary font-orbitron">
                {p ? formatNumber(p[stat]) : '---'}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <LeaderboardTable data={topByCred} title="STREET CRED" stat="street_cred" />
      <LeaderboardTable data={topByBtc} title="BTC" stat="btc" />
      <LeaderboardTable data={topByLevel} title="LEVEL" stat="level" />
    </div>
  )
}