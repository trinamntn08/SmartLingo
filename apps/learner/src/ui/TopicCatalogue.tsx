import { useState } from 'react';
import { ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { groupLessonTopics, languageNames, lessonProgress, matchesLesson, matchesVocabulary, normalizeSearch,
  type CatalogueLevel, type Lesson, type LessonTopic, type TargetLanguage } from '@smartlingo/domain';
import { Button } from './controls';
import { colors, designTokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { VocabularyCard } from './VocabularyCard';
import { TopicCover } from './TopicCover';
import { routeHref, topicRouteKey } from '../app/routes';

export type CatalogueSearch = {
  query: string; level: CatalogueLevel;
  onQueryChange: (value: string) => void; onLevelChange: (value: CatalogueLevel) => void;
};

export function TopicCatalogue({ language, lessons, topics, model, onOpen, selectedTopic, onSelectTopic, search, disabled }: {
  language: TargetLanguage; lessons: Lesson[]; topics: LessonTopic[]; model: LearningModel; onOpen: (lesson: Lesson) => void;
  selectedTopic: string | null; onSelectTopic: (name: string | null) => void;
  search: CatalogueSearch; disabled: boolean;
}) {
  const { query, level, onQueryChange: setQuery, onLevelChange: setLevel } = search;
  const { width } = useWindowDimensions();
  const phone = width < designTokens.layout.compactBreakpoint;
  const [gridWidth, setGridWidth] = useState(0);
  const columns = gridWidth >= 960 ? 3 : !phone && gridWidth >= 570 ? 2 : 1;
  const selected = topics.find(topic => topic.name === selectedTopic);
  const visibleTopics = topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level)));
  const topicLessons = selected?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];
  const topicQuery = selected && normalizeSearch(selected.name).includes(normalizeSearch(query));
  const words = groupLessonTopics(topicLessons).flatMap(topic => topic.vocabulary)
    .filter(entry => topicQuery || matchesVocabulary(entry, query));

  return <View style={{ gap: 16, minWidth: 0 }}>
    {selected ? <>
      <View style={[s.row, { gap: 8 }]}>
        <Button compact quiet label="All topics" disabled={disabled} onPress={() => onSelectTopic(null)}>← All topics</Button>
        <Text style={s.muted}>{languageNames[language]} / Library</Text>
      </View>
      <View style={{ flexDirection: phone ? 'column' : 'row', alignItems: 'stretch', gap: 16 }}>
        <View style={{ flex: 1, minWidth: 0, gap: 6, justifyContent: 'center' }}>
          <Text accessibilityRole="header" style={[s.title, phone && s.compactTitle]}>{selected.name}</Text>
          <Text style={s.body}>{selected.lessons[0]?.outcome}</Text>
          <Text style={s.muted}>{selected.vocabulary.length} words · {selected.lessons.length} short lessons</Text>
        </View>
        <View style={{ width: phone ? '100%' : 250, maxHeight: phone ? 104 : 136, minWidth: 0, borderRadius: 14, overflow: 'hidden', justifyContent: 'center' }}><TopicCover key={selected.name} topic={selected} hero /></View>
      </View>
    </> : <View style={{ gap: 4 }}>
      <Text style={s.eyebrow}>{languageNames[language]} / Library</Text>
      <Text accessibilityRole="header" style={[s.title, phone && s.compactTitle]}>Explore topics</Text>
      <Text style={s.muted}>{topics.length} everyday topics · {[...new Set(lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' / ')}</Text>
    </View>}
    <View style={{ gap: 10 }}>
      <TextInput accessibilityLabel="Search lessons" placeholder={phone ? 'Search topics and words' : 'Search topics, words, readings or English meanings'}
        value={query} onChangeText={setQuery} style={[s.input, { width: '100%' }]} clearButtonMode="while-editing" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', gap: 6, paddingVertical: 3 }}>
        {(['All', 'foundation', 'A1', 'A2', 'B1'] as const).filter(value => value === 'All' || lessons.some(lesson => lesson.level === value)).map(value => <View key={value} style={{ flexShrink: 0 }}><Button compact quiet selected={level === value}
          label={value === 'All' ? 'All levels' : value === 'foundation' ? 'Foundations level' : `${value} level`} onPress={() => setLevel(value)}>{value === 'All' ? 'All levels' : value === 'foundation' ? 'Foundations' : value}</Button></View>)}
        {!!query.trim() && <Button compact quiet onPress={() => setQuery('')}>Clear search</Button>}
      </ScrollView>
    </View>
    {!selected ? <>
      {!topics.length ? <View style={s.card}><Text style={s.heading}>No topics available.</Text>
        <Text style={s.body}>Your lesson catalogue is empty. Try loading the published catalogue from Profile.</Text></View>
        : !visibleTopics.length && <EmptyResults onClear={() => { setQuery(''); setLevel('All'); }} />}
      {!!visibleTopics.length && (query.trim() || level !== 'All') && <Text accessibilityLiveRegion="polite" style={s.muted}>{visibleTopics.length} {visibleTopics.length === 1 ? 'topic' : 'topics'} to explore</Text>}
      <View onLayout={event => setGridWidth(event.nativeEvent.layout.width)} style={[s.split, { gap: 16 }]}>{visibleTopics.map((topic, index) => {
        const completed = topic.lessons.filter(lesson => lessonProgress(lesson, model.events).completed).length;
        const levels = [...new Set(topic.lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' · ');
        return <View key={topic.name} style={[s.card, { gap: 0, padding: 0, overflow: 'hidden', minWidth: 0, boxShadow: 'none',
          width: columns === 1 ? '100%' : (gridWidth - 16 * (columns - 1)) / columns, flexShrink: 1 }]}>
          <TopicCover topic={topic} />
          <View style={{ padding: 18, gap: 8, flexGrow: 1, backgroundColor: [colors.card, colors.skyTint, colors.sageTint][index % 3] }}>
            <View style={[s.row, { justifyContent: 'space-between', gap: 6 }]}><Text style={s.eyebrow}>{levels}</Text><Text style={s.muted}>{topic.lessons.every(lesson => lesson.status === 'published') ? 'Published' : topic.lessons.some(lesson => lesson.status === 'published') ? 'Includes drafts' : 'Draft'}</Text></View>
            <Text accessibilityRole="header" style={s.heading}>{topic.name}</Text>
            <Text style={s.body}>{topic.lessons[0]?.outcome}</Text>
            <Text style={s.muted}>{topic.vocabulary.length} words · {topic.lessons.length} short lessons</Text>
            <View style={{ marginTop: 'auto', paddingTop: 8, gap: 8 }}>
              {!!completed && <Text style={s.muted}>{completed} sessions saved</Text>}
              <Button compact label={`Topic ${topic.name}`} disabled={disabled} onPress={() => onSelectTopic(topic.name)}
                href={routeHref({ kind: 'topics', language, topic: topicRouteKey(topic.name) })}>Explore topic →</Button>
            </View>
          </View>
        </View>;
      })}</View>
    </> : <>
      {!!topicLessons.length && <ShortLessons lessons={topicLessons} model={model} onOpen={onOpen} disabled={disabled} />}
      <Text accessibilityRole="header" style={s.heading}>Vocabulary · {words.length}</Text>
      {!topicLessons.length ? <EmptyResults onClear={() => { setQuery(''); setLevel('All'); }} />
        : !words.length && <Text style={s.muted}>No word matches this search. The lesson matches its title or situation.</Text>}
      <View style={[s.split, { gap: 16 }]}>{words.map(entry =>
        <View key={`${selected.name}:${entry.id}`} style={{ flexGrow: 1, flexShrink: 1, flexBasis: phone ? '100%' : 350, minWidth: 0 }}>
          <VocabularyCard entry={entry} model={model} language={language} />
        </View>)}</View>
    </>}
  </View>;
}

function ShortLessons({ lessons, model, onOpen, disabled }: { lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; disabled: boolean }) {
  return <View style={{ gap: 12 }}>
    <Text accessibilityRole="header" style={s.heading}>Short lessons</Text>
    <View style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 16, backgroundColor: colors.card, overflow: 'hidden' }}>
      {lessons.map((lesson, index) => {
        const progress = lessonProgress(lesson, model.events);
        return <View key={lesson.id} style={{ padding: 16, gap: 8, borderTopWidth: index ? 1 : 0, borderColor: colors.line }}>
          <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }]}>
            <View style={{ minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: progress.completed ? colors.sageTint : colors.goldTint }}><Text style={[s.body, designTokens.typography.button]}>{progress.completed ? '✓' : String(index + 1).padStart(2, '0')}</Text></View>
            <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 200, minWidth: 0, gap: 4 }}>
              <Text style={[s.body, { fontWeight: '700' }]}>{lesson.subtitle}</Text>
              <Text style={s.muted}>{lesson.outcome}</Text>
              <Text style={s.muted}>{lesson.vocabulary.length} words · {lesson.durationMinutes} min · {lesson.level} · {lesson.status === 'published' ? 'Published' : 'Draft'}</Text>
            </View>
            <Button compact label={`Open ${lesson.subtitle}`} disabled={disabled} onPress={() => onOpen(lesson)}
              href={routeHref({ kind: 'lesson', language: lesson.language === 'ja-JP' ? 'ja-JP' : 'fr-FR', lessonId: lesson.id })}>
              {progress.completed ? 'Revisit →' : progress.viewedIds.size ? 'Continue →' : 'Start lesson →'}
            </Button>
          </View>
          {(progress.completed || !!progress.viewedIds.size) && <Text style={s.muted}>
            {progress.completed ? 'Session saved' : `${progress.viewedIds.size} words explored`}</Text>}
        </View>;
      })}
    </View>
  </View>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}><Text style={s.heading}>No matches.</Text><Text style={s.body}>Try a topic, word, reading or English meaning.</Text><Button onPress={onClear}>Clear search and filters</Button></View>;
}
