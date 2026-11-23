import { useId, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { groupLessonTopics, languageNames, lessonProgress, matchesLesson, matchesVocabulary, normalizeSearch,
  type CatalogueLevel, type Lesson, type LessonTopic, type TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { Icon } from './Icon';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { VocabularyCard } from './VocabularyCard';
import { TopicCover } from './TopicCover';
import { TopicLessonCards } from './TopicLessonCards';
import { routeHref, topicRouteKey } from '../app/routes';
import { routePress } from './routePress';

export type CatalogueSearch = {
  query: string; level: CatalogueLevel;
  onQueryChange: (value: string) => void; onLevelChange: (value: CatalogueLevel) => void;
};

const levels = [
  { value: 'All', name: 'All levels', label: 'All levels' },
  { value: 'foundation', name: 'Foundations', label: 'Foundations level' },
  { value: 'A1', name: 'A1', label: 'A1 level' },
  { value: 'A2', name: 'A2', label: 'A2 level' },
  { value: 'B1', name: 'B1', label: 'B1 level' },
] as const;
const tileGap = tokens.space.lg;

export function TopicCatalogue({ language, lessons, topics, model, onOpen, selectedTopic, onSelectTopic, search, disabled }: {
  language: TargetLanguage; lessons: Lesson[]; topics: LessonTopic[]; model: LearningModel; onOpen: (lesson: Lesson) => void;
  selectedTopic: string | null; onSelectTopic: (name: string | null) => void;
  search: CatalogueSearch; disabled: boolean;
}) {
  const { query, level, onQueryChange: setQuery, onLevelChange: setLevel } = search;
  const phone = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const lessonHeadingId = useId();
  const selected = topics.find(topic => topic.name === selectedTopic);
  const visibleTopics = topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level)));
  const topicLessons = selected?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];
  const topicQuery = selected && normalizeSearch(selected.name).includes(normalizeSearch(query));
  const words = groupLessonTopics(topicLessons).flatMap(topic => topic.vocabulary)
    .filter(entry => topicQuery || matchesVocabulary(entry, query));

  function clearFilters() {
    setQuery('');
    setLevel('All');
  }

  function jumpToLessons() {
    if (Platform.OS !== 'web') return;
    const heading = document.getElementById(lessonHeadingId);
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start', inline: 'nearest' });
  }

  return <View style={{ gap: 16, minWidth: 0 }}>
    {selected ? <>
      <View style={[s.row, { gap: 8 }]}>
        <Button compact quiet label="All topics" disabled={disabled} onPress={() => onSelectTopic(null)}>← All topics</Button>
        <Text style={s.muted}>{languageNames[language]} / Library</Text>
      </View>
      <View style={{ flexDirection: phone ? 'column' : 'row', alignItems: 'stretch', gap: 16 }}>
        <View style={{ flex: 1, minWidth: 0, gap: 6, justifyContent: 'center' }}>
          <Text accessibilityRole="header" style={[s.title, phone && s.compactTitle]}>{selected.name}</Text>
          <Text style={s.muted}>{selected.vocabulary.length} words · {selected.lessons.length} short {selected.lessons.length === 1 ? 'lesson' : 'lessons'}</Text>
        </View>
        <View style={{ width: phone ? '100%' : 250, maxHeight: phone ? 104 : 136, minWidth: 0, borderRadius: 14, overflow: 'hidden', justifyContent: 'center' }}><TopicCover key={selected.name} topic={selected} hero /></View>
      </View>
    </> : <View style={{ gap: 4 }}>
      <Text style={s.eyebrow}>{languageNames[language]} / Library</Text>
      <Text accessibilityRole="header" style={[s.title, phone && s.compactTitle]}>Explore topics</Text>
      <Text style={s.muted}>{topics.length} everyday topics · {[...new Set(lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' / ')}</Text>
    </View>}
    <CatalogueFilters search={search} lessons={lessons} compact={phone} />
    {!selected ? <>
      {!topics.length ? <View style={s.card}><Text style={s.heading}>No topics available.</Text>
        <Text style={s.body}>Your lesson catalogue is empty. Try loading the published catalogue from Profile.</Text></View>
        : !visibleTopics.length && <EmptyResults onClear={clearFilters} />}
      {!!visibleTopics.length && (query.trim() || level !== 'All') && <Text accessibilityLiveRegion="polite" style={s.muted}>{visibleTopics.length} {visibleTopics.length === 1 ? 'topic' : 'topics'} to explore</Text>}
      {!!visibleTopics.length && <TopicGrid topics={visibleTopics} model={model} language={language} onSelect={onSelectTopic} disabled={disabled} />}
    </> : <>
      {topicLessons.length ? <>
        <View style={[s.row, layout.sectionHeading]}>
          <Text accessibilityRole="header" style={s.heading}>Vocabulary · {words.length}</Text>
          {Platform.OS === 'web' && <Button compact trailingIcon="chevron-down"
            label="Jump to lessons" onPress={jumpToLessons}>Jump to lessons</Button>}
        </View>
        {!words.length && <Text style={s.muted}>No word matches this search. The lesson matches its title or situation.</Text>}
        <View style={[s.split, { gap: 16 }]}>{words.map(entry =>
          <View key={`${selected.name}:${entry.id}`} style={{ flexGrow: 1, flexShrink: 1, flexBasis: phone ? '100%' : 350, minWidth: 0 }}>
            <VocabularyCard entry={entry} model={model} language={language} />
          </View>)}</View>
        <TopicLessonCards language={language} lessons={selected.lessons} visibleLessons={topicLessons}
          headingId={lessonHeadingId} events={model.events} progressAvailable={!model.loadError} compact={phone}
          onOpen={onOpen} disabled={disabled} />
      </> : <EmptyResults onClear={clearFilters} />}
    </>}
  </View>;
}

function CatalogueFilters({ search, lessons, compact }: {
  search: CatalogueSearch; lessons: readonly Lesson[]; compact: boolean;
}) {
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);

  function clearSearch() {
    search.onQueryChange('');
    input.current?.focus();
  }

  return <View style={layout.filters}>
    <View style={[layout.search, focused && layout.focus]}>
      <Icon name="search" color={colors.muted} />
      <TextInput ref={input} accessibilityLabel="Search lessons" placeholder={compact ? 'Search topics and words' : 'Search topics, words, readings or English meanings'}
        placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false}
        value={search.query} onChangeText={search.onQueryChange} style={layout.searchInput}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      {!!search.query && <Button compact quiet label="Clear search" onPress={clearSearch}>{compact ? '×' : 'Clear'}</Button>}
    </View>
    <View role="group" accessibilityLabel="Lesson levels" style={[s.row, layout.levels]}>
      {levels.filter(item => item.value === 'All' || lessons.some(lesson => lesson.level === item.value)).map(item =>
        <Button key={item.value} compact selected={search.level === item.value} label={item.label}
          onPress={() => search.onLevelChange(item.value)}>{item.name}</Button>)}
    </View>
  </View>;
}

function TopicGrid({ topics, model, language, disabled, onSelect }: {
  topics: LessonTopic[]; model: LearningModel; language: TargetLanguage; disabled: boolean; onSelect: (name: string) => void;
}) {
  const [gridWidth, setGridWidth] = useState(0);
  const columns = gridWidth >= 740 ? 3 : gridWidth >= 480 ? 2 : 1;
  const width = columns === 1 ? '100%' : (gridWidth - tileGap * (columns - 1)) / columns;
  return <View onLayout={event => setGridWidth(Math.floor(event.nativeEvent.layout.width))} style={[s.split, { gap: tileGap }]}>
    {topics.map(topic => <TopicTile key={topic.name} topic={topic} width={width} events={model.events}
      language={language} disabled={disabled} onSelect={() => onSelect(topic.name)} />)}
  </View>;
}

function TopicTile({ topic, width, events, language, disabled, onSelect }: {
  topic: LessonTopic; width: number | '100%'; events: LearningModel['events'];
  language: TargetLanguage; disabled: boolean; onSelect: () => void;
}) {
  const summaryId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const completed = topic.lessons.filter(lesson => lessonProgress(lesson, events).completed).length;
  const levelNames = [...new Set(topic.lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' · ');
  const published = topic.lessons.filter(lesson => lesson.status === 'published').length;
  const status = published === topic.lessons.length ? 'Published' : published ? 'Includes drafts' : 'Draft';
  const href = routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) });
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  return <Pressable accessibilityRole="button" accessibilityLabel={`Topic ${topic.name}`} aria-describedby={summaryId}
    accessibilityState={{ disabled }} disabled={disabled} {...routePress(disabled ? undefined : href, onSelect)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [s.card, layout.tile, { width }, !disabled && hovered && layout.tileHover, focused && layout.focus,
      pressed && { opacity: tokens.opacity.pressed }, disabled && { opacity: tokens.opacity.disabled }]}>
    <View style={layout.tileArt}><TopicCover topic={topic} hero /></View>
    <View style={layout.tileBody}>
      <View style={layout.tileTitle}>
        <Text style={[s.heading, layout.tileName]}>{topic.name}</Text>
        <View style={[layout.tileArrow, hovered && layout.tileArrowHover]}><Icon name="arrow-right" size={18} color={colors.primary} /></View>
      </View>
      {topic.vocabulary.length > 0 && <Text style={layout.sample} numberOfLines={2} {...languageProps}>
        {topic.vocabulary.slice(0, 2).map(entry => entry.target).join(' · ')}
      </Text>}
      <View nativeID={summaryId} style={layout.tileSummary}>
        <Text style={layout.tileCount}>{topic.vocabulary.length} words · {topic.lessons.length} {topic.lessons.length === 1 ? 'lesson' : 'lessons'}</Text>
        <Text style={layout.sample}>{levelNames} · {status}{completed ? ` · ${completed} sessions saved` : ''}</Text>
      </View>
    </View>
  </Pressable>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}><Text style={s.heading}>No matches.</Text><Text style={s.body}>Try a topic, word, reading or English meaning.</Text><Button onPress={onClear}>Clear search and filters</Button></View>;
}

const layout = StyleSheet.create({
  filters: { gap: tokens.space.sm },
  search: { minHeight: tokens.control.inputHeight, minWidth: 0, flexDirection: 'row', alignItems: 'center',
    gap: tokens.space.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder,
    borderRadius: tokens.radius.input, paddingLeft: 13, paddingRight: 3 },
  searchInput: { ...tokens.typography.muted, color: colors.ink, minWidth: 0, minHeight: tokens.control.inputHeight,
    flex: 1, paddingVertical: 8, paddingRight: 7, outlineWidth: 0 },
  levels: { gap: tokens.space.xs, paddingVertical: 3 },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineOffset: 2, outlineStyle: 'solid' },
  sectionHeading: { justifyContent: 'space-between', rowGap: tokens.space.sm, marginTop: tokens.space.sm },
  tile: { minWidth: 0, flexShrink: 1, gap: 0, padding: 0, borderBottomWidth: 3, boxShadow: 'none' },
  tileHover: { borderColor: colors.primary, backgroundColor: colors.sageTint },
  tileArt: { borderTopLeftRadius: tokens.radius.card - 1, borderTopRightRadius: tokens.radius.card - 1, overflow: 'hidden' },
  tileBody: { padding: 13, gap: tokens.space.xs, flex: 1 },
  tileTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space.sm },
  tileName: { ...tokens.typography.compactHeading, flexShrink: 1, fontSize: 20, lineHeight: 26 },
  tileArrow: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.sand, width: 34, height: 34,
    borderRadius: tokens.radius.sm, flexShrink: 0 },
  tileArrowHover: { backgroundColor: colors.goldTint },
  sample: { ...tokens.typography.caption, color: colors.muted },
  tileSummary: { gap: 2, marginTop: 'auto', paddingTop: 8 },
  tileCount: { ...tokens.typography.smallLabel, color: colors.primary },
});
