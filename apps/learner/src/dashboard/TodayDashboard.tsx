import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LessonTopic, TargetLanguage } from '@smartlingo/domain';
import { alphabetProgress, isAlphabetLessonId } from '../alphabet/progress';
import { routeHref, topicRouteKey } from '../app/routes';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { Icon, type IconName } from '../ui/Icon';
import { Button } from '../ui/controls';
import { routePress } from '../ui/routePress';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

const bakeryPhoto = require('./assets/lyon-bakery.jpg');

const introductions = {
  'fr-FR': { language: 'French', greeting: 'Bonjour !', description: 'Use practical French to greet people, shop and find your way around.' },
  'ja-JP': { language: 'Japanese', greeting: 'こんにちは', description: 'Read kana and use useful Japanese in everyday conversations.' },
} as const;

const starterTileStyles = [
  { icon: 'book', tint: colors.goldTint },
  { icon: 'person', tint: colors.sageTint },
  { icon: 'grid', tint: colors.skyTint },
] as const;

interface TodayDashboardProps {
  language: TargetLanguage;
  courseLaunch: CourseLaunchProps;
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
  icon: IconName;
  tint: string;
  open: () => void;
  href: string;
}

export function TodayDashboard({ language, courseLaunch, alphabetEvents, topics, onTopic, onExplore, onListen, onSpeak, onAlphabet }: TodayDashboardProps) {
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
    { label: 'Listening & videos', description: 'Listen to sentences and find videos', icon: 'headphones', tint: colors.lilacTint, open: onListen, href: routeHref({ kind: 'listening', language }) },
    { label: 'Speaking practice', description: 'Say your part in a dialogue', icon: 'mic', tint: colors.sageTint, open: onSpeak, href: routeHref({ kind: 'speaking', language }) },
  ];

  return <View style={[today.screen, compact && today.compactScreen]}>
    <View testID="today-next-step" style={[today.screen, compact && today.compactScreen]}>
      <TodayHero language={language} stacked={stackedHero} compact={compact} />
      {recommendLetters
        ? <KanaRecommendation alphabet={alphabet} compact={compact} action={alphabetAction} onOpen={onAlphabet} disabled={disabled} />
        : <CourseLaunchCard {...courseLaunch} featured />}
    </View>
    {recommendLetters && <CourseLaunchCard {...courseLaunch} />}

    <View style={today.section}>
      <View style={[s.row, today.sectionHeader]}>
        <Text accessibilityRole="header" aria-level={2} style={[s.heading, compact && today.compactHeading]}>
          {topics.length ? 'Start with a topic' : 'Explore topics'}
        </Text>
        <Button compact icon="grid" trailingIcon="arrow-right" onPress={onExplore} href={topicsHref} disabled={disabled}>
          Vocabulary &amp; lessons
        </Button>
      </View>
      {!!topics.length && <View style={[today.tileGrid, compact && today.stacked]}>
        {topics.slice(0, starterTileStyles.length).map((topic, index) => (
          <ShortcutTile key={topic.name} compact={compact} disabled={disabled} accessibleLabel={`Explore ${topic.name}`} item={{
            label: topic.name,
            description: `${topic.lessons.length} ${topic.lessons.length === 1 ? 'lesson' : 'lessons'} · ${topic.vocabulary.length} ${topic.vocabulary.length === 1 ? 'word' : 'words'}`,
            ...starterTileStyles[index]!,
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

function TodayHero({ language, stacked, compact }: { language: TargetLanguage; stacked: boolean; compact: boolean }) {
  const [bakeryFailed, setBakeryFailed] = useState(false);
  const introduction = introductions[language];
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  const showBakery = language === 'fr-FR' && !bakeryFailed;

  return <View style={[today.hero, stacked && today.stacked]}>
    <View style={[today.heroCopy, !stacked && today.heroCopyWide]}>
      <Text accessibilityRole="header" aria-level={1} style={today.pageName}>Today</Text>
      <Text style={[s.hero, today.heroTitle, compact && today.compactTitle]}>
        {introduction.language} for{'\n'}<Text style={today.heroAccent}>everyday life.</Text>
      </Text>
      <Text style={[s.body, today.heroDescription]}>{introduction.description}</Text>
    </View>
    <View testID="today-hero-art" style={[today.photoFrame, stacked ? today.photoStacked : today.photoWide, compact && today.photoCompact]}>
      {showBakery ? <Image source={bakeryPhoto} resizeMode="cover" onError={() => setBakeryFailed(true)}
        accessibilityLabel="Two people waving to each other outside a French neighbourhood bakery"
        accessible style={[StyleSheet.absoluteFill, today.photo]} /> : <ContextImage photo={getContextPhoto(language)} style={StyleSheet.absoluteFill} />}
      <View style={today.greeting}>
        <Text {...languageProps} style={today.targetGreeting}>{introduction.greeting}</Text>
        <Text style={today.translation}>Hello!</Text>
      </View>
    </View>
  </View>;
}

function KanaRecommendation({ alphabet, compact, action, onOpen, disabled }: {
  alphabet: ReturnType<typeof alphabetProgress>; compact: boolean; action: string; onOpen: () => void; disabled: boolean;
}) {
  return <View style={[s.card, today.kanaCard, compact && today.kanaCardCompact]}>
    <View style={today.kanaIcon}><Icon name="book" size={22} color={colors.primary} /></View>
    <View style={today.kanaCopy}>
      <Text accessibilityRole="header" aria-level={2} style={[s.heading, compact && today.compactHeading]}>
        {alphabet.completed === 0 ? 'Start with Japanese letters' : alphabet.next ? 'Continue Japanese letters' : 'Revisit Japanese letters'}
      </Text>
      <Text style={today.kanaDescription}>{alphabet.next ? `Hear and recognise ${alphabet.next.script}, one row at a time.`
        : 'Revisit a hiragana or katakana row and practise recognising its characters.'}</Text>
      <Text style={today.translation}>{alphabet.completed} of {alphabet.total} rows studied</Text>
    </View>
    <View style={compact && today.fullWidth}><Button accent onPress={onOpen} href="/learn/ja/letters" disabled={disabled} trailingIcon="chevron">{action}</Button></View>
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
    <View style={[today.tileIcon, { backgroundColor: item.tint }]}>
      <Icon name={item.icon} size={20} color={colors.primary} />
    </View>
    <View style={today.tileCopy}>
      <Text style={today.tileTitle}>{item.label}</Text>
      <Text style={today.translation}>{item.description}</Text>
    </View>
    <Icon name="chevron" size={16} color={colors.muted} />
  </Pressable>;
}

const today = StyleSheet.create({
  screen: { gap: 24, minWidth: 0 },
  compactScreen: { gap: 16 },
  hero: { flexDirection: 'row', gap: 20 },
  stacked: { flexDirection: 'column' },
  heroCopy: { minWidth: 0, gap: 10 },
  heroCopyWide: { flex: 1, justifyContent: 'center' },
  pageName: { ...designTokens.typography.label, color: colors.primary },
  heroTitle: { fontSize: 52, lineHeight: 54, color: colors.ink },
  heroAccent: { color: colors.primary },
  compactTitle: { fontSize: 37, lineHeight: 39, letterSpacing: -1.4 },
  heroDescription: { fontSize: 17, lineHeight: 24, color: colors.muted, maxWidth: 395 },
  photoFrame: { minWidth: 0, justifyContent: 'flex-end', alignItems: 'flex-start',
    borderRadius: 20, backgroundColor: colors.sageTint, overflow: 'hidden', padding: 14 },
  photoWide: { flex: 1.15, minHeight: 262 },
  photoStacked: { height: 182 },
  photoCompact: { height: 125, padding: 9, borderRadius: 14 },
  photo: { width: '100%', height: '100%' },
  greeting: { backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 10, paddingVertical: 5 },
  targetGreeting: { ...designTokens.typography.smallLabel, color: colors.ink, lineHeight: 19 },
  translation: { ...designTokens.typography.caption, color: colors.muted },
  kanaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.goldTint, borderBottomWidth: 3, gap: 12, padding: 16 },
  kanaCardCompact: { flexWrap: 'wrap', alignItems: 'flex-start', padding: 12 },
  kanaIcon: { borderRadius: 10, backgroundColor: colors.yellow, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  kanaCopy: { flex: 1, minWidth: 0, gap: 3 },
  kanaDescription: { ...designTokens.typography.muted, color: colors.ink, lineHeight: 22 },
  fullWidth: { flexBasis: '100%' },
  compactHeading: { ...designTokens.typography.compactHeading },
  section: { gap: 10 },
  sectionHeader: { justifyContent: 'space-between' },
  tileGrid: { flexDirection: 'row', gap: 10 },
  tile: { minWidth: 0, minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 13, borderWidth: 1, borderBottomWidth: 3, borderColor: colors.line, backgroundColor: colors.card },
  tileWide: { flex: 1 },
  tileCompact: { minHeight: 60 },
  tileHovered: { backgroundColor: colors.sageTint },
  tileFocused: { outlineWidth: designTokens.focus.outlineWidth, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: 2 },
  tileDisabled: { opacity: designTokens.opacity.disabled },
  tileIcon: { width: 35, height: 35, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tileCopy: { flex: 1, minWidth: 0, gap: 2 },
  tileTitle: { ...designTokens.typography.label, color: colors.ink },
});
