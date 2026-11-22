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
  onReview: () => void; onListen: () => void; onSpeak: () => void; onAlphabet: () => void;
}

interface Shortcut {
  label: string;
  icon: IconName;
  tint: string;
  open: () => void;
}

export function TodayDashboard({ language, lessons, course, model, onWriteBlocked, onOpen, onExplore, onReview, onListen, onSpeak, onAlphabet }: TodayDashboardProps) {
  const compact = useWindowDimensions().width < designTokens.layout.compactBreakpoint;
  const recent = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const latest = recent.find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  const japanese = language === 'ja-JP';
  const recommendLetters = japanese && (!recent[0] || isAlphabetLessonId(recent[0].lessonId));
  const alphabet = alphabetProgress(model.events);
  const alphabetAction = alphabet.completed === 0 ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters';
  const shortcuts: Shortcut[] = [
    { label: 'Explore lessons', icon: 'grid', tint: colors.skyTint, open: onExplore },
    { label: 'Open your notebook', icon: 'bookmark', tint: colors.goldTint, open: onReview },
    { label: 'Listening & videos', icon: 'headphones', tint: colors.lilacTint, open: onListen },
    { label: 'Speaking practice', icon: 'mic', tint: colors.sageTint, open: onSpeak },
  ];

  return <View style={{ gap: compact ? 18 : 24, minWidth: 0 }}>
    <ScreenHeader title="Today" eyebrow={languageNames[language]} />
    {recommendLetters
      ? <NextActivity compact={compact} photo={getContextPhoto(language)} label="Japanese letters"
          title={alphabet.completed === 0 ? 'Start with Japanese letters' : alphabet.next ? 'Continue Japanese letters' : 'Revisit Japanese letters'}
          description="Meet the hiragana characters, hear their sounds, and try recognising a row."
          detail={`${alphabet.completed} of ${alphabet.total} rows studied`} action={alphabetAction} open={onAlphabet} />
      : suggested
        ? <NextActivity compact={compact} photo={getContextPhoto(language, suggested.topic)} label={suggested.topic}
            title={suggested.subtitle} description={suggested.outcome}
            detail={`${suggested.durationMinutes} min · ${suggested.vocabulary.length} words`}
            action={lessonAction(suggested, model)} open={() => onOpen(suggested)} />
        : <View testID="today-next-step" style={s.card}>
            <Text accessibilityRole="header" style={s.heading}>No lessons available</Text>
            <Text style={s.body}>You can still open your notebook or listen to a resource below.</Text>
          </View>}
    {!!model.loadError && <Text style={s.muted}>Your saved place is unavailable. You can still browse and study.</Text>}

    <View style={[s.row, { alignItems: 'stretch', gap: compact ? 10 : 12 }]}>
      {shortcuts.map(shortcut => <ShortcutTile key={shortcut.label} item={shortcut} compact={compact} />)}
    </View>
    {japanese && !recommendLetters && <View style={s.row}><Button compact icon="book" onPress={onAlphabet}>{alphabetAction}</Button></View>}

    <OpenCoursePanel key={language} course={course} model={model} onWriteBlocked={onWriteBlocked} />
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
    <View style={{ gap: compact ? 10 : 15, padding: compact ? 20 : 32, flex: compact ? undefined : 1,
      minWidth: 0, justifyContent: 'center' }}>
      <Text style={[s.eyebrow, { color: colors.yellow }]}>{label}</Text>
      <Text accessibilityRole="header" style={[s.title, compact && s.compactTitle, { color: colors.card }]}>{title}</Text>
      <Text style={[s.body, { color: colors.card }]}>{description}</Text>
      <Text style={[s.muted, { color: '#C5DCD3' }]}>{detail}</Text>
      <View style={[s.row, { marginTop: 2 }]}><Button accent onPress={open}>{action}</Button></View>
    </View>
    <ContextImage photo={photo} style={compact ? { width: '100%', height: 146 } : { flex: 1.25, minHeight: 292 }} />
  </View>;
}

function ShortcutTile({ item, compact }: { item: Shortcut; compact: boolean }) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={item.label} onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)} onPress={item.open} style={({ pressed }) => ({
      flex: 1, flexBasis: compact ? '44%' : 205, minWidth: 0, maxWidth: '100%', minHeight: compact ? 68 : 72,
      flexDirection: 'row', alignItems: 'center', gap: compact ? 9 : 12, padding: compact ? 11 : 15,
      borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: pressed ? item.tint : colors.card,
      outlineWidth: focused ? 3 : 0, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: 2,
    })}>
    <View style={{ backgroundColor: item.tint, width: compact ? 30 : 36, height: compact ? 30 : 36,
      borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={item.icon} size={compact ? 17 : 20} color={colors.primary} />
    </View>
    <Text style={[s.body, { flex: 1, minWidth: 0, ...(compact ? designTokens.typography.label : designTokens.typography.button),
      textAlign: 'left', fontWeight: '600' }]}>{item.label}</Text>
    {!compact && <Icon name="chevron" size={16} color={colors.muted} />}
  </Pressable>;
}
