// Space Grotesk — gros titres, noms d'établissements
// Inter — UI, boutons, descriptions, listes

export const FontFamily = {
  displayBold:     'SpaceGrotesk_700Bold',
  displaySemiBold: 'SpaceGrotesk_600SemiBold',
  displayMedium:   'SpaceGrotesk_500Medium',

  regular:  'Inter_400Regular',
  medium:   'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold:     'Inter_700Bold',
} as const

export const FontSize = {
  xs:      11,
  sm:      13,
  md:      15,
  lg:      17,
  xl:      20,
  xxl:     24,
  display: 32,
} as const

export const LineHeight = {
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.75,
} as const

export type FontFamilyKey = keyof typeof FontFamily
export type FontSizeKey   = keyof typeof FontSize
