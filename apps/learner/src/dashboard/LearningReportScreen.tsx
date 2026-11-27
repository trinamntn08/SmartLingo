import { Text, View, useWindowDimensions } from 'react-native';
import { languageNames, type LearningReport, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { designTokens, styles as s } from '../ui/theme';
import { toolsStyles as t } from '../ui/learnerToolsStyles';
import { ReportMetrics, ReportStatus, WeeklyActivity, type ReportState } from './ReportWidgets';

export function LearningReportScreen({ language, state, onTopic, onExplore, onReview }: {
  language: TargetLanguage; state: ReportState; onTopic: (topic: string) => void; onExplore: () => void; onReview: () => void;
}) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const report = state.report;
  const refresh = <Button compact disabled={state.loading} onPress={() => void state.refresh()}>Refresh report</Button>;
  return <View style={[t.page, compact && { gap: 14 }]}>
    <Text accessibilityRole="header" aria-level={1} style={s.title}>Learning report</Text>
    <ReportStatus state={state} />
    {report && !state.error && <>
      <ReportMetrics report={report} />
      <WeeklyActivity report={report} />
      <View style={s.row}><Button quiet={report.actionsThisWeek > 0} primary={report.actionsThisWeek === 0} compact onPress={onExplore}>Find your next lesson</Button>
        {!!report.savedWords && <Button quiet compact onPress={onReview}>Review saved words</Button>}
      </View>
      {compact ? <Disclosure title="Topic progress" compact icon="chart">
        <TopicProgress topics={report.topics} onTopic={onTopic} onExplore={onExplore} compact />
      </Disclosure> : <TopicProgress topics={report.topics} onTopic={onTopic} onExplore={onExplore} />}
      <Disclosure title="What counts here?" compact>
        <Text style={s.body}>Weekly activity counts saved lesson practice, course activities and notebook ratings.</Text>
        <Text style={s.muted}>Words explored counts distinct words studied. Words saved counts entries in your {languageNames[language]} notebook. Completion uses the current lesson revision.</Text>
        {refresh}
      </Disclosure>
    </>}
  </View>;
}

function TopicProgress({ topics, onTopic, onExplore, compact = false }: {
  topics: LearningReport['topics']; onTopic: (topic: string) => void; onExplore: () => void; compact?: boolean;
}) {
  return <View testID="report-topic-list" style={compact ? t.stack : t.panel}>
    {!compact && <View style={t.panelHeader}>
      <Text accessibilityRole="header" style={s.heading}>Topic progress</Text>
      <Text style={t.detail}>{topics.length} topics</Text>
    </View>}
    {!topics.length && <View style={t.inset}><Text style={s.body}>No topics yet.</Text><Button onPress={onExplore}>Explore lessons</Button></View>}
    {topics.map(topic => <View key={topic.name} style={[t.listRow, compact ? { paddingVertical: 10 } : { gap: 16 }]}>
      <View style={[t.panelHeader, compact && { gap: 8 }]}>
        <Text accessibilityRole="header" style={compact ? [s.body, { flexGrow: 1, flexShrink: 1, fontWeight: '600' }]
          : [t.sectionTitle, { flexGrow: 1, flexShrink: 1, flexBasis: 200 }]}>{topic.name}</Text>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : 260, minWidth: 0, gap: compact ? 4 : 10 }}>
          <Text style={compact ? t.label : t.detail}>{topic.completedLessons} / {topic.totalLessons} lessons completed</Text>
          <View style={s.progressTrack}><View style={[s.progressFill, { width: `${topic.totalLessons ? topic.completedLessons / topic.totalLessons * 100 : 0}%` }]} /></View>
          <Text style={compact ? t.label : t.detail}>{topic.exploredWords} / {topic.totalWords} words explored</Text>
        </View>
        <Button quiet compact icon="arrow-right" label={compact ? `Study ${topic.name}` : undefined}
          onPress={() => onTopic(topic.name)}>{compact ? 'Study' : `Study ${topic.name}`}</Button>
      </View>
    </View>)}
  </View>;
}
