import { Text, View, useWindowDimensions } from 'react-native';
import { languageNames, lessonProgress, type Lesson, type OpenCourse, type TargetLanguage } from '@smartlingo/domain';
import { OpenCoursePanel } from '../course/OpenCoursePanel';
import { Button } from '../ui/controls';
import { WordIllustration } from '../ui/WordIllustration';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { alphabetProgress, isAlphabetLessonId } from '../alphabet/progress';

export function TodayDashboard({ language, lessons, course, model, onWriteBlocked, onOpen, onExplore, onReview, onListen, onSpeak, onAlphabet }: {
  language: TargetLanguage; lessons: Lesson[]; course: OpenCourse; model: LearningModel;
  onWriteBlocked: (blocked: boolean) => void; onOpen: (lesson: Lesson) => void; onExplore: () => void;
  onReview: () => void; onListen: () => void; onSpeak: () => void; onAlphabet: () => void;
}) {
  const compact = useWindowDimensions().width < 600;
  const latest = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  const progress = suggested ? lessonProgress(suggested, model.events) : null;
  const started = suggested && model.events.some(event => event.lessonId === suggested.id && event.revision === suggested.revision);
  const startLabel = progress?.completed ? 'Revisit your lesson →' : started ? 'Continue your lesson →' : suggested?.id.startsWith('fr.greetings.') ? 'Start greetings practice →' : suggested?.id === 'fr.restaurant.customer' ? 'Start restaurant practice →' : 'Start lesson →';
  const alphabet = alphabetProgress(model.events);
  const japanese = language === 'ja-JP';
  const latestStudy = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0];
  const recommendLetters = japanese && (!latestStudy || isAlphabetLessonId(latestStudy.lessonId));
  const alternatives = [
    { label: 'Explore lessons', detail: 'Find a topic for everyday life.', open: onExplore },
    { label: 'Open your notebook', detail: 'Revisit the words you saved.', open: onReview },
    { label: 'Listening & videos', detail: 'Listen with English support.', open: onListen },
    { label: 'Speaking practice', detail: 'Try a guided conversation.', open: onSpeak },
  ];

  return <View style={{ gap: 24, minWidth: 0 }}>
    <View style={{ gap: 9 }}>
      <Text style={s.eyebrow}>{languageNames[language]} · AT YOUR OWN PACE</Text>
      <Text accessibilityRole="header" style={[s.hero, { fontSize: compact ? 32 : 40, lineHeight: compact ? 39 : 48, letterSpacing: -1.2 }]}>One small step today.</Text>
      <Text style={s.body}>Pick up here. A little is enough.</Text>
    </View>

    <View testID="today-next-step" style={[s.card, { padding: compact ? 22 : 30, gap: 22, borderTopWidth: 4, borderTopColor: colors.yellow }]}>
      <Text style={s.eyebrow}>{recommendLetters ? 'JAPANESE LETTERS' : started ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR FIRST EVERYDAY MOMENT'}</Text>
      {recommendLetters ? <>
        <View style={[s.row, { alignItems: 'center', gap: 20 }]}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 88, height: 88, borderRadius: 22, backgroundColor: colors.sand, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 51, color: colors.ink }}>あ</Text>
          </View>
          <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
            <Text accessibilityRole="header" style={s.heading}>{alphabet.completed === 0 ? 'Start with Japanese letters' : alphabet.next ? 'Continue Japanese letters' : 'Revisit Japanese letters'}</Text>
            <Text style={s.body}>Meet a few characters and their sounds, one at a time.</Text>
          </View>
        </View>
        <View style={s.row}><Button primary onPress={onAlphabet}>{alphabet.completed === 0 ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters'}</Button></View>
      </> : suggested ? <>
        <View style={[s.row, { alignItems: 'center', gap: 20 }]}>
          <WordIllustration entry={suggested.vocabulary[1] ?? suggested.vocabulary[0]} size={88} />
          <View style={{ flex: 1, minWidth: 130, gap: 8 }}>
            <Text accessibilityRole="header" style={s.heading}>{suggested.subtitle}</Text>
            <Text style={s.body}>{suggested.outcome}</Text>
          </View>
        </View>
        <Text style={s.muted}>{suggested.durationMinutes} min · {suggested.vocabulary.length} useful words · English meanings included</Text>
        <View style={s.row}><Button primary onPress={() => onOpen(suggested)}>{startLabel}</Button></View>
      </> : <>
        <Text accessibilityRole="header" style={s.heading}>Your lessons are on their way.</Text>
        <Text style={s.body}>No lessons are available for this language yet. You can still open your notebook or explore the learning tools below.</Text>
      </>}
      {model.loading && <Text accessibilityLiveRegion="polite" style={s.muted}>Loading your saved place…</Text>}
      {!!model.loadError && <Text style={s.muted}>Your saved place is unavailable. You can still browse and study.</Text>}
      {japanese && !recommendLetters && <View style={s.row}><Button onPress={onAlphabet}>{alphabet.completed ? 'Continue Japanese letters' : 'Start Hiragana'}</Button></View>}
    </View>

    <OpenCoursePanel key={language} course={course} model={model} onWriteBlocked={onWriteBlocked} />

    <View style={{ gap: 14 }}>
      <Text accessibilityRole="header" style={[s.heading, { fontSize: 21 }]}>Something else in mind?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {alternatives.map(item => <View key={item.label} style={[s.card, { flexGrow: 1, flexShrink: 1, flexBasis: compact ? '100%' : '46%', minWidth: 0, gap: 7, padding: 17 }]}>
          <View style={s.row}><Button onPress={item.open}>{item.label}</Button></View>
          <Text style={s.muted}>{item.detail}</Text>
        </View>)}
      </View>
    </View>
  </View>;
}
