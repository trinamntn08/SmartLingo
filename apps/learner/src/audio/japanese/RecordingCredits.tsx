import { Text, View } from 'react-native';
import { Disclosure } from '../../ui/Disclosure';
import { colors, styles as s } from '../../ui/theme';
import { humanRecordings, type RecordingCredit } from './bundled';

const linkStyle = { color: colors.primary };
const groups = new Map<string, { credit: RecordingCredit; items: { text: string; source: string }[] }>();
for (const [text, credit] of Object.entries(humanRecordings)) {
  const key = JSON.stringify([credit.author, credit.license, credit.licenseUrl, credit.changes]);
  let group = groups.get(key);
  if (!group) {
    group = { credit, items: [] };
    groups.set(key, group);
  }
  group.items.push({ text, source: credit.source });
}

export function RecordingCredits() {
  return <Disclosure title="Japanese recording credits" keepMounted={false}>
    <Text style={s.body}>Synthetic recordings by VOICEVOX:四国めたん. Keep this credit and follow the applicable voice and model terms when reusing clips.</Text>
    <View style={s.row}>
      <a href="https://zunko.jp/con_ongen_kiyaku.html" target="_blank" rel="noreferrer" style={linkStyle}>Voice terms</a>
      <a href="https://github.com/VOICEVOX/voicevox_vvm/blob/0.17.1/TERMS.txt" target="_blank" rel="noreferrer" style={linkStyle}>Model terms</a>
    </View>
    {[...groups].map(([key, { credit, items }]) =>
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
