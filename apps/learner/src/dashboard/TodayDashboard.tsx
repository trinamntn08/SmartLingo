import { useId, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { LessonTopic, TargetLanguage } from '@smartlingo/domain';
import { kanaTopics } from '../alphabet/kanaTopics';
import { routeHref, topicRouteKey } from '../app/routes';
import { useVisitState } from '../app/WebNavigation';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/controls';
import { routePress } from '../ui/routePress';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';

const starterTopicCount = 3;

interface TodayDashboardProps {
  language: TargetLanguage;
  courseLaunch: CourseLaunchProps;
  otherCourses: readonly CourseLaunchProps[];
  topics: readonly LessonTopic[];
  onTopic: (name: string) => void;
  onExplore: () => void;
  onListen: () => void;
  onSpeak: () => void;
}

export function TodayDashboard({ language, courseLaunch, otherCourses, topics, onTopic, onExplore, onListen, onSpeak }: TodayDashboardProps) {
  const { width } = useWindowDimensions();
  const compact = width < tokens.layout.compactBreakpoint;
  const wide = width >= tokens.layout.sidebarBreakpoint;
  const [expanded, setExpanded] = useVisitState('today.study-options', false);
  const optionsId = useId();
  const japanese = language === 'ja-JP';
  const studyTopics = [...(japanese ? kanaTopics : []), ...topics.slice(0, starterTopicCount)];
  const disabled = courseLaunch.disabled;

  return <View style={[today.screen, wide && today.wideScreen]}>
    <View style={[today.recommendation, wide && today.wideRecommendation]}>
      <Text accessibilityRole="header" aria-level={1} style={[s.hero, today.pageTitle, compact && today.compactTitle]}>Today</Text>
      <View testID="today-next-step" style={today.nextStep}>
        <CourseLaunchCard {...courseLaunch} featured />
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
              current={option.course.id === courseLaunch.course.id} />)}
          </StudyGroup>
          <StudyGroup title="Topics">
            {studyTopics.map(topic => <StudyLink key={topic.name} title={topic.name}
              href={routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) })}
              onOpen={() => onTopic(topic.name)} disabled={disabled} />)}
            <StudyLink title="Browse all lessons" href={routeHref({ kind: 'topics', language })} onOpen={onExplore} disabled={disabled} />
          </StudyGroup>
          <StudyGroup title="Practice">
            <StudyLink title="Listening & videos" href={routeHref({ kind: 'listening', language })} onOpen={onListen} disabled={disabled} />
            <StudyLink title="Speaking practice" href={routeHref({ kind: 'speaking', language })} onOpen={onSpeak} disabled={disabled} />
          </StudyGroup>
        </View>}
      </View>
    </View>
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
