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
import { useVisitState } from '../app/WebNavigation';
import { routeHref, topicRouteKey } from '../app/routes';
import { KanaTopicCover, KanaTopicLessonCards } from '../alphabet/KanaTopic';
import { findKanaTopic, kanaTopics, matchesKanaLesson, type KanaTopic } from '../alphabet/kanaTopics';
import { alphabetProgress } from '../alphabet/progress';
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
type BrowseTopic = LessonTopic | KanaTopic;

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
  const scripts = language === 'ja-JP' ? kanaTopics : [];
  const selectedKana = language === 'ja-JP' ? findKanaTopic(selectedTopic) : undefined;
  const selectedWords = topics.find(topic => topic.name === selectedTopic);
  const selected = selectedKana ?? selectedWords;
  const count = selected?.lessons.length ?? 0;
  const lessonCount = `${count} short ${count === 1 ? 'lesson' : 'lessons'}`;
  const visibleTopics = [
    ...scripts.filter(topic => topic.lessons.some(lesson => matchesKanaLesson(lesson, query, level))),
    ...topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level))),
  ];
  const topicLessons = selectedWords?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];
  const kanaLessonIds = new Set(selectedKana?.lessons.filter(lesson => matchesKanaLesson(lesson, query, level)).map(lesson => lesson.id));
  const topicCount = topics.length + scripts.length;
  const filters = <CatalogueFilters search={search} lessons={lessons} compact={phone} hasKana={scripts.length > 0} kanaTopic={!!selectedKana} />;

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
        {!phone && <View style={layout.topicCover}><CatalogueTopicCover key={selected.name} topic={selected} /></View>}
      </View>
    </> : <View style={layout.libraryIntro}>
      <Text accessibilityRole="header" aria-level={1} style={[s.title, phone && s.compactTitle]}>Explore topics</Text>
      <Text style={s.muted}>{topicCount} {scripts.length ? 'topics' : 'everyday topics'} · {[...new Set([
        ...(scripts.length ? ['Foundations'] : []),
        ...lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level),
      ])].join(' / ')}</Text>
    </View>}
    {(!selected || !compactLibrary) && filters}
    {!selected ? <>
      {!topicCount ? <View style={s.card}><Text style={s.heading}>No topics available.</Text>
        <Text style={s.body}>Your lesson catalogue is empty. Try loading the published catalogue from Profile.</Text></View>
        : !visibleTopics.length && <EmptyResults onClear={clearFilters} />}
      {!!visibleTopics.length && (query.trim() || level !== 'All') && <Text accessibilityLiveRegion="polite" style={layout.topicDetail}>{visibleTopics.length} {visibleTopics.length === 1 ? 'topic' : 'topics'}</Text>}
      {!!visibleTopics.length && <TopicGrid topics={visibleTopics} model={model} language={language} onSelect={onSelectTopic} disabled={disabled} />}
    </> : selectedKana ? <>
      <KanaTopicLessonCards topic={selectedKana} visibleIds={kanaLessonIds} model={model} headingId={lessonHeadingId}
        compact={phone} disabled={disabled} afterFirst={compactLibrary ? filters : undefined} />
      {!kanaLessonIds.size && <EmptyResults onClear={clearFilters} />}
    </> : selectedWords && <>
      <TopicLessonCards language={language} lessons={selectedWords.lessons} visibleLessons={topicLessons}
        headingId={lessonHeadingId} events={model.events} progressAvailable={!model.loadError} compact={phone}
        afterFirst={compactLibrary ? filters : undefined}
        onOpen={onOpen} disabled={disabled} />
      {!topicLessons.length && <EmptyResults onClear={clearFilters} />}
      <TopicVocabulary topic={selectedWords} filteredLessons={topicLessons} query={query} model={model} language={language} />
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
      <Text style={layout.topicDetail}>{topic.vocabulary.length} words and phrases</Text>
    </View>
    <View nativeID={contentId} style={expanded ? layout.wordBank : { display: 'none' }}>
      {expanded && <>
        <Text accessibilityRole="header" aria-level={2} style={s.heading}>Vocabulary · {words.length}</Text>
        {!words.length && <Text style={s.muted}>No vocabulary matches these filters.</Text>}
        {!!words.length && <View style={layout.wordList}>
          {words.map((entry, index) => <View key={`${topic.name}:${entry.id}`} style={index > 0 && layout.wordRule}>
            <VocabularyCard entry={entry} model={model} language={language} study />
          </View>)}
        </View>}
      </>}
    </View>
  </View>;
}

function CatalogueFilters({ search, lessons, compact, hasKana, kanaTopic }: {
  search: CatalogueSearch; lessons: readonly Lesson[]; compact: boolean; hasKana: boolean; kanaTopic: boolean;
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
      <TextInput ref={input} accessibilityLabel="Search lessons" placeholder={kanaTopic ? 'Search kana lessons'
        : compact ? 'Search topics and words' : 'Search topics, words, readings or meanings'}
        placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false}
        value={search.query} onChangeText={search.onQueryChange} style={layout.searchInput}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      {!!search.query && <Button compact quiet label="Clear search" onPress={clearSearch}>{compact ? '×' : 'Clear'}</Button>}
    </View>
    {!kanaTopic && <View role="group" accessibilityLabel="Lesson levels" style={[s.row, layout.levels]}>
      {levels.filter(item => item.value === 'All' || (item.value === 'foundation' && hasKana)
        || lessons.some(lesson => lesson.level === item.value)).map(item =>
        <Button key={item.value} compact selected={search.level === item.value} label={item.label}
          onPress={() => search.onLevelChange(item.value)}>{item.name}</Button>)}
    </View>}
  </View>;
}

function CatalogueTopicCover({ topic, thumbnail }: { topic: BrowseTopic; thumbnail?: boolean }) {
  return 'script' in topic ? <KanaTopicCover topic={topic} thumbnail={thumbnail} />
    : <TopicCover topic={topic} hero thumbnail={thumbnail} />;
}

function TopicGrid({ topics, model, language, disabled, onSelect }: {
  topics: BrowseTopic[]; model: LearningModel; language: TargetLanguage; disabled: boolean; onSelect: (name: string) => void;
}) {
  const [gridWidth, setGridWidth] = useState(0);
  const columns = gridWidth >= 740 ? 3 : gridWidth >= 480 ? 2 : 1;
  const width = columns === 1 ? '100%' : (gridWidth - tileGap * (columns - 1)) / columns;
  const kanaCompletions = language === 'ja-JP' && !model.loadError ? alphabetProgress(model.events).completedIds : undefined;
  return <View onLayout={event => setGridWidth(Math.floor(event.nativeEvent.layout.width))} style={[s.split, { gap: tileGap }]}>
    {topics.map(topic => <TopicTile key={topic.name} topic={topic} width={width} events={model.events} kanaCompletions={kanaCompletions}
      language={language} disabled={disabled} compact={columns === 1} onSelect={() => onSelect(topic.name)} />)}
  </View>;
}

function TopicTile({ topic, width, events, kanaCompletions, language, disabled, compact, onSelect }: {
  topic: BrowseTopic; width: number | '100%'; events: LearningModel['events']; kanaCompletions?: ReadonlySet<string>;
  language: TargetLanguage; disabled: boolean; compact: boolean; onSelect: () => void;
}) {
  const summaryId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const completed = 'script' in topic ? topic.lessons.filter(lesson => kanaCompletions?.has(lesson.id)).length
    : topic.lessons.filter(lesson => lessonProgress(lesson, events).completed).length;
  const levelNames = 'script' in topic ? 'Foundations'
    : [...new Set(topic.lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' · ');
  const sample = 'script' in topic ? '' : topic.vocabulary.slice(0, 2).map(entry => entry.target).join(' · ');
  const lessonCount = `${topic.lessons.length} ${topic.lessons.length === 1 ? 'lesson' : 'lessons'}`;
  const size = 'script' in topic ? lessonCount : `${topic.vocabulary.length} words · ${lessonCount}`;
  const published = topic.lessons.filter(lesson => lesson.status === 'published').length;
  const status = published === topic.lessons.length ? 'Published' : published ? 'Includes drafts' : 'Draft';
  const href = routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) });
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  return <Pressable accessibilityRole="button" accessibilityLabel={`Topic ${topic.name}`} aria-describedby={summaryId}
    accessibilityState={{ disabled }} disabled={disabled} {...routePress(disabled ? undefined : href, onSelect)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
    style={({ pressed }) => [s.card, layout.tile, compact && layout.tileCompact, { width }, !disabled && hovered && layout.tileHover, focused && layout.focus,
      pressed && { opacity: tokens.opacity.pressed }, disabled && { opacity: tokens.opacity.disabled }]}>
    <View style={[layout.tileArt, compact && layout.tileArtCompact]}><CatalogueTopicCover topic={topic} thumbnail={compact} /></View>
    <View style={layout.tileBody}>
      <View style={layout.tileTitle}>
        <Text style={[s.heading, layout.tileName]}>{topic.name}</Text>
        <Icon name="arrow-right" size={18} color={colors.primary} />
      </View>
      {!compact && !!sample && <Text style={layout.sample} {...languageProps}>{sample}</Text>}
      <View nativeID={summaryId} style={layout.tileSummary}>
        <Text style={layout.tileCount}>{size}</Text>
        <Text style={layout.sample}>{levelNames} · {status}{completed ? ` · ${completed} complete` : ''}</Text>
      </View>
    </View>
  </Pressable>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}><Text style={s.heading}>No matches.</Text><Text style={s.muted}>Try another search or level.</Text><View style={s.row}><Button compact onPress={onClear}>Clear search and filters</Button></View></View>;
}

const layout = StyleSheet.create({
  catalogue: { gap: tokens.space.xl, minWidth: 0 },
  libraryIntro: { gap: tokens.space.xs },
  mobileTopic: { gap: tokens.space.md },
  topicHeader: { minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: tokens.space.lg },
  topicIntro: { flex: 1, minWidth: 0, gap: tokens.space.xs },
  breadcrumb: { gap: tokens.space.xs },
  topicDetail: { ...tokens.typography.caption, color: colors.muted, fontVariant: ['tabular-nums'] },
  mobileTitle: { fontSize: 28, lineHeight: 36, letterSpacing: -0.5 },
  topicCover: { width: 184, borderRadius: tokens.radius.md, overflow: 'hidden' },
  vocabulary: { minWidth: 0, borderTopColor: colors.line, borderTopWidth: 1, paddingTop: tokens.space.sm, gap: tokens.space.md },
  vocabularyHeader: { justifyContent: 'space-between', gap: tokens.space.xs },
  wordBank: { minWidth: 0, gap: tokens.space.md },
  wordList: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: tokens.radius.card, borderWidth: 1, paddingHorizontal: 12 },
  wordRule: { borderTopColor: colors.line, borderTopWidth: 1 },
  filters: { gap: tokens.space.sm },
  search: { minHeight: tokens.control.inputHeight, minWidth: 0, flexDirection: 'row', alignItems: 'center',
    gap: tokens.space.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.inputBorder,
    borderRadius: tokens.radius.input, paddingLeft: 12, paddingRight: 4 },
  searchInput: { ...tokens.typography.muted, color: colors.ink, minWidth: 0, minHeight: tokens.control.inputHeight,
    flex: 1, paddingVertical: 8, paddingRight: 8, outlineWidth: 0 },
  levels: { gap: tokens.space.xs },
  focus: { outlineColor: colors.focusRing, outlineWidth: tokens.focus.outlineWidth, outlineOffset: 2, outlineStyle: 'solid' },
  tile: { minWidth: 0, flexShrink: 1, gap: 0, padding: 8, boxShadow: 'none' },
  tileCompact: { flexDirection: 'row', alignItems: 'center' },
  tileHover: { backgroundColor: colors.sand },
  tileArt: { borderRadius: tokens.radius.sm, overflow: 'hidden' },
  tileArtCompact: { width: 64, height: 72, flexShrink: 0 },
  tileBody: { padding: 12, gap: tokens.space.xs, flex: 1, minWidth: 0 },
  tileTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space.sm },
  tileName: { ...tokens.typography.compactHeading, flexShrink: 1, fontSize: 20, lineHeight: 26 },
  sample: { ...tokens.typography.caption, color: colors.muted },
  tileSummary: { gap: 2, marginTop: 'auto', paddingTop: 8 },
  tileCount: { ...tokens.typography.caption, color: colors.ink, fontVariant: ['tabular-nums'] },
});
