import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { languageNames, lessonProgress, type Lesson, type OpenCourse, type TargetLanguage } from '@smartlingo/domain';
import { OpenCoursePanel } from '../course/OpenCoursePanel';
import { alphabetProgress, isAlphabetLessonId } from '../alphabet/progress';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto, type ContextPhoto } from '../ui/contextPhotos';
import { Icon, type IconName } from '../ui/Icon';
import { ScreenHeader } from '../ui/ScreenHeader';
import { Button } from '../ui/controls';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

interface TodayDashboardProps {
  language: TargetLanguage; lessons: Lesson[]; course: OpenCourse; model: LearningModel;
  onWriteBlocked: (blocked: boolean) => void; onOpen: (lesson: Lesson) => void; onExplore: () => void;
  onListen: () => void; onSpeak: () => void; onAlphabet: () => void;
}

interface Shortcut {
  label: string;
  description: string;
  icon: IconName;
  tint: string;
  open: () => void;
}

export function TodayDashboard({ language, lessons, course, model, onWriteBlocked, onOpen, onExplore, onListen, onSpeak, onAlphabet }: TodayDashboardProps) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const recent = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const latest = recent.find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  const japanese = language === 'ja-JP';
  const recommendLetters = japanese && (!recent[0] || isAlphabetLessonId(recent[0].lessonId));
  const alphabet = alphabetProgress(model.events);
  const alphabetAction = alphabet.completed === 0 ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters';
  const shortcuts: Shortcut[] = [
    { label: 'Vocabulary & lessons', description: 'Browse topics and useful words', icon: 'grid', tint: colors.skyTint, open: onExplore },
    { label: 'Listening & videos', description: 'Listen to sentences and find videos', icon: 'headphones', tint: colors.lilacTint, open: onListen },
    { label: 'Speaking practice', description: 'Say your part in a dialogue', icon: 'mic', tint: colors.sageTint, open: onSpeak },
  ];

  return <View style={{ gap: compact ? 14 : 18, minWidth: 0 }}>
    <ScreenHeader title="Today" eyebrow={languageNames[language]} />
    {recommendLetters
      ? <NextActivity compact={compact} photo={getContextPhoto(language)} label="Japanese letters"
          title={alphabet.completed === 0 ? 'Start with Japanese letters' : alphabet.next ? 'Continue Japanese letters' : 'Revisit Japanese letters'}
          description={alphabet.next
            ? `Hear and recognise ${alphabet.next.script}, one row at a time.`
            : 'Revisit a hiragana or katakana row and practise recognising its characters.'}
          detail={`${alphabet.completed} of ${alphabet.total} rows studied`} action={alphabetAction} open={onAlphabet} />
      : suggested
        ? <NextActivity compact={compact} photo={getContextPhoto(language, suggested.topic)} label={suggested.topic}
            title={suggested.subtitle} description={suggested.outcome}
            detail={`${suggested.durationMinutes} min · ${suggested.vocabulary.length} words`}
            action={lessonAction(suggested, model)} open={() => onOpen(suggested)} />
        : <View testID="today-next-step" style={s.card}>
            <Text accessibilityRole="header" style={s.heading}>No lessons available</Text>
            <Text style={s.body}>Try the daily course or browse listening resources below.</Text>
          </View>}
    {!!model.loadError && <Text style={s.muted}>Your saved place is unavailable. You can still browse and study.</Text>}

    <OpenCoursePanel key={language} course={course} model={model} onWriteBlocked={onWriteBlocked} />
    <View style={{ gap: 10 }}>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <Text accessibilityRole="header" style={s.heading}>Explore and practice</Text>
        {japanese && !recommendLetters && <Button quiet compact icon="book" onPress={onAlphabet}>{alphabetAction}</Button>}
      </View>
      <View style={{ flexDirection: compact ? 'column' : 'row', gap: 12 }}>
        {shortcuts.map(shortcut => <ShortcutTile key={shortcut.label} item={shortcut} compact={compact} />)}
      </View>
    </View>
  </View>;
}

function lessonAction(lesson: Lesson, model: LearningModel): string {
  if (lessonProgress(lesson, model.events).completed) return 'Revisit your lesson →';
  if (model.events.some(event => event.lessonId === lesson.id && event.revision === lesson.revision)) return 'Continue your lesson →';
  if (lesson.id.startsWith('fr.greetings.')) return 'Start greetings practice →';
  if (lesson.id === 'fr.restaurant.customer') return 'Start restaurant practice →';
  return 'Start lesson →';
}

function NextActivity({ compact, photo, label, title, description, detail, action, open }: {
  compact: boolean; photo: ContextPhoto; label: string; title: string; description: string;
  detail: string; action: string; open: () => void;
}) {
  return <View testID="today-next-step" style={{
    flexDirection: compact ? 'column-reverse' : 'row', backgroundColor: colors.dark, borderRadius: 20, overflow: 'hidden',
  }}>
    <View style={{ gap: compact ? 8 : 10, padding: compact ? 16 : 24, flex: compact ? undefined : 1,
      minWidth: 0, justifyContent: 'center' }}>
      <Text style={[s.eyebrow, { color: colors.yellow }]}>{label}</Text>
      <Text accessibilityRole="header" style={[s.title, {
        color: colors.card, fontSize: compact ? 28 : 36, lineHeight: compact ? 34 : 43,
      }]}>{title}</Text>
      <Text style={[s.body, { color: colors.card, fontSize: compact ? 16 : 18, lineHeight: compact ? 22 : 26 }]}>{description}</Text>
      <Text style={[s.muted, { color: '#C5DCD3', lineHeight: 21 }]}>{detail}</Text>
      <View style={[s.row, { marginTop: 2 }]}><Button accent onPress={open}>{action}</Button></View>
    </View>
    <ContextImage photo={photo} style={compact ? { width: '100%', height: 104 } : { flex: 1.15, minHeight: 244 }} />
  </View>;
}

function ShortcutTile({ item, compact }: { item: Shortcut; compact: boolean }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={item.label} onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)} onPress={item.open} style={({ pressed }) => ({
      flex: compact ? undefined : 1, minWidth: 0, minHeight: compact ? 66 : 84,
      flexDirection: 'row', alignItems: 'center', gap: 12, padding: compact ? 11 : 15,
      borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: pressed ? item.tint : colors.card,
      outlineWidth: focused ? 3 : 0, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: 2,
    })}>
    <View style={{ backgroundColor: item.tint, width: compact ? 30 : 36, height: compact ? 30 : 36,
      borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={item.icon} size={compact ? 17 : 20} color={colors.primary} />
    </View>
    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
      <Text style={[s.body, { fontSize: 16, lineHeight: 22, fontWeight: '600' }]}>{item.label}</Text>
      <Text style={[s.muted, { fontSize: 14, lineHeight: 20 }]}>{item.description}</Text>
    </View>
    <Icon name="chevron" size={16} color={colors.muted} />
  </Pressable>;
}
