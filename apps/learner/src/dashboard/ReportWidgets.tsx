import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LearningReport } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

export type ReportState = {
  report: LearningReport | null; loading: boolean; error: string; refresh: () => Promise<void>;
};

export function ReportStatus({ state }: { state: ReportState }) {
  if (state.error) return <View style={s.error}>
    <Text accessibilityRole="alert" style={s.heading}>Your report couldn’t be opened.</Text>
    <Text style={s.body}>{state.error}</Text>
    <Text style={s.muted}>Your saved history has not been changed. You can still explore your lessons.</Text>
    <Button onPress={() => void state.refresh()}>Retry report</Button>
  </View>;
  if (!state.report) return <View style={s.card}><ActivityIndicator color={colors.ink} />
    <Text accessibilityLiveRegion="polite" style={s.body}>Loading your learning report…</Text>
  </View>;
  return state.loading ? <Text accessibilityLiveRegion="polite" style={s.muted}>Refreshing your saved activity…</Text> : null;
}

export function ReportMetrics({ report }: { report: LearningReport }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const metrics = [
    { id: 'lessons', value: report.completedLessons, total: report.totalLessons, title: 'Lessons completed' },
    { id: 'explored', value: report.exploredWords, total: report.totalWords, title: 'Words explored' },
    { id: 'saved', value: report.savedWords, total: null, title: 'Words saved' },
    { id: 'days', value: report.completedStudyDays, total: report.totalStudyDays, title: 'Course lessons completed' },
  ] as const;
  return <View style={[t.panel, reportStyles.metrics]}>
    {metrics.map((metric, index) => <View key={metric.id} testID={`report-${metric.id}`} style={[reportStyles.metric,
      compact && reportStyles.compactMetric, index % (compact ? 2 : 4) !== 0 && reportStyles.metricDivider,
      compact && index >= 2 && reportStyles.metricRowDivider]}>
      <Text style={t.detail}>{metric.title}</Text>
      <Text style={[t.number, reportStyles.metricValue]}>{metric.value}{metric.total !== null && <Text style={reportStyles.total}> / {metric.total}</Text>}</Text>
    </View>)}
  </View>;
}

export function WeeklyActivity({ report }: { report: LearningReport }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const maximum = Math.max(1, ...report.week.map(day => day.actions));
  const plotHeight = compact ? 128 : 176;
  return <View testID="report-week" style={[t.panel, compact && reportStyles.compactPanel]}>
    <View style={t.panelHeader}>
      <Text accessibilityRole="header" style={t.sectionTitle}>Weekly activity</Text>
      <Text style={t.detail}>{report.weekStart} to {report.weekEnd}</Text>
    </View>
    <View style={s.row}>
      <Text style={reportStyles.weekSummary}>{report.actionsThisWeek} saved practice {report.actionsThisWeek === 1 ? 'action' : 'actions'}</Text>
      <Text style={t.detail}>{report.activeDaysThisWeek} active {report.activeDaysThisWeek === 1 ? 'day' : 'days'}</Text>
    </View>
    <View style={reportStyles.chart}>
      <View aria-hidden style={[reportStyles.grid, { height: plotHeight }]}>
        {[0, 1, 2, 3].map(line => <View key={line} style={s.divider} />)}
      </View>
      {report.week.map(day => <View key={day.date} accessible
        accessibilityLabel={`${day.label}, ${day.date}: ${day.actions} actions${day.future ? ', upcoming' : ''}${day.today ? ', today' : ''}`}
        style={reportStyles.chartColumn}>
        <Text style={reportStyles.chartCount}>{day.future ? '–' : day.actions}</Text>
        <View aria-hidden style={[reportStyles.barSpace, { height: plotHeight }]}>
          {!!day.actions && <View style={[reportStyles.bar, day.today && reportStyles.currentBar,
            { height: Math.max(4, day.actions / maximum * plotHeight) }]} />}
        </View>
        <Text style={[t.detail, reportStyles.dayLabel, day.today && reportStyles.currentDay]}>{day.label.slice(0, 3)}</Text>
      </View>)}
    </View>
    <Text style={t.detail}>{report.timeZone}</Text>
  </View>;
}

const reportStyles = StyleSheet.create({
  metrics: { flexDirection: 'row', flexWrap: 'wrap', padding: 0, gap: 0 },
  compactPanel: { padding: 16 },
  metric: { alignSelf: 'stretch', flexBasis: '25%', minWidth: 0, padding: 20, gap: 4 },
  compactMetric: { flexBasis: '50%', padding: 16 },
  metricDivider: { borderLeftWidth: 1, borderColor: colors.line },
  metricRowDivider: { borderTopWidth: 1, borderColor: colors.line },
  metricValue: { fontSize: 28, lineHeight: 36, letterSpacing: 0 },
  total: { ...designTokens.typography.caption, color: colors.muted },
  weekSummary: { ...designTokens.typography.label, color: colors.ink, fontVariant: ['tabular-nums'] },
  chart: { flexDirection: 'row', gap: 4, position: 'relative' },
  grid: { position: 'absolute', top: 28, left: 0, right: 0, justifyContent: 'space-between' },
  chartColumn: { flex: 1, minWidth: 0, alignItems: 'center', gap: 8 },
  chartCount: { ...designTokens.typography.caption, color: colors.muted, lineHeight: 20, fontVariant: ['tabular-nums'] },
  barSpace: { width: '70%', maxWidth: 48, justifyContent: 'flex-end' },
  bar: { backgroundColor: colors.inputBorder, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  currentBar: { backgroundColor: colors.yellow },
  dayLabel: { textAlign: 'center', paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  currentDay: { color: colors.ink, fontWeight: '600', borderBottomColor: colors.yellow },
});
