/** Shared visual values. Feature-specific layouts stay with their components. */
import { Platform } from 'react-native';

export const colors = {
  paper: '#F5F4ED', card: '#FFFFFF', ink: '#182D27', muted: '#50605A',
  primary: '#145448', onPrimary: '#FFFFFF', dark: '#103B32',
  yellow: '#F2C45C', green: '#DBEBE0', line: '#DEE2D8', sand: '#EFEEE5',
  goldTint: '#FFF0CD', sageTint: '#E6F0E4', skyTint: '#E5EFF7', lilacTint: '#ECEAF7',
  danger: '#9B2F23', softDanger: '#FFF0EB',
  inputBorder: '#87978E', errorBorder: '#DFA99B', focusRing: '#336FA0',
  audioIcon: '#145448', modalScrim: 'rgba(16,59,50,0.35)',
} as const;

const fontFamily = Platform.select({ web: 'Inter, system-ui, "Segoe UI", "Yu Gothic UI", Meiryo, sans-serif' });

export const designTokens = {
  colors,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radius: { sm: 8, md: 12, input: 11, lg: 16, card: 18, pill: 11 },
  layout: {
    compactBreakpoint: 600, desktopNavBreakpoint: 1000, desktopFrenchNavBreakpoint: 1100, sidebarBreakpoint: 1050,
    shellMaxWidth: 1536, contentMaxWidth: 1240, libraryMaxWidth: 1320, sidebarWidth: 250,
  },
  control: { minimumTarget: 48, buttonHeight: 48, inputHeight: 48, audioIconSize: 22 },
  focus: { outlineWidth: 3, outlineOffset: 3 },
  opacity: { disabled: 0.5, pressed: 0.75 },
  shadow: { card: '0 3px 10px rgba(16,59,50,0.045)' },
  typography: {
    brand: { fontFamily, fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.95 },
    compactBrand: { fontSize: 23, lineHeight: 30 },
    title: { fontFamily, fontSize: 41, lineHeight: 50, fontWeight: '700', letterSpacing: -1.35 },
    compactTitle: { fontSize: 34, lineHeight: 42, letterSpacing: -0.8 },
    hero: { fontFamily, fontSize: 56, lineHeight: 64, fontWeight: '700', letterSpacing: -2.2 },
    heading: { fontFamily, fontSize: 26, lineHeight: 34, fontWeight: '700', letterSpacing: -0.55 },
    compactHeading: { fontFamily, fontSize: 22, lineHeight: 30, fontWeight: '700' },
    sectionHeading: { fontFamily, fontSize: 23, lineHeight: 32, fontWeight: '700' },
    target: { fontFamily, fontSize: 38, lineHeight: 49, fontWeight: '700', letterSpacing: -0.7 },
    body: { fontFamily, fontSize: 20, lineHeight: 30 },
    muted: { fontFamily, fontSize: 17, lineHeight: 25 },
    eyebrow: { fontFamily, fontSize: 15, lineHeight: 22, letterSpacing: 0.8, fontWeight: '700', textTransform: 'uppercase' },
    label: { fontFamily, fontSize: 16, lineHeight: 23, fontWeight: '600' },
    smallLabel: { fontFamily, fontSize: 15, lineHeight: 22, fontWeight: '600' },
    caption: { fontFamily, fontSize: 14, lineHeight: 20 },
    button: { fontFamily, fontSize: 18, lineHeight: 26, fontWeight: '600', textAlign: 'center' },
    metric: { fontFamily, fontSize: 40, lineHeight: 49, fontWeight: '600', letterSpacing: -1.3 },
  },
} as const;
