import React from 'react'

interface TabNavProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

export const TabNav: React.FC<TabNavProps> = ({ tabs, active, onChange }) => {
  return (
    <div className="flex gap-2 border-b border-primary mb-4">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 font-orbitron transition-all ${
            active === tab 
              ? 'text-primary border-b-2 border-primary glow-text' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}