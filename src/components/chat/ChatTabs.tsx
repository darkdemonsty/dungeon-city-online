import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getGlobalChat, getGangChat, getMail, getNotifications, sendGlobalMessage, sendGangMessage, sendMail, markNotificationRead } from '../../lib/api'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { timeAgo } from '../../lib/utils'
import { useState, useEffect, useRef } from 'react'
import { Modal } from '../ui/Modal'

const linkifyContent = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.split(urlRegex).map((part: string, i: number) => 
    urlRegex.test(part) 
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-secondary underline">{part}</a>
      : part
  )
}

export function GlobalChat() {
  const queryClient = useQueryClient()
  const { data: messages, isLoading } = useQuery(['global-chat'], getGlobalChat, {
    refetchInterval: 5000
  })
  const [content, setContent] = useState('')
  
  const sendMutation = useMutation(sendGlobalMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['global-chat'])
      setContent('')
    }
  })

  const endRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) sendMutation.mutate(content)
  }

  if (isLoading) return <div className="text-primary glow-text">LOADING CHAT...</div>

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages?.map((msg: any) => (
          <div key={msg.id} className="border-l-2 border-primary pl-2">
            <span className="text-secondary text-xs font-tech">[{timeAgo(msg.created_at)}]</span>
            <span className="text-accent font-tech ml-2">{msg.sender_id}:</span>
            <span className="text-primary ml-2">{linkifyContent(msg.content)}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-3 py-2 bg-black border border-primary rounded glow-border font-tech"
        />
        <Button type="submit" disabled={!content.trim()} loading={sendMutation.isPending}>
          SEND
        </Button>
      </form>
    </div>
  )
}

export function GangChat() {
  const queryClient = useQueryClient()
  const { data: messages, isLoading } = useQuery(['gang-chat'], getGangChat, {
    refetchInterval: 5000
  })
  const [content, setContent] = useState('')
  
  const sendMutation = useMutation(sendGangMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['gang-chat'])
      setContent('')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) sendMutation.mutate(content)
  }

  if (isLoading) return <div className="text-primary glow-text">LOADING CHAT...</div>

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages?.map((msg: any) => (
          <div key={msg.id} className="border-l-2 border-secondary pl-2">
            <span className="text-secondary text-xs font-tech">[{timeAgo(msg.created_at)}]</span>
            <span className="text-accent font-tech ml-2">{msg.sender_id}:</span>
            <span className="text-primary ml-2">{linkifyContent(msg.content)}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type gang message..."
          className="flex-1 px-3 py-2 bg-black border border-primary rounded glow-border font-tech"
        />
        <Button type="submit" disabled={!content.trim()} loading={sendMutation.isPending}>
          SEND
        </Button>
      </form>
    </div>
  )
}

export function Mail() {
  const queryClient = useQueryClient()
  const { data: threads, isLoading } = useQuery(['mail'], getMail)
  const [showCompose, setShowCompose] = useState(false)
  const [mail, setMail] = useState({ recipient_id: '', content: '' })

  const sendMutation = useMutation(sendMail, {
    onSuccess: () => {
      queryClient.invalidateQueries(['mail'])
      setShowCompose(false)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMutation.mutate(mail)
  }

  if (isLoading) return <div className="text-primary glow-text">LOADING MAIL...</div>

  return (
    <div>
      <Button onClick={() => setShowCompose(true)} className="mb-4">COMPOSE</Button>
      
      <div className="space-y-2">
        {threads?.map((m: any) => (
          <Card key={m.id}>
            <div className="text-primary font-tech">{m.sender_id} → {m.recipient_id}</div>
            <div className="text-secondary text-sm mt-1">{linkifyContent(m.content)}</div>
          </Card>
        ))}
        
        {!threads?.length && <div className="text-secondary">NO MESSAGES — INBOX EMPTY</div>}
      </div>
      
      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="COMPOSE MAIL">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={mail.recipient_id}
            onChange={e => setMail({ ...mail, recipient_id: e.target.value })}
            placeholder="Recipient ID"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <textarea
            value={mail.content}
            onChange={e => setMail({ ...mail, content: e.target.value })}
            placeholder="Message"
            rows={4}
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button type="submit" loading={sendMutation.isPending}>SEND</Button>
        </form>
      </Modal>
    </div>
  )
}

export function Notifications() {
  const queryClient = useQueryClient()
  const { data: notifications, isLoading } = useQuery(['notifications'], getNotifications, {
    refetchInterval: 15000
  })

  const markReadMutation = useMutation(markNotificationRead, {
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  if (isLoading) return <div className="text-primary glow-text">LOADING...</div>

  return (
    <div className="space-y-2">
      {notifications?.map((n: any) => (
        <Card 
          key={n.id} 
          className={!n.read ? 'border-accent animate-pulse' : ''}
          onClick={() => !n.read && markReadMutation.mutate(String(n.id))}
        >
          <div className="text-primary font-orbitron">{n.title}</div>
          <div className="text-secondary text-sm mt-1">{n.content}</div>
        </Card>
      ))}
      
      {!notifications?.length && <div className="text-secondary">NO NOTIFICATIONS — ALL CLEAR</div>}
    </div>
  )
}