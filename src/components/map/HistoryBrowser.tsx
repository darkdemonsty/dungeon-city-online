import React from 'react'
import { useQuery } from 'react-query'
import { getHistory } from '../../lib/api'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'

export default function HistoryBrowser() {
  const { data: entries, isLoading } = useQuery(['history'], getHistory)
  const [filter, setFilter] = React.useState('')
  const [expanded, setExpanded] = React.useState<number | null>(null)

  const eras = [...new Set(entries?.map((e: any) => e.era))].filter(Boolean)

  const filtered = entries?.filter((e: any) => 
    !filter || e.era === filter || e.title.toLowerCase().includes(filter.toLowerCase())
  )

  if (isLoading) return <div className="text-primary glow-text">LOADING LORE...</div>

  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.split(urlRegex).map((part, i) => 
      urlRegex.test(part) 
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-secondary underline">{part}</a>
        : part
    )
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter by era..."
          className="flex-1 px-3 py-2 bg-black border border-primary rounded glow-border"
        />
        <select 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 bg-black border border-primary rounded glow-border"
        >
          <option value="">ALL ERAS</option>
          {eras.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      
      <div className="space-y-4">
        {filtered?.map((entry: any) => (
          <Card key={entry.id}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-primary glow-text font-orbitron">{entry.title}</h3>
              <Badge era={entry.era}>{entry.era}</Badge>
            </div>
            <AnimatePresence>
              {(expanded === entry.id || entry.content.length < 200) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-secondary font-tech"
                >
                  <p className="whitespace-pre-wrap">{linkify(entry.content)}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {entry.content.length >= 200 && (
              <button 
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="text-primary glow-text mt-2"
              >
                {expanded === entry.id ? 'COLLAPSE' : 'EXPAND'}
              </button>
            )}
          </Card>
        ))}
        {!filtered?.length && (
          <div className="text-center py-8 text-secondary">
            NO DATA FOUND — SECTOR OFFLINE
          </div>
        )}
      </div>
    </div>
  )
}