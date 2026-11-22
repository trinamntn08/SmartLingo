import { StyleSheet } from 'react-native';
import { colors, designTokens as tokens } from './designTokens';

export { colors, designTokens } from './designTokens';

export const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.paper },
  header: { backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.line, paddingHorizontal: 24, paddingVertical: 10 },
  headerInner: { width: '100%', maxWidth: tokens.layout.libraryMaxWidth, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space.lg, flexWrap: 'wrap' },
  brand: { ...tokens.typography.brand, color: colors.ink },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, maxWidth: '100%', flexShrink: 1 },
  main: { width: '100%', maxWidth: tokens.layout.contentMaxWidth, alignSelf: 'center', padding: tokens.space.xxl, paddingTop: 40, paddingBottom: 48, gap: tokens.space.xxl },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: tokens.space.md },
  split: { flexDirection: 'row', flexWrap: 'wrap', gap: 28, alignItems: 'stretch' },
  column: { flexGrow: 1, flexShrink: 1, flexBasis: 330, minWidth: 0, gap: 20 },
  card: { backgroundColor: colors.card, borderRadius: tokens.radius.card, padding: tokens.space.xxl, borderWidth: 1, borderColor: colors.line, boxShadow: tokens.shadow.card, gap: tokens.space.lg },
  title: { ...tokens.typography.title, color: colors.ink },
  compactTitle: tokens.typography.compactTitle,
  hero: { ...tokens.typography.hero, color: colors.ink },
  heading: { ...tokens.typography.heading, color: colors.ink },
  target: { ...tokens.typography.target, color: colors.ink },
  body: { ...tokens.typography.body, color: colors.ink },
  muted: { ...tokens.typography.muted, color: colors.muted },
  eyebrow: { ...tokens.typography.eyebrow, color: colors.muted },
  badge: { backgroundColor: colors.sand, borderRadius: tokens.radius.lg, paddingHorizontal: 10, paddingVertical: 6, maxWidth: '100%', flexShrink: 1 },
  badgeText: { ...tokens.typography.label, color: colors.ink },
  button: { minHeight: tokens.control.buttonHeight, borderRadius: tokens.radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: tokens.space.xl, paddingVertical: tokens.space.md, justifyContent: 'center', alignItems: 'center' },
  buttonPrimary: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  buttonSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  buttonText: { ...tokens.typography.button, color: colors.ink },
  input: { backgroundColor: colors.card, borderColor: colors.inputBorder, borderWidth: 1, borderRadius: tokens.radius.input, padding: 14, fontFamily: tokens.typography.body.fontFamily, fontSize: tokens.typography.body.fontSize, color: colors.ink, minHeight: tokens.control.inputHeight },
  notice: { borderRadius: 16, padding: 18, backgroundColor: colors.sand, gap: 10 },
  error: { borderRadius: tokens.radius.md, padding: 18, backgroundColor: colors.softDanger, borderWidth: 1, borderColor: colors.errorBorder, gap: tokens.space.md },
  progressTrack: { height: 8, backgroundColor: colors.sand, borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.ink, borderRadius: 10 },
  divider: { height: 1, backgroundColor: colors.line },
});
