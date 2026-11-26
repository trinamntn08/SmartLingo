import { Text, View } from 'react-native';
import type { JapanesePracticeResult, JapanesePracticeSet, JapanesePracticeTask } from '@smartlingo/domain';
import { useVisitState } from '../app/WebNavigation';
import { Disclosure } from '../ui/Disclosure';
import { styles as s } from '../ui/theme';
import { JapanesePractice } from './JapanesePractice';

export function JapaneseLessonPractice({ practice, completedIds, onResult, disabled, browseOnly }: {
  practice: JapanesePracticeSet;
  completedIds: readonly string[];
  onResult: (task: JapanesePracticeTask, result: JapanesePracticeResult, assisted: boolean) => void;
  disabled: boolean;
  browseOnly: boolean;
}) {
  const [open, setOpen] = useVisitState(`japanese-practice-open:${practice.tasks[0].id}`, false);
  const finished = practice.tasks.every(task => completedIds.includes(task.id));
  const count = practice.tasks.filter(task => completedIds.includes(task.id)).length;
  return <Disclosure compact open={open} onOpenChange={setOpen} title={practice.checkpoint ? 'Unit check' : 'Real-life practice'}
    description={finished ? 'Practice complete. Revisit any task.' : `${count} of ${practice.tasks.length} tasks recorded`}>
    <View style={{ gap: 12 }} accessibilityLiveRegion="polite">
      {browseOnly && <Text style={s.muted}>You can practise here while saving is unavailable.</Text>}
      {practice.revisit && <Text style={s.muted}>Review next · {practice.revisit}</Text>}
    </View>
    <JapanesePractice tasks={practice.tasks} completedIds={completedIds}
      disabled={disabled && !browseOnly} onResult={browseOnly ? undefined : onResult} />
  </Disclosure>;
}
