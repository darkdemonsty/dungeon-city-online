import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useTheme } from '../hooks/use-theme'
import { logout, submitReport, getUpdateLogs } from '../lib/api'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useLocation } from 'wouter'

const themes = [
  { id: 'default', name: 'Default', colors: 'bg-primary' },
  { id: 'dark', name: 'Dark', colors: 'bg-gray-600' },
  { id: 'shadow', name: 'Shadow', colors: 'bg-green-500' },
  { id: 'rose', name: 'Rose', colors: 'bg-pink-500' },
  { id: 'void', name: 'Void', colors: 'bg-orange-500' },
  { id: 'limbo', name: 'Limbo', colors: 'bg-cyan-400' }
]

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [, setLocation] = useLocation()
  const [bgm, setBgm] = useState(JSON.parse(localStorage.getItem('bgm') || '{"ambient":true,"combat":false,"notification":false}'))
  const [showReport, setShowReport] = useState(false)
  const [report, setReport] = useState({ reported_id: '', reason: '', details: '' })

  const updateLogsQuery = useQuery(['update-logs'], getUpdateLogs)
  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      queryClient.clear()
      setLocation('/')
    }
  })

  const reportMutation = useMutation(submitReport, {
    onSuccess: () => setShowReport(false)
  })

  const handleThemeChange = (themeId: string) => {
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('theme', themeId)
  }

  const handleBgmChange = (key: string) => {
    const newBgm = { ...bgm, [key]: !bgm[key] }
    setBgm(newBgm)
    localStorage.setItem('bgm', JSON.stringify(newBgm))
  }

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault()
    reportMutation.mutate({
      reported_id: report.reported_id,
      reason: report.details || report.reason
    })
  }

  return (
    <div className="min-h-screen bg-black pt-14">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-orbitron text-primary glow-text">SETTINGS</h1>
        
        <section>
          <h2 className="text-secondary font-orbitron mb-3">THEME</h2>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`p-3 border border-primary rounded hover:glow-border-secondary ${t.colors} transition-all`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-secondary font-orbitron mb-3">BGM</h2>
          <div className="space-y-2">
            {Object.entries(bgm).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={() => handleBgmChange(key)}
                  className="w-4 h-4"
                />
                <span className="text-primary capitalize">{key.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-secondary font-orbitron mb-3">UPDATE LOGS</h2>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {updateLogsQuery.data?.map((log: any) => (
              <div key={log.id} className="border border-secondary rounded p-3">
                <span className="text-primary font-orbitron">v{log.version}</span>
                <span className="text-secondary ml-2">{log.title}</span>
                <p className="text-xs mt-1">{log.content}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-secondary font-orbitron mb-3">REPORT PLAYER</h2>
          <Button onClick={() => setShowReport(true)}>SUBMIT REPORT</Button>
        </section>
        
        <section>
          <h2 className="text-secondary font-orbitron mb-3">FEEDBACK</h2>
          <textarea
            placeholder="Send feedback to the system operators..."
            rows={4}
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button className="mt-2">SEND</Button>
        </section>
        
        <section>
          <h2 className="text-secondary font-orbitron mb-3">ACCOUNT</h2>
          <Button variant="destructive" onClick={() => logoutMutation.mutate()}>
            LOGOUT
          </Button>
        </section>
      </div>
      
      <Modal open={showReport} onClose={() => setShowReport(false)} title="REPORT PLAYER">
        <form onSubmit={handleReport} className="space-y-3">
          <input
            value={report.reported_id}
            onChange={e => setReport({ ...report, reported_id: e.target.value })}
            placeholder="Player ID"
            required
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <select
            value={report.reason}
            onChange={e => setReport({ ...report, reason: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          >
            <option value="">Select reason</option>
            <option value="harassment">Harassment</option>
            <option value="cheating">Cheating</option>
            <option value="spam">Spam</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={report.details}
            onChange={e => setReport({ ...report, details: e.target.value })}
            placeholder="Details"
            rows={3}
            className="w-full px-3 py-2 bg-black border border-primary rounded glow-border"
          />
          <Button type="submit" loading={reportMutation.isPending}>SUBMIT</Button>
        </form>
      </Modal>
    </div>
  )
}