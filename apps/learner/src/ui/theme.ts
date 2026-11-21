import { StyleSheet } from 'react-native';

export const colors = {
  paper: '#FFFBEA', card: '#FFFFFF', ink: '#4F1F2B', muted: '#78656A',
  yellow: '#FFCE35', green: '#DCEEDC', line: '#EDE3D8', sand: '#F7F0DE',
  danger: '#9E3026', softDanger: '#FDEDE5',
};

export const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.paper },
  header: { backgroundColor: colors.paper, borderBottomWidth: 1, borderColor: colors.line, paddingHorizontal: 24, paddingVertical: 18 },
  headerInner: { width: '100%', maxWidth: 1440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  brand: { fontSize: 25, fontWeight: '800', letterSpacing: -1, color: colors.ink },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, maxWidth: '100%', flexShrink: 1 },
  main: { width: '100%', maxWidth: 1160, alignSelf: 'center', padding: 24, paddingTop: 36, paddingBottom: 64, gap: 24 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  split: { flexDirection: 'row', flexWrap: 'wrap', gap: 28, alignItems: 'stretch' },
  column: { flexGrow: 1, flexShrink: 1, flexBasis: 330, minWidth: 0, gap: 20 },
  card: { backgroundColor: colors.card, borderRadius: 28, padding: 24, borderWidth: 1, borderColor: colors.line, boxShadow: '0 4px 16px rgba(79,31,43,0.04)', gap: 16 },
  title: { fontSize: 38, lineHeight: 44, fontWeight: '900', letterSpacing: -1.2, color: colors.ink },
  hero: { fontSize: 56, lineHeight: 60, fontWeight: '900', letterSpacing: -2, color: colors.ink },
  heading: { fontSize: 24, lineHeight: 31, fontWeight: '800', color: colors.ink, letterSpacing: -0.4 },
  body: { fontSize: 17, lineHeight: 26, color: colors.ink },
  muted: { fontSize: 15, lineHeight: 23, color: colors.muted },
  eyebrow: { fontSize: 12, letterSpacing: 1.7, fontWeight: '700', color: colors.muted, textTransform: 'uppercase' },
  badge: { backgroundColor: colors.sand, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, maxWidth: '100%', flexShrink: 1 },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  button: { minHeight: 46, borderRadius: 999, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center', alignItems: 'center' },
  buttonPrimary: { backgroundColor: colors.yellow, borderColor: '#FFCE35' },
  buttonSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
  buttonText: { color: colors.ink, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  input: { backgroundColor: colors.card, borderColor: '#8B8D7E', borderWidth: 1, borderRadius: 18, padding: 14, fontSize: 17, color: colors.ink, minHeight: 48 },
  notice: { borderRadius: 16, padding: 18, backgroundColor: colors.sand, gap: 10 },
  error: { borderRadius: 16, padding: 18, backgroundColor: colors.softDanger, borderWidth: 1, borderColor: '#E3A99C', gap: 12 },
  progressTrack: { height: 8, backgroundColor: colors.sand, borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.ink, borderRadius: 10 },
  divider: { height: 1, backgroundColor: colors.line },
});
