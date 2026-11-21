import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
import type { LearningReport } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';

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
  const compact = useWindowDimensions().width < 600;
  const metrics = [
    { id: 'lessons', icon: '▤', color: '#FCE5CC', value: `${report.completedLessons} / ${report.totalLessons}`, title: 'Lessons completed', detail: 'Saved lesson sessions' },
    { id: 'explored', icon: 'Aa', color: '#E9E2F8', value: `${report.exploredWords} / ${report.totalWords}`, title: 'Words explored', detail: 'Studied, not a mastery score' },
    { id: 'saved', icon: '♡', color: '#FCE1E4', value: `${report.savedWords}`, title: 'Words saved', detail: 'In your personal notebook' },
    { id: 'days', icon: '▦', color: '#E1EEDB', value: `${report.completedStudyDays} / ${report.totalStudyDays}`, title: 'Course days completed', detail: 'At your own pace' },
  ];
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
    {metrics.map(metric => <View key={metric.id} testID={`report-${metric.id}`} style={[s.card, {
      flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : 180, minWidth: 0, padding: 20, gap: 10,
    }]}>
      <View style={{ width: 44, height: 44, backgroundColor: metric.color, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text accessible={false} style={{ fontSize: 25, color: colors.ink }}>{metric.icon}</Text>
      </View>
      <Text style={{ fontSize: 30, fontWeight: '900', color: colors.ink, letterSpacing: -1 }}>{metric.value}</Text>
      <Text style={[s.body, { fontSize: 15, fontWeight: '800', lineHeight: 21 }]}>{metric.title}</Text>
      <Text style={[s.muted, { fontSize: 13, lineHeight: 19 }]}>{metric.detail}</Text>
    </View>)}
  </View>;
}

export function WeeklyActivity({ report }: { report: LearningReport }) {
  const maximum = Math.max(1, ...report.week.map(day => day.actions));
  return <View testID="report-week" style={[s.card, { flex: 1, minWidth: 0, gap: 14 }]}>
    <View style={[s.row, { justifyContent: 'space-between', gap: 8 }]}>
      <Text accessibilityRole="header" style={s.heading}>Your week in small steps</Text>
      <Text style={s.muted}>Mon – Sun</Text>
    </View>
    <Text style={s.body}>{report.actionsThisWeek} saved practice actions · {report.activeDaysThisWeek} active {report.activeDaysThisWeek === 1 ? 'day' : 'days'}</Text>
    <View style={{ flexDirection: 'row', gap: 7, alignItems: 'flex-end', minHeight: 170 }}>
      {report.week.map(day => <View key={day.date} accessible accessibilityLabel={`${day.label}, ${day.date}: ${day.actions} actions${day.future ? ', upcoming' : ''}${day.today ? ', today' : ''}`}
        style={{ flex: 1, minWidth: 0, alignItems: 'center', gap: 8 }}>
        <Text style={[s.muted, { fontSize: 12 }]}>{day.future ? '–' : day.actions}</Text>
        <View style={{ height: 106, width: '100%', maxWidth: 34, borderRadius: 10, backgroundColor: colors.paper, justifyContent: 'flex-end', overflow: 'hidden' }}>
          <View style={{ height: day.actions ? Math.max(8, day.actions / maximum * 106) : 3, borderRadius: 10,
            backgroundColor: day.future ? colors.line : day.today ? colors.ink : day.actions ? colors.yellow : colors.line }} />
        </View>
        <Text style={[s.muted, { fontSize: 12, fontWeight: day.today ? '800' : '400', color: day.today ? colors.ink : colors.muted }]}>{day.label.slice(0, 3)}</Text>
      </View>)}
    </View>
    <Text style={[s.muted, { fontSize: 13 }]}>{report.weekStart} to {report.weekEnd} · {report.timeZone}</Text>
    <Text style={s.muted}>{report.actionsThisWeek === 0 ? 'A quiet week is a fresh start. Your next small step is ready whenever you are.' : 'Every saved practice action is a small step. Take breaks and return when it suits you.'}</Text>
  </View>;
}

export function WeeklyRhythm({ state }: { state: ReportState }) {
  const report = state.report;
  return <View style={[s.card, { backgroundColor: '#FFFEF6', flexGrow: 1, flexShrink: 1, flexBasis: 230, maxWidth: 310, gap: 12, padding: 22 }]}>
    <Text accessible={false} style={{ fontSize: 29, color: colors.ink }}>☀</Text>
    <Text style={[s.heading, { fontSize: 20 }]}>A rhythm that fits you</Text>
    {report && !state.error ? <><Text style={s.body}>{report.activeDaysThisWeek} active {report.activeDaysThisWeek === 1 ? 'day' : 'days'} this week</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5 }}>{report.week.map(day => <View key={day.date} style={{ alignItems: 'center', gap: 7 }}>
        <View style={{ width: 23, height: 23, borderRadius: 12, backgroundColor: day.actions ? colors.yellow : colors.sand, alignItems: 'center', justifyContent: 'center', borderWidth: day.today ? 1 : 0, borderColor: colors.ink }}>
          <Text accessible={false} style={{ fontSize: 12, color: colors.ink }}>{day.actions ? '✓' : '·'}</Text>
        </View><Text style={[s.muted, { fontSize: 11 }]}>{day.label.slice(0, 1)}</Text>
      </View>)}</View></> : <Text style={s.muted}>{state.error ? 'Your weekly rhythm is unavailable for now.' : 'Opening your saved weekly activity…'}</Text>}
    <Text style={[s.muted, { fontSize: 13, lineHeight: 20 }]}>A little room to learn, whenever life allows.</Text>
  </View>;
}
