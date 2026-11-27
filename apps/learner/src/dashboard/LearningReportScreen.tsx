import { StyleSheet, Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { styles as s } from '../ui/theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { toolsStyles as t } from '../ui/learnerToolsStyles';
import { ReportMetrics, ReportStatus, WeeklyActivity, type ReportState } from './ReportWidgets';

export function LearningReportScreen({ language, state, onTopic, onExplore, onReview }: {
  language: TargetLanguage; state: ReportState; onTopic: (topic: string) => void; onExplore: () => void; onReview: () => void;
}) {
  const report = state.report;
  const name = languageNames[language];
  return <View style={t.page}>
    <ScreenHeader eyebrow={name} title="Learning report" subtitle="Practice saved on this device"
      action={<Button compact quiet disabled={state.loading} onPress={() => void state.refresh()}>Refresh report</Button>} />
    <ReportStatus state={state} />
    {report && !state.error && <>
      <ReportMetrics report={report} />
      <View style={t.board}>
        <View style={t.main}><WeeklyActivity report={report} /></View>
        <View style={[t.side, t.panel, reportStyles.actions]}>
          <Text accessibilityRole="header" style={t.sectionTitle}>Keep studying</Text>
          <Button compact trailingIcon="arrow-right" onPress={onExplore}>Find your next lesson</Button>
          <Button compact quiet trailingIcon="arrow-right" onPress={onReview}>Review saved words</Button>
        </View>
      </View>
      <View testID="report-topic-list" style={[t.panel, reportStyles.topics]}>
        <View style={[t.panelHeader, reportStyles.topicsHeader]}>
          <Text accessibilityRole="header" style={t.sectionTitle}>Topic progress</Text>
          <Text style={t.detail}>{report.topics.length} {report.topics.length === 1 ? 'topic' : 'topics'}</Text>
        </View>
        {!report.topics.length && <View style={t.inset}><Text style={s.body}>No topics are available in this language yet.</Text><Button onPress={onExplore}>Explore lessons</Button></View>}
        {report.topics.map(topic => <View key={topic.name} style={[t.listRow, t.panelHeader, reportStyles.topicRow]}>
          <Text accessibilityRole="header" style={[s.body, reportStyles.topicName]}>{topic.name}</Text>
          <View style={reportStyles.topicCounts}>
            <Text style={t.detail}>{topic.completedLessons} / {topic.totalLessons} lessons completed</Text>
            <Text style={t.detail}>{topic.exploredWords} / {topic.totalWords} words explored</Text>
          </View>
          <Button quiet compact label={`Study ${topic.name}`} trailingIcon="arrow-right" onPress={() => onTopic(topic.name)}>Study topic</Button>
        </View>)}
      </View>
      <Disclosure title="What counts here?">
        <Text style={s.body}>Weekly activity counts saved lesson practice, course activities, and notebook review ratings.</Text>
        <Text style={s.muted}>Completion uses the current lesson revision. Words explored counts distinct words studied in vocabulary activities. Words saved counts entries in your {name} notebook.</Text>
        <Text style={s.muted}>These totals describe practice. Your full learning history stays on this device.</Text>
      </Disclosure>
    </>}
    {(!report || !!state.error) && <View style={s.row}><Button primary onPress={onExplore}>Find your next lesson</Button><Button onPress={onReview}>Review saved words</Button></View>}
  </View>;
}

const reportStyles = StyleSheet.create({
  actions: { alignItems: 'flex-start', flexBasis: 240, gap: 8 },
  topics: { padding: 0, gap: 0 },
  topicsHeader: { padding: 16 },
  topicRow: { paddingHorizontal: 16, paddingVertical: 12 },
  topicName: { flexGrow: 1, flexShrink: 1, flexBasis: 220, fontWeight: '500' },
  topicCounts: { flexGrow: 1, flexShrink: 1, flexBasis: 200, gap: 4 },
});
