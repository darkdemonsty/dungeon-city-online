import React from 'react'
import { motion } from 'framer-motion'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'status'
  status?: 'online' | 'away' | 'busy' | 'offline'
  era?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', status, era }) => {
  const baseClasses = 'inline-flex items-center px-2 py-1 text-xs rounded font-tech'
  
  if (status) {
    return (
      <span className="inline-flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full status-${status}`} />
        <span>{children}</span>
      </span>
    )
  }
  
  const variantClasses = {
    primary: 'border border-primary text-primary glow-text',
    secondary: 'border border-secondary text-secondary glow-text-secondary',
    accent: 'border border-accent text-accent glow-text-accent',
    destructive: 'border border-destructive text-destructive glow-text-accent'
  }
  
  const eraClasses: Record<string, string> = {
    'Year 0': 'bg-purple-900 text-purple-300',
    'Year 3': 'bg-blue-900 text-blue-300',
    'Year 7': 'bg-red-900 text-red-300',
    'Year 12': 'bg-green-900 text-green-300',
    'Year 15': 'bg-cyan-900 text-cyan-300'
  }

  return (
    <span className={`${baseClasses} ${era ? eraClasses[era] || variantClasses.primary : variantClasses[variant]}`}>
      {children}
    </span>
  )
}