import { useId, useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { groupLessonTopics, languageNames, lessonProgress, matchesLesson, matchesVocabulary, normalizeSearch,
  type CatalogueLevel, type Lesson, type LessonTopic, type TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { Icon } from './Icon';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { VocabularyList } from './VocabularyList';
import { TopicCover } from './TopicCover';
import { TopicLessonCards } from './TopicLessonCards';
import { useVisitState } from '../app/WebNavigation';
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
  const { width } = useWindowDimensions();
  const phone = width < tokens.layout.compactBreakpoint;
  const compactLibrary = width < tokens.layout.desktopNavBreakpoint;
  const lessonHeadingId = useId();
  const selected = topics.find(topic => topic.name === selectedTopic);
  const count = selected?.lessons.length ?? 0;
  const lessonCount = `${count} short ${count === 1 ? 'lesson' : 'lessons'}`;
  const visibleTopics = topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level)));
  const topicLessons = selected?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];

  function clearFilters() {
    setQuery('');
    setLevel('All');
  }

  return <View style={[layout.catalogue, selected && phone && layout.mobileTopic]}>
    {selected ? <>
      <View style={layout.topicHeader}>
        <View style={layout.topicIntro}>
          <View style={[s.row, layout.breadcrumb]}>
            <Button compact quiet label="All topics" disabled={disabled} icon="arrow-left" onPress={() => onSelectTopic(null)}>All topics</Button>
            <Text style={layout.topicDetail}>{phone ? lessonCount : languageNames[language]}</Text>
          </View>
          <Text accessibilityRole="header" aria-level={1} style={[s.title, phone && layout.mobileTitle]}>{selected.name}</Text>
          {!phone && <Text style={layout.topicDetail}>{lessonCount}</Text>}
        </View>
        {!phone && <View style={layout.topicCover}><TopicCover key={selected.name} topic={selected} hero /></View>}
      </View>
    </> : !phone && <View style={{ gap: 4 }}>
      <Text accessibilityRole="header" style={[s.title, phone && s.compactTitle]}>Explore topics</Text>
    </View>}
    {(!selected || !compactLibrary) && <CatalogueFilters search={search} lessons={lessons} compact={phone} />}
    {!selected ? <>
      {!topics.length ? <Text style={s.body}>No topics available.</Text>
        : !visibleTopics.length && <EmptyResults onClear={clearFilters} />}
      {!!visibleTopics.length && (query.trim() || level !== 'All') && <Text accessibilityLiveRegion="polite" style={s.muted}>{visibleTopics.length} {visibleTopics.length === 1 ? 'topic' : 'topics'}</Text>}
      {!!visibleTopics.length && <TopicGrid topics={visibleTopics} model={model} language={language} onSelect={onSelectTopic} disabled={disabled} compact={phone} />}
    </> : <>
      <TopicLessonCards language={language} lessons={selected.lessons} visibleLessons={topicLessons}
        headingId={lessonHeadingId} events={model.events} progressAvailable={!model.loadError} compact={phone}
        afterFirst={compactLibrary ? <CatalogueFilters search={search} lessons={lessons} compact={phone} /> : undefined}
        onOpen={onOpen} disabled={disabled} />
      {!topicLessons.length && <EmptyResults onClear={clearFilters} />}
      <TopicVocabulary topic={selected} filteredLessons={topicLessons} query={query} model={model} language={language} />
    </>}
  </View>;
}

function TopicVocabulary({ topic, filteredLessons, query, model, language }: {
  topic: LessonTopic; filteredLessons: Lesson[]; query: string; model: LearningModel; language: TargetLanguage;
}) {
  const contentId = useId();
  const [expanded, setExpanded] = useVisitState('topic-vocabulary-expanded', false);
  const matchesTopic = normalizeSearch(topic.name).includes(normalizeSearch(query));
  const words = expanded ? groupLessonTopics(filteredLessons).flatMap(group => group.vocabulary)
    .filter(entry => matchesTopic || matchesVocabulary(entry, query)) : [];

  return <View style={layout.vocabulary}>
    <View style={[s.row, layout.vocabularyHeader]}>
      <Button compact quiet label="Topic vocabulary" icon="book" expanded={expanded} controls={contentId}
        onPress={() => setExpanded(value => !value)}>Topic vocabulary <Text aria-hidden>{expanded ? '−' : '+'}</Text></Button>
      <Text accessibilityRole={expanded ? 'header' : undefined} aria-level={expanded ? 2 : undefined} style={layout.topicDetail}>
        {expanded ? `Vocabulary · ${words.length}` : `${topic.vocabulary.length} words and phrases`}
      </Text>
    </View>
    <View nativeID={contentId} style={expanded ? layout.wordBank : { display: 'none' }}>
      {expanded && <>
        {!words.length && <Text style={s.muted}>No matching words.</Text>}
        <VocabularyList entries={words} model={model} language={language} />
      </>}
    </View>
  </View>;
}

function CatalogueFilters({ search, lessons, compact }: {
  search: CatalogueSearch; lessons: readonly Lesson[]; compact: boolean;
}) {
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);
  const filtersId = useId();
  const [filtersOpen, setFiltersOpen] = useVisitState('topic-filters-open', false);

  function clearSearch() {
    search.onQueryChange('');
    input.current?.focus();
  }

  return <View style={layout.filters}>
    <View style={layout.searchRow}>
      <View style={[layout.search, focused && layout.focus]}>
        <Icon name="search" color={colors.muted} />
        <TextInput ref={input} accessibilityLabel="Search lessons" placeholder={compact ? 'Search topics and words' : 'Search topics, words, readings or English meanings'}
          placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false}
          value={search.query} onChangeText={search.onQueryChange} style={layout.searchInput}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        {!!search.query && <Button compact quiet iconOnly={compact} icon={compact ? 'close' : undefined}
          label="Clear search" onPress={clearSearch}>Clear</Button>}
      </View>
      {compact && <Button compact iconOnly icon="filter" label="Filter lessons" selected={search.level !== 'All'}
        expanded={filtersOpen} controls={filtersOpen ? filtersId : undefined} onPress={() => setFiltersOpen(value => !value)} />}
    </View>
    {(!compact || filtersOpen) && <View nativeID={filtersId} role="group" accessibilityLabel="Lesson levels" style={[s.row, layout.levels]}>
      {levels.filter(item => item.value === 'All' || lessons.some(lesson => lesson.level === item.value)).map(item =>
        <Button key={item.value} compact selected={search.level === item.value} label={item.label}
          onPress={() => search.onLevelChange(item.value)}>{item.name}</Button>)}
    </View>}
  </View>;
}

function TopicGrid({ topics, model, language, disabled, onSelect, compact }: {
  topics: LessonTopic[]; model: LearningModel; language: TargetLanguage; disabled: boolean; onSelect: (name: string) => void;
  compact: boolean;
}) {
  const [gridWidth, setGridWidth] = useState(0);
  const columns = gridWidth >= 740 ? 3 : gridWidth >= 480 ? 2 : 1;
  const width = columns === 1 ? '100%' : (gridWidth - tileGap * (columns - 1)) / columns;
  return <View onLayout={event => setGridWidth(Math.floor(event.nativeEvent.layout.width))} style={[s.split, { gap: compact ? 8 : tileGap }]}>
    {topics.map(topic => <TopicTile key={topic.name} topic={topic} width={width} events={model.events}
      language={language} disabled={disabled} compact={compact} onSelect={() => onSelect(topic.name)} />)}
  </View>;
}

function TopicTile({ topic, width, events, language, disabled, onSelect, compact }: {
  topic: LessonTopic; width: number | '100%'; events: LearningModel['events'];
  language: TargetLanguage; disabled: boolean; onSelect: () => void; compact: boolean;
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
    style={({ pressed }) => [s.card, layout.tile, { width }, compact && layout.phoneTile, !disabled && hovered && layout.tileHover, focused && layout.focus,
      pressed && { opacity: tokens.opacity.pressed }, disabled && { opacity: tokens.opacity.disabled }]}>
    <View style={compact ? layout.phoneTileArt : layout.tileArt}><TopicCover topic={topic} hero thumbnail={compact} /></View>
    <View style={layout.tileBody}>
      <View style={layout.tileTitle}>
        <Text style={[s.heading, layout.tileName, compact && layout.phoneTileName]}>{topic.name}</Text>
        <View style={[layout.tileArrow, hovered && layout.tileArrowHover]}><Icon name="arrow-right" size={18} color={colors.primary} /></View>
      </View>
      {!compact && topic.vocabulary.length > 0 && <Text style={layout.sample} {...languageProps}>
        {topic.vocabulary.slice(0, 2).map(entry => entry.target).join(' · ')}
      </Text>}
      <View nativeID={summaryId} style={!compact && layout.tileSummary}>
        <Text style={layout.tileCount}>{!compact && `${topic.vocabulary.length} words · `}{topic.lessons.length} {topic.lessons.length === 1 ? 'lesson' : 'lessons'}</Text>
        {!compact && <Text style={layout.sample}>{levelNames} · {status}{completed ? ` · ${completed} sessions saved` : ''}</Text>}
      </View>
    </View>
  </Pressable>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}><Text style={s.heading}>No matches.</Text><Text style={s.body}>Try another word or level.</Text><Button onPress={onClear}>Clear search and filters</Button></View>;
}

const layout = StyleSheet.create({
  catalogue: { gap: tokens.space.lg, minWidth: 0 },
  mobileTopic: { gap: tokens.space.md },
  topicHeader: { minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: tokens.space.lg },
  topicIntro: { flex: 1, minWidth: 0, gap: tokens.space.xs },
  breadcrumb: { gap: tokens.space.xs },
  topicDetail: { ...tokens.typography.caption, color: colors.muted },
  mobileTitle: { fontSize: 29, lineHeight: 34, letterSpacing: -0.6 },
  topicCover: { width: 184, borderRadius: tokens.radius.md, overflow: 'hidden' },
  vocabulary: { minWidth: 0, borderTopColor: colors.line, borderTopWidth: 1, paddingTop: tokens.space.sm, gap: tokens.space.md },
  vocabularyHeader: { justifyContent: 'space-between', gap: tokens.space.xs },
  wordBank: { minWidth: 0, gap: tokens.space.md },
  filters: { gap: tokens.space.sm },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  search: { flex: 1, minHeight: tokens.control.inputHeight, minWidth: 0, flexDirection: 'row', alignItems: 'center',
    gap: tokens.space.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder,
    borderRadius: tokens.radius.input, paddingLeft: 13, paddingRight: 3 },
  searchInput: { ...tokens.typography.muted, color: colors.ink, minWidth: 0, minHeight: tokens.control.inputHeight,
    flex: 1, paddingVertical: 8, paddingRight: 7, outlineWidth: 0 },
  levels: { gap: tokens.space.xs, paddingVertical: 3 },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineOffset: 2, outlineStyle: 'solid' },
  tile: { minWidth: 0, flexShrink: 1, gap: 0, padding: 0, borderBottomWidth: 1, boxShadow: 'none' },
  tileHover: { borderColor: colors.primary, backgroundColor: colors.sageTint },
  tileArt: { borderTopLeftRadius: tokens.radius.card - 1, borderTopRightRadius: tokens.radius.card - 1, overflow: 'hidden' },
  phoneTile: { flexDirection: 'row', alignItems: 'center', paddingLeft: 9, borderRadius: 13, borderBottomWidth: 1 },
  phoneTileArt: { width: 51, height: 49, borderRadius: 8, overflow: 'hidden' },
  phoneTileName: { fontSize: 17, lineHeight: 23 },
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
