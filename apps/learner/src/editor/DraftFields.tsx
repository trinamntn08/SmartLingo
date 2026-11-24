import { Text, TextInput, View } from 'react-native';
import type { Lesson, Vocabulary } from '@smartlingo/domain';
import { colors, designTokens, styles as s } from '../ui/theme';
import { Button } from '../ui/controls';
import { vocabularyPresentation } from '../content/vocabularyPresentation';

function Field({ label, value, onChange, disabled, multiline = true, maxLength = 2000, inputMode }: {
  label: string; value: string; onChange: (value: string) => void; disabled: boolean; multiline?: boolean; maxLength?: number; inputMode?: 'numeric';
}) {
  return <View style={{ gap: 8, minWidth: 0 }}><Text style={[s.body, { ...designTokens.typography.button, textAlign: 'left' }]}>{label}</Text>
    <TextInput accessibilityLabel={label} editable={!disabled} value={value} onChangeText={onChange} maxLength={maxLength}
      multiline={multiline} inputMode={inputMode} style={[s.input, { backgroundColor: colors.paper }, multiline && { minHeight: 92, textAlignVertical: 'top' }]} />
  </View>;
}

export function DraftFields({ draft, onChange, disabled, durationText, onDurationChange }: {
  draft: Lesson; onChange: (draft: Lesson) => void; disabled: boolean; durationText: string; onDurationChange: (value: string) => void;
}) {
  function changeWord(index: number, field: keyof Vocabulary, value: string) {
    onChange({ ...draft, vocabulary: draft.vocabulary.map((word, at) => at === index ? { ...word, [field]: value } : word) });
  }
  function changeGender(index: number, gender: Vocabulary['gender']) {
    onChange({ ...draft, vocabulary: draft.vocabulary.map((word, at) => at === index ? { ...word, gender, note: vocabularyPresentation(word).note } : word) });
  }
  function changeDialogue(index: number, field: keyof Lesson['dialogue'][number], value: string) {
    onChange({ ...draft, dialogue: draft.dialogue.map((line, at) => at === index ? { ...line, [field]: value } : line) });
  }
  return <View style={{ gap: 24 }}>
    <View style={s.card}><Text style={s.eyebrow}>01 · Lesson details</Text><Text accessibilityRole="header" style={s.heading}>Lesson introduction</Text>
      <Text style={s.muted}>Set the scene and the practical outcome learners will work towards.</Text>
      <Field label="Lesson title" value={draft.title} disabled={disabled} multiline={false} onChange={title => onChange({ ...draft, title })} />
      <Field label="Lesson subtitle" value={draft.subtitle} disabled={disabled} multiline={false} onChange={subtitle => onChange({ ...draft, subtitle })} />
      <Field label="Practical outcome" value={draft.outcome} disabled={disabled} onChange={outcome => onChange({ ...draft, outcome })} />
      <Field label="Estimated duration in minutes" value={durationText} disabled={disabled} multiline={false} maxLength={10} inputMode="numeric" onChange={onDurationChange} />
      <Text style={s.muted}>Choose a whole number from 1 to 60. This is a suggested study time, not a timer or completion requirement.</Text>
      <View style={[s.split, { gap: 16 }]}><View style={[s.column, { flexBasis: 220 }]}><Field label="Lesson topic" value={draft.topic} disabled={disabled} multiline={false} onChange={topic => onChange({ ...draft, topic })} /></View>
      <View style={[s.column, { flexBasis: 220 }]}><Field label="Learner role" value={draft.role} disabled={disabled} multiline={false} onChange={role => onChange({ ...draft, role })} /></View></View>
      <Text style={s.muted}>Use the same role name in the dialogue for the learner’s lines. Dialogue speaker labels can be edited below.</Text>
      <Text style={s.body}>Estimated lesson level</Text>
      <View style={s.row}>{(['foundation', 'A1', 'A2', 'B1'] as const).map(level => <Button key={level} selected={draft.level === level} disabled={disabled}
        label={`Lesson level ${level === 'foundation' ? 'Foundations' : level}`} onPress={() => onChange({ ...draft, level })}>{level === 'foundation' ? 'Foundations' : level}</Button>)}</View>
      <Text style={s.muted}>Level labels describe lesson content. They do not measure a learner’s proficiency.</Text>
    </View>
    <View style={s.notice}><Text style={s.body}>Edit lesson details, vocabulary support, dialogue text and grammar help. Vocabulary target words, pictures, exercise answers and the order of dialogue lines stay fixed in this editor.</Text></View>
    <View style={{ gap: 8 }}><Text style={s.eyebrow}>02 · Vocabulary support</Text><Text accessibilityRole="header" style={s.heading}>Words in context</Text><Text style={s.muted}>{draft.vocabulary.length} entries · English meanings, examples and useful notes</Text></View>
    {draft.vocabulary.map((word, index) => <View key={word.id} style={[s.card, { borderLeftWidth: 4, borderLeftColor: colors.yellow }]}><Text style={s.eyebrow}>Vocabulary {index + 1} · {word.id}</Text><Text accessibilityRole="header" style={[s.heading, { fontSize: 30, lineHeight: 40 }]}>{word.target}</Text>
      <View style={s.row}>{([
        [undefined, 'No gender'], ['masculine', 'm.'], ['feminine', 'f.'], ['both', 'm./f.'],
      ] as const).map(([gender, label]) => <Button key={label} selected={vocabularyPresentation(word).gender === gender} disabled={disabled}
        label={`${word.target} — ${label}`} onPress={() => changeGender(index, gender)}>{label}</Button>)}</View>
      <Field label={`${word.target} — English meaning`} value={word.meaning} disabled={disabled} maxLength={500} onChange={value => changeWord(index, 'meaning', value)} />
      <View style={[s.split, { gap: 16 }]}><View style={[s.column, { flexBasis: 220 }]}><Field label={`${word.target} — French example`} value={word.example} disabled={disabled} maxLength={1000} onChange={value => changeWord(index, 'example', value)} /></View>
      <View style={[s.column, { flexBasis: 220 }]}><Field label={`${word.target} — Example translation`} value={word.exampleMeaning} disabled={disabled} onChange={value => changeWord(index, 'exampleMeaning', value)} /></View></View>
      <Field label={`${word.target} — Word note`} value={word.note} disabled={disabled} onChange={value => changeWord(index, 'note', value)} />
    </View>)}
    <View style={{ gap: 16 }}><Text style={s.eyebrow}>03 · Conversation</Text><Text accessibilityRole="header" style={s.heading}>Dialogue</Text>
      <Text style={s.body}>Edit each speaker role, French line and English translation. Save a draft, then use the lesson preview to review the conversation.</Text>
      {draft.dialogue.map((line, index) => <View key={index} style={s.card}>
        <Text style={s.eyebrow}>Dialogue line {index + 1}</Text>
        <Field label={`Dialogue line ${index + 1} — Speaker role`} value={line.role} disabled={disabled} multiline={false} onChange={value => changeDialogue(index, 'role', value)} />
        <View style={[s.split, { gap: 16 }]}><View style={[s.column, { flexBasis: 220 }]}><Field label={`Dialogue line ${index + 1} — French text`} value={line.target} disabled={disabled} onChange={value => changeDialogue(index, 'target', value)} /></View>
        <View style={[s.column, { flexBasis: 220 }]}><Field label={`Dialogue line ${index + 1} — English translation`} value={line.meaning} disabled={disabled} onChange={value => changeDialogue(index, 'meaning', value)} /></View></View>
      </View>)}
    </View>
    <View style={s.card}><Text style={s.eyebrow}>04 · Language notes</Text><Text accessibilityRole="header" style={s.heading}>Optional grammar help</Text>
      <Field label="Grammar title" value={draft.grammar.title} disabled={disabled} multiline={false} onChange={title => onChange({ ...draft, grammar: { ...draft.grammar, title } })} />
      <Field label="Grammar explanation" value={draft.grammar.explanation} disabled={disabled} onChange={explanation => onChange({ ...draft, grammar: { ...draft.grammar, explanation } })} />
    </View>
  </View>;
}
