/** Shared visual values. Feature-specific layouts stay with their components. */
export const colors = {
  paper: '#FAF7EF', card: '#FFFFFF', ink: '#35212F', muted: '#655964',
  yellow: '#F6CA56', green: '#E8EFE3', line: '#E8DED3', sand: '#F3EDE3',
  goldTint: '#FFF0C8', sageTint: '#E5EFE2', skyTint: '#E4EDF6', lilacTint: '#F0E8F5',
  danger: '#9E3026', softDanger: '#FDEDE5',
  inputBorder: '#8B8D7E', errorBorder: '#E3A99C', focusRing: '#246944',
  audioIcon: '#19201D', modalScrim: 'rgba(25,32,29,0.35)',
} as const;

const fontFamily = 'system-ui, "Segoe UI", "Yu Gothic", Meiryo, sans-serif';

export const designTokens = {
  colors,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radius: { sm: 8, md: 16, input: 12, lg: 16, card: 22, pill: 14 },
  layout: {
    compactBreakpoint: 600, desktopNavBreakpoint: 900, sidebarBreakpoint: 1050,
    shellMaxWidth: 1440, contentMaxWidth: 1080, libraryMaxWidth: 1320, sidebarWidth: 240,
  },
  control: { minimumTarget: 44, buttonHeight: 46, inputHeight: 48, audioIconSize: 22 },
  focus: { outlineWidth: 3, outlineOffset: 3 },
  opacity: { disabled: 0.5, pressed: 0.75 },
  shadow: { card: '0 2px 5px rgba(53,33,47,0.05)' },
  typography: {
    brand: { fontFamily, fontSize: 24, fontWeight: '800', letterSpacing: -0.8 },
    title: { fontFamily, fontSize: 42, lineHeight: 49, fontWeight: '800', letterSpacing: -1.2 },
    compactTitle: { fontSize: 34, lineHeight: 40, letterSpacing: -0.7 },
    hero: { fontFamily, fontSize: 48, lineHeight: 55, fontWeight: '800', letterSpacing: -1.5 },
    heading: { fontFamily, fontSize: 24, lineHeight: 31, fontWeight: '700', letterSpacing: -0.3 },
    target: { fontFamily, fontSize: 36, lineHeight: 44, fontWeight: '800' },
    body: { fontFamily, fontSize: 19, lineHeight: 29 },
    muted: { fontFamily, fontSize: 16, lineHeight: 24 },
    eyebrow: { fontFamily, fontSize: 13, letterSpacing: 0.9, fontWeight: '700', textTransform: 'uppercase' },
    label: { fontFamily, fontSize: 14, lineHeight: 20, fontWeight: '700' },
    button: { fontFamily, fontSize: 16, lineHeight: 22, fontWeight: '700', textAlign: 'center' },
  },
} as const;
