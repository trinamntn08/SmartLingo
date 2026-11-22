import { Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, styles as s } from '../ui/theme';
import { ScreenHeader } from '../ui/ScreenHeader';
import { Icon } from '../ui/Icon';
import { toolsStyles as t } from '../ui/learnerToolsStyles';
import { ReportMetrics, ReportStatus, WeeklyActivity, type ReportState } from './ReportWidgets';

export function LearningReportScreen({ language, state, onTopic, onExplore, onReview }: {
  language: TargetLanguage; state: ReportState; onTopic: (topic: string) => void; onExplore: () => void; onReview: () => void;
}) {
  const report = state.report;
  return <View style={t.page}>
    <ScreenHeader eyebrow={`${languageNames[language]} · Saved on this device`} title="Learning report" subtitle={`A little perspective on your ${languageNames[language]} practice. Your activity records practice, not proficiency.`} action={<Button compact disabled={state.loading} onPress={() => void state.refresh()}>Refresh report</Button>} />
    <ReportStatus state={state} />
    {report && !state.error && <>
      <ReportMetrics report={report} />
      <View style={t.board}>
        <View style={t.main}><WeeklyActivity report={report} /></View>
        <View style={[t.side, t.panel, { backgroundColor: colors.goldTint }]}>
          <View style={t.icon}><Icon name="book" size={24} /></View>
          <Text accessibilityRole="header" style={s.heading}>Make room for your next step.</Text>
          <Text style={s.body}>Pick up a useful phrase, explore a topic, or return to words you have saved.</Text>
          <Button primary onPress={onExplore}>Find your next lesson</Button>
          <Button quiet onPress={onReview}>Review saved words</Button>
          <Text style={t.detail}>Learning at your pace. No streak to protect.</Text>
        </View>
      </View>
      <View testID="report-topic-list" style={t.panel}>
        <View style={t.panelHeader}><View style={t.stack}><Text style={s.eyebrow}>Keep exploring</Text><Text accessibilityRole="header" style={s.heading}>Your topics, at a glance</Text></View><Text style={t.detail}>{report.topics.length} topics</Text></View>
        {!report.topics.length && <View style={t.inset}><Text style={s.body}>No topics are available in this language yet.</Text><Button onPress={onExplore}>Explore lessons</Button></View>}
        {report.topics.map(topic => <View key={topic.name} style={[t.listRow, { gap: 16 }]}>
          <View style={t.panelHeader}>
            <Text accessibilityRole="header" style={[t.sectionTitle, { flexGrow: 1, flexShrink: 1, flexBasis: 200 }]}>{topic.name}</Text>
            <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 260, gap: 10 }}><Text style={t.detail}>{topic.completedLessons} / {topic.totalLessons} lessons completed</Text><View style={s.progressTrack}><View style={[s.progressFill, { width: `${topic.totalLessons ? topic.completedLessons / topic.totalLessons * 100 : 0}%` }]} /></View><Text style={t.detail}>{topic.exploredWords} / {topic.totalWords} words explored</Text></View>
            <Button quiet compact icon="arrow-right" onPress={() => onTopic(topic.name)}>Study {topic.name} →</Button>
          </View>
        </View>)}
      </View>
      <Disclosure title="What counts here?">
        <Text style={s.body}>The weekly chart includes saved lesson practice, course study and activities, and notebook recognition ratings. Browsing and editing a note don’t add practice actions. Future days are left open.</Text>
        <Text style={s.muted}>Lesson and course completion uses the current content revision. Words explored are distinct words explicitly studied in vocabulary activities; saved words are entries in your {languageNames[language]} notebook. All history stays on this device.</Text>
      </Disclosure>
    </>}
    {(!report || !!state.error) && <View style={s.row}><Button primary onPress={onExplore}>Find your next lesson</Button><Button onPress={onReview}>Review saved words</Button></View>}
  </View>;
}
