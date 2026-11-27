import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LessonTopic, TargetLanguage } from '@smartlingo/domain';
import { alphabetLessonTitle, alphabetProgress, isAlphabetLessonId } from '../alphabet/progress';
import { routeHref, topicRouteKey } from '../app/routes';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';
import { ContextImage } from '../ui/ContextImage';
import { getContextPhoto } from '../ui/contextPhotos';
import { Icon, type IconName } from '../ui/Icon';
import { Button } from '../ui/controls';
import { routePress } from '../ui/routePress';
import { StudyLaunchCard } from '../ui/StudyLaunchCard';
import { colors, designTokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

const bakeryPhoto = require('./assets/lyon-bakery.jpg');

const starterTileStyles = [
  { icon: 'book', tint: colors.goldTint },
  { icon: 'person', tint: colors.sageTint },
  { icon: 'grid', tint: colors.skyTint },
] as const;

interface TodayDashboardProps {
  language: TargetLanguage;
  courseLaunch: CourseLaunchProps;
  courseStudiedAt?: string;
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

export function TodayDashboard({ language, courseLaunch, courseStudiedAt, alphabetEvents, topics, onTopic, onExplore, onListen, onSpeak, onAlphabet }: TodayDashboardProps) {
  const { width } = useWindowDimensions();
  const compact = width < designTokens.layout.compactBreakpoint;
  const stackedHero = width < 720;
  const recent = [...alphabetEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const japanese = language === 'ja-JP';
  const recentStudy = recent[0];
  const alphabet = alphabetProgress(alphabetEvents);
  const recommendLetters = japanese && !!alphabet.next && (!recentStudy || isAlphabetLessonId(recentStudy.lessonId))
    && (!courseStudiedAt || (!!recentStudy && Date.parse(recentStudy.occurredAt) > Date.parse(courseStudiedAt)));
  const lettersStarted = alphabet.completed > 0 || alphabet.taskIds.size > 0;
  const alphabetAction = !lettersStarted ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters';
  const disabled = courseLaunch.disabled;
  const topicsHref = routeHref({ kind: 'topics', language });
  const shortcuts: Shortcut[] = [
    { label: 'Listening & videos', description: 'Listen to sentences and find videos', icon: 'headphones', tint: colors.lilacTint, open: onListen, href: routeHref({ kind: 'listening', language }) },
    { label: 'Speaking practice', description: 'Say your part in a dialogue', icon: 'mic', tint: colors.sageTint, open: onSpeak, href: routeHref({ kind: 'speaking', language }) },
  ];

  return <View style={[today.screen, compact && today.compactScreen]}>
    <Text accessibilityRole="header" aria-level={1} style={[s.title, compact && today.phoneTitle]}>Today</Text>
    <View style={[today.hero, stackedHero && today.stacked]}>
      <View testID="today-next-step" style={!stackedHero && today.recommendationWide}>
        {recommendLetters
          ? <KanaRecommendation alphabet={alphabet} action={alphabetAction} onOpen={onAlphabet} disabled={disabled} />
          : <CourseLaunchCard {...courseLaunch} featured concise={compact} />}
      </View>
      <TodayPhoto language={language} stacked={stackedHero} compact={compact} />
    </View>
    {recommendLetters && <CourseLaunchCard {...courseLaunch} concise />}
    {!compact && <>
      <View style={today.section}>
        <View style={[s.row, today.sectionHeader]}>
          <Text accessibilityRole="header" aria-level={2} style={s.heading}>
            Explore topics
          </Text>
          <Button compact icon="grid" onPress={onExplore} href={topicsHref} disabled={disabled}>
            Browse lessons
          </Button>
        </View>
        {!!topics.length && <View style={today.tileGrid}>
          {topics.slice(0, starterTileStyles.length).map((topic, index) => (
            <ShortcutTile key={topic.name} disabled={disabled} accessibleLabel={`Explore ${topic.name}`} item={{
              label: topic.name,
              description: `${topic.lessons.length} short ${topic.lessons.length === 1 ? 'lesson' : 'lessons'}`,
              ...starterTileStyles[index]!,
              open: () => onTopic(topic.name),
              href: routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) }),
            }} />
          ))}
        </View>}
      </View>

      <View style={today.section}>
        <View style={[s.row, today.sectionHeader]}>
          <Text accessibilityRole="header" aria-level={2} style={s.heading}>Listening and speaking</Text>
          {japanese && !recommendLetters && <Button quiet compact icon="book" onPress={onAlphabet} href="/learn/ja/letters" disabled={disabled}>
            {alphabetAction}
          </Button>}
        </View>
        <View style={today.tileGrid}>
          {shortcuts.map(shortcut => <ShortcutTile key={shortcut.label} item={shortcut} disabled={disabled} />)}
        </View>
      </View>
    </>}
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
  return <StudyLaunchCard featured context={alphabet.next?.script === 'katakana' ? 'Katakana' : 'Hiragana'}
    title={alphabet.next ? alphabetLessonTitle(alphabet.next) : 'Japanese letters'}
    status={alphabet.completed ? `${alphabet.completed} of ${alphabet.total} rows studied` : undefined}
    action={{ label: action, href: routeHref({ kind: 'letters', language: 'ja-JP' }), onOpen, disabled }} />;
}

function ShortcutTile({ item, disabled, accessibleLabel }: {
  item: Shortcut; disabled: boolean; accessibleLabel?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibleLabel ?? item.label} accessibilityHint={item.description}
    aria-disabled={disabled} disabled={disabled} {...routePress(disabled ? undefined : item.href, item.open)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [today.tile, (pressed || hovered) && today.tileHovered,
      focused && today.tileFocused, disabled && today.tileDisabled]}>
    <View style={[today.tileIcon, { backgroundColor: item.tint }]}>
      <Icon name={item.icon} size={20} color={colors.primary} />
    </View>
    <View style={today.tileCopy}>
      <Text style={today.tileTitle}>{item.label}</Text>
      {accessibleLabel && <Text style={today.translation}>{item.description}</Text>}
    </View>
    <Icon name="chevron" size={16} color={colors.muted} />
  </Pressable>;
}

const today = StyleSheet.create({
  screen: { gap: 24, minWidth: 0 },
  compactScreen: { gap: 14, minWidth: 0 },
  phoneTitle: { fontSize: 32, lineHeight: 39 },
  hero: { flexDirection: 'row', gap: 14 },
  stacked: { flexDirection: 'column' },
  recommendationWide: { flex: 1.25, minWidth: 0, justifyContent: 'center' },
  photoFrame: { minWidth: 0, borderRadius: 18, backgroundColor: colors.sageTint, overflow: 'hidden' },
  photoWide: { flex: 1, minHeight: 236 },
  photoStacked: { height: 165 },
  photoCompact: { height: 144, borderRadius: 16 },
  photo: { width: '100%', height: '100%' },
  translation: { ...designTokens.typography.caption, color: colors.muted },
  section: { gap: 10 },
  sectionHeader: { justifyContent: 'space-between' },
  tileGrid: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, minWidth: 0, minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 10, backgroundColor: colors.card },
  tileHovered: { backgroundColor: colors.sageTint },
  tileFocused: { outlineWidth: designTokens.focus.outlineWidth, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: 2 },
  tileDisabled: { opacity: designTokens.opacity.disabled },
  tileIcon: { width: 35, height: 35, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tileCopy: { flex: 1, minWidth: 0, gap: 2 },
  tileTitle: { ...designTokens.typography.label, color: colors.ink },
});
