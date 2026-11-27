import { useId, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LessonTopic, TargetLanguage } from '@smartlingo/domain';
import { alphabetProgress, isAlphabetLessonId } from '../alphabet/progress';
import { routeHref, topicRouteKey } from '../app/routes';
import { useVisitState } from '../app/WebNavigation';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/controls';
import { routePress } from '../ui/routePress';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

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

export function TodayDashboard({ language, courseLaunch, otherCourses, alphabetEvents, topics, onTopic, onExplore, onListen, onSpeak, onAlphabet }: TodayDashboardProps) {
  const { width } = useWindowDimensions();
  const compact = width < tokens.layout.compactBreakpoint;
  const wide = width >= tokens.layout.sidebarBreakpoint;
  const [expanded, setExpanded] = useVisitState('today.study-options', false);
  const optionsId = useId();
  const recent = [...alphabetEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const japanese = language === 'ja-JP';
  const recommendLetters = japanese && (!recent[0] || isAlphabetLessonId(recent[0].lessonId));
  const disabled = courseLaunch.disabled;

  return <View style={[today.screen, wide && today.wideScreen]}>
    <View style={[today.recommendation, wide && today.wideRecommendation]}>
      <Text accessibilityRole="header" aria-level={1} style={[s.hero, today.pageTitle, compact && today.compactTitle]}>Today</Text>
      <View testID="today-next-step" style={today.nextStep}>
        {recommendLetters
          ? <KanaRecommendation alphabet={alphabetProgress(alphabetEvents)} onOpen={onAlphabet} disabled={disabled} compact={compact} />
          : <CourseLaunchCard {...courseLaunch} featured />}
      </View>
    </View>
    <View style={wide ? today.sidebar : today.options}>
      {!wide && <Button compact expanded={expanded} controls={optionsId} trailingIcon={expanded ? 'chevron-up' : 'chevron-down'}
        onPress={() => setExpanded(value => !value)}>Browse study options</Button>}
      <View nativeID={optionsId} style={!wide && !expanded && today.hidden}>
        {(wide || expanded) && <View role="navigation" accessibilityLabel="Study options" style={today.groups}>
          <StudyGroup title="Courses">
            {[courseLaunch, ...otherCourses].map(option => <StudyLink key={option.course.id} label={option.course.title}
              title={japanese ? option.course.title.split(':')[0]! : option.course.title.replace(/^French /u, '')}
              href={option.href} onOpen={option.onOpen} disabled={option.loading || option.disabled}
              current={!recommendLetters && option.course.id === courseLaunch.course.id} />)}
          </StudyGroup>
          <StudyGroup title="Topics">
            {topics.slice(0, starterTopicCount).map(topic => <StudyLink key={topic.name} title={topic.name}
              href={routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) })}
              onOpen={() => onTopic(topic.name)} disabled={disabled} />)}
            <StudyLink title="Browse all lessons" href={routeHref({ kind: 'topics', language })} onOpen={onExplore} disabled={disabled} />
          </StudyGroup>
          <StudyGroup title="Practice">
            <StudyLink title="Listening & videos" href={routeHref({ kind: 'listening', language })} onOpen={onListen} disabled={disabled} />
            <StudyLink title="Speaking practice" href={routeHref({ kind: 'speaking', language })} onOpen={onSpeak} disabled={disabled} />
            {japanese && <StudyLink title="Japanese letters" href="/learn/ja/letters" onOpen={onAlphabet} disabled={disabled} />}
          </StudyGroup>
        </View>}
      </View>
    </View>
  </View>;
}

function KanaRecommendation({ alphabet, onOpen, disabled, compact }: {
  alphabet: ReturnType<typeof alphabetProgress>; onOpen: () => void; disabled: boolean; compact: boolean;
}) {
  const action = alphabet.completed === 0 ? 'Start Hiragana' : alphabet.next ? 'Continue Japanese letters' : 'Review Japanese letters';
  return <View style={[s.card, today.kanaCard, compact && today.compactKanaCard]}>
    <View style={today.kanaCopy}>
      <Text accessibilityRole="header" aria-level={2} style={[s.title, compact && s.compactTitle]}>
        {alphabet.next?.title ?? 'Review Japanese letters'}
      </Text>
      <Text style={s.muted}>{alphabet.next ? 'Hear the characters, read their sounds and practise recognising them.'
        : 'Practise recognising the characters in any hiragana or katakana row.'}</Text>
    </View>
    <View style={s.row}><Button accent onPress={onOpen} href="/learn/ja/letters" disabled={disabled} trailingIcon="arrow-right">{action}</Button></View>
  </View>;
}

function StudyGroup({ title, children }: { title: string; children: ReactNode }) {
  return <View style={today.group}>
    <Text accessibilityRole="header" aria-level={2} style={today.groupTitle}>{title}</Text>
    <View style={today.rows}>{children}</View>
  </View>;
}

function StudyLink({ title, label, href, onOpen, disabled, current }: {
  title: string; label?: string; href: string; onOpen: () => void; disabled: boolean; current?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="link" accessibilityLabel={label} accessibilityState={{ disabled }}
    aria-current={current ? 'true' : undefined} disabled={disabled} {...routePress(disabled ? undefined : href, onOpen)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [today.link, current && today.currentLink, (pressed || hovered) && today.hoveredLink,
      focused && today.focusedLink, disabled && today.disabledLink]}>
    <Text style={[today.linkLabel, current && today.currentLabel]}>{title}</Text>
    <Icon name="chevron" size={16} color={colors.muted} />
  </Pressable>;
}

const today = StyleSheet.create({
  screen: { gap: 24, minWidth: 0 },
  wideScreen: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 40 },
  recommendation: { gap: 16, minWidth: 0 },
  wideRecommendation: { flex: 1 },
  pageTitle: { fontSize: 48, lineHeight: 52 },
  compactTitle: { fontSize: 36, lineHeight: 40 },
  nextStep: { width: '100%', maxWidth: 768 },
  kanaCard: { borderLeftWidth: 4, borderLeftColor: colors.yellow, boxShadow: 'none', padding: 32, gap: 20 },
  compactKanaCard: { padding: 20, gap: 16 },
  kanaCopy: { gap: 8 },
  sidebar: { width: tokens.layout.sidebarWidth, flexShrink: 0, paddingRight: 16, paddingTop: 4, borderRightWidth: 1, borderColor: colors.line },
  options: { gap: 12, maxWidth: 768 },
  hidden: { display: 'none' },
  groups: { gap: 20 },
  group: { gap: 4 },
  groupTitle: { ...tokens.typography.smallLabel, paddingHorizontal: 12, color: colors.muted },
  rows: { borderTopWidth: 1, borderColor: colors.line },
  link: { minHeight: tokens.control.minimumTarget, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8,
    paddingLeft: 10, paddingRight: 8, borderLeftWidth: 2, borderLeftColor: 'transparent',
    borderBottomWidth: 1, borderBottomColor: colors.line },
  currentLink: { borderLeftColor: colors.yellow, backgroundColor: colors.card },
  hoveredLink: { backgroundColor: colors.sand },
  focusedLink: { outlineWidth: tokens.focus.outlineWidth, outlineColor: colors.focusRing, outlineStyle: 'solid', outlineOffset: -3 },
  disabledLink: { opacity: tokens.opacity.disabled },
  linkLabel: { ...tokens.typography.caption, color: colors.ink, flex: 1, minWidth: 0 },
  currentLabel: { fontWeight: '600' },
});
