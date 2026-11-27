import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { TargetLanguage } from '@smartlingo/domain';
import { Speak } from '../audio/Speak';
import { colors, styles as s } from './theme';

interface DialogueTurn {
  role: string;
  target: string;
  meaning: string;
  reading?: string;
}

export function BilingualDialogue({ turns, highlightedRole = turns[0]?.role, language = 'fr-FR', study = false }: {
  turns: readonly DialogueTurn[];
  highlightedRole?: string;
  language?: TargetLanguage;
  study?: boolean;
}) {
  return <View style={t.transcripts}>
    <Transcript turns={turns} language={language} highlightedRole={highlightedRole} study={study} />
    <Transcript turns={turns} language="en" highlightedRole={highlightedRole} study={study} />
  </View>;
}

function Transcript({ turns, language, highlightedRole, study }: {
  turns: readonly DialogueTurn[]; language: TargetLanguage | 'en'; highlightedRole?: string; study: boolean;
}) {
  const target = language !== 'en';
  const label = language === 'fr-FR' ? 'French' : language === 'ja-JP' ? 'Japanese' : 'English';
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  return <View testID={`dialogue-${label.toLowerCase()}-transcript`} style={[t.transcript, target && !study && t.frenchTranscript]}>
    <Text accessibilityRole="header" aria-level={3} style={[t.transcriptHeading, study && t.studyHeading]}>{label}</Text>
    {turns.map((turn, index) => <View key={index} style={t.turn}>
      <Text style={[s.muted, t.role, turn.role === highlightedRole && t.highlightedRole]}>{turn.role}</Text>
      {target ? <SpokenTurn turn={turn} language={language} /> : <Text {...languageProps} style={s.body}>{turn.meaning}</Text>}
    </View>)}
  </View>;
}

function SpokenTurn({ turn, language }: { turn: DialogueTurn; language: TargetLanguage }) {
  const [voiceError, setVoiceError] = useState('');
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };
  return <>
    <View style={t.frenchTurn}>
      <View style={t.frenchText}>
        <Text {...languageProps} style={[s.body, t.frenchSentence]}>{turn.target}</Text>
        {!!turn.reading && <Text style={s.muted}>{turn.reading}</Text>}
      </View>
      <Speak language={language} text={turn.target} onError={setVoiceError} />
    </View>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, t.voiceError]}>{voiceError}</Text>}
  </>;
}

const t = StyleSheet.create({
  transcripts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 16, minWidth: 0 },
  transcript: { flexBasis: 284, flexGrow: 1, flexShrink: 1, minWidth: 0, padding: 16, gap: 12, borderRadius: 12,
    borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  frenchTranscript: { backgroundColor: colors.paper },
  studyHeading: { marginBottom: 4 },
  transcriptHeading: { ...s.heading, fontSize: 20, lineHeight: 28 },
  turn: { gap: 4, minWidth: 0, borderTopWidth: 1, borderColor: colors.line, paddingTop: 8 },
  role: { fontSize: 14, lineHeight: 20 },
  highlightedRole: { color: colors.ink, fontWeight: '600' },
  frenchTurn: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  frenchText: { flex: 1, minWidth: 0 },
  frenchSentence: { fontWeight: '500' },
  voiceError: { color: colors.danger },
});
