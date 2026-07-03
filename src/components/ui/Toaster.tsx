import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  toasts: Array<{ id: number; message: string; type: 'success' | 'error' }>
  dismiss: (id: number) => void
}

export const Toaster: React.FC<ToastProps> = ({ toasts, dismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`p-4 rounded border ${t.type === 'success' ? 'border-primary' : 'border-destructive'} bg-black glow-border min-w-64`}
          >
            <p className={t.type === 'success' ? 'text-primary glow-text' : 'text-destructive glow-text-accent'}>
              {t.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}