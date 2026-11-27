import { Text, View } from 'react-native';
import type { JapaneseDailyGuide as DailyGuide } from '@smartlingo/content';
import { Disclosure } from '../ui/Disclosure';
import { styles as s } from '../ui/theme';

export function JapaneseDailyGuide({ guide }: { guide: DailyGuide }) {
  return <View testID="japanese-daily-guide">
    <Disclosure title="Lesson goals and preparation" compact>
      <View style={{ gap: 8 }}>
        {guide.canDos.map(canDo => <Text key={canDo} style={s.body}>• {canDo}</Text>)}
        <Text style={s.body}>{guide.preparation}</Text>
        <Text style={s.body}>Script focus: {guide.script}</Text>
        <Text style={s.body}>Register: {guide.register}</Text>
        <Text style={s.muted}>{guide.review}</Text>
      </View>
    </Disclosure>
  </View>;
}
