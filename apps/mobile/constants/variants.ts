import { Colors } from './colors'

export type Variant = 'filled' | 'outline' | 'ghost'

function withAlpha(color: string, alpha: number): string {
  const hex = color.match(/^#([0-9a-f]{6})$/i)
  if (!hex) return color
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex[1].slice(i - 1, i + 1), 16))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function resolveVariant(variant: Variant, color: string) {
  switch (variant) {
    case 'filled':
      return { backgroundColor: color, borderColor: color, textColor: Colors.ivory }
    case 'outline':
      return { backgroundColor: 'transparent', borderColor: color, textColor: color }
    case 'ghost':
      return { backgroundColor: withAlpha(color, 0.25), borderColor: color, textColor: color }
  }
}
