import React, { createContext, useContext, useEffect, useState } from 'react'

const themes = ['default', 'dark', 'shadow', 'rose', 'void', 'limbo'] as const
type Theme = typeof themes[number]

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'default', setTheme: () => {} })

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('default')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme
    if (saved && themes.includes(saved as Theme)) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}