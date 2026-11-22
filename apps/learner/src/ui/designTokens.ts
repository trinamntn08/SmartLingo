/** Shared visual values. Feature-specific layouts stay with their components. */
export const colors = {
  paper: '#FAF8F1', card: '#FFFFFF', ink: '#4F1F2B', muted: '#75676A',
  yellow: '#FFCE35', green: '#E8EFE3', line: '#E9E4DA', sand: '#F3F0E7',
  danger: '#9E3026', softDanger: '#FDEDE5',
  inputBorder: '#8B8D7E', errorBorder: '#E3A99C', focusRing: '#246944',
  audioIcon: '#19201D', modalScrim: 'rgba(25,32,29,0.35)',
} as const;

export const designTokens = {
  colors,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radius: { sm: 8, md: 16, input: 12, lg: 16, card: 22, pill: 14 },
  layout: {
    compactBreakpoint: 600, sidebarBreakpoint: 1050,
    shellMaxWidth: 1200, contentMaxWidth: 1080, sidebarWidth: 230,
  },
  control: { minimumTarget: 44, buttonHeight: 46, inputHeight: 48, audioIconSize: 22 },
  focus: { outlineWidth: 3, outlineOffset: 3 },
  opacity: { disabled: 0.5, pressed: 0.75 },
  shadow: { card: '0 2px 4px rgba(79,31,43,0.02)' },
  typography: {
    brand: { fontFamily: 'Arial', fontSize: 24, fontWeight: '800', letterSpacing: -1 },
    title: { fontFamily: 'Arial', fontSize: 34, lineHeight: 42, fontWeight: '800', letterSpacing: -1 },
    hero: { fontFamily: 'Arial', fontSize: 48, lineHeight: 56, fontWeight: '800', letterSpacing: -1.5 },
    heading: { fontFamily: 'Arial', fontSize: 22, lineHeight: 29, fontWeight: '700', letterSpacing: -0.4 },
    body: { fontFamily: 'Arial', fontSize: 17, lineHeight: 26 },
    muted: { fontFamily: 'Arial', fontSize: 15, lineHeight: 23 },
    eyebrow: { fontFamily: 'Arial', fontSize: 11, letterSpacing: 1.4, fontWeight: '700', textTransform: 'uppercase' },
    label: { fontFamily: 'Arial', fontSize: 12, fontWeight: '700' },
    button: { fontFamily: 'Arial', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  },
} as const;
