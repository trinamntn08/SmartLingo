import { Platform, Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { AudioPreferencesPanel } from '../audio/AudioPreferencesPanel';
import { GeneratedSpeechPanel } from '../audio/generated/GeneratedSpeechPanel';
import { BackupPanel } from '../backup/BackupPanel';
import type { useCatalogue } from '../content/useCatalogue';
import { OfflinePanel } from '../offline/OfflinePanel';
import { Badge, Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

interface ProfileScreenProps {
  language: TargetLanguage;
  model: LearningModel;
  catalogue: ReturnType<typeof useCatalogue>;
  onOpenEditor: () => void;
}

export function ProfileScreen({ model, catalogue, onOpenEditor, language }: ProfileScreenProps) {
  const completed = model.events.filter(event => event.activity === 'completion' && event.result === 'completed').length;
  return <View style={{ gap: 24 }}>
    <Text style={s.eyebrow}>Your learning space</Text>
    <Text accessibilityRole="header" style={s.title}>At your own pace.</Text>
    <View style={s.card}>
      <Text style={s.heading}>A local learner profile</Text>
      <Text style={s.body}>Learning {languageNames[language]} · English explanations · Draft lessons</Text>
      <View style={s.row}>
        <Badge>{completed} sessions completed</Badge>
        <Badge>{model.notebook.length} notebook entries</Badge>
      </View>
      <Text style={s.muted}>Session completion records practice, not a language level or proficiency score.</Text>
    </View>
    {language === 'fr-FR' && <>
      <View style={s.card}>
        <Text style={s.heading}>Local curriculum workshop</Text>
        <Text style={s.body}>Edit a draft, preview its saved revision, and review it before explicitly publishing to the local catalogue.</Text>
        <Button onPress={onOpenEditor}>Open curriculum editor</Button>
      </View>
      <View style={s.card}>
        <Text style={s.heading}>Published lessons</Text>
        <Text style={s.body}>Load owner-published local revisions into this browser. Draft edits stay in the workshop. Earlier practice and personal notes stay recorded when a new revision arrives.</Text>
        <Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button>
        {!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}
        {!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}
      </View>
    </>}
    {language === 'ja-JP' && <View style={s.card}>
      <Text style={s.heading}>Japanese study support</Text>
      <Text style={s.body}>Vocabulary, kana readings, dialogues, sentence building and your personal notebook work without AI. Learn includes listening comprehension, video/audio resources and guided speaking in Japanese. Optional AI conversation, Azure neural audio and the curriculum workshop currently support French only.</Text>
    </View>}
    <OfflinePanel />
    <AudioPreferencesPanel key={language} language={language} />
    {language === 'fr-FR' && <GeneratedSpeechPanel />}
    <Text style={s.muted}>Offline app downloads and private learning backups include both French and Japanese.</Text>
    <BackupPanel />
    <View style={s.card}>
      <Text style={s.heading}>About this preview</Text>
      <Text style={s.body}>Your progress and notebook stay in this browser on this device. There is no account or sync. Clearing browser data removes these notes.</Text>
      <Text style={s.body}>Bundled lessons don’t need the local API or an AI key. {language === 'ja-JP' ? 'Japanese listening uses a device voice, saved clip or free local VOICEVOX voice.' : 'French listening uses a device voice or explicitly saved neural audio.'} You can always read and practise from the text.</Text>
      <Text style={s.muted}>Draft lessons, photographs and illustrations still need owner review. Keep private learning backups separately; browser storage may be cleared or evicted.</Text>
      {Platform.OS === 'web' && <a href="/vocabulary-photos/credits.html" target="_blank" rel="noopener noreferrer" style={{ color: colors.ink, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Photo credits and licences</a>}
    </View>
  </View>;
}
