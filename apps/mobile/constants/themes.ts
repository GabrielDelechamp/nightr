import { Colors } from './colors'

export type ColorScheme = 'light' | 'night' | 'system'

export type Theme = {
  bg: string
  surface: string
  surfaceLight: string
  text: string
  textMuted: string
  border: string
}

export const NightTheme: Theme = {
  bg: Colors.navy,
  surface: Colors.slate,
  surfaceLight: Colors.slateLight,
  text: Colors.ivory,
  textMuted: Colors.cream,
  border: Colors.slate,
}

export const LightTheme: Theme = {
  bg: '#f5f0e8',
  surface: '#ffffff',
  surfaceLight: 'rgba(255, 255, 255, 0.5)',
  text: Colors.navy,
  textMuted: Colors.slate,
  border: '#d8d0c4',
}
