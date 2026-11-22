import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { lessonProgress, type Lesson, type LessonTopic } from '@smartlingo/domain';
import { Badge, Button } from './controls';
import { Icon, type IconName } from './Icon';
import { colors, frenchTextProps, styles as s } from './theme';
import type { LearningModel } from './useLearning';

// Decorative artwork generated for SmartLingo with OpenAI ImageGen.
const neighborhoodPhoto = require('./assets/lyon-bakery.jpg');
const starterIcons = ['practice', 'book', 'numbers'] satisfies IconName[];
const starterBackgrounds = [colors.goldSoft, colors.greenSoft, '#F3E3D9'];

export function Today({ lessons, topics, model, compact, narrowTitle, onOpen, onExplore, onSelectTopic }: {
  lessons: Lesson[]; topics: LessonTopic[]; model: LearningModel; compact: boolean; narrowTitle: boolean;
  onOpen: (lesson: Lesson) => void; onExplore: () => void; onSelectTopic: (name: string) => void;
}) {
  const latest = [...model.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).find(event => lessons.some(lesson => lesson.id === event.lessonId));
  const suggested = lessons.find(lesson => lesson.id === latest?.lessonId) ?? lessons[0];
  return <View style={[today.screen, compact && { gap: 20 }]}>
    <View style={[today.intro, compact && today.compactIntro]}>
      <View style={[today.introCopy, compact && today.compactIntroCopy]}>
        <View style={today.level}><View style={today.levelDot} /><Text style={s.eyebrow}>Foundations to A2</Text></View>
        <Text accessibilityRole="header" style={[s.hero, narrowTitle && today.mediumHero, compact && today.compactHero]}>
          French for{'\n'}<Text style={today.accent}>everyday life.</Text>
        </Text>
        <Text style={today.description}>Learn useful French for real conversations, from saying hello to finding your way around.</Text>
      </View>
      <View testID="today-hero-art" style={[today.photo, compact && today.compactPhoto]}>
        <Image accessible={false} aria-hidden source={neighborhoodPhoto} resizeMode="cover" style={[StyleSheet.absoluteFill, today.photoImage]} />
        <View style={today.phrase}>
          <View style={today.phraseIcon}><Icon name="practice" size={17} /></View>
          <View><Text style={today.phraseFrench} {...frenchTextProps}>Bonjour !</Text><Text style={today.phraseEnglish}>Hello!</Text></View>
        </View>
      </View>
    </View>
    {suggested && <NextLesson lesson={suggested} model={model} onOpen={onOpen} compact={compact} />}
    {!!topics.length && <View style={today.topics}>
      <View style={today.sectionHeader}>
        <Text accessibilityRole="header" style={s.heading}>Start with a topic</Text>
        <Button label="Explore all topics" onPress={onExplore}>Explore all topics →</Button>
      </View>
      <View style={[today.topicGrid, compact && today.compactTopicGrid]}>
        {topics.slice(0, starterIcons.length).map((topic, index) => <StarterTopic key={topic.name} topic={topic} index={index} onSelect={onSelectTopic} />)}
      </View>
    </View>}
  </View>;
}

function NextLesson({ lesson, model, compact, onOpen }: {
  lesson: Lesson; model: LearningModel; compact: boolean; onOpen: (lesson: Lesson) => void;
}) {
  const progress = lessonProgress(lesson, model.events);
  const started = model.events.some(event => event.lessonId === lesson.id && event.revision === lesson.revision);
  const action = progress.completed ? 'Revisit your lesson →' : started ? 'Continue your lesson →'
    : lesson.id.startsWith('fr.greetings.') ? 'Start greetings practice →'
      : lesson.id === 'fr.restaurant.customer' ? 'Start restaurant practice →' : 'Start lesson →';
  return <View style={[today.next, compact && today.compactNext]}>
    <View style={today.lessonIcon}><Icon name="book" size={23} /></View>
    <View style={today.nextCopy}>
      <Text style={s.eyebrow}>{progress.completed ? 'Last lesson' : started ? 'Continue learning' : 'Your next lesson'}</Text>
      <Text accessibilityRole="header" style={s.heading}>{lesson.subtitle}</Text>
      <Text style={s.muted}>{lesson.outcome}</Text>
      <View style={today.nextMeta}>
        <Badge>{lesson.level === 'foundation' ? 'Foundations' : lesson.level}</Badge>
        <Icon name="clock" size={15} color={colors.muted} />
        <Text style={s.muted}>{lesson.durationMinutes} min · {lesson.vocabulary.length} useful words</Text>
        <Badge>{lesson.role}</Badge>
        {started && <Text style={[s.muted, today.accent]}>{progress.completed ? 'Session saved' : `${progress.viewedIds.size} words explored`}</Text>}
      </View>
    </View>
    <View style={compact ? today.compactAction : today.nextAction}><Button primary onPress={() => onOpen(lesson)}>{action}</Button></View>
  </View>;
}

function StarterTopic({ topic, index, onSelect }: { topic: LessonTopic; index: number; onSelect: (name: string) => void }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Explore ${topic.name}`} onPress={() => onSelect(topic.name)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [today.topic, (pressed || hovered) && { backgroundColor: colors.greenSoft }, focused && s.focus]}>
    <View style={[today.topicIcon, { backgroundColor: starterBackgrounds[index] }]}><Icon name={starterIcons[index]} size={20} /></View>
    <View style={today.topicCopy}>
      <Text style={today.topicName}>{topic.name}</Text>
      <Text style={s.muted}>{topic.lessons.length} lessons · {topic.vocabulary.length} words</Text>
    </View>
    <Icon name="chevron" size={16} color={colors.forest} />
  </Pressable>;
}

const today = StyleSheet.create({
  screen: { gap: 28 },
  intro: { flexDirection: 'row', gap: 28, alignItems: 'stretch' },
  compactIntro: { flexDirection: 'column', gap: 16 },
  introCopy: { flex: 1, minWidth: 0, gap: 15, justifyContent: 'center', paddingVertical: 6 },
  compactIntroCopy: { flex: 0, flexBasis: 'auto', gap: 11, paddingVertical: 0 },
  level: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 5, paddingHorizontal: 9, backgroundColor: colors.greenSoft, borderRadius: 20 },
  levelDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#53815D' },
  accent: { color: colors.forest },
  mediumHero: { fontSize: 50, lineHeight: 52, letterSpacing: -2.4 },
  compactHero: { fontSize: 42, lineHeight: 44, letterSpacing: -2 },
  description: { color: colors.muted, fontSize: 16, lineHeight: 25, maxWidth: 360 },
  photo: { flex: 1.16, minWidth: 0, minHeight: 278, borderRadius: 21, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'flex-start', padding: 16, backgroundColor: colors.green },
  photoImage: { width: '100%', height: '100%' },
  compactPhoto: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', minHeight: 0, width: '100%', height: 152, borderRadius: 16, padding: 10 },
  phrase: { flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 12, backgroundColor: colors.card, padding: 10, paddingRight: 15, borderWidth: 1, borderColor: colors.line },
  phraseIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.goldSoft },
  phraseFrench: { color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: '800' },
  phraseEnglish: { color: colors.muted, fontSize: 12, lineHeight: 16 },
  next: { backgroundColor: '#FFF9DE', borderWidth: 1, borderColor: '#E9DEAE', borderBottomWidth: 3, borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  compactNext: { flexWrap: 'wrap', gap: 12, padding: 15 },
  lessonIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  nextCopy: { flex: 1, gap: 5, minWidth: 0 },
  nextMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 7, marginTop: 3 },
  nextAction: { alignSelf: 'center' },
  compactAction: { flexBasis: '100%' },
  topics: { gap: 12 },
  sectionHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center' },
  topicGrid: { flexDirection: 'row', gap: 12 },
  compactTopicGrid: { flexDirection: 'column' },
  topic: { flex: 1, minWidth: 0, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderBottomWidth: 3, borderRadius: 15, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  topicIcon: { width: 37, height: 37, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  topicCopy: { flex: 1, minWidth: 0, gap: 3 },
  topicName: { color: colors.ink, fontWeight: '700', fontSize: 15, lineHeight: 19 },
});
