import { Text, View, useWindowDimensions } from 'react-native';
import { groupLessonTopics, languageNames, lessonProgress, type Lesson, type OpenCourse, type TargetLanguage } from '@smartlingo/domain';
import { OpenCoursePanel } from '../course/OpenCoursePanel';
import { Badge, Button } from '../ui/controls';
import { WordIllustration } from '../ui/WordIllustration';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { ReportMetrics, ReportStatus, WeeklyActivity, WeeklyRhythm, type ReportState } from './ReportWidgets';
import { alphabetProgress } from '../alphabet/progress';

export function TodayDashboard({ language, lessons, course, model, state, onWriteBlocked, onOpen, onExplore, onReview, onTopic, onListen, onSpeak, onAlphabet }: {
  language: TargetLanguage; lessons: Lesson[]; course: OpenCourse; model: LearningModel; state: ReportState;
  onWriteBlocked: (blocked: boolean) => void; onOpen: (lesson: Lesson) => void; onExplore: () => void;
  onReview: () => void; onTopic: (topic: string) => void; onListen: () => void; onSpeak: () => void; onAlphabet: () => void;
}) {
  const compact = useWindowDimensions().width < 600;
  const latest = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  const progress = suggested ? lessonProgress(suggested, model.events) : null;
  const started = suggested && model.events.some(event => event.lessonId === suggested.id && event.revision === suggested.revision);
  const startLabel = progress?.completed ? 'Revisit your lesson →' : started ? 'Continue your lesson →' : suggested?.id.startsWith('fr.greetings.') ? 'Start greetings practice →' : suggested?.id === 'fr.restaurant.customer' ? 'Start restaurant practice →' : 'Start lesson →';
  const topics = groupLessonTopics(lessons);
  const alphabet = alphabetProgress(model.events);
  return <View style={{ gap: 24, minWidth: 0 }}>
    {language === 'ja-JP' && <View style={[s.card, { backgroundColor: '#FFF3CF', gap: 14 }]}>
      <Badge>JAPANESE FIRST STEPS · DRAFT</Badge>
      <Text accessibilityRole="header" style={s.heading}>Start with Japanese letters</Text>
      <Text style={s.body}>Learn Hiragana first, then Katakana, in small groups before moving into words and conversations. You can explore any topic whenever you like.</Text>
      <Text style={s.muted}>{model.loadError ? 'Saved alphabet progress is unavailable.' : `${alphabet.completed} / ${alphabet.total} rows studied`} · 46 basic Hiragana + 46 basic Katakana</Text>
      <View style={s.row}><Button primary onPress={onAlphabet}>{alphabet.completed === 0 ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters'}</Button></View>
    </View>}
    <View style={[s.card, { backgroundColor: '#FFF3CF', borderColor: '#F5E7BE', padding: compact ? 22 : 30, flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'center' }]}>
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 370, gap: 16, minWidth: 0 }}>
        <Text style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 19, color: colors.ink }}>Welcome to your learning space</Text>
        <Text style={s.eyebrow}>{languageNames[language]} · Small steps. Real conversations.</Text>
        <Text accessibilityRole="header" style={[s.hero, { fontSize: compact ? 34 : 44, lineHeight: compact ? 40 : 50, letterSpacing: -1.6 }]}>Make yourself{ '\n' }a little more at home.</Text>
        <Text style={[s.body, { maxWidth: 540 }]}>A few useful words, an everyday conversation, a small moment of practice. Pick up where you left off, or discover something new — at your own pace.</Text>
        <View style={s.row}>{suggested && <Button primary onPress={() => onOpen(suggested)}>{startLabel}</Button>}<Button onPress={onExplore}>Explore lessons</Button></View>
      </View>
      <WeeklyRhythm state={state} />
    </View>
    <ReportStatus state={state} />
    {state.report && !state.error && <ReportMetrics report={state.report} />}
    <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>Listen, watch and speak</Text>
      <Text style={s.body}>Understand a spoken sentence, find a short video or podcast, or practise responding aloud.</Text>
      <View style={s.row}><Button primary onPress={onListen}>Listening & videos</Button><Button onPress={onSpeak}>Speaking practice</Button></View>
    </View>
    <View style={[s.split, { gap: 20 }]}>
      <View style={[s.card, s.column, { flexBasis: 360, gap: 15 }]}>
        <View style={s.row}><Badge>YOUR NEXT EVERYDAY MOMENT</Badge>{suggested && <Badge>{suggested.level}</Badge>}</View>
        {suggested ? <>
          <View style={[s.row, { alignItems: 'center', gap: 18 }]}>
            <WordIllustration entry={suggested.vocabulary[1] ?? suggested.vocabulary[0]} size={112} />
            <View style={{ flex: 1, minWidth: 130, gap: 7 }}><Text accessibilityRole="header" style={s.heading}>{suggested.subtitle}</Text><Text style={s.muted}>{suggested.durationMinutes} min · {suggested.vocabulary.length} useful words</Text></View>
          </View>
          <Text style={s.body}>{suggested.outcome}</Text>
          <View style={s.row}><Badge>{suggested.role}</Badge></View>
          {!model.loadError && <View style={s.progressTrack}><View style={[s.progressFill, { width: `${progress!.completed ? 100 : 100 * progress!.viewedIds.size / Math.max(1, suggested.vocabulary.length)}%` }]} /></View>}
          <Text style={s.muted}>{model.loadError ? 'Saved lesson progress is unavailable.' : progress!.completed ? '✓ Session completed and saved' : `${progress!.viewedIds.size} of ${suggested.vocabulary.length} words explored`} · {suggested.status === 'published' ? `Published revision ${suggested.revision}` : 'Draft preview'}</Text>
          <Button primary onPress={() => onOpen(suggested)} label={`Open next lesson: ${suggested.subtitle}`}>{progress?.completed ? 'Revisit this lesson →' : started ? 'Continue this lesson →' : 'Let’s begin →'}</Button>
        </> : <><Text style={s.heading}>Your lessons are on their way.</Text><Text style={s.body}>No lessons are available for this language yet.</Text><Button onPress={onExplore}>Explore topics</Button></>}
      </View>
      {state.report && !state.error && <View style={[s.column, { flexBasis: 360 }]}><WeeklyActivity report={state.report} /></View>}
    </View>
    <View style={[s.row, { justifyContent: 'space-between' }]}><Text accessibilityRole="header" style={s.heading}>A little practice, your way</Text><Button onPress={onReview}>Open your notebook</Button></View>
    <View style={[s.split, { gap: 14 }]}>{topics.slice(0, 3).map((topic, index) => <View key={topic.name} style={[s.card, s.column, { flexBasis: 230, padding: 20, gap: 11 }]}>
      <View style={{ width: 42, height: 42, borderRadius: 15, backgroundColor: ['#FCE5CC', '#E9E2F8', '#E1EEDB'][index], alignItems: 'center', justifyContent: 'center' }}><Text accessible={false} style={{ fontSize: 25, color: colors.ink }}>{['◇', '✎', '☀'][index]}</Text></View>
      <Text style={[s.heading, { fontSize: 20 }]}>{topic.name}</Text><Text style={s.muted}>{topic.vocabulary.length} words · {[...new Set(topic.lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' / ')}</Text>
      <Button onPress={() => onTopic(topic.name)}>Discover {topic.name} →</Button>
    </View>)}</View>
    <OpenCoursePanel key={language} course={course} model={model} onWriteBlocked={onWriteBlocked} />
  </View>;
}
