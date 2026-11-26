import { useState } from 'react';
import { Text, View } from 'react-native';
import type { JapaneseDailyGuide as DailyGuide } from '@smartlingo/content';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

/** Directly visible outcomes, with optional sequencing detail for independent learners. */
export function JapaneseDailyGuide({ guide }: { guide: DailyGuide }) {
  const [details, setDetails] = useState(false);
  return <View testID="japanese-daily-guide" style={[s.notice, { gap: 10 }]}>
    <Text accessibilityRole="header" style={s.heading}>Today’s Can-dos</Text>
    {guide.canDos.map(canDo => <Text key={canDo} style={s.body}>• {canDo}</Text>)}
    <Text style={s.muted}>Selected tasks inspired by the Japan Foundation’s action-oriented Can-do approach. This draft route covers selected situations, not a complete A1, A2 or B1 syllabus.</Text>
    <Button compact expanded={details} onPress={() => setDetails(value => !value)}>{details ? 'Hide study guidance' : 'Script, register and preparation'}</Button>
    {details && <View style={{ gap: 12 }}>
      <Text style={s.body}>{guide.preparation}</Text>
      <Text style={s.body}>Script focus: {guide.script}</Text>
      <Text style={s.body}>Register: {guide.register}</Text>
      <Text style={s.muted}>{guide.review}</Text>
    </View>}
  </View>;
}
