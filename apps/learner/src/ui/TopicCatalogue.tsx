import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { groupLessonTopics, lessonProgress, matchesLesson, matchesVocabulary, normalizeSearch,
  type CatalogueLevel, type Lesson } from '@smartlingo/domain';
import { Badge, Button } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';
import { VocabularyCard } from './VocabularyCard';

export function TopicCatalogue({ lessons, model, onOpen, practice, selectedTopic, onSelectTopic }: {
  lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; practice: boolean;
  selectedTopic: string | null; onSelectTopic: (name: string | null) => void;
}) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<CatalogueLevel>('All');
  useEffect(() => { setQuery(''); setLevel('All'); }, [selectedTopic]);
  const topics = groupLessonTopics(lessons);
  const selected = topics.find(topic => topic.name === selectedTopic);
  const visibleTopics = topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level)));
  const topicLessons = selected?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];
  const topicQuery = selected && normalizeSearch(selected.name).includes(normalizeSearch(query));
  const words = groupLessonTopics(topicLessons).flatMap(topic => topic.vocabulary)
    .filter(entry => topicQuery || matchesVocabulary(entry, query));

  return <View style={{ gap: 20, minWidth: 0 }}>
    {selected && <View style={s.row}><Button onPress={() => onSelectTopic(null)}>← All topics</Button></View>}
    <View style={{ gap: 6 }}>
      <Text accessibilityRole="header" style={s.title}>{selected?.name ?? (practice ? 'Choose your practice.' : 'Explore topics')}</Text>
      <Text style={s.muted}>{selected ? `${selected.vocabulary.length} words · ${selected.lessons.length} short lessons`
        : `${topics.length} everyday topics · ${[...new Set(lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' / ')}`}</Text>
    </View>
    <TextInput accessibilityLabel="Search lessons" placeholder="Search topics, words, readings or English meanings"
      value={query} onChangeText={setQuery} style={s.input} clearButtonMode="while-editing" />
    <View style={s.row}>{(['All', 'foundation', 'A1', 'A2', 'B1'] as const).filter(value => value === 'All' || lessons.some(lesson => lesson.level === value)).map(value => <Button key={value} selected={level === value}
      label={value === 'All' ? 'All levels' : value === 'foundation' ? 'Foundations level' : `${value} level`} onPress={() => setLevel(value)}>{value === 'All' ? 'All levels' : value === 'foundation' ? 'Foundations' : value}</Button>)}</View>
    {!selected ? <>
      {!topics.length ? <View style={s.card}><Text style={s.heading}>No topics available.</Text>
        <Text style={s.body}>Your lesson catalogue is empty. Try loading the published catalogue from Profile.</Text></View>
        : !visibleTopics.length && <EmptyResults onClear={() => { setQuery(''); setLevel('All'); }} />}
      <View style={s.split}>{visibleTopics.map(topic => {
        const completed = topic.lessons.filter(lesson => lessonProgress(lesson, model.events).completed).length;
        return <View key={topic.name} style={[s.card, s.column, { gap: 14, flexBasis: 270, padding: 20 }]}>
          <Text accessibilityRole="header" style={s.heading}>{topic.name}</Text>
          <Text style={s.body}>{topic.vocabulary.length} words · {topic.lessons.length} lessons</Text>
          <Text style={s.muted}>{topic.vocabulary.slice(0, 3).map(entry => entry.target).join(' · ')}</Text>
          <View style={s.row}><Badge>{[...new Set(topic.lessons.map(lesson => lesson.level))].join(' · ')}</Badge>
            <Text style={s.muted}>{completed ? `${completed} sessions saved · ` : ''}{topic.lessons.every(lesson => lesson.status === 'published') ? 'Published' : topic.lessons.some(lesson => lesson.status === 'published') ? 'Includes drafts' : 'Draft'}</Text></View>
          <Button primary onPress={() => onSelectTopic(topic.name)}>Explore {topic.name} →</Button>
        </View>;
      })}</View>
    </> : <>
      <Text accessibilityRole="header" style={s.heading}>Vocabulary · {words.length}</Text>
      {!topicLessons.length ? <EmptyResults onClear={() => { setQuery(''); setLevel('All'); }} />
        : !words.length && <Text style={s.muted}>No word matches this search. The lesson matches its title or situation.</Text>}
      <View style={[s.split, { gap: 18 }]}>{words.map(entry =>
        <View key={`${selected.name}:${entry.id}`} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 300, minWidth: 0 }}>
          <VocabularyCard entry={entry} model={model} language={topicLessons[0]?.language === 'ja-JP' ? 'ja-JP' : 'fr-FR'} />
        </View>)}</View>
      {!!topicLessons.length && <View style={{ gap: 12 }}>
        <Text accessibilityRole="header" style={s.heading}>Short lessons</Text>
        <View style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 16, backgroundColor: colors.card, overflow: 'hidden' }}>
          {topicLessons.map((lesson, index) => {
            const progress = lessonProgress(lesson, model.events);
            return <View key={lesson.id} style={{ padding: 14, gap: 8, borderTopWidth: index ? 1 : 0, borderColor: colors.line }}>
              <View style={[s.row, { justifyContent: 'space-between' }]}>
                <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 200, minWidth: 0, gap: 4 }}>
                  <Text style={[s.body, { fontWeight: '700' }]}>{lesson.subtitle}</Text>
                  <Text style={s.muted}>{lesson.level} · {lesson.vocabulary.length} words · {lesson.durationMinutes} min · {lesson.status === 'published' ? 'Published' : 'Draft'}</Text>
                </View>
                <Button label={`Open ${lesson.subtitle}`} onPress={() => onOpen(lesson)}>
                  {progress.completed ? 'Revisit →' : progress.viewedIds.size ? 'Continue →' : 'Practise →'}
                </Button>
              </View>
              {(progress.completed || !!progress.viewedIds.size) && <Text style={s.muted}>
                {progress.completed ? 'Session saved' : `${progress.viewedIds.size} words explored`}</Text>}
            </View>;
          })}
        </View>
      </View>}
    </>}
  </View>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}><Text style={s.heading}>No matches.</Text><Text style={s.body}>Try a topic, word, reading or English meaning.</Text><Button onPress={onClear}>Clear search and filters</Button></View>;
}
