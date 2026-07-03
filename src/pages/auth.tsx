import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'
import { register, login } from '../lib/api'
import { useToast } from '../hooks/use-toast'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
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
      {/* Grid background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-950 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,255,255,.05) 25%, rgba(0,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(0,255,255,.05) 75%, rgba(0,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,255,255,.05) 25%, rgba(0,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(0,255,255,.05) 75%, rgba(0,255,255,.05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
      
      <AnimatePresence>
        {isBooting && <BootSequence />}
      </AnimatePresence>
      
      {!isBooting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4 relative z-10"
        >
          <div className="bg-gradient-to-b from-gray-900 to-black border border-cyan-500 border-opacity-50 p-8 rounded-lg shadow-2xl" style={{ boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.05)' }}>
            <h1 className="text-4xl font-orbitron text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 font-black tracking-wider">
              DUNGEON CITY
            </h1>
            <p className="text-center text-cyan-400 text-xs font-tech mb-6 tracking-widest">[ ONLINE ]</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50" 
                loading={registerMutation.isPending || loginMutation.isPending}
              >
                {mode === 'register' ? '[ INITIALIZE ]' : '[ JACK IN ]'}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-cyan-500 border-opacity-30">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-center w-full text-cyan-400 hover:text-cyan-300 transition-colors font-tech text-sm tracking-wide"
              >
                {mode === 'login' ? '[ CREATE NEW ACCOUNT ]' : '[ BACK TO LOGIN ]'}
              </button>
            </div>
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