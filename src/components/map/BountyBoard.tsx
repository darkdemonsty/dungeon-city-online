import React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getBounties, postBounty } from '../../lib/api'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { formatNumber } from '../../lib/utils'
import { useState } from 'react'

export default function BountyBoard() {
  const queryClient = useQueryClient()
  const { data: bounties, isLoading } = useQuery(['bounties'], getBounties)
  const [showPost, setShowPost] = useState(false)
  const [newBounty, setNewBounty] = useState({ target_id: '', reward: 0, reason: '' })

  const postMutation = useMutation(postBounty, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bounties'])
      setShowPost(false)
      setNewBounty({ target_id: '', reward: 0, reason: '' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    postMutation.mutate(newBounty)
  }

  if (isLoading) return <div className="text-primary glow-text">LOADING BOUNTIES...</div>

  return (
    <div>
      <Button onClick={() => setShowPost(true)} className="mb-4">POST BOUNTY</Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bounties?.map((bounty: any) => (
          <BountyCard key={bounty.id} bounty={bounty} />
        ))}
      </div>
      
      {!bounties?.length && (
        <div className="text-center py-8 text-secondary">NO ACTIVE CONTRACTS — GRID SECURE</div>
      )}
      
      <Modal open={showPost} onClose={() => setShowPost(false)} title="POST BOUNTY">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={newBounty.target_id}
            onChange={e => setNewBounty({ ...newBounty, target_id: e.target.value })}
            placeholder="Target Player ID"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <input
            value={newBounty.reward}
            onChange={e => setNewBounty({ ...newBounty, reward: parseInt(e.target.value) })}
            placeholder="Reward (BTC)"
            type="number"
            min="0"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <input
            value={newBounty.reason}
            onChange={e => setNewBounty({ ...newBounty, reason: e.target.value })}
            placeholder="Reason"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button type="submit" loading={postMutation.isPending}>POST CONTRACT</Button>
        </form>
      </Modal>
    </div>
  )
}

function BountyCard({ bounty }: { bounty: any }) {
  return (
    <Card className="border-destructive glow-border-accent">
      <div className="text-destructive font-orbitron mb-2">WANTED</div>
      <div className="text-primary text-xl mb-1">{bounty.target_id}</div>
      <div className="text-accent mb-2">{formatNumber(bounty.reward)} BTC</div>
      <div className="text-secondary text-sm">{bounty.reason}</div>
      <div className="text-xs text-secondary mt-2">Posted: {new Date(bounty.created_at).toLocaleDateString()}</div>
    </Card>
  )
}