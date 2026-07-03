import React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getMarketListings, createListing, buyListing } from '../../lib/api'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { formatNumber } from '../../lib/utils'
import { useState } from 'react'

export default function Market() {
  const queryClient = useQueryClient()
  const { data: listings, isLoading } = useQuery(['market'], getMarketListings)
  const [showCreate, setShowCreate] = useState(false)
  const [newListing, setNewListing] = useState({ item_id: 0, quantity: 1, price: 0 })

  const createMutation = useMutation(createListing, {
    onSuccess: () => {
      queryClient.invalidateQueries(['market'])
      queryClient.invalidateQueries(['inventory'])
      setShowCreate(false)
    }
  })

  const buyMutation = useMutation(buyListing, {
    onSuccess: () => {
      queryClient.invalidateQueries(['market'])
      queryClient.invalidateQueries(['me'])
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newListing)
  }

  if (isLoading) return <div className="text-primary glow-text">LOADING MARKET...</div>

  return (
    <div>
      <Button onClick={() => setShowCreate(true)} className="mb-4">LIST ITEM</Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings?.map((listing: any) => (
          <MarketCard key={listing.id} listing={listing} onBuy={buyMutation.mutate} />
        ))}
      </div>
      
      {!listings?.length && (
        <div className="text-center py-8 text-secondary">MARKET EMPTY — NO LISTINGS</div>
      )}
      
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="LIST ITEM">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={newListing.item_id}
            onChange={e => setNewListing({ ...newListing, item_id: parseInt(e.target.value) })}
            placeholder="Item ID"
            type="number"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <input
            value={newListing.quantity}
            onChange={e => setNewListing({ ...newListing, quantity: parseInt(e.target.value) })}
            placeholder="Quantity"
            type="number"
            min="1"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <input
            value={newListing.price}
            onChange={e => setNewListing({ ...newListing, price: parseInt(e.target.value) })}
            placeholder="Price (BTC)"
            type="number"
            min="0"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button type="submit" loading={createMutation.isPending}>LIST</Button>
        </form>
      </Modal>
    </div>
  )
}

function MarketCard({ listing, onBuy }: any) {
  const rarityClass = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    legendary: 'text-purple-400',
    mythic: 'text-pink-400'
  }

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-orbitron ${rarityClass[listing.item?.rarity as keyof typeof rarityClass] || 'text-secondary'}`}>
            {listing.item?.name}
          </h3>
          <div className="text-xs text-secondary">QTY: {listing.quantity}</div>
        </div>
        <div className="text-right">
          <div className="text-accent">{formatNumber(listing.price)} BTC</div>
          <Button size="sm" onClick={() => onBuy(String(listing.id))}>BUY</Button>
        </div>
      </div>
      <div className="text-secondary text-sm mt-2">{listing.item?.description}</div>
    </Card>
  )
}