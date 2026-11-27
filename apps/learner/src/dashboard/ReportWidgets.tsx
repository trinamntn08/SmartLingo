import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
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
    <Button onPress={() => void state.refresh()}>Retry report</Button>
  </View>;
  if (!state.report) return <View style={s.card}><ActivityIndicator color={colors.ink} />
    <Text accessibilityLiveRegion="polite" style={s.body}>Loading report…</Text>
  </View>;
  return state.loading ? <Text accessibilityLiveRegion="polite" style={s.muted}>Refreshing activity…</Text> : null;
}

export function ReportMetrics({ report }: { report: LearningReport }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const metrics = [
    { id: 'lessons', value: report.completedLessons, total: report.totalLessons, title: 'Lessons completed' },
    { id: 'explored', value: report.exploredWords, total: report.totalWords, title: 'Words explored' },
    { id: 'saved', value: report.savedWords, total: null, title: 'Words saved' },
    { id: 'days', value: report.completedStudyDays, total: report.totalStudyDays, title: 'Course lessons completed' },
  ] as const;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: compact ? 8 : 14 }}>
    {metrics.map(metric => <View key={metric.id} testID={`report-${metric.id}`} style={{
      flexGrow: 1, flexShrink: 1, flexBasis: compact ? '45%' : 170, minWidth: 0, paddingVertical: 10,
      gap: 4, borderTopWidth: 1, borderColor: colors.line,
    }}>
      <Text style={[t.number, compact && { fontSize: 26, lineHeight: 34 }]}>{metric.value}{metric.total !== null && <Text style={{
        fontSize: compact ? 15 : 21, color: colors.muted, fontWeight: '400', letterSpacing: 0,
      }}> / {metric.total}</Text>}</Text>
      <Text style={t.label}>{metric.title}</Text>
    </View>)}
  </View>;
}

export function WeeklyActivity({ report }: { report: LearningReport }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const maximum = Math.max(1, ...report.week.map(day => day.actions));
  const chartHeight = compact ? 70 : 142;
  return <View testID="report-week" style={[t.panel, { minWidth: 0, gap: compact ? 10 : 18 }, compact && { padding: 14 }]}>
    <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
      <Text accessibilityRole="header" style={[s.heading, compact && designTokens.typography.compactHeading]}>This week</Text>
      {!compact && <Text style={t.label}>Mon – Sun</Text>}
    </View>
    <Text style={t.detail}>{report.actionsThisWeek} {report.actionsThisWeek === 1 ? 'activity' : 'activities'} · {report.activeDaysThisWeek} active {report.activeDaysThisWeek === 1 ? 'day' : 'days'}</Text>
    <View style={{ flexDirection: 'row', gap: compact ? 5 : 7, alignItems: 'flex-end', minHeight: compact ? 106 : 210,
      paddingTop: compact ? 2 : 8, borderBottomWidth: 1, borderColor: colors.line, paddingBottom: compact ? 8 : 14 }}>
      {report.week.map(day => <View key={day.date} accessible accessibilityLabel={`${day.label}, ${day.date}: ${day.actions} actions${day.future ? ', upcoming' : ''}${day.today ? ', today' : ''}`}
        style={{ flex: 1, minWidth: 0, alignItems: 'center', gap: compact ? 4 : 8 }}>
        <Text style={[t.detail, designTokens.typography.caption, { maxWidth: '100%', textAlign: 'center' }]}>{day.future ? '–' : day.actions}</Text>
        <View style={{ height: chartHeight, width: '100%', maxWidth: 48, borderRadius: 8, backgroundColor: colors.paper, justifyContent: 'flex-end', overflow: 'hidden' }}>
          <View style={{ height: day.actions ? Math.max(8, day.actions / maximum * chartHeight) : 3, borderRadius: 8,
            backgroundColor: day.future ? colors.line : day.today ? '#145448' : day.actions ? colors.yellow : colors.line }} />
        </View>
        <Text style={[s.muted, { ...designTokens.typography.caption, fontWeight: day.today ? '800' : '400',
          color: day.today ? colors.ink : colors.muted, maxWidth: '100%', textAlign: 'center' }]}>{day.label.slice(0, compact ? 2 : 3)}</Text>
      </View>)}
    </View>
    <Text style={[s.muted, compact ? designTokens.typography.caption : designTokens.typography.smallLabel]}>{report.weekStart} to {report.weekEnd} · {report.timeZone}</Text>
  </View>;
}
