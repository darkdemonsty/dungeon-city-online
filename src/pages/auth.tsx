import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'
import { register, login } from '../../lib/api'
import { useToast } from '../../hooks/use-toast'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useLocation } from 'wouter'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isBooting, setIsBooting] = useState(() => !sessionStorage.getItem('booted'))
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const [, setLocation] = useLocation()

  const registerMutation = useMutation(register, {
    onSuccess: () => {
      queryClient.invalidateQueries(['me'])
      setLocation('/home')
      showToast('INITIALIZATION COMPLETE', 'success')
    },
    onError: (e: any) => showToast(e.message, 'error')
  })

  const loginMutation = useMutation(login, {
    onSuccess: () => {
      queryClient.invalidateQueries(['me'])
      setLocation('/home')
      showToast('JACK IN SUCCESSFUL', 'success')
    },
    onError: (e: any) => showToast(e.message, 'error')
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    
    if (mode === 'register') {
      registerMutation.mutate({
        player_id: data.get('player_id') as string,
        email: data.get('email') as string,
        password: data.get('password') as string
      })
    } else {
      loginMutation.mutate({
        player_id: data.get('player_id') as string,
        password: data.get('password') as string
      })
    }
  }

  React.useEffect(() => {
    if (isBooting) {
      const timer = setTimeout(() => {
        setIsBooting(false)
        sessionStorage.setItem('booted', 'true')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isBooting])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence>
        {isBooting && <BootSequence />}
      </AnimatePresence>
      
      {!isBooting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md px-4"
        >
          <div className="border-2 border-primary p-6 rounded-lg glow-border">
            <h1 className="text-3xl font-orbitron text-center text-primary glow-text animate-flicker mb-6">
              DUNGEON CITY ONLINE [DC]
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                name="player_id" 
                label="PLAYER ID" 
                required 
                autoComplete="username"
                pattern="[a-zA-Z0-9_]{3,20}"
                title="3-20 alphanumeric characters or underscores"
              />
              
              {mode === 'register' && (
                <Input name="email" label="EMAIL" type="email" required autoComplete="email" />
              )}
              
              <Input 
                name="password" 
                label="PASSWORD" 
                type="password" 
                required 
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                loading={registerMutation.isPending || loginMutation.isPending}
              >
                {mode === 'register' ? 'INITIALIZE' : 'JACK IN'}
              </Button>
            </form>
            
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="mt-4 text-center w-full text-secondary glow-text-secondary hover:opacity-70"
            >
              {mode === 'login' ? '[ REGISTER ]' : '[ BACK TO LOGIN ]'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function BootSequence() {
  const [lines, setLines] = React.useState<string[]>([])
  
  React.useEffect(() => {
    const bootLines = [
      'SYSTEM INITIALIZATION...',
      'MEMORY CHECK: 64KB OK',
      'NETWORK SCAN: ONLINE',
      'LOADING NEURAL INTERFACE...',
      'CONNECTING TO GRID...',
      'ACCESS GRANTED'
    ]
    
    let i = 0
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines(l => [...l, bootLines[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 400)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center font-tech text-secondary"
    >
      <div className="text-left">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            &gt; {line}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}