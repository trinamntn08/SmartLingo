import { Text, View } from 'react-native';
import { Button } from '../ui/controls';
import { styles as s } from '../ui/theme';
import type { CourseLearningModel } from './useCourseLearning';

export function CourseWriteStatus({ learning }: { learning: Pick<CourseLearningModel, 'busy' | 'saveError' | 'retry' | 'discard'> }) {
  if (learning.saveError) return <View style={s.error}>
    <Text accessibilityRole="alert" style={s.body}>{learning.saveError}</Text>
    <Text style={s.muted}>This action has not finished saving. Retry keeps the same event IDs.</Text>
    <View style={s.row}>
      <Button disabled={learning.busy} onPress={learning.retry}>Retry course save</Button>
      <Button disabled={learning.busy} onPress={learning.discard}>Discard unsaved course action</Button>
    </View>
  </View>;
  return learning.busy ? <Text accessibilityLiveRegion="polite" style={s.muted}>Saving course progress…</Text> : null;
}
