import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { findSlangExpressions, slangCategories, slangCategoryIds, slangExpressions,
  type SlangCategory, type SlangExpression, type SlangRegister } from '@smartlingo/content';
import { useVisitState } from '../app/WebNavigation';
import { Speak } from '../audio/Speak';
import { Button } from './controls';
import { colors, designTokens as tokens, styles as s } from './theme';
import type { LearningModel } from './useLearning';

const pageSize = 12;
const cardGap = 16;
const initialBrowse = { query: '', category: null as SlangCategory | null, limit: pageSize };
const frenchLanguage = { accessibilityLanguage: 'fr-FR', ...(Platform.OS === 'web' ? { lang: 'fr-FR' } : {}) };

const registerLabels: Record<SlangRegister, string> = {
  informal: 'Informal',
  slang: 'Slang',
  vulgar: 'Vulgar',
};

const photoDescriptions: Record<SlangCategory, string> = {
  conversation: 'Two neighbors chatting on the sidewalk',
  reactions: 'A woman with a surprised smile',
  friends: 'Three friends laughing on a park bench',
  plans: 'Two people looking at a calendar together',
  food: 'People sharing bread and coffee at a bistro',
  work: 'A colleague working at a laptop',
  trouble: 'A person fixing a bicycle tire on the street',
  emotions: 'A tired woman resting her head beside a window',
  errands: 'A shopper choosing fruit at an outdoor market',
  messages: 'Hands typing a message on a phone',
  verlan: 'Two friends talking on a train platform',
  strong: 'A frustrated person beside a spilled cup of coffee',
};

export function SlangCatalogue({ model }: { model: LearningModel }) {
  const { width } = useWindowDimensions();
  const compact = width < 680;
  const [resultWidth, setResultWidth] = useState(0);
  const columns = resultWidth >= 900 ? 3 : resultWidth >= 600 ? 2 : 1;
  const cardWidth = columns === 1 ? '100%' : (resultWidth - (columns - 1) * cardGap) / columns;
  const [{ query, category, limit }, setBrowse] = useVisitState('slang:browse', initialBrowse);
  const results = findSlangExpressions(query, category);
  const visible = results.slice(0, limit);
  const savedIds = new Set(model.notebook.map(entry => entry.sourceEntryId));

  function updateQuery(value: string) {
    setBrowse({ query: value, category, limit: pageSize });
  }

  function chooseCategory(value: SlangCategory | null) {
    setBrowse({ query, category: value, limit: pageSize });
  }

  const categoryButtons = <>
    <Button compact toggle selected={category === null} onPress={() => chooseCategory(null)}>All expressions</Button>
    {slangCategoryIds.map(id => <Button compact key={id} toggle selected={category === id} onPress={() => chooseCategory(id)}>
      {slangCategories[id]}
    </Button>)}
  </>;

  return <View style={styles.catalogue}>
    <View testID="slang-intro" style={[styles.hero, compact && styles.heroCompact]}>
      <View style={[styles.intro, compact ? styles.introCompact : styles.introWide]}>
        <Text accessibilityRole="header" aria-level={1} style={[s.title, compact && s.compactTitle]}>Everyday French & slang</Text>
        <Text style={s.muted}>Expressions for conversations, work and everyday life in France</Text>
      </View>
      <Image source={{ uri: '/slang-photos/hero.jpg' }} accessibilityRole="img"
        accessibilityLabel="Three friends laughing together on a French café terrace"
        style={[styles.heroPhoto, compact && styles.heroPhotoCompact]} resizeMode="cover" />
    </View>

    <View style={styles.filters}>
      <TextInput accessibilityLabel="Search slang" placeholder="Search in French or English"
        value={query} onChangeText={updateQuery} autoCapitalize="none" autoCorrect={false}
        placeholderTextColor={colors.muted} style={styles.search} />
      {!!query && <Button onPress={() => updateQuery('')}>Clear search</Button>}
    </View>
    {compact ? <ScrollView horizontal accessibilityLabel="Expression categories" keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.categoryStrip}>{categoryButtons}</ScrollView>
      : <View accessibilityLabel="Expression categories" style={styles.categories}>{categoryButtons}</View>}

    <View style={styles.results}>
      <View style={styles.resultHeader}>
        <Text accessibilityRole="header" style={s.heading}>{category ? slangCategories[category] : 'Browse expressions'}</Text>
        <Text accessibilityLiveRegion="polite" style={styles.count}>
          {results.length === slangExpressions.length ? `${results.length} expressions` : `${results.length} of ${slangExpressions.length} expressions`}
        </Text>
      </View>
      {category === 'verlan' && <Text style={s.muted}>Verlan flips the sounds of a word. Usage varies by age, place and group of friends.</Text>}
      {category === 'strong' && <Text style={s.muted}>These expressions include swear words and insults. Use the notes to understand how strong each one sounds.</Text>}
      {visible.length ? <View style={styles.cards} onLayout={event => setResultWidth(Math.floor(event.nativeEvent.layout.width))}>
        {visible.map(expression => <View key={expression.id} style={{ width: cardWidth, minWidth: 0 }}>
          <ExpressionCard expression={expression} saved={savedIds.has(expression.sourceEntryId)} model={model} />
        </View>)}
      </View> : <View style={s.card}>
        <Text accessibilityRole="header" style={s.heading}>No expressions found</Text>
        <Text style={s.body}>Try another French phrase or English meaning, or search across all categories.</Text>
        <Button onPress={() => setBrowse(initialBrowse)}>Reset search and category</Button>
      </View>}
      {visible.length < results.length && <View style={styles.more}>
        <Text style={s.muted}>Showing {visible.length} of {results.length}</Text>
        <Button onPress={() => setBrowse(current => ({ ...current, limit: current.limit + pageSize }))}>Show more expressions</Button>
      </View>}
    </View>
  </View>;
}

function ExpressionCard({ expression, saved, model }: { expression: SlangExpression; saved: boolean; model: LearningModel }) {
  const { id, sourceEntryId, category, target, meaning, example, exampleMeaning, note, register, textAbbreviation } = expression;

  function saveExpression() {
    model.captureEntry({ id: `notebook.${sourceEntryId}`, sourceEntryId, language: 'fr-FR', target, meaning, example, updatedAt: new Date().toISOString() });
  }

  return <View testID={`expression-${id}`} style={[s.card, styles.expression]}>
    <View style={styles.summary}>
      <View style={styles.definition}>
        <Text style={styles.categoryLabel}>{slangCategories[category]}</Text>
        <Text accessibilityRole="header" {...frenchLanguage} style={styles.target}>{target}</Text>
        <Text style={styles.meaning}>{meaning}</Text>
      </View>
      <Image source={{ uri: `/slang-photos/${category}.jpg` }} accessibilityRole="img" accessibilityLabel={photoDescriptions[category]}
        style={styles.thumbnail} resizeMode="cover" />
    </View>
    <View style={styles.example}>
      <Text {...frenchLanguage} style={styles.exampleFrench}>{example}</Text>
      <Text style={s.muted}>{exampleMeaning}</Text>
    </View>
    <Text style={s.muted}>{note}</Text>
    <View style={styles.actions}>
      <View style={styles.tags}>
        <Text style={[styles.tag, register === 'vulgar' && styles.vulgarTag]}>{registerLabels[register]}</Text>
        {textAbbreviation ? <Text style={styles.tag}>Text shorthand</Text> : <Speak language="fr-FR" text={target} />}
      </View>
      <Button compact label={saved ? undefined : `Save ${target}`} disabled={model.blocked || saved} onPress={saveExpression}>
        {saved ? 'In notebook' : 'Save'}
      </Button>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  catalogue: { alignSelf: 'center', width: '100%', gap: 16, minWidth: 0 },
  hero: { flexDirection: 'row', alignItems: 'stretch', gap: 24 },
  heroCompact: { flexDirection: 'column', gap: 16 },
  intro: { minWidth: 0, justifyContent: 'center', paddingVertical: 24, gap: 8 },
  introWide: { flex: 1 },
  introCompact: { paddingVertical: 0 },
  heroPhoto: { width: '48%', minHeight: 224, borderRadius: tokens.radius.card, backgroundColor: colors.sand },
  heroPhotoCompact: { width: '100%', height: 124, minHeight: 0 },
  filters: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  search: { ...s.input, minWidth: 180, flexGrow: 1, flexBasis: 300 },
  categories: { ...s.row, gap: 8 },
  categoryStrip: { ...s.row, flexWrap: 'nowrap', gap: 8, padding: 4 },
  results: { marginTop: 8, gap: 16 },
  resultHeader: { ...s.row, justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  count: { ...s.muted, ...tokens.typography.caption, fontVariant: ['tabular-nums'] },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: cardGap, alignItems: 'stretch' },
  expression: { flex: 1, padding: 16, gap: 12 },
  summary: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  definition: { flex: 1, minWidth: 0, gap: 4 },
  categoryLabel: { ...tokens.typography.caption, color: colors.muted },
  target: { ...s.heading, fontSize: 22, lineHeight: 28 },
  meaning: { ...s.body, fontSize: 16, lineHeight: 24 },
  thumbnail: { width: 72, height: 72, borderRadius: tokens.radius.sm, backgroundColor: colors.sand },
  example: { paddingVertical: 8, paddingLeft: 12, borderLeftWidth: 1, borderColor: colors.inputBorder, gap: 4 },
  exampleFrench: { ...s.body, fontSize: 16, lineHeight: 24, fontWeight: '500' },
  actions: { ...s.row, marginTop: 'auto', justifyContent: 'space-between', gap: 8 },
  tags: { ...s.row, gap: 8, flexShrink: 1 },
  tag: { ...tokens.typography.caption, color: colors.muted },
  vulgarTag: { color: colors.danger },
  more: { alignItems: 'center', gap: 8, marginTop: 4 },
});
