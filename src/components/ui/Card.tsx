import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : undefined}
      className={`border border-primary rounded-lg p-4 bg-black glow-border ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}