import { Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';
import { ReportMetrics, ReportStatus, WeeklyActivity, type ReportState } from './ReportWidgets';

export function LearningReportScreen({ language, state, onTopic, onExplore, onReview }: {
  language: TargetLanguage; state: ReportState; onTopic: (topic: string) => void; onExplore: () => void; onReview: () => void;
}) {
  const report = state.report;
  return <View style={{ gap: 24, minWidth: 0 }}>
    <View style={{ gap: 10 }}><Text style={s.eyebrow}>{languageNames[language]} · Your saved learning activity</Text>
      <Text accessibilityRole="header" style={s.title}>Learning report</Text>
      <Text style={[s.body, { maxWidth: 760 }]}>See the small steps you’ve saved in this browser. Words explored record study, and completed lessons and course days record activity — they don’t measure proficiency.</Text>
    </View>
    <ReportStatus state={state} />
    {report && !state.error && <>
      <ReportMetrics report={report} />
      <WeeklyActivity report={report} />
      <View style={[s.card, { gap: 10 }]}><Text accessibilityRole="header" style={s.heading}>What counts here?</Text>
        <Text style={s.body}>The weekly chart includes saved lesson practice, course study and activities, and notebook recognition ratings. Browsing and editing a note don’t add practice actions. Future days are left open.</Text>
        <Text style={s.muted}>Lesson and course completion uses the current content revision. Words explored are distinct words explicitly studied in vocabulary activities; saved words are entries in your {languageNames[language]} notebook. All history stays on this device.</Text>
      </View>
      <View testID="report-topic-list" style={{ gap: 14 }}>
        <Text accessibilityRole="header" style={s.heading}>Your topics, at a glance</Text>
        {!report.topics.length && <View style={s.card}><Text style={s.body}>No topics are available in this language yet.</Text><Button onPress={onExplore}>Explore lessons</Button></View>}
        <View style={[s.split, { gap: 14 }]}>{report.topics.map(topic => <View key={topic.name} style={[s.card, s.column, { flexBasis: 290, padding: 20, gap: 12 }]}>
          <Text accessibilityRole="header" style={[s.heading, { fontSize: 21 }]}>{topic.name}</Text>
          <Text style={s.body}>{topic.completedLessons} / {topic.totalLessons} lessons completed</Text>
          <View style={s.progressTrack}><View style={[s.progressFill, { width: `${topic.totalLessons ? topic.completedLessons / topic.totalLessons * 100 : 0}%` }]} /></View>
          <Text style={s.muted}>{topic.exploredWords} / {topic.totalWords} words explored</Text>
          <Button onPress={() => onTopic(topic.name)}>Study {topic.name} →</Button>
        </View>)}</View>
      </View>
    </>}
    <View style={s.row}><Button primary onPress={onExplore}>Find your next lesson</Button><Button onPress={onReview}>Review saved words</Button></View>
  </View>;
}
