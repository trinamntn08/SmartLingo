import { useEffect, useId } from 'react';
import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { routeHref } from '../app/routes';
import { useVisitState } from '../app/WebNavigation';
import { CourseLaunchCard, type CourseLaunchProps } from '../course/CourseLaunchCard';
import { SidebarRow, sidebarStyles } from '../ui/SidebarRow';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';

interface TodayDashboardProps {
  language: TargetLanguage;
  courseLaunch: CourseLaunchProps;
  otherCourses: readonly CourseLaunchProps[];
  showCourses: boolean;
  onExplore: () => void;
  onListen: () => void;
  onSpeak: () => void;
}

export function TodayDashboard({ language, courseLaunch, otherCourses, showCourses,
  onExplore, onListen, onSpeak }: TodayDashboardProps) {
  const { width } = useWindowDimensions();
  const compact = width < tokens.layout.compactBreakpoint;
  const wide = width >= tokens.layout.sidebarBreakpoint;
  const [expanded, setExpanded] = useVisitState('today.study-options', showCourses);
  const [coursesFocused, setCoursesFocused] = useVisitState('today.courses-focused', false);
  const optionsId = useId();
  const coursesId = useId();
  const panelTitle = `Explore ${languageNames[language]}`;
  const showNavigation = wide || expanded;
  const disabled = courseLaunch.disabled;

  useEffect(() => {
    if (Platform.OS !== 'web' || !showCourses || !showNavigation || coursesFocused) return;
    // Wait for the learner shell to restore its scroll position before moving to the course choices.
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById(coursesId);
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start', inline: 'nearest' });
      setCoursesFocused(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [coursesFocused, coursesId, setCoursesFocused, showCourses, showNavigation]);

  return <View style={[today.screen, wide && today.wideScreen]}>
    <View style={[today.recommendation, wide && today.wideRecommendation]}>
      <Text accessibilityRole="header" aria-level={1} style={[s.hero, today.pageTitle, compact && today.compactTitle]}>Today</Text>
      <View testID="today-next-step" style={today.nextStep}>
        <CourseLaunchCard {...courseLaunch} featured />
      </View>
    </View>
    <View style={[sidebarStyles.panel, wide ? today.sidebar : today.options]}>
      {!wide && <View accessibilityRole="header" aria-level={2}>
        <SidebarRow title={panelTitle} expanded={expanded} controls={optionsId}
          onPress={() => setExpanded(value => !value)} />
      </View>}
      <View nativeID={optionsId} style={!showNavigation && today.hidden}>
        {showNavigation && <View role="navigation" accessibilityLabel={panelTitle} style={today.navigation}>
          {wide && <Text accessibilityRole="header" aria-level={2}
            style={[sidebarStyles.title, today.heading]}>{panelTitle}</Text>}
          <View style={sidebarStyles.group}>
            <Text accessibilityRole="header" aria-level={3}
              style={[sidebarStyles.sectionLabel, today.heading]}>Find lessons</Text>
            <SidebarRow title="Browse lessons by topic" icon="grid" prominent
              description={language === 'ja-JP' ? 'Includes Hiragana and Katakana' : undefined}
              href={routeHref({ kind: 'topics', language })} onPress={onExplore} disabled={disabled} />
            <View style={[sidebarStyles.group, today.courseGroup]}>
              <Text nativeID={coursesId} accessibilityRole="header" aria-level={4}
                style={[sidebarStyles.meta, today.heading, today.courseHeading]}>Guided courses</Text>
              {[courseLaunch, ...otherCourses].map(option => {
                const title = option.course.title.replace(/^French ([A-C][12]):\s*/u, '$1 · ');
                return <SidebarRow key={option.course.id} title={title}
                  href={option.href} onPress={option.onOpen} disabled={option.loading || option.disabled} />;
              })}
            </View>
          </View>
          <View style={[sidebarStyles.group, today.skillsGroup]}>
            <Text accessibilityRole="header" aria-level={3}
              style={[sidebarStyles.sectionLabel, today.heading]}>Practise a skill</Text>
            <SidebarRow title="Listening & videos" icon="headphones"
              href={routeHref({ kind: 'listening', language })} onPress={onListen} disabled={disabled} />
            <SidebarRow title="Speaking" icon="mic"
              href={routeHref({ kind: 'speaking', language })} onPress={onSpeak} disabled={disabled} />
          </View>
        </View>}
      </View>
    </View>
  </View>;
}

const today = StyleSheet.create({
  screen: { gap: 24, minWidth: 0 },
  wideScreen: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 40 },
  recommendation: { gap: 16, minWidth: 0 },
  wideRecommendation: { flex: 1 },
  pageTitle: { fontSize: 48, lineHeight: 52 },
  compactTitle: { fontSize: 36, lineHeight: 40 },
  nextStep: { width: '100%', maxWidth: 768 },
  sidebar: { width: tokens.layout.sidebarWidth, flexShrink: 0 },
  options: { maxWidth: 768 },
  hidden: { display: 'none' },
  navigation: { gap: 16 },
  heading: { paddingHorizontal: 8 },
  courseGroup: { paddingTop: 8 },
  courseHeading: { fontSize: 13, fontWeight: '500' },
  skillsGroup: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12 },
});
