import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Speak } from '../audio/Speak';
import { ContextImage } from './ContextImage';
import type { ContextPhoto } from './contextPhotos';
import { colors, styles as s } from './theme';

interface DialogueTurn {
  role: string;
  target: string;
  meaning: string;
  reading?: string;
}

export function BilingualDialogue({ turns, photo, highlightedRole = turns[0]?.role }: {
  turns: readonly DialogueTurn[];
  photo?: ContextPhoto;
  highlightedRole?: string;
}) {
  return <View style={t.dialogue}>
    {photo && <View testID="dialogue-context-photo" style={t.photoFrame}>
      <ContextImage photo={photo} style={t.photo} />
    </View>}
    <View style={t.transcripts}>
      <Transcript turns={turns} language="fr-FR" highlightedRole={highlightedRole} />
      <Transcript turns={turns} language="en" highlightedRole={highlightedRole} />
    </View>
  </View>;
}

function Transcript({ turns, language, highlightedRole }: {
  turns: readonly DialogueTurn[]; language: 'fr-FR' | 'en'; highlightedRole?: string;
}) {
  const french = language === 'fr-FR';
  const label = french ? 'French' : 'English';
  const languageProps = Platform.OS === 'web' ? { lang: language } : { accessibilityLanguage: language };

  return <View testID={`dialogue-${label.toLowerCase()}-transcript`} style={[t.transcript, french && t.frenchTranscript]}>
    <Text accessibilityRole="header" style={t.transcriptHeading}>{label}</Text>
    {turns.map((turn, index) => <View key={index} style={[t.turn, index === 0 && t.firstTurn]}>
      <Text style={[s.eyebrow, turn.role === highlightedRole && t.highlightedRole]}>{turn.role}</Text>
      {french ? <FrenchTurn turn={turn} /> : <Text {...languageProps} style={s.body}>{turn.meaning}</Text>}
    </View>)}
  </View>;
}

function FrenchTurn({ turn }: { turn: DialogueTurn }) {
  const [voiceError, setVoiceError] = useState('');
  const languageProps = Platform.OS === 'web' ? { lang: 'fr-FR' } : { accessibilityLanguage: 'fr-FR' };
  return <>
    <View style={t.frenchTurn}>
      <View style={t.frenchText}>
        <Text {...languageProps} style={[s.body, t.frenchSentence]}>{turn.target}</Text>
        {!!turn.reading && <Text style={s.muted}>{turn.reading}</Text>}
      </View>
      <Speak language="fr-FR" text={turn.target} onError={setVoiceError} />
    </View>
    {!!voiceError && <Text accessibilityRole="alert" style={[s.muted, t.voiceError]}>{voiceError}</Text>}
  </>;
}

const t = StyleSheet.create({
  dialogue: { gap: 14, minWidth: 0 },
  photoFrame: { alignItems: 'center' },
  photo: { width: '100%', maxWidth: 420, aspectRatio: 2, borderRadius: 14 },
  transcripts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 12 },
  transcript: { flexBasis: 290, flexGrow: 1, flexShrink: 1, minWidth: 0, padding: 14, gap: 8, borderRadius: 14,
    borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  frenchTranscript: { backgroundColor: colors.paper },
  transcriptHeading: { ...s.heading, fontSize: 20, lineHeight: 27 },
  turn: { gap: 2, minWidth: 0, borderTopWidth: 1, borderColor: colors.line, paddingTop: 8 },
  firstTurn: { borderTopWidth: 0, paddingTop: 0 },
  highlightedRole: { color: colors.primary },
  frenchTurn: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 0 },
  frenchText: { flex: 1, minWidth: 0 },
  frenchSentence: { fontWeight: '600' },
  voiceError: { color: colors.danger },
});
