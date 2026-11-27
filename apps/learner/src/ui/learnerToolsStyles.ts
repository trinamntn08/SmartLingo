import { StyleSheet } from 'react-native';
import { colors, designTokens } from './theme';

/** Presentation shared by the notebook, report and practice workspaces. */
export const toolsStyles = StyleSheet.create({
  page: { gap: 24, minWidth: 0 },
  board: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24, minWidth: 0 },
  main: { flexGrow: 2, flexShrink: 1, flexBasis: 520, minWidth: 0, maxWidth: '100%', gap: 16 },
  side: { flexGrow: 1, flexShrink: 1, flexBasis: 280, minWidth: 0, maxWidth: '100%', gap: 16 },
  panel: { padding: 20, gap: 16, minWidth: 0, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: designTokens.radius.lg },
  panelHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, minWidth: 0 },
  icon: { width: 40, height: 40, borderRadius: designTokens.radius.sm, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stack: { gap: 8, minWidth: 0 },
  sectionTitle: { ...designTokens.typography.sectionHeading, color: colors.ink },
  label: { ...designTokens.typography.smallLabel, color: colors.muted },
  detail: { ...designTokens.typography.caption, color: colors.muted },
  inset: { padding: 16, gap: 12, minWidth: 0, borderRadius: designTokens.radius.md, backgroundColor: colors.sand },
  listRow: { paddingVertical: 16, gap: 12, borderTopWidth: 1, borderColor: colors.line, minWidth: 0 },
  fieldRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, minWidth: 0 },
  field: { flexGrow: 1, flexShrink: 1, flexBasis: 220, minWidth: 0, gap: 8 },
  number: { ...designTokens.typography.metric, color: colors.ink, fontVariant: ['tabular-nums'] },
  stage: { padding: 24, gap: 16, borderRadius: designTokens.radius.md, backgroundColor: colors.sand, minWidth: 0 },
  steps: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, minWidth: 0 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  stepNumber: { width: 24, height: 24, borderRadius: 8, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
});
