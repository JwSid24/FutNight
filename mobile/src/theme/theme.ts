// FutNight design tokens — blandet grøn-blå (teal) identitet.
export const colors = {
  ground: '#07191F',
  surface: '#0D2831',
  surface2: '#123442',
  surface3: '#184150',
  border: '#20404B',
  borderSoft: '#153039',
  text: '#E7F2F1',
  muted: '#8BA7AA',
  muted2: '#6B888C',
  green: '#33D17A',
  blue: '#1E88E5',
  blueSoft: 'rgba(30,136,229,0.13)',
  blueBorder: 'rgba(30,136,229,0.34)',
  accent: '#22C6AE',
  accentPress: '#18AB96',
  accentSoft: 'rgba(34,198,174,0.14)',
  accentBorder: 'rgba(34,198,174,0.36)',
  floodlight: '#F5C451',
  floodlightSoft: 'rgba(245,196,81,0.12)',
  floodlightBorder: 'rgba(245,196,81,0.28)',
  live: '#F4676B',
  onAccent: '#04231D',
} as const;

// Grøn → teal → blå. Brugt på primære knapper, avatars, ➕-fanen.
export const gradient = ['#33D17A', '#25B79E', '#1E88E5'] as const;

export const radius = { sm: 13, md: 20, lg: 26, pill: 999 } as const;

export const font = {
  display: 'BarlowSemiCondensed_800ExtraBold',
  displayBold: 'BarlowSemiCondensed_700Bold',
  displaySemi: 'BarlowSemiCondensed_600SemiBold',
  reg: 'Manrope_400Regular',
  med: 'Manrope_500Medium',
  semi: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extra: 'Manrope_800ExtraBold',
} as const;
