import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getGangs, joinGang, leaveGang, createGang } from '../../lib/api'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useState } from 'react'
import { formatNumber } from '../../lib/utils'

export default function GangDirectory() {
  const queryClient = useQueryClient()
  const { data: gangs, isLoading } = useQuery(['gangs'], getGangs)
  const [showCreate, setShowCreate] = useState(false)
  const [newGang, setNewGang] = useState({ name: '', tag: '', description: '' })

  const joinMutation = useMutation(joinGang, {
    onSuccess: () => queryClient.invalidateQueries(['gangs'])
  })

  const createMutation = useMutation(createGang, {
    onSuccess: () => {
      queryClient.invalidateQueries(['gangs'])
      setShowCreate(false)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newGang)
  }

  if (isLoading) return <div className="text-primary glow-text">LOADING GANGS...</div>

  return (
    <div>
      <Button onClick={() => setShowCreate(true)} className="mb-4">CREATE GANG</Button>
      
      <div className="space-y-2">
        {gangs?.map((gang: any) => (
          <GangCard key={gang.id} gang={gang} />
        ))}
      </div>
      
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="CREATE GANG">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={newGang.name}
            onChange={e => setNewGang({ ...newGang, name: e.target.value })}
            placeholder="Gang Name"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <input
            value={newGang.tag}
            onChange={e => setNewGang({ ...newGang, tag: e.target.value.toUpperCase().slice(0, 5) })}
            placeholder="Tag (2-5 chars)"
            maxLength={5}
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <textarea
            value={newGang.description}
            onChange={e => setNewGang({ ...newGang, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button type="submit" loading={createMutation.isPending}>CREATE</Button>
        </form>
      </Modal>
    </div>
  )
}

function GangCard({ gang }: { gang: any }) {
  const queryClient = useQueryClient()
  const joinMutation = useMutation(joinGang, {
    onSuccess: () => queryClient.invalidateQueries(['me'])
  })

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-primary glow-text font-orbitron">{gang.name}</h3>
          {gang.tag && <span className="text-secondary font-tech">[{gang.tag}]</span>}
          <p className="text-sm text-secondary mt-1">{gang.members?.length || 0} MEMBERS</p>
        </div>
        <Button size="sm" onClick={() => joinMutation.mutate(String(gang.id))}>
          JOIN
        </Button>
      </div>
      {gang.description && <p className="text-secondary text-sm mt-2">{gang.description}</p>}
    </Card>
  )
}