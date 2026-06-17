export const Colors = {
  purple: '#8a2be2',
  blue: '#5e91ff',

  navy: '#002147',
  slate: '#2f496a',

  cream: '#faf2da',
  ivory: '#fffaf1',
} as const;

export type ColorKey = keyof typeof Colors;
