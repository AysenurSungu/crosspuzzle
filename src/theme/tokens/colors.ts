// Semantic color tokens. Values are provisional (matched to the current
// login mockup palette) until brand direction is finalised.
export const lightColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  surface: '#f0f7f3',
  surfaceMuted: '#eeeeee',

  primary: '#2f9e78',
  primarySoft: '#d7f0e6',
  primaryContrast: '#ffffff',

  // Brand header block — a constant emerald across light/dark so the
  // home hero reads the same regardless of theme.
  brandHeader: '#0d5c44',
  brandHeaderPill: '#0f6b50',
  brandHeaderControl: '#0a4835',
  brandBright: '#a9f0cf',
  brandBrightText: '#0d3b2c',
  onBrand: '#f0faf5',
  onBrandMuted: '#a7ccbd',

  text: '#1a1a1a',
  textSecondary: '#555555',
  textMuted: '#999999',
  textPlaceholder: '#a0a0a0',
  textLink: '#2f9e78',

  border: '#dddddd',
  borderMuted: '#eeeeee',

  cellEmpty: '#ffffff',
  cellActive: '#d7f0e6',
  cellCorrect: '#2f9e78',
  cellWrong: '#d24d4d',
  cellBlock: '#1a1a1a',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;

export const darkColors: Colors = {
  background: '#111815',
  card: '#1a2320',
  surface: '#1f2b26',
  surfaceMuted: '#243430',

  primary: '#4fc09a',
  primarySoft: '#1e4238',
  primaryContrast: '#0f1512',

  brandHeader: '#0d5c44',
  brandHeaderPill: '#0f6b50',
  brandHeaderControl: '#0a4835',
  brandBright: '#a9f0cf',
  brandBrightText: '#0d3b2c',
  onBrand: '#f0faf5',
  onBrandMuted: '#a7ccbd',

  text: '#f2f2f2',
  textSecondary: '#c8c8c8',
  textMuted: '#8a8a8a',
  textPlaceholder: '#6a6a6a',
  textLink: '#4fc09a',

  border: '#2f3d38',
  borderMuted: '#243430',

  cellEmpty: '#1a2320',
  cellActive: '#1e4238',
  cellCorrect: '#4fc09a',
  cellWrong: '#e07474',
  cellBlock: '#000000',
};
