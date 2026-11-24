import { useId } from 'react';
import { Platform, Text, View } from 'react-native';
import { useVisitState } from '../app/WebNavigation';
import { Button } from './controls';
import { colors, styles as s } from './theme';

export const frenchTopicPracticeMinutes = '10–12 min with practice';

export function FrenchTransferPractice({ lessonId, prompt, modelTarget, modelMeaning, checks }: {
  lessonId: string; prompt: string; modelTarget: string; modelMeaning: string; checks: readonly string[];
}) {
  const [expanded, setExpanded] = useVisitState(`french-practice:${lessonId}:model`, false);
  const modelId = useId();
  return <View style={[s.notice, { gap: 10 }]} testID="french-transfer-practice">
    <Text accessibilityRole="header" style={s.heading}>Try a real-life response</Text>
    <Text style={s.body}>{prompt}</Text>
    <Text style={s.muted}>Say your reply aloud or write it on your own. Compare it with the example, then try again.</Text>
    <View style={{ alignItems: 'flex-start' }}>
      <Button quiet compact expanded={expanded} controls={modelId} onPress={() => setExpanded(value => !value)}>
        {expanded ? 'Hide example reply' : 'Show example reply'}
      </Button>
    </View>
    <View nativeID={modelId} style={{ display: expanded ? 'flex' : 'none', gap: 8 }}>
      {expanded && <>
        <Text {...(Platform.OS === 'web' ? { lang: 'fr-FR' } : { accessibilityLanguage: 'fr-FR' })}
          style={[s.body, { color: colors.dark, fontWeight: '600' }]}>{modelTarget}</Text>
        <Text style={s.body}>{modelMeaning}</Text>
        <Text accessibilityRole="header" style={[s.muted, { fontWeight: '600' }]}>Check your reply</Text>
        {checks.map(check => <Text key={check} style={s.body}>{check}</Text>)}
      </>}
    </View>
  </View>;
}
