import { useState } from 'react';
import { Text, View } from 'react-native';
import type { JapaneseDailyGuide as DailyGuide } from '@smartlingo/content';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';

export function JapaneseDailyGuide({ guide }: { guide: DailyGuide }) {
  const [details, setDetails] = useState(false);
  return <View testID="japanese-daily-guide" style={{ gap: 8 }}>
    <View style={s.row}>
      <Button compact quiet expanded={details} onPress={() => setDetails(value => !value)}>Lesson goals and preparation</Button>
    </View>
    {details && <View style={{ gap: 8 }}>
      {guide.canDos.map(canDo => <Text key={canDo} style={s.body}>• {canDo}</Text>)}
      <Text style={s.body}>{guide.preparation}</Text>
      <Text style={s.body}>Script focus: {guide.script}</Text>
      <Text style={s.body}>Register: {guide.register}</Text>
      <Text style={s.muted}>{guide.review}</Text>
    </View>}
  </View>;
}
