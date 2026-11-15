import { Text, TextInput, View } from 'react-native';
import type { Lesson, Vocabulary } from '@smartlingo/domain';
import { styles as s } from '../ui/theme';
import { Button } from '../ui/controls';
import { vocabularyPresentation } from '../content/vocabularyPresentation';

function Field({ label, value, onChange, disabled, multiline = true, maxLength = 2000 }: {
  label: string; value: string; onChange: (value: string) => void; disabled: boolean; multiline?: boolean; maxLength?: number;
}) {
  return <View style={{ gap: 8 }}><Text style={s.body}>{label}</Text>
    <TextInput accessibilityLabel={label} editable={!disabled} value={value} onChangeText={onChange} maxLength={maxLength}
      multiline={multiline} style={[s.input, multiline && { minHeight: 84, textAlignVertical: 'top' }]} />
  </View>;
}

export function DraftFields({ draft, onChange, disabled }: { draft: Lesson; onChange: (draft: Lesson) => void; disabled: boolean }) {
  function changeWord(index: number, field: keyof Vocabulary, value: string) {
    onChange({ ...draft, vocabulary: draft.vocabulary.map((word, at) => at === index ? { ...word, [field]: value } : word) });
  }
  function changeGender(index: number, gender: Vocabulary['gender']) {
    onChange({ ...draft, vocabulary: draft.vocabulary.map((word, at) => at === index ? { ...word, gender, note: vocabularyPresentation(word).note } : word) });
  }
  return <View style={{ gap: 24 }}>
    <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Lesson introduction</Text>
      <Field label="Lesson title" value={draft.title} disabled={disabled} multiline={false} onChange={title => onChange({ ...draft, title })} />
      <Field label="Lesson subtitle" value={draft.subtitle} disabled={disabled} multiline={false} onChange={subtitle => onChange({ ...draft, subtitle })} />
      <Field label="Practical outcome" value={draft.outcome} disabled={disabled} onChange={outcome => onChange({ ...draft, outcome })} />
    </View>
    <View style={s.notice}><Text style={s.body}>This first editor changes headings, explanations, and vocabulary support. French target words, dialogues, pictures, and exercise answers stay fixed in this slice.</Text></View>
    {draft.vocabulary.map((word, index) => <View key={word.id} style={s.card}><Text style={s.eyebrow}>Vocabulary {index + 1} · {word.id}</Text><Text accessibilityRole="header" style={s.heading}>{word.target}</Text>
      <View style={s.row}>{([
        [undefined, 'No gender'], ['masculine', 'm.'], ['feminine', 'f.'], ['both', 'm./f.'],
      ] as const).map(([gender, label]) => <Button key={label} selected={vocabularyPresentation(word).gender === gender} disabled={disabled}
        label={`${word.target} — ${label}`} onPress={() => changeGender(index, gender)}>{label}</Button>)}</View>
      <Field label={`${word.target} — English meaning`} value={word.meaning} disabled={disabled} maxLength={500} onChange={value => changeWord(index, 'meaning', value)} />
      <Field label={`${word.target} — French example`} value={word.example} disabled={disabled} maxLength={1000} onChange={value => changeWord(index, 'example', value)} />
      <Field label={`${word.target} — Example translation`} value={word.exampleMeaning} disabled={disabled} onChange={value => changeWord(index, 'exampleMeaning', value)} />
      <Field label={`${word.target} — Word note`} value={word.note} disabled={disabled} onChange={value => changeWord(index, 'note', value)} />
    </View>)}
    <View style={s.card}><Text accessibilityRole="header" style={s.heading}>Optional grammar help</Text>
      <Field label="Grammar title" value={draft.grammar.title} disabled={disabled} multiline={false} onChange={title => onChange({ ...draft, grammar: { ...draft.grammar, title } })} />
      <Field label="Grammar explanation" value={draft.grammar.explanation} disabled={disabled} onChange={explanation => onChange({ ...draft, grammar: { ...draft.grammar, explanation } })} />
    </View>
  </View>;
}
