import { useId } from 'react';
import { Platform, Text, View } from 'react-native';
import type { CourseChoice, CourseDay } from '@smartlingo/domain';
import { useVisitState } from '../app/WebNavigation';
import { Button } from '../ui/controls';
import { FrenchTransferPractice } from '../ui/FrenchTransferPractice';
import { styles as s } from '../ui/theme';

export const frenchCoursePracticeMinutes = '12–15 min with practice';

export function FrenchCoursePractice({ day }: { day: CourseDay }) {
  const [expanded, setExpanded] = useVisitState(`french-practice:${day.id}:choices`, false);
  const choicesId = useId();
  const choices = day.blocks.filter(block => block.kind === 'choice');
  const reflection = day.blocks.find(block => block.kind === 'reflection');
  return <View style={{ gap: 12 }}>
    {!!choices.length && <View style={[s.notice, { gap: 8 }]}>
      <View style={{ alignItems: 'flex-start' }}>
        <Button quiet expanded={expanded} controls={choicesId} trailingIcon={expanded ? 'chevron-down' : 'chevron'}
          onPress={() => setExpanded(value => !value)}>Practise the conversation</Button>
      </View>
      <View nativeID={choicesId} style={{ display: expanded ? 'flex' : 'none', gap: 10 }}>
        {expanded && choices.map(block => <Situation key={block.id} block={block}
          copy={day.compact?.practice.find(item => item.blockId === block.id)} />)}
      </View>
    </View>}
    {reflection && <FrenchTransferPractice lessonId={day.id} prompt={day.compact?.reflectionPrompt ?? reflection.prompt}
      modelTarget={reflection.modelTarget} modelMeaning={reflection.modelMeaning} checks={reflection.checklist} />}
  </View>;
}

function Situation({ block, copy }: {
  block: CourseChoice; copy?: { prompt: string; feedback: string; hint: string };
}) {
  const [selected, setSelected] = useVisitState(`french-practice:${block.id}:selection`, '');
  const [showHint, setShowHint] = useVisitState(`french-practice:${block.id}:hint`, false);
  const correct = selected === block.answerId;
  const answer = block.choices.find(choice => choice.id === block.answerId);
  return <View style={[s.notice, { gap: 8 }]} testID="french-course-situation">
    <Text accessibilityRole="header" style={s.body}>{copy?.prompt ?? block.prompt}</Text>
    {block.choices.map(choice => <Button key={choice.id} compact
      toggle selected={selected === choice.id} onPress={() => setSelected(choice.id)}>
      <Text {...(Platform.OS === 'web' ? { lang: 'fr-FR' } : { accessibilityLanguage: 'fr-FR' })}>{choice.target}</Text>
    </Button>)}
    {selected && <Text accessibilityLiveRegion="polite" style={s.body}>
      {correct ? copy?.feedback ?? block.feedback : 'Try again. Choose the reply that fits the situation.'}
    </Text>}
    {correct && answer && answer.meaning !== answer.target && <Text style={s.muted}>{answer.meaning}</Text>}
    {!correct && <View style={{ alignItems: 'flex-start' }}>
      <Button quiet compact expanded={showHint} onPress={() => setShowHint(value => !value)}>{showHint ? 'Hide hint' : 'Show a hint'}</Button>
      {showHint && <Text style={s.muted}>{copy?.hint ?? block.hint}</Text>}
    </View>}
  </View>;
}
