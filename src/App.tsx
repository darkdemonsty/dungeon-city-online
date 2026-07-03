import { Route, Switch } from 'wouter'
import AuthPage from './pages/auth'
import HomePage from './pages/home'
import SettingsPage from './pages/settings'
import AdminPage from './pages/admin'
import { useAuth } from './hooks/use-auth'
import { Toaster } from './components/ui/Toaster'
import { useToast } from './hooks/use-toast'

function App() {
  const { player, isLoading } = useAuth()
  const { toasts, dismiss } = useToast()

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-primary glow-text">JACKING IN...</div>
  }

  return (
    <div className="bg-black min-h-screen">
      <Toaster toasts={toasts} dismiss={dismiss} />
      <Switch>
        <Route path="/">{player ? <HomePage /> : <AuthPage />}</Route>
        <Route path="/login">{player ? <HomePage /> : <AuthPage />}</Route>
        <Route path="/home">{player ? <HomePage /> : <AuthPage />}</Route>
        <Route path="/settings">{player ? <SettingsPage /> : <AuthPage />}</Route>
        <Route path="/admin">{(player?.is_admin || player?.is_moderator) ? <AdminPage /> : <AuthPage />}</Route>
      </Switch>
    </div>
  )
}

export default App