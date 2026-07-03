import { useQuery } from 'react-query'

const fetchMe = async () => {
  const res = await fetch('/api/auth/me', { credentials: 'include' })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

export const useAuth = () => {
  const { data: player, isLoading, refetch } = useQuery(['me'], fetchMe, {
    retry: false,
    staleTime: 5 * 60 * 1000
  })

  return { player, isLoading, refetch }
}