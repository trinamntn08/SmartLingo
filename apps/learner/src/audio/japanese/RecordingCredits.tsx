import { Text, View } from 'react-native';
import { Disclosure } from '../../ui/Disclosure';
import { colors, styles as s } from '../../ui/theme';
import { humanRecordings, type RecordingCredit } from './course-clips';

const linkStyle = { color: colors.primary };

function byAttribution() {
  const groups = new Map<string, { credit: RecordingCredit; items: { text: string; source: string }[] }>();
  for (const [text, credit] of Object.entries(humanRecordings)) {
    const key = JSON.stringify([credit.author, credit.license, credit.licenseUrl, credit.changes]);
    if (!groups.has(key)) groups.set(key, { credit, items: [] });
    groups.get(key)!.items.push({ text, source: credit.source });
  }
  return [...groups.entries()];
}

export function RecordingCredits() {
  return <Disclosure title="Japanese recording credits" compact keepMounted={false}>
    {byAttribution().map(([key, { credit, items }]) =>
      <View key={key} style={{ gap: 4 }}>
        <Text style={s.body}>{credit.author === 'Tofugu and WaniKani'
          ? <><a href="https://www.tofugu.com/" target="_blank" rel="noreferrer" style={linkStyle}>Tofugu</a> and <a href="https://www.wanikani.com/" target="_blank" rel="noreferrer" style={linkStyle}>WaniKani</a></>
          : credit.author}{' · '}<a href={credit.licenseUrl} target="_blank" rel="noreferrer" style={linkStyle}>{credit.license}</a></Text>
        {!!credit.changes && <Text style={s.muted}>{credit.changes}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {items.map(({ text, source }) => <a key={text} href={source} target="_blank" rel="noreferrer" lang="ja" style={linkStyle}>{text}</a>)}
        </View>
      </View>
    )}
  </Disclosure>;
}
