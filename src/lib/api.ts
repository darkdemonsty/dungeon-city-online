const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const register = (data: { player_id: string; password: string; email: string }) =>
  apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })

export const login = (data: { player_id: string; password: string }) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })

export const logout = () => apiFetch('/api/auth/logout', { method: 'POST' })

export const searchPlayers = (q: string) => apiFetch(`/api/players/search?q=${encodeURIComponent(q)}`)

export const getPlayer = (id: string) => apiFetch(`/api/players/${id}`)

export const updatePlayerStats = (stats: any) =>
  apiFetch('/api/players/me/stats', { method: 'PATCH', body: JSON.stringify(stats) })

export const getGangs = () => apiFetch('/api/gangs')

export const getGang = (id: string) => apiFetch(`/api/gangs/${id}`)

export const createGang = (data: { name: string; tag: string; description: string }) =>
  apiFetch('/api/gangs', { method: 'POST', body: JSON.stringify(data) })

export const joinGang = (id: string) => apiFetch(`/api/gangs/${id}/join`, { method: 'POST' })

export const leaveGang = (id: string) => apiFetch(`/api/gangs/${id}/leave`, { method: 'POST' })

export const getHistory = () => apiFetch('/api/history')

export const getGlobalChat = () => apiFetch('/api/chat/global')

export const sendGlobalMessage = (content: string) =>
  apiFetch('/api/chat/global', { method: 'POST', body: JSON.stringify({ content }) })

export const getGangChat = () => apiFetch('/api/chat/gang')

export const sendGangMessage = (content: string) =>
  apiFetch('/api/chat/gang', { method: 'POST', body: JSON.stringify({ content }) })

export const getMail = () => apiFetch('/api/chat/mail')

export const sendMail = (data: { recipient_id: string; content: string }) =>
  apiFetch('/api/chat/mail', { method: 'POST', body: JSON.stringify(data) })

export const getNotifications = () => apiFetch('/api/notifications')

export const markNotificationRead = (id: string) =>
  apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })

export const getMemories = () => apiFetch('/api/memories')

export const createMemory = (data: { title: string; content: string }) =>
  apiFetch('/api/memories', { method: 'POST', body: JSON.stringify(data) })

export const updateMemory = (id: string, data: { title?: string; content?: string; is_pinned?: boolean }) =>
  apiFetch(`/api/memories/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteMemory = (id: string) => apiFetch(`/api/memories/${id}`, { method: 'DELETE' })

export const getItems = () => apiFetch('/api/items')

export const getPlayerInventory = (id: string) => apiFetch(`/api/players/${id}/inventory`)

export const getMarketListings = () => apiFetch('/api/market')

export const createListing = (data: { item_id: number; quantity: number; price: number }) =>
  apiFetch('/api/market', { method: 'POST', body: JSON.stringify(data) })

export const buyListing = (id: string) => apiFetch(`/api/market/${id}/buy`, { method: 'POST' })

export const getBounties = () => apiFetch('/api/bounties')

export const postBounty = (data: { target_id: string; reward: number; reason: string }) =>
  apiFetch('/api/bounties', { method: 'POST', body: JSON.stringify(data) })

export const getAchievements = (id: string) => apiFetch(`/api/players/${id}/achievements`)

export const submitReport = (data: { reported_id: string; reason: string }) =>
  apiFetch('/api/reports', { method: 'POST', body: JSON.stringify(data) })

export const getUpdateLogs = () => apiFetch('/api/admin/updates')

export const getAdminPlayers = () => apiFetch('/api/admin/players')

export const getAdminReports = () => apiFetch('/api/admin/reports')

export const getAllPlayers = () => apiFetch('/api/players/search?q=')