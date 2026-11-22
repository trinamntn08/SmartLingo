/** Shared visual values. Feature-specific layouts stay with their components. */
export const colors = {
  paper: '#FFFBEA', card: '#FFFFFF', ink: '#4F1F2B', muted: '#78656A',
  yellow: '#FFCE35', green: '#DCEEDC', line: '#EDE3D8', sand: '#F7F0DE',
  danger: '#9E3026', softDanger: '#FDEDE5',
  inputBorder: '#8B8D7E', errorBorder: '#E3A99C', focusRing: '#246944',
  audioIcon: '#19201D', modalScrim: 'rgba(25,32,29,0.35)',
} as const;

export const designTokens = {
  colors,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radius: { sm: 8, md: 16, input: 18, lg: 20, card: 28, pill: 999 },
  layout: {
    compactBreakpoint: 600, sidebarBreakpoint: 1050,
    shellMaxWidth: 1440, contentMaxWidth: 1160, sidebarWidth: 230,
  },
  control: { minimumTarget: 44, buttonHeight: 46, inputHeight: 48, audioIconSize: 22 },
  focus: { outlineWidth: 3, outlineOffset: 3 },
  opacity: { disabled: 0.5, pressed: 0.75 },
  shadow: { card: '0 4px 16px rgba(79,31,43,0.04)' },
  typography: {
    brand: { fontSize: 25, fontWeight: '800', letterSpacing: -1 },
    title: { fontSize: 38, lineHeight: 44, fontWeight: '900', letterSpacing: -1.2 },
    hero: { fontSize: 56, lineHeight: 60, fontWeight: '900', letterSpacing: -2 },
    heading: { fontSize: 24, lineHeight: 31, fontWeight: '800', letterSpacing: -0.4 },
    body: { fontSize: 17, lineHeight: 26 },
    muted: { fontSize: 15, lineHeight: 23 },
    eyebrow: { fontSize: 12, letterSpacing: 1.7, fontWeight: '700', textTransform: 'uppercase' },
    label: { fontSize: 12, fontWeight: '700' },
    button: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  },
} as const;
