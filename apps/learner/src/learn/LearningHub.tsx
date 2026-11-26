import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { type Lesson, type LessonTopic, type TargetLanguage } from '@smartlingo/domain';
import { Button } from '../ui/controls';
import { Icon, type IconName } from '../ui/Icon';
import { routePress } from '../ui/routePress';
import { Disclosure } from '../ui/Disclosure';
import { colors, designTokens, styles as s } from '../ui/theme';
import { TopicCatalogue, type CatalogueSearch } from '../ui/TopicCatalogue';
import type { LearningModel } from '../ui/useLearning';
import { ListeningResources } from '../listening/ListeningResources';
import { ListeningComprehension } from '../listening/ListeningComprehension';
import { GuidedSpeaking } from '../practice/GuidedSpeaking';
import { FrenchPractice } from '../practice/FrenchPractice';
import { isAndroidApp } from '../platform/runtime';
import { JapaneseAlphabet } from '../alphabet/JapaneseAlphabet';
import { useNavigation } from '../app/WebNavigation';
import { routeHref, topicRouteKey } from '../app/routes';
import { learnRoute } from '../app/useLearnerNavigation';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';

export const learnModes = ['Japanese letters', 'Lessons', 'Listening & videos', 'Speaking'] as const;
export type LearnMode = typeof learnModes[number];
const studyAction: Record<LearnMode, { icon: IconName; text: string }> = {
  'Japanese letters': { icon: 'book', text: 'Letters' },
  Lessons: { icon: 'grid', text: 'Topics' },
  'Listening & videos': { icon: 'headphones', text: 'Listen' },
  Speaking: { icon: 'mic', text: 'Speak' },
};

export function LearningHub({ language, lessons, model, mode, onMode, selectedTopic, onSelectTopic, onOpen, disabled, active, catalogueSearch, topics, topicNavigation, courseLaunch }: {
  language: TargetLanguage; lessons: Lesson[]; model: LearningModel; mode: LearnMode; courseLaunch: CourseLaunchProps;
  onMode: (mode: LearnMode) => void; selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void; onOpen: (lesson: Lesson) => void;
  disabled: boolean; active: boolean;
  catalogueSearch: CatalogueSearch;
  topics: LessonTopic[];
  topicNavigation: ReactNode;
}) {
  const studyLessons = selectedTopic ? lessons.filter(lesson => lesson.topic === selectedTopic) : lessons;
  const conversationLessons = studyLessons.filter(lesson => lesson.language === 'fr-FR' && lesson.level !== 'B1');
  const visibleModes = learnModes.filter(choice => language === 'ja-JP' || choice !== 'Japanese letters');
  const activeMode = visibleModes.includes(mode) ? mode : 'Lessons';
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const lessonsLead = !!selectedTopic && activeMode === 'Lessons' && compact;
  const showCourseCard = !selectedTopic && (activeMode === 'Lessons' || activeMode === 'Japanese letters');
  const { navigate } = useNavigation();
  const picker = { kind: 'courses', language } as const;
  const coursesButton = <Button nativeID="learn-courses-trigger" compact icon="layers" href={routeHref(picker)}
    disabled={disabled} onPress={() => navigate(picker)}>Courses</Button>;
  const slangButton = language === 'fr-FR' && width < designTokens.layout.desktopFrenchNavBreakpoint
    ? <Button compact quiet icon="grid" href="/slang/fr" disabled={disabled} onPress={() => navigate({ kind: 'slang', language })}>Slang</Button> : null;
  const courseShortcut = !showCourseCard && <Button compact icon="calendar" href={courseLaunch.href}
    disabled={courseLaunch.disabled || courseLaunch.loading} onPress={courseLaunch.onOpen}>Course</Button>;
  const hrefForMode = (choice: LearnMode) => routeHref(learnRoute(choice, language, selectedTopic ? topicRouteKey(selectedTopic) : undefined));
  const sectionNavigation = compact ? <View role="navigation" accessibilityLabel="Learning sections" style={phone.actions}>
    {visibleModes.map(choice => <PhoneStudyAction key={choice} {...studyAction[choice]} label={choice === 'Lessons' ? 'Topics' : choice}
      selected={choice === activeMode} disabled={disabled} href={hrefForMode(choice)} onOpen={() => onMode(choice)} />)}
    {language === 'fr-FR' && <PhoneStudyAction text="Slang" label="Slang" icon="book" href="/slang/fr"
      disabled={disabled} onOpen={() => navigate({ kind: 'slang', language })} />}
  </View> : <View style={{ gap: 10, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.line }}>
      <View accessibilityLabel="Learning sections" style={s.row}>
        {visibleModes.map(choice => <Button compact quiet key={choice} selected={choice === activeMode} disabled={disabled} onPress={() => onMode(choice)} href={hrefForMode(choice)}>{choice}</Button>)}
        {courseShortcut}
        {!showCourseCard && coursesButton}
        {slangButton}
      </View>
      {!!selectedTopic && activeMode !== 'Lessons' && activeMode !== 'Japanese letters' && <View style={s.row}>
        <Text style={s.muted}>{selectedTopic}</Text><Button compact quiet disabled={disabled} onPress={() => onSelectTopic(null)}>All topics</Button>
      </View>}
    </View>;
  return <View style={{ gap: compact ? 12 : 16, minWidth: 0 }}>
    {showCourseCard && <>
      <View style={phone.headingRow}>
        <Text accessibilityRole="header" aria-level={1} style={[s.title, compact && phone.title]}>Learn</Text>
        {coursesButton}
      </View>
      {(!compact || activeMode !== 'Japanese letters') && <CourseLaunchCard {...courseLaunch} concise={compact} />}
    </>}
    {compact && !showCourseCard && !lessonsLead && <View style={phone.headingRow}>{coursesButton}</View>}
    {!lessonsLead && sectionNavigation}
    {compact && !!selectedTopic && activeMode !== 'Lessons' && activeMode !== 'Japanese letters' && <View style={s.row}>
      <Text style={s.muted}>{selectedTopic}</Text>
      <Button compact quiet disabled={disabled} onPress={() => onSelectTopic(null)}>All topics</Button>
    </View>}
    {topicNavigation}
    {activeMode === 'Japanese letters' && language === 'ja-JP' ? <JapaneseAlphabet model={model} />
      : activeMode === 'Lessons' ? <TopicCatalogue key={language} language={language} lessons={lessons} topics={topics} model={model}
        onOpen={onOpen} selectedTopic={selectedTopic} onSelectTopic={onSelectTopic} search={catalogueSearch} disabled={disabled} />
      : activeMode === 'Listening & videos' ? <ListeningSection key={`${language}:${selectedTopic ?? 'all'}`}
        lessons={studyLessons} language={language} active={active} /> : <>
        <GuidedSpeaking key={`${language}:${selectedTopic ?? 'all'}`} lessons={studyLessons} />
        {!isAndroidApp() && active && conversationLessons.length > 0 && <Disclosure title="Optional AI conversation" description="Try a temporary French exchange with English feedback." keepMounted={false}>
          <FrenchPractice lessons={conversationLessons} model={model} active={active} />
        </Disclosure>}
      </>}
    {lessonsLead && sectionNavigation}
  </View>;
}

function PhoneStudyAction({ text, label, icon, href, selected, disabled, onOpen }: {
  text: string; label: string; icon: IconName; href: string; selected?: boolean; disabled: boolean; onOpen: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected, disabled }}
    aria-selected={selected} aria-current={selected ? 'page' : undefined} disabled={disabled} {...routePress(disabled ? undefined : href, onOpen)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [phone.action, selected && phone.selected, focused && phone.focus,
      { opacity: disabled ? designTokens.opacity.disabled : pressed ? designTokens.opacity.pressed : 1 }]}>
    <Icon name={icon} size={21} color={colors.primary} />
    <Text style={phone.actionText}>{text}</Text>
  </Pressable>;
}

const phone = StyleSheet.create({
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { fontSize: 32, lineHeight: 39, flexShrink: 1, minWidth: 0 },
  actions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  action: { flex: 1, minWidth: 57, minHeight: 62, borderWidth: 1, borderColor: colors.line, borderRadius: 12,
    backgroundColor: colors.card, gap: 4, padding: 5, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: colors.sageTint, borderColor: '#B7D3C3' },
  focus: { outlineColor: colors.focusRing, outlineStyle: 'solid', outlineWidth: designTokens.focus.outlineWidth },
  actionText: { ...designTokens.typography.caption, color: colors.ink, fontWeight: '600', textAlign: 'center' },
});

function ListeningSection({ lessons, language, active }: { lessons: Lesson[]; language: TargetLanguage; active: boolean }) {
  const { route, navigate, backTo } = useNavigation();
  const listening = route.kind === 'listening' ? route : undefined;
  const browsing = !!listening?.library;
  const previousView = useRef(browsing);
  const practiceHeading = useId();
  const libraryHeading = useId();

  useLayoutEffect(() => {
    if (previousView.current === browsing) return;
    previousView.current = browsing;
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(browsing ? libraryHeading : practiceHeading);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'nearest' });
  }, [browsing, libraryHeading, practiceHeading]);

  const topic = listening?.topic;
  if (browsing) return <ListeningResources language={language} headingId={libraryHeading} onClose={() => backTo({ kind: 'listening', language, topic },
    previous => previous.kind === 'listening' && previous.language === language && previous.topic === topic && !previous.library && !previous.chooser, true)} />;
  return <ListeningComprehension lessons={lessons} active={active} headingId={practiceHeading} onBrowse={() => navigate({ kind: 'listening', language, topic, library: true }, { replace: listening?.chooser })} />;
}
