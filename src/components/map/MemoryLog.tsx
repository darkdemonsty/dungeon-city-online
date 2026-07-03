import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getMemories, createMemory, updateMemory, deleteMemory } from '../../lib/api'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useState } from 'react'

export default function MemoryLog() {
  const queryClient = useQueryClient()
  const { data: memories, isLoading } = useQuery(['memories'], getMemories)
  const [showCreate, setShowCreate] = useState(false)
  const [editMemory, setEditMemory] = useState<any>(null)
  const [newMem, setNewMem] = useState({ title: '', content: '' })

  const createMutation = useMutation(createMemory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['memories'])
      setShowCreate(false)
      setNewMem({ title: '', content: '' })
    }
  })

  const updateMutation = useMutation(updateMemory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['memories'])
      setEditMemory(null)
    }
  })

  const deleteMutation = useMutation(deleteMemory, {
    onSuccess: () => queryClient.invalidateQueries(['memories'])
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newMem)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editMemory) {
      updateMutation.mutate({ id: String(editMemory.id), title: editMemory.title, content: editMemory.content })
    }
  }

  const pinned = memories?.filter((m: any) => m.is_pinned) || []
  const unpinned = memories?.filter((m: any) => !m.is_pinned) || []

  if (isLoading) return <div className="text-primary glow-text">LOADING MEMORIES...</div>

  return (
    <div>
      <Button onClick={() => setShowCreate(true)} className="mb-4">NEW MEMORY</Button>
      
      <div className="space-y-4">
        {pinned.length > 0 && (
          <div>
            <h3 className="text-accent glow-text mb-2">PINNED</h3>
            {pinned.map((m: any) => (
              <MemoryCard key={m.id} memory={m} onEdit={setEditMemory} onDelete={deleteMutation.mutate} />
            ))}
          </div>
        )}
        
        {unpinned.length > 0 && (
          <div>
            {pinned.length > 0 && <h3 className="text-secondary mb-2">OTHER</h3>}
            {unpinned.map((m: any) => (
              <MemoryCard key={m.id} memory={m} onEdit={setEditMemory} onDelete={deleteMutation.mutate} />
            ))}
          </div>
        )}
        
        {!memories?.length && (
          <div className="text-center py-8 text-secondary">NO MEMORIES ENCRYPTED</div>
        )}
      </div>
      
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="NEW MEMORY">
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            value={newMem.title}
            onChange={e => setNewMem({ ...newMem, title: e.target.value })}
            placeholder="Title"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <textarea
            value={newMem.content}
            onChange={e => setNewMem({ ...newMem, content: e.target.value })}
            placeholder="Content"
            rows={4}
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button type="submit" loading={createMutation.isPending}>ENCRYPT</Button>
        </form>
      </Modal>
      
      <Modal open={!!editMemory} onClose={() => setEditMemory(null)} title="EDIT MEMORY">
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            value={editMemory?.title || ''}
            onChange={e => setEditMemory({ ...editMemory, title: e.target.value })}
            placeholder="Title"
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <textarea
            value={editMemory?.content || ''}
            onChange={e => setEditMemory({ ...editMemory, content: e.target.value })}
            placeholder="Content"
            rows={4}
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <div className="flex gap-2">
            <Button type="submit" loading={updateMutation.isPending}>SAVE</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(String(editMemory?.id))}>
              DELETE
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function MemoryCard({ memory, onEdit, onDelete }: { memory: any; onEdit: any; onDelete: any }) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <h3 className="text-primary glow-text font-orbitron">{memory.title}</h3>
        <div className="flex gap-1">
          <button onClick={() => onEdit(memory)} className="text-secondary hover:text-primary">EDIT</button>
        </div>
      </div>
      <p className="text-secondary mt-2 font-tech whitespace-pre-wrap">{memory.content}</p>
    </Card>
  )
}