import { useId, useState } from 'react';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { Linking, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Button } from '../ui/controls';
import { colors, designTokens as tokens, styles as s } from '../ui/theme';
import { getListeningResources, listeningFormats, listeningLevels, type ListeningFormat, type ListeningLevel, type ListeningResource } from './resources';

type Props = { language?: TargetLanguage; onClose?: () => void; headingId?: string };

export function ListeningResources({ language = 'fr-FR', onClose, headingId }: Props) {
  return <ListeningLibrary key={language} language={language} onClose={onClose} headingId={headingId} />;
}

function ListeningLibrary({ language = 'fr-FR', onClose, headingId }: Props) {
  const compact = useWindowDimensions().width < tokens.layout.compactBreakpoint;
  const filtersId = useId();
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [level, setLevel] = useState<ListeningLevel | null>(null);
  const [format, setFormat] = useState<ListeningFormat | null>(null);
  const resources = getListeningResources(language);
  const availableLevels = listeningLevels.filter(choice => resources.some(resource => resource.levels.includes(choice)));
  const availableFormats = listeningFormats.filter(choice => resources.some(resource => resource.format === choice));
  const filtered = resources.filter(resource => (!level || resource.levels.includes(level)) && (!format || resource.format === format));
  function reset() { setLevel(null); setFormat(null); }

  const filters = <View nativeID={filtersId} style={[layout.filters, compact && !filtersExpanded && layout.hidden]}>
    <View style={layout.filterRow}>
      <View style={layout.filterGroup}>
        <Text style={s.eyebrow}>Level</Text>
        <View style={layout.filterOptions}>
          <Button compact label="All listening levels" selected={level === null} onPress={() => setLevel(null)}>All levels</Button>
          {availableLevels.map(choice => <Button compact key={choice} label={`Listening level ${choice}`} selected={level === choice} onPress={() => setLevel(choice)}>{choice}</Button>)}
        </View>
      </View>
      <View style={layout.filterGroup}>
        <Text style={s.eyebrow}>Format</Text>
        <View style={layout.filterOptions}>
          <Button compact label="All listening formats" selected={format === null} onPress={() => setFormat(null)}>All formats</Button>
          {availableFormats.map(choice => <Button compact key={choice} label={`Listening format ${choice}`} selected={format === choice} onPress={() => setFormat(choice)}>{choice}</Button>)}
        </View>
      </View>
    </View>
  </View>;

  return <View testID="listening-resources" style={layout.page}>
    <View style={layout.header}>
      <View style={[layout.headerCopy, compact && layout.wide]}>
        <Text nativeID={headingId} accessibilityRole="header" style={[s.title, layout.destinationHeading, compact && s.compactTitle]}>{languageNames[language]} listening library</Text>
        <Text style={s.muted}>Playback opens on an external provider and requires internet.</Text>
      </View>
      {onClose && <Button compact quiet icon="arrow-left" onPress={onClose}>Back to practice</Button>}
    </View>
    {!compact && filters}
    <View style={layout.resultBar}>
      <Text testID="listening-count" accessibilityLiveRegion="polite" style={s.muted}>
        {filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}
      </Text>
      <View style={layout.actions}>
        {(level || format) && <Button compact quiet label="Reset listening filters" onPress={reset}>{compact ? 'Reset' : 'Reset listening filters'}</Button>}
        {compact && <Button compact expanded={filtersExpanded} controls={filtersId} trailingIcon="chevron-down"
          onPress={() => setFiltersExpanded(value => !value)}>Filters</Button>}
      </View>
    </View>
    {compact && filters}
    {filtered.length ? <View style={layout.resourceList}>{filtered.map(resource => <ResourceCard key={resource.id} resource={resource} />)}</View>
      : <View style={layout.empty}>
        <Text accessibilityRole="header" style={s.heading}>No listening resources match</Text>
        <Button onPress={reset}>Show all listening resources</Button>
      </View>}
    <Text style={s.muted}>Levels are approximate recommendations.</Text>
  </View>;
}

function ResourceCard({ resource }: { resource: ListeningResource }) {
  const contentId = useId();
  const [expanded, setExpanded] = useState(false);
  return <View testID={`listening-resource-${resource.id}`} style={layout.card}>
    <View style={layout.resourceRow}>
      <View style={layout.resourceCopy}>
        <Text accessibilityRole="header" style={layout.resourceTitle}>{resource.title}</Text>
        <View style={layout.metadata}>
          <Text style={s.muted}>{resource.provider}</Text>
          <Text style={[s.badgeText, layout.format]}>{resource.format}</Text>
          <Text style={[s.badgeText, layout.level]}>{resource.levels.join(' / ')}</Text>
        </View>
      </View>
      <View style={layout.actions}>
        <Button compact quiet label="Listening notes" expanded={expanded} controls={contentId} onPress={() => setExpanded(value => !value)}>Listening notes {expanded ? '−' : '+'}</Button>
        <ResourceLink resource={resource} />
      </View>
    </View>
    <View nativeID={contentId} style={expanded ? layout.notes : layout.hidden}>
      {expanded && <>
        <Text style={s.body}>{resource.description}</Text>
        <Text style={s.muted}>{resource.levelNote}</Text>
        <View style={layout.noteColumns}>
          <View style={layout.noteColumn}><Text style={s.eyebrow}>Captions &amp; text</Text><Text style={s.muted}>{resource.support}</Text></View>
          <View style={layout.noteColumn}><Text style={s.eyebrow}>Access</Text><Text style={s.muted}>{resource.access}</Text></View>
        </View>
        <View style={layout.practice}><Text style={s.eyebrow}>Try this</Text><Text style={s.body}>{resource.practice}</Text></View>
        <Text style={s.muted}>Link and access notes checked {resource.checkedOn}.</Text>
      </>}
    </View>
  </View>;
}

function ResourceLink({ resource }: { resource: ListeningResource }) {
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const action = resource.format === 'Podcast' ? 'Listen' : resource.format === 'YouTube' ? 'Watch' : 'Open';
  const label = `${action === 'Listen' ? 'Listen to' : action} ${resource.title} — ${Platform.OS === 'web' ? 'new tab' : 'external provider'}`;
  async function open() {
    setError(false);
    try { await Linking.openURL(resource.url); }
    catch { setError(true); }
  }
  if (Platform.OS === 'web') return <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={label}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={{ color: colors.onPrimary, backgroundColor: colors.primary, borderRadius: tokens.radius.pill, padding: '8px 14px',
      minHeight: tokens.control.minimumTarget, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: tokens.typography.button.fontFamily, fontWeight: 600, fontSize: 15, lineHeight: '22px', textDecoration: 'none',
      outline: focused ? `${tokens.focus.outlineWidth}px solid ${colors.focusRing}` : undefined, outlineOffset: tokens.focus.outlineOffset }}>
    {action} ↗
  </a>;
  return <View style={layout.nativeLink}>
    <Button primary compact label={label} onPress={() => void open()}>{action} ↗</Button>
    {error && <Text accessibilityRole="alert" style={[s.muted, { color: colors.danger }]}>The resource could not be opened. Check your connection and try again.</Text>}
  </View>;
}

const layout = StyleSheet.create({
  page: { width: '100%', maxWidth: 840, alignSelf: 'center', minWidth: 0, gap: tokens.space.lg },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: tokens.space.sm },
  destinationHeading: { outlineWidth: 0 },
  headerCopy: { gap: tokens.space.xs, flexShrink: 1, minWidth: 0 },
  wide: { flexBasis: '100%' },
  filters: { padding: tokens.space.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: tokens.radius.lg },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space.lg },
  filterGroup: { flexGrow: 1, flexShrink: 1, flexBasis: 244, minWidth: 0, gap: tokens.space.xs },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space.xs },
  resultBar: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space.sm, alignItems: 'center', justifyContent: 'space-between' },
  resourceList: { gap: tokens.space.md },
  card: { minWidth: 0, gap: tokens.space.md, padding: tokens.space.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: tokens.radius.lg },
  resourceRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: tokens.space.sm },
  resourceCopy: { flexGrow: 1, flexShrink: 1, flexBasis: 275, minWidth: 0, gap: tokens.space.xs },
  resourceTitle: { ...tokens.typography.heading, color: colors.ink, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: tokens.space.sm },
  format: { backgroundColor: colors.goldTint, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.space.sm, paddingVertical: 2 },
  level: { backgroundColor: colors.sand, borderRadius: tokens.radius.sm, paddingHorizontal: tokens.space.sm, paddingVertical: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: tokens.space.xs, minWidth: 0, maxWidth: '100%' },
  notes: { minWidth: 0, paddingTop: tokens.space.md, gap: tokens.space.md, borderTopWidth: 1, borderColor: colors.line },
  noteColumns: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space.md },
  noteColumn: { flexGrow: 1, flexShrink: 1, flexBasis: 220, minWidth: 0, gap: tokens.space.xs },
  practice: { padding: tokens.space.md, gap: tokens.space.xs, backgroundColor: colors.sageTint, borderRadius: tokens.radius.md },
  hidden: { display: 'none' },
  nativeLink: { minWidth: 0, flexShrink: 1, alignItems: 'flex-start', gap: tokens.space.xs },
  empty: { padding: tokens.space.xl, gap: tokens.space.md, alignItems: 'flex-start', backgroundColor: colors.sand, borderRadius: tokens.radius.lg },
});
