import { createContext, useContext, useState } from 'react'
import { useColorScheme } from 'react-native'
import { ColorScheme, LightTheme, NightTheme, Theme } from '../constants/themes'

type ThemeContextValue = {
  theme: Theme
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveTheme(scheme: ColorScheme, system: 'light' | 'dark' | null | undefined): Theme {
  if (scheme === 'light') return LightTheme
  if (scheme === 'night') return NightTheme
  return system === 'light' ? LightTheme : NightTheme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<ColorScheme>('night')

  const theme = resolveTheme(colorScheme, systemScheme)

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
