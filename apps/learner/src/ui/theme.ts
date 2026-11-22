import { Platform, StyleSheet } from 'react-native';

export const colors = {
  paper: '#F8F6ED', card: '#FFFEF9', white: '#FFFFFF', ink: '#242822', muted: '#606358',
  yellow: '#F8CF45', goldSoft: '#FFF0B7', green: '#D6E7CB', greenSoft: '#E9F0E2', forest: '#34563D',
  line: '#E2DED0', sand: '#EEEADF', focus: '#246944', danger: '#9E3026', softDanger: '#FDEDE5',
};

export const frenchTextProps = Platform.select({ web: { lang: 'fr-FR' }, default: { accessibilityLanguage: 'fr-FR' } });

export const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.paper },
  header: { backgroundColor: colors.card, borderBottomWidth: 1, borderColor: colors.line, paddingHorizontal: 24, paddingVertical: 12 },
  headerInner: { width: '100%', maxWidth: 1440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: -0.8, color: colors.ink },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, maxWidth: '100%', flexShrink: 1 },
  main: { width: '100%', maxWidth: 1240, alignSelf: 'center', paddingHorizontal: 36, paddingTop: 32, paddingBottom: 56, gap: 20 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  split: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'stretch' },
  column: { flexGrow: 1, flexShrink: 1, flexBasis: 330, minWidth: 0, gap: 20 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 22, borderWidth: 1, borderColor: colors.line, borderBottomWidth: 3, gap: 16 },
  title: { fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.5, color: colors.ink },
  hero: { fontSize: 60, lineHeight: 61, fontWeight: '800', letterSpacing: -3, color: colors.ink },
  heading: { fontSize: 23, lineHeight: 29, fontWeight: '700', color: colors.ink, letterSpacing: -0.55 },
  body: { fontSize: 16, lineHeight: 25, color: colors.ink },
  muted: { fontSize: 14, lineHeight: 21, color: colors.muted },
  eyebrow: { fontSize: 11, lineHeight: 16, letterSpacing: 1.35, fontWeight: '800', color: colors.forest, textTransform: 'uppercase' },
  badge: { backgroundColor: colors.sand, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 4, maxWidth: '100%', flexShrink: 1 },
  badgeText: { fontSize: 12, lineHeight: 17, fontWeight: '700', color: colors.ink },
  button: { minHeight: 44, borderRadius: 11, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderBottomWidth: 2, paddingHorizontal: 15, paddingVertical: 10, justifyContent: 'center', alignItems: 'center' },
  buttonPrimary: { backgroundColor: colors.yellow, borderColor: '#C69D25' },
  buttonSelected: { backgroundColor: colors.forest, borderColor: colors.forest },
  buttonText: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: '700', textAlign: 'center' },
  input: { backgroundColor: colors.card, borderColor: '#838677', borderWidth: 1, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 11, fontSize: 16, color: colors.ink, minHeight: 46 },
  notice: { borderRadius: 13, padding: 16, backgroundColor: colors.sand, gap: 8 },
  error: { borderRadius: 14, padding: 18, backgroundColor: colors.softDanger, borderWidth: 1, borderColor: '#E3A99C', gap: 12 },
  progressTrack: { height: 7, backgroundColor: colors.sand, borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: 7, backgroundColor: '#53815D', borderRadius: 10 },
  divider: { height: 1, backgroundColor: colors.line },
  focus: { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' },
});
