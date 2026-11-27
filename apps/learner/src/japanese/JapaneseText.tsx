import { Fragment, type ReactNode } from 'react';
import { Platform, Text } from 'react-native';
import { styles as s } from '../ui/theme';

type Ruby = Readonly<{ base: string; reading: string }>;

export function JapaneseText({ text, ruby = [] }: { text: string; ruby?: readonly Ruby[] }) {
  if (Platform.OS !== 'web') {
    const reading = ruby.map(entry => `${entry.base}（${entry.reading}）`).join('、');
    return <Text style={s.body}>{reading ? `${text}\n${reading}` : text}</Text>;
  }
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const entry of ruby) {
    const start = text.indexOf(entry.base, cursor);
    if (start < 0) continue;
    parts.push(<Fragment key={start}>{text.slice(cursor, start)}
      <ruby style={{ whiteSpace: 'nowrap' }}>{entry.base}<rp>（</rp><rt>{entry.reading}</rt><rp>）</rp></ruby>
    </Fragment>);
    cursor = start + entry.base.length;
  }
  return <span lang="ja" style={{ lineBreak: 'strict', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
    {parts}{text.slice(cursor)}
  </span>;
}
