import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getVocabularyPhoto } from '@smartlingo/content';
import { groupLessonTopics, lessonProgress, matchesLesson, matchesVocabulary, normalizeSearch,
  type CatalogueLevel, type Lesson, type LessonTopic } from '@smartlingo/domain';
import { Button } from './controls';
import { Icon, type IconName } from './Icon';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { VocabularyCard } from './VocabularyCard';

const levels = [
  { value: 'All', name: 'All levels', label: 'All levels' },
  { value: 'foundation', name: 'Foundations', label: 'Foundations level' },
  { value: 'A1', name: 'A1', label: 'A1 level' },
  { value: 'A2', name: 'A2', label: 'A2 level' },
] as const;

const topicMarks: Partial<Record<string, IconName>> = {
  greetings: 'brand',
  essentials: 'practice',
  numbers: 'numbers',
  calendar: 'clock',
  opinions: 'practice',
};
const gridGap = 14;

export function TopicCatalogue({ lessons, model, onOpen, practice, selectedTopic, onSelectTopic }: {
  lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; practice: boolean;
  selectedTopic: string | null; onSelectTopic: (name: string | null) => void;
}) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<CatalogueLevel>('All');
  const lessonHeading = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => { setQuery(''); setLevel('All'); }, [selectedTopic]);
  const topics = groupLessonTopics(lessons);
  const selected = topics.find(topic => topic.name === selectedTopic);
  const visibleTopics = selected ? [] : topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level)));
  const topicLessons = selected?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];
  const topicQuery = selected && normalizeSearch(selected.name).includes(normalizeSearch(query));
  const words = groupLessonTopics(topicLessons).flatMap(topic => topic.vocabulary)
    .filter(entry => topicQuery || matchesVocabulary(entry, query));

  function clearFilters() {
    setQuery('');
    setLevel('All');
  }

  return <View style={layout.catalogue}>
    {selected && <View style={s.row}><Button onPress={() => onSelectTopic(null)}>← All topics</Button></View>}
    <View style={layout.headingGroup}>
      <Text accessibilityRole="header" style={s.title}>{selected?.name ?? (practice ? 'Choose your practice.' : 'Explore topics')}</Text>
      <Text style={s.muted}>{selected ? `${selected.vocabulary.length} words · ${selected.lessons.length} short lessons`
        : `${topics.length} everyday topics · ${lessons.some(lesson => lesson.level === 'foundation') ? 'Foundations, A1–A2' : 'A1–A2'}`}</Text>
    </View>
    <CatalogueFilters query={query} onQuery={setQuery} level={level} onLevel={setLevel} />
    {selected ? <>
      <View style={layout.section}>
        <View style={[s.row, layout.distributed]}>
          <Text accessibilityRole="header" style={s.heading}>Vocabulary · {words.length}</Text>
          {Platform.OS === 'web' && !!topicLessons.length && <Button label="Jump to short lessons" onPress={() => lessonHeading.current?.focus()}>Short lessons ↓</Button>}
        </View>
        {!topicLessons.length ? <EmptyResults onClear={clearFilters} />
          : !words.length && <Text style={s.muted}>No word matches this search. The lesson matches its title or situation.</Text>}
        <View style={[s.split, { gap: 18 }]}>{words.map(entry =>
          <View key={entry.id} style={layout.word}><VocabularyCard entry={entry} model={model} /></View>
        )}</View>
      </View>
      {!!topicLessons.length && <View style={layout.section}>
        <View ref={lessonHeading} tabIndex={-1} accessibilityRole="header">
          <Text style={s.heading}>Short lessons</Text>
        </View>
        <View style={layout.lessonList}>
          {topicLessons.map((lesson, index) => <LessonRow key={lesson.id} lesson={lesson}
            model={model} separated={index > 0} onOpen={() => onOpen(lesson)} />)}
        </View>
      </View>}
    </> : !topics.length ? <View style={s.card}>
      <Text style={s.heading}>No topics available.</Text>
      <Text style={s.body}>Your lesson catalogue is empty. Try loading the published catalogue from Profile.</Text>
    </View> : !visibleTopics.length ? <EmptyResults onClear={clearFilters} />
      : <TopicGrid topics={visibleTopics} model={model} onSelect={onSelectTopic} />}
  </View>;
}

function CatalogueFilters({ query, onQuery, level, onLevel }: {
  query: string; onQuery: (value: string) => void; level: CatalogueLevel; onLevel: (value: CatalogueLevel) => void;
}) {
  const search = useRef<ComponentRef<typeof TextInput>>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  return <View style={layout.filters}>
    <View style={[layout.search, searchFocused && [layout.focusBorder, s.focus]]}>
      <View aria-hidden style={layout.searchIcon}><View style={layout.searchHandle} /></View>
      <TextInput ref={search} accessibilityLabel="Search lessons" placeholder="Search topics or words"
        placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false}
        value={query} onChangeText={onQuery} style={layout.searchInput}
        onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
      {!!query && <Button label="Clear search" onPress={() => { onQuery(''); search.current?.focus(); }}>×</Button>}
    </View>
    <View role="group" accessibilityLabel="Lesson levels" style={layout.levelFilters}>
      {levels.map(item => <Button key={item.value} selected={level === item.value} label={item.label} onPress={() => onLevel(item.value)}>{item.name}</Button>)}
    </View>
  </View>;
}

function TopicGrid({ topics, model, onSelect }: {
  topics: LessonTopic[]; model: LearningModel; onSelect: (name: string) => void;
}) {
  const [width, setWidth] = useState(0);
  const columns = width >= 680 ? 3 : width >= 454 ? 2 : 1;
  const cardWidth = columns === 1 ? '100%' : (width - (columns - 1) * gridGap) / columns;

  return <View style={layout.grid} onLayout={event => setWidth(Math.floor(event.nativeEvent.layout.width))}>
    {topics.map(topic => <TopicCard key={topic.name} topic={topic} width={cardWidth} model={model} onSelect={() => onSelect(topic.name)} />)}
  </View>;
}

function TopicCard({ topic, width, model, onSelect }: {
  topic: LessonTopic; width: number | '100%'; model: LearningModel; onSelect: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const completed = topic.lessons.filter(lesson => lessonProgress(lesson, model.events).completed).length;
  const photo = topic.vocabulary.map(entry => getVocabularyPhoto(entry.id, entry.target)).find(item => item?.kind === 'literal');
  const levelNames = [...new Set(topic.lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' · ');
  const published = topic.lessons.filter(lesson => lesson.status === 'published').length;
  const status = published === topic.lessons.length ? 'Published' : published > 0 ? 'Includes drafts' : 'Draft';
  const count = `${topic.vocabulary.length} words · ${topic.lessons.length} lessons`;
  const firstLessonId = topic.lessons[0].id;
  const slug = firstLessonId.split('.')[1];
  const summaryId = `topic-summary-${firstLessonId}`;

  return <Pressable accessibilityRole="button" accessibilityLabel={`Explore ${topic.name} →`}
    accessibilityHint={`${count}. ${levelNames}. ${status}.`} aria-describedby={summaryId}
    onPress={onSelect} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [s.card, layout.topicCard, { width }, hovered && layout.topicHovered,
      focused && [layout.focusBorder, s.focus], pressed && { opacity: 0.8 }]}>
    <View style={[s.row, layout.distributed]}>
      <View aria-hidden style={layout.topicMark}>
        {photo && photo.uri !== failedPhoto ? <Image accessible={false} source={{ uri: photo.uri }}
          onError={() => setFailedPhoto(photo.uri)} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          : <Icon name={topicMarks[slug] ?? 'book'} color={colors.forest} />}
      </View>
      <View style={[layout.topicArrow, hovered && layout.topicArrowHovered]}>
        <Icon name="arrow" size={18} color={hovered ? colors.forest : colors.muted} />
      </View>
    </View>
    <View style={layout.headingGroup}>
      <Text style={layout.topicTitle}>{topic.name}</Text>
      <Text numberOfLines={2} style={s.muted}>{topic.vocabulary.slice(0, 2).map(entry => entry.target).join(' · ')}</Text>
    </View>
    <View nativeID={summaryId} style={layout.topicFooter}>
      <Text style={layout.topicCount}>{count}</Text>
      <Text style={layout.topicMeta}>{levelNames} · {status}{completed ? ` · ${completed} sessions saved` : ''}</Text>
    </View>
  </Pressable>;
}

function LessonRow({ lesson, model, separated, onOpen }: {
  lesson: Lesson; model: LearningModel; separated: boolean; onOpen: () => void;
}) {
  const progress = lessonProgress(lesson, model.events);
  const level = lesson.level === 'foundation' ? 'Foundations' : lesson.level;
  return <View style={[layout.lessonRow, separated && layout.lessonSeparated]}>
    <View style={layout.lessonDetails}>
      <Text style={layout.topicTitle}>{lesson.subtitle}</Text>
      <Text style={s.muted}>{level} · {lesson.vocabulary.length} words · {lesson.durationMinutes} min · {lesson.status === 'published' ? 'Published' : 'Draft'}</Text>
      {(progress.completed || !!progress.viewedIds.size) && <Text style={layout.saved}>
        {progress.completed ? 'Session saved' : `${progress.viewedIds.size} words explored`}
      </Text>}
    </View>
    <Button label={`Open ${lesson.subtitle}`} onPress={onOpen}>
      {progress.completed ? 'Revisit →' : progress.viewedIds.size ? 'Continue →' : 'Practise →'}
    </Button>
  </View>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>No matches.</Text>
    <Text style={s.body}>Try a topic, French word or English meaning.</Text>
    <View style={s.row}><Button onPress={onClear}>Clear search and filters</Button></View>
  </View>;
}

const layout = StyleSheet.create({
  catalogue: { gap: 24, minWidth: 0 },
  headingGroup: { gap: 5, minWidth: 0 },
  section: { gap: 12, minWidth: 0 },
  distributed: { justifyContent: 'space-between' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, minWidth: 0 },
  search: {
    flex: 1, flexBasis: 290, minWidth: 0, minHeight: 46, flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.card,
  },
  searchInput: {
    flex: 1, minWidth: 0, minHeight: 44, padding: 0, fontSize: 15, color: colors.ink,
    ...Platform.select({ web: { outlineWidth: 0 } }),
  },
  searchIcon: { width: 13, height: 13, borderWidth: 1.6, borderRadius: 7, borderColor: colors.muted, marginRight: 3, marginBottom: 2 },
  searchHandle: { position: 'absolute', width: 6, height: 1.6, left: 8, top: 10, transform: [{ rotate: '45deg' }], backgroundColor: colors.muted, borderRadius: 1 },
  levelFilters: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, minWidth: 0, maxWidth: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: gridGap },
  topicCard: { gap: 12, minWidth: 0, padding: 16, borderRadius: 17, borderBottomWidth: 3 },
  topicHovered: { borderColor: colors.forest },
  focusBorder: { borderColor: colors.focus },
  topicMark: {
    width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 11, overflow: 'hidden', backgroundColor: colors.goldSoft,
  },
  topicArrow: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  topicArrowHovered: { backgroundColor: colors.greenSoft },
  topicTitle: { color: colors.ink, fontSize: 17, lineHeight: 22, fontWeight: '700' },
  topicFooter: { marginTop: 'auto', paddingTop: 10, borderTopWidth: 1, borderColor: colors.line, gap: 3 },
  topicCount: { color: colors.ink, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  topicMeta: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  lessonList: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, backgroundColor: colors.card },
  lessonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: 14, gap: 10 },
  lessonSeparated: { borderTopWidth: 1, borderColor: colors.line },
  lessonDetails: { flexGrow: 1, flexShrink: 1, flexBasis: 155, minWidth: 0, gap: 4 },
  saved: { color: colors.forest, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  word: { flexGrow: 1, flexShrink: 1, flexBasis: 300, minWidth: 0 },
});
