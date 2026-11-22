import { StyleSheet } from 'react-native';
import { colors, designTokens } from './theme';

const fontFamily = designTokens.typography.body.fontFamily;

/** Presentation shared by the notebook, report and practice workspaces. */
export const toolsStyles = StyleSheet.create({
  page: { gap: 28, minWidth: 0 },
  board: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24, minWidth: 0 },
  main: { flexGrow: 2, flexShrink: 1, flexBasis: 520, minWidth: 0, maxWidth: '100%', gap: 20 },
  side: { flexGrow: 1, flexShrink: 1, flexBasis: 280, minWidth: 0, maxWidth: '100%', gap: 18 },
  panel: { padding: 24, gap: 20, minWidth: 0, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 22 },
  panelHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14, minWidth: 0 },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.goldTint, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stack: { gap: 8, minWidth: 0 },
  sectionTitle: { fontFamily, fontSize: 21, lineHeight: 29, color: colors.ink, fontWeight: '700' },
  label: { fontFamily, color: colors.muted, fontSize: 13, lineHeight: 20, fontWeight: '600' },
  detail: { fontFamily, color: colors.muted, fontSize: 15, lineHeight: 23 },
  inset: { padding: 20, gap: 12, minWidth: 0, borderRadius: 16, backgroundColor: colors.sand },
  listRow: { paddingVertical: 22, gap: 14, borderTopWidth: 1, borderColor: colors.line, minWidth: 0 },
  fieldRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, minWidth: 0 },
  field: { flexGrow: 1, flexShrink: 1, flexBasis: 220, minWidth: 0, gap: 8 },
  number: { fontFamily, fontSize: 38, lineHeight: 46, color: colors.ink, fontWeight: '600', letterSpacing: -1.3 },
  stage: { padding: 24, gap: 22, borderRadius: 18, backgroundColor: colors.skyTint, minWidth: 0 },
  steps: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, minWidth: 0 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  stepNumber: { width: 25, height: 25, borderRadius: 8, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
});
