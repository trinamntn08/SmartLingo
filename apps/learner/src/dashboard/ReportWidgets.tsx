import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
import type { LearningReport } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import { Icon } from '../ui/Icon';
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
    { id: 'lessons', icon: 'book', color: colors.skyTint, value: report.completedLessons, total: report.totalLessons, title: 'Lessons completed', detail: 'Saved lesson sessions' },
    { id: 'explored', icon: 'globe', color: colors.sageTint, value: report.exploredWords, total: report.totalWords, title: 'Words explored', detail: 'Studied, not a mastery score' },
    { id: 'saved', icon: 'bookmark', color: colors.goldTint, value: report.savedWords, total: null, title: 'Words saved', detail: 'In your personal notebook' },
    { id: 'days', icon: 'calendar', color: colors.lilacTint, value: report.completedStudyDays, total: report.totalStudyDays, title: 'Course lessons completed', detail: 'At your own pace' },
  ] as const;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: compact ? 8 : 14 }}>
    {metrics.map(metric => <View key={metric.id} testID={`report-${metric.id}`} style={[t.panel, {
      flexGrow: 1, flexShrink: 1, flexBasis: compact ? '45%' : 190, minWidth: 0, padding: compact ? 12 : 22, gap: compact ? 6 : 16,
    }]}>
      <View style={compact ? [s.row, { gap: 8 }] : { gap: 16 }}>
        <View style={[t.icon, { backgroundColor: metric.color }, compact && { width: 28, height: 28, borderRadius: 8 }]}><Icon name={metric.icon} size={compact ? 17 : 23} /></View>
        <Text style={[t.number, compact && { fontSize: 26, lineHeight: 34, minWidth: 0, flexShrink: 1 }]}>{metric.value}{metric.total !== null && <Text style={{ fontSize: compact ? 15 : 21, lineHeight: compact ? 22 : 30, color: colors.muted, fontWeight: '400', letterSpacing: 0 }}> / {metric.total}</Text>}</Text>
      </View>
      <View style={t.stack}><Text style={[s.body, { ...(compact ? designTokens.typography.label : designTokens.typography.button), textAlign: 'left' }]}>{metric.title}</Text>{!compact && <Text style={t.detail}>{metric.detail}</Text>}</View>
    </View>)}
  </View>;
}

export function WeeklyActivity({ report }: { report: LearningReport }) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const maximum = Math.max(1, ...report.week.map(day => day.actions));
  const chartHeight = compact ? 70 : 142;
  return <View testID="report-week" style={[t.panel, { minWidth: 0, gap: compact ? 10 : 18 }, compact && { padding: 14 }]}>
    <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
      <Text accessibilityRole="header" style={[s.heading, compact && designTokens.typography.compactHeading]}>{compact ? 'This week' : 'Your week in small steps'}</Text>
      {!compact && <Text style={t.label}>Mon – Sun</Text>}
    </View>
    {compact
      ? <Text style={t.detail}>{report.actionsThisWeek} {report.actionsThisWeek === 1 ? 'activity' : 'activities'} · {report.activeDaysThisWeek} active {report.activeDaysThisWeek === 1 ? 'day' : 'days'}</Text>
      : <View style={[s.row, { gap: 28 }]}><View style={t.stack}><Text style={t.number}>{report.actionsThisWeek}</Text><Text style={t.detail}>saved practice actions</Text></View><View style={t.stack}><Text style={t.number}>{report.activeDaysThisWeek}</Text><Text style={t.detail}>active {report.activeDaysThisWeek === 1 ? 'day' : 'days'}</Text></View></View>}
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
    {!compact && <Text style={s.muted}>{report.actionsThisWeek === 0 ? 'A quiet week is a fresh start. Your next small step is ready whenever you are.' : 'Every saved practice action is a small step. Take breaks and return when it suits you.'}</Text>}
  </View>;
}

export function WeeklyRhythm({ state }: { state: ReportState }) {
  const report = state.report;
  return <View style={[s.card, { backgroundColor: '#FFFEF6', flexGrow: 1, flexShrink: 1, flexBasis: 230, maxWidth: 310, gap: 12, padding: 22 }]}>
    <Text accessible={false} style={{ fontSize: 29, color: colors.ink }}>☀</Text>
    <Text style={[s.heading, designTokens.typography.compactHeading]}>A rhythm that fits you</Text>
    {report && !state.error ? <><Text style={s.body}>{report.activeDaysThisWeek} active {report.activeDaysThisWeek === 1 ? 'day' : 'days'} this week</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5 }}>{report.week.map(day => <View key={day.date} style={{ alignItems: 'center', gap: 7 }}>
        <View style={{ width: 23, height: 23, borderRadius: 12, backgroundColor: day.actions ? colors.yellow : colors.sand, alignItems: 'center', justifyContent: 'center', borderWidth: day.today ? 1 : 0, borderColor: colors.ink }}>
          <Text accessible={false} style={{ fontSize: 12, color: colors.ink }}>{day.actions ? '✓' : '·'}</Text>
        </View><Text style={[s.muted, { fontSize: 11 }]}>{day.label.slice(0, 1)}</Text>
      </View>)}</View></> : <Text style={s.muted}>{state.error ? 'Your weekly rhythm is unavailable for now.' : 'Opening your saved weekly activity…'}</Text>}
    <Text style={[s.muted, designTokens.typography.smallLabel]}>A little room to learn, whenever life allows.</Text>
  </View>;
}
