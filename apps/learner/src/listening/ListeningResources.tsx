import { useState } from 'react';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Linking, Platform, Text, View } from 'react-native';
import { Badge, Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { getListeningResources, listeningFormats, listeningLevels, type ListeningFormat, type ListeningLevel, type ListeningResource } from './resources';

type Props = { language?: TargetLanguage; onClose?: () => void };

export function ListeningResources({ language = 'fr-FR', onClose }: Props) {
  return <ListeningLibrary key={language} language={language} onClose={onClose} />;
}

function ListeningLibrary({ language = 'fr-FR', onClose }: Props) {
  const [level, setLevel] = useState<ListeningLevel | null>(null);
  const [format, setFormat] = useState<ListeningFormat | null>(null);
  const languageName = languageNames[language];
  const filtered = getListeningResources(language).filter(resource => (!level || resource.levels.includes(level)) && (!format || resource.format === format));
  function reset() { setLevel(null); setFormat(null); }

  return <View testID="listening-resources" style={{ gap: 20 }}>
    {onClose && <View style={s.row}><Button onPress={onClose}>← Back to practice</Button></View>}
    <View style={[s.card, { backgroundColor: colors.yellow }]}>
      <Text style={s.eyebrow}>Listen a little. Notice a little more.</Text>
      <Text accessibilityRole="header" style={s.title}>{languageName} listening library</Text>
      <Text style={s.body}>Find videos, podcasts and guided listening for everyday {languageName}. Choose something manageable, replay a short part and try the practice idea.</Text>
      <Text style={s.body}>Online only: playback opens on an external provider. Nothing plays or loads from these providers until you open a link.</Text>
      <Text style={s.body}>A1, A2 and B1 are approximate resource recommendations, not assessments of your proficiency. Difficulty, captions and access vary by episode. Check the support notes before listening.</Text>
      {language === 'ja-JP' && <Text style={s.body}>Japanese recommendations currently focus on starter and elementary listening. JF Standard labels are shown where the provider uses them; these are not JLPT ratings. Some filter combinations have no recommendations yet.</Text>}
    </View>
    <View style={s.card}>
      <Text accessibilityRole="header" style={s.heading}>Find your next listen</Text>
      <Text style={s.eyebrow}>Suggested level</Text>
      <View style={s.row}>
        <Button label="All listening levels" selected={level === null} onPress={() => setLevel(null)}>All levels</Button>
        {listeningLevels.map(choice => <Button key={choice} label={`Listening level ${choice}`} selected={level === choice} onPress={() => setLevel(choice)}>{choice}</Button>)}
      </View>
      <Text style={s.eyebrow}>Format</Text>
      <View style={s.row}>
        <Button label="All listening formats" selected={format === null} onPress={() => setFormat(null)}>All formats</Button>
        {listeningFormats.map(choice => <Button key={choice} label={`Listening format ${choice}`} selected={format === choice} onPress={() => setFormat(choice)}>{choice}</Button>)}
      </View>
      <Text testID="listening-count" accessibilityLiveRegion="polite" style={s.muted}>{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}{level ? ` · ${level}` : ' · All levels'}{format ? ` · ${format}` : ' · All formats'}</Text>
      {(level || format) && <Button onPress={reset}>Reset listening filters</Button>}
    </View>
    {filtered.length ? <View style={[s.split, { gap: 20 }]}>{filtered.map(resource => <ResourceCard key={resource.id} resource={resource} />)}</View>
      : <View style={s.notice}>
        <Text accessibilityRole="header" style={s.heading}>No listening resources match</Text>
        <Text style={s.body}>Try another level or format, or show the whole library.</Text>
        <Button onPress={reset}>Show all listening resources</Button>
      </View>}
  </View>;
}

function ResourceCard({ resource }: { resource: ListeningResource }) {
  return <View testID={`listening-resource-${resource.id}`} style={[s.card, { flexBasis: 330, flexGrow: 1, flexShrink: 1, minWidth: 0, maxWidth: '100%' }]}>
    <View style={s.row}><Badge>{resource.format}</Badge><Badge>{resource.levels.join(' / ')}</Badge></View>
    <Text style={s.eyebrow}>{resource.provider}</Text>
    <Text accessibilityRole="header" style={s.heading}>{resource.title}</Text>
    <Text style={s.body}>{resource.description}</Text>
    <Text style={s.muted}>{resource.levelNote}</Text>
    <View style={s.divider} />
    <Text style={s.body}><Text style={{ fontWeight: '700' }}>Captions & text: </Text>{resource.support}</Text>
    <Text style={s.body}><Text style={{ fontWeight: '700' }}>Access: </Text>{resource.access}</Text>
    <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text style={s.eyebrow}>Try this</Text><Text style={s.body}>{resource.practice}</Text>
    </View>
    <ResourceLink resource={resource} />
    <Text style={s.muted}>Link and access notes checked {resource.checkedOn}. Provider availability may change.</Text>
  </View>;
}

function ResourceLink({ resource }: { resource: ListeningResource }) {
  const [error, setError] = useState(false);
  const label = `Open ${resource.title} — ${Platform.OS === 'web' ? 'new tab' : 'external provider'}`;
  async function open() {
    setError(false);
    try { await Linking.openURL(resource.url); }
    catch { setError(true); }
  }
  if (Platform.OS === 'web') return <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={label}
    style={{ color: colors.ink, backgroundColor: colors.yellow, border: '1px solid #D0B527', borderBottomWidth: 3, borderRadius: 14, padding: '12px 17px', minHeight: 46, boxSizing: 'border-box', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 15, lineHeight: '23px', overflowWrap: 'anywhere' }}>Open resource ↗ (new tab)</a>;
  return <View style={{ gap: 10 }}>
    <Button primary label={label} onPress={() => void open()}>Open resource ↗</Button>
    {error && <Text accessibilityRole="alert" style={[s.body, { color: colors.danger }]}>The resource could not be opened. Check your connection and try again.</Text>}
  </View>;
}
