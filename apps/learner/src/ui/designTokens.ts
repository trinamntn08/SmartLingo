/** Shared visual values. Feature-specific layouts stay with their components. */
import { Platform } from 'react-native';

export const colors = {
  paper: '#F7F4ED', card: '#FFFDFA', ink: '#242722', muted: '#5D6158',
  primary: '#24483C', onPrimary: '#FFFFFF', dark: '#1C352D',
  yellow: '#F2C658', green: '#E0EBE2', line: '#DEDAD0', sand: '#EEEAE1',
  goldTint: '#FAF0D4', sageTint: '#EDF0E8', soft: '#F1EFE9',
  danger: '#9B2F23', softDanger: '#FFF0EB',
  inputBorder: '#87978E', errorBorder: '#DFA99B', focusRing: '#336FA0',
  audioIcon: '#24483C', modalScrim: 'rgba(36,39,34,0.35)',
} as const;

const fontFamily = Platform.select({ web: 'Inter, system-ui, "Segoe UI", "Yu Gothic UI", Meiryo, sans-serif' });

export const designTokens = {
  colors,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radius: { sm: 8, md: 12, input: 8, lg: 16, card: 16 },
  layout: {
    compactBreakpoint: 600, desktopNavBreakpoint: 1000, fullNavBreakpoint: 1100, sidebarBreakpoint: 1050,
    shellMaxWidth: 1536, contentMaxWidth: 1240, libraryMaxWidth: 1320, sidebarWidth: 250,
  },
  control: { minimumTarget: 44, buttonHeight: 48, inputHeight: 48, audioIconSize: 20 },
  focus: { outlineWidth: 3, outlineOffset: 3 },
  opacity: { disabled: 0.5, pressed: 0.75 },
  shadow: { card: '0 2px 3px rgba(36,39,34,0.04)' },
  typography: {
    brand: { fontFamily, fontSize: 22, lineHeight: 28, fontWeight: '600', letterSpacing: -0.45 },
    compactBrand: { fontSize: 20, lineHeight: 28 },
    title: { fontFamily, fontSize: 40, lineHeight: 48, fontWeight: '500', letterSpacing: -1 },
    compactTitle: { fontSize: 32, lineHeight: 40, letterSpacing: -0.5 },
    hero: { fontFamily: Platform.select({ web: 'Georgia, "Times New Roman", serif' }), fontSize: 60, lineHeight: 64, fontWeight: '400', letterSpacing: -1.6 },
    heading: { fontFamily, fontSize: 26, lineHeight: 32, fontWeight: '500', letterSpacing: -0.35 },
    compactHeading: { fontFamily, fontSize: 22, lineHeight: 28, fontWeight: '500' },
    sectionHeading: { fontFamily, fontSize: 22, lineHeight: 28, fontWeight: '500' },
    target: { fontFamily, fontSize: 36, lineHeight: 48, fontWeight: '600' },
    body: { fontFamily, fontSize: 18, lineHeight: 28 },
    muted: { fontFamily, fontSize: 16, lineHeight: 24 },
    eyebrow: { fontFamily, fontSize: 14, lineHeight: 20, fontWeight: '500' },
    label: { fontFamily, fontSize: 16, lineHeight: 24, fontWeight: '600' },
    smallLabel: { fontFamily, fontSize: 14, lineHeight: 20, fontWeight: '600' },
    caption: { fontFamily, fontSize: 14, lineHeight: 20 },
    button: { fontFamily, fontSize: 16, lineHeight: 24, fontWeight: '600', textAlign: 'center' },
    metric: { fontFamily, fontSize: 40, lineHeight: 48, fontWeight: '500', fontVariant: ['tabular-nums'] },
  },
} as const;
