import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

const themes = ['default', 'dark', 'shadow', 'rose', 'void', 'limbo'] as const
type Theme = typeof themes[number]

export const useTheme = () => {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme
    const theme = saved && themes.includes(saved as Theme) ? saved : 'default'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  const setTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    queryClient.invalidateQueries()
  }

  return { setTheme, themes }
}