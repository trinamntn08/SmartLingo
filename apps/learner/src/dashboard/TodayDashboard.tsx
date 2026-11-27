import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LessonTopic, TargetLanguage } from '@smartlingo/domain';
import { alphabetProgress, isAlphabetLessonId } from '../alphabet/progress';
import { routeHref, topicRouteKey } from '../app/routes';
import { CourseLaunchCard, OtherFrenchCourses, type CourseLaunchProps } from '../course/CourseLaunchCard';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { Icon, type IconName } from '../ui/Icon';
import { Button } from '../ui/controls';
import { routePress } from '../ui/routePress';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

const bakeryPhoto = require('./assets/lyon-bakery.jpg');

const starterTopicCount = 3;

interface TodayDashboardProps {
  language: TargetLanguage;
  courseLaunch: CourseLaunchProps;
  otherCourses: readonly CourseLaunchProps[];
  alphabetEvents: LearningModel['events'];
  topics: readonly LessonTopic[];
  onTopic: (name: string) => void;
  onExplore: () => void;
  onListen: () => void;
  onSpeak: () => void;
  onAlphabet: () => void;
}

interface Shortcut {
  label: string;
  description: string;
  icon?: IconName;
  open: () => void;
  href: string;
}

export function TodayDashboard({ language, courseLaunch, otherCourses, alphabetEvents, topics, onTopic, onExplore, onListen, onSpeak, onAlphabet }: TodayDashboardProps) {
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const stackedHero = width < 720;
  const recent = [...alphabetEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const japanese = language === 'ja-JP';
  const recommendLetters = japanese && (!recent[0] || isAlphabetLessonId(recent[0].lessonId));
  const alphabet = alphabetProgress(alphabetEvents);
  const alphabetAction = alphabet.completed === 0 ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters';
  const disabled = courseLaunch.disabled;
  const topicsHref = routeHref({ kind: 'topics', language });
  const shortcuts: Shortcut[] = [
    { label: 'Listening & videos', description: 'Listen to sentences and find videos', icon: 'headphones', open: onListen, href: routeHref({ kind: 'listening', language }) },
    { label: 'Speaking practice', description: 'Say your part in a dialogue', icon: 'mic', open: onSpeak, href: routeHref({ kind: 'speaking', language }) },
  ];

  return <View style={[today.screen, compact && today.compactScreen]}>
    <View style={today.intro}>
      <Text accessibilityRole="header" aria-level={1} style={[s.hero, today.pageTitle, compact && today.compactTitle]}>Today</Text>
      <View testID="today-next-step" style={[today.hero, stackedHero && today.stacked]}>
        <View style={!stackedHero && today.recommendationWide}>
          {recommendLetters
            ? <KanaRecommendation alphabet={alphabet} action={alphabetAction} onOpen={onAlphabet} disabled={disabled} />
            : <CourseLaunchCard {...courseLaunch} featured />}
        </View>
        <TodayPhoto language={language} stacked={stackedHero} compact={compact} />
      </View>
    </View>
    {recommendLetters && <CourseLaunchCard {...courseLaunch} />}
    <OtherFrenchCourses courses={otherCourses} />

    <View style={today.section}>
      <View style={[s.row, today.sectionHeader]}>
        <Text accessibilityRole="header" aria-level={2} style={[s.heading, compact && today.compactHeading]}>
          Explore topics
        </Text>
        <Button quiet compact trailingIcon="arrow-right" onPress={onExplore} href={topicsHref} disabled={disabled}>
          Browse lessons
        </Button>
      </View>
      {!!topics.length && <View style={[today.tileGrid, compact && today.stacked]}>
        {topics.slice(0, starterTopicCount).map(topic => (
          <ShortcutTile key={topic.name} compact={compact} disabled={disabled} accessibleLabel={`Explore ${topic.name}`} item={{
            label: topic.name,
            description: `${topic.lessons.length} short ${topic.lessons.length === 1 ? 'lesson' : 'lessons'}`,
            open: () => onTopic(topic.name),
            href: routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) }),
          }} />
        ))}
      </View>}
    </View>

    <View style={today.section}>
      <View style={[s.row, today.sectionHeader]}>
        <Text accessibilityRole="header" aria-level={2} style={[s.heading, compact && today.compactHeading]}>Listening and speaking</Text>
        {japanese && !recommendLetters && <Button quiet compact icon="book" onPress={onAlphabet} href="/learn/ja/letters" disabled={disabled}>
          {alphabetAction}
        </Button>}
      </View>
      <View style={[today.tileGrid, compact && today.stacked]}>
        {shortcuts.map(shortcut => <ShortcutTile key={shortcut.label} item={shortcut} compact={compact} disabled={disabled} />)}
      </View>
    </View>
  </View>;
}

function TodayPhoto({ language, stacked, compact }: { language: TargetLanguage; stacked: boolean; compact: boolean }) {
  const [bakeryFailed, setBakeryFailed] = useState(false);
  const showBakery = language === 'fr-FR' && !bakeryFailed;

  return <View testID="today-hero-art" style={[today.photoFrame, stacked ? today.photoStacked : today.photoWide, compact && today.photoCompact]}>
    {showBakery ? <Image source={bakeryPhoto} resizeMode="cover" onError={() => setBakeryFailed(true)}
      accessibilityLabel="Two people waving to each other outside a French neighbourhood bakery"
      accessible style={[StyleSheet.absoluteFill, today.photo]} /> : <ContextImage photo={getContextPhoto(language)} style={StyleSheet.absoluteFill} />}
  </View>;
}

function KanaRecommendation({ alphabet, action, onOpen, disabled }: {
  alphabet: ReturnType<typeof alphabetProgress>; action: string; onOpen: () => void; disabled: boolean;
}) {
  return <View style={[s.card, today.kanaCard]}>
    <View style={today.kanaCopy}>
      <Text accessibilityRole="header" aria-level={2} style={today.kanaCourse}>
        {alphabet.completed === 0 ? 'Start with Japanese letters' : alphabet.next ? 'Japanese letters' : 'Revisit Japanese letters'}
      </Text>
      {alphabet.next && <Text accessibilityRole="header" aria-level={3} style={s.heading}>{alphabet.next.title}</Text>}
      <Text style={today.kanaDescription}>{alphabet.next ? 'Hear the characters, read their sounds and practise recognising them.'
        : 'Practise recognising the characters in any hiragana or katakana row.'}</Text>
      <Text style={today.translation}>{alphabet.completed} of {alphabet.total} rows studied</Text>
    </View>
    <View style={s.row}><Button accent onPress={onOpen} href="/learn/ja/letters" disabled={disabled} trailingIcon="arrow-right">{action}</Button></View>
  </View>;
}

function ShortcutTile({ item, compact, disabled, accessibleLabel }: {
  item: Shortcut; compact: boolean; disabled: boolean; accessibleLabel?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibleLabel ?? item.label} accessibilityHint={item.description}
    aria-disabled={disabled} disabled={disabled} {...routePress(disabled ? undefined : item.href, item.open)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [today.tile, compact ? today.tileCompact : today.tileWide, (pressed || hovered) && today.tileHovered,
      focused && today.tileFocused, disabled && today.tileDisabled]}>
    {item.icon && <Icon name={item.icon} size={18} color={colors.primary} />}
    <View style={today.tileCopy}>
      <Text style={today.tileTitle}>{item.label}</Text>
      <Text style={today.translation}>{item.description}</Text>
    </View>
    <Icon name="chevron" size={18} color={colors.muted} />
  </Pressable>;
}

const today = StyleSheet.create({
  screen: { gap: 32, minWidth: 0 },
  compactScreen: { gap: 24 },
  intro: { gap: 16 },
  pageTitle: { fontSize: 48, lineHeight: 52 },
  compactTitle: { fontSize: 36, lineHeight: 40 },
  hero: { flexDirection: 'row', borderWidth: 1, borderColor: colors.line, borderRadius: designTokens.radius.lg, overflow: 'hidden', backgroundColor: colors.card },
  stacked: { flexDirection: 'column' },
  recommendationWide: { flex: 0.9, minWidth: 0 },
  photoFrame: { minWidth: 0, backgroundColor: colors.sand, overflow: 'hidden' },
  photoWide: { flex: 1, minHeight: 300 },
  photoStacked: { height: 208 },
  photoCompact: { height: 152 },
  photo: { width: '100%', height: '100%' },
  translation: { ...designTokens.typography.caption, color: colors.muted },
  kanaCard: { flexGrow: 1, justifyContent: 'center', borderWidth: 0, borderRadius: 0, borderLeftWidth: 4, borderLeftColor: colors.yellow, boxShadow: 'none', gap: 20 },
  kanaCopy: { minWidth: 0, gap: 8 },
  kanaCourse: { ...designTokens.typography.label, color: colors.primary },
  kanaDescription: { ...designTokens.typography.muted, color: colors.ink },
  compactHeading: { ...designTokens.typography.compactHeading },
  section: { gap: 8 },
  sectionHeader: { justifyContent: 'space-between' },
  tileGrid: { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: colors.line },
  tile: { minWidth: 0, minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 8,
    borderBottomWidth: 1, borderColor: colors.line },
  tileWide: { flex: 1 },
  tileCompact: { minHeight: 60 },
  tileHovered: { backgroundColor: colors.sand },
  tileFocused: { outlineWidth: designTokens.focus.outlineWidth, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: 2 },
  tileDisabled: { opacity: designTokens.opacity.disabled },
  tileCopy: { flex: 1, minWidth: 0, gap: 2 },
  tileTitle: { ...designTokens.typography.label, color: colors.ink },
});
