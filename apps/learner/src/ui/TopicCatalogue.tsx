import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { groupLessonTopics, lessonProgress, matchesLesson, matchesVocabulary, normalizeSearch,
  type CatalogueLevel, type Lesson, type Vocabulary } from '@smartlingo/domain';
import { Badge, Button, Speak } from './controls';
import { colors, styles as s } from './theme';
import type { LearningModel } from './useLearning';

export function TopicCatalogue({ lessons, model, onOpen, practice }: {
  lessons: Lesson[]; model: LearningModel; onOpen: (lesson: Lesson) => void; practice: boolean;
}) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<CatalogueLevel>('All');
  const [topicName, setTopicName] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const topics = groupLessonTopics(lessons);
  const selected = topics.find(topic => topic.name === topicName);
  const visibleTopics = topics.filter(topic => topic.lessons.some(lesson => matchesLesson(lesson, query, level)));
  const topicLessons = selected?.lessons.filter(lesson => matchesLesson(lesson, query, level)) ?? [];
  const topicQuery = selected && normalizeSearch(selected.name).includes(normalizeSearch(query));
  const words = groupLessonTopics(topicLessons).flatMap(topic => topic.vocabulary)
    .filter(entry => topicQuery || matchesVocabulary(entry, query));

  function saveWord(entry: Vocabulary) {
    setMessage('');
    model.captureEntry({ id: `notebook.${entry.id}`, sourceEntryId: entry.id, target: entry.target,
      meaning: entry.meaning, example: entry.example, updatedAt: new Date().toISOString() },
    () => setMessage(`Saved ${entry.target} to your notebook.`));
  }

  return <View style={{ gap: 24 }}>
    {selected && <View style={s.row}><Button onPress={() => { setTopicName(null); setQuery(''); setMessage(''); }}>← All topics</Button></View>}
    <Text accessibilityRole="header" style={s.title}>{selected?.name ?? (practice ? 'Choose your practice.' : 'Explore topics')}</Text>
    <Text style={s.muted}>{selected ? `${selected.vocabulary.length} words · ${selected.lessons.length} short lessons`
      : `${topics.length} everyday topics · A1–A2`}</Text>
    <TextInput accessibilityLabel="Search lessons" placeholder="Search topics or words in French or English"
      value={query} onChangeText={value => { setQuery(value); setMessage(''); }} style={s.input} clearButtonMode="while-editing" />
    <View style={s.row}>{(['All', 'A1', 'A2'] as const).map(value => <Button key={value} selected={level === value}
      label={value === 'All' ? 'All levels' : `${value} level`} onPress={() => setLevel(value)}>{value === 'All' ? 'All levels' : value}</Button>)}</View>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}
    {!selected ? <>
      {!visibleTopics.length && <EmptyResults onClear={() => { setQuery(''); setLevel('All'); }} />}
      <View style={s.split}>{visibleTopics.map(topic => {
        const completed = topic.lessons.filter(lesson => lessonProgress(lesson, model.events).completed).length;
        return <View key={topic.name} style={[s.card, s.column, { gap: 14 }]}>
          <Text accessibilityRole="header" style={s.heading}>{topic.name}</Text>
          <Text style={s.body}>{topic.vocabulary.length} words · {topic.lessons.length} lessons</Text>
          <Text style={s.muted}>{topic.vocabulary.slice(0, 3).map(entry => entry.target).join(' · ')}</Text>
          <View style={s.row}><Badge>{[...new Set(topic.lessons.map(lesson => lesson.level))].join(' · ')}</Badge>
            <Text style={s.muted}>{completed ? `${completed} sessions saved · ` : ''}{topic.lessons.every(lesson => lesson.status === 'published') ? 'Published' : topic.lessons.some(lesson => lesson.status === 'published') ? 'Includes drafts' : 'Draft'}</Text></View>
          <Button primary onPress={() => { setTopicName(topic.name); setMessage(''); }}>Explore {topic.name} →</Button>
        </View>;
      })}</View>
    </> : <>
      {!topicLessons.length && <EmptyResults onClear={() => { setQuery(''); setLevel('All'); }} />}
      {!!topicLessons.length && <>
        <Text accessibilityRole="header" style={s.heading}>Short lessons</Text>
        <View style={{ gap: 12 }}>{topicLessons.map(lesson => {
          const progress = lessonProgress(lesson, model.events);
          return <View key={lesson.id} style={[s.notice, { backgroundColor: colors.card }]}>
            <View style={s.row}><Badge>{lesson.level}</Badge><Badge>{lesson.status === 'published' ? 'Published' : 'Draft'}</Badge>
              <Text style={s.muted}>{lesson.vocabulary.length} words · {lesson.durationMinutes} min</Text></View>
            <Text style={s.heading}>{lesson.subtitle}</Text><Text style={s.body}>{lesson.outcome}</Text>
            <View style={s.row}><Button primary label={`Open ${lesson.subtitle}`} onPress={() => onOpen(lesson)}>
              {progress.completed ? 'Revisit lesson →' : progress.viewedIds.size ? 'Continue lesson →' : 'Choose this lesson →'}
            </Button>{(progress.completed || !!progress.viewedIds.size) && <Text style={s.muted}>
              {progress.completed ? 'Session saved' : `${progress.viewedIds.size} words explored`}</Text>}</View>
          </View>;
        })}</View>
        <Text accessibilityRole="header" style={s.heading}>Vocabulary · {words.length}</Text>
        {!words.length && <Text style={s.muted}>No word matches this search. The lesson matches its title or situation.</Text>}
        <View style={s.split}>{words.map(entry => <View key={entry.id} style={[s.card, s.column, { gap: 12 }]}>
          <Text accessibilityRole="header" style={s.heading}>{entry.target}</Text><Text style={s.body}>{entry.meaning}</Text>
          <View style={{ gap: 4 }}><Text style={s.eyebrow}>Example</Text><Text style={s.body}>{entry.example}</Text><Text style={s.muted}>{entry.exampleMeaning}</Text></View>
          <View style={{ gap: 4 }}><Text style={s.eyebrow}>Explanation</Text><Text style={s.body}>{entry.note}</Text></View>
          <View style={s.row}><Speak text={entry.target} /><Button label={`Save ${entry.target}`}
            disabled={model.blocked || model.notebook.some(note => note.sourceEntryId === entry.id)} onPress={() => saveWord(entry)}>
            {model.notebook.some(note => note.sourceEntryId === entry.id) ? '✓ In notebook' : '+ Save word'}</Button></View>
        </View>)}</View>
      </>}
    </>}
  </View>;
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <View style={s.card}><Text style={s.heading}>No matches.</Text><Text style={s.body}>Try a topic, French word or English meaning.</Text><Button onPress={onClear}>Clear search and filters</Button></View>;
}
