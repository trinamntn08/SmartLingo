import { Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { RecordingCredits } from '../audio/japanese/RecordingCredits';
import { AudioPreferencesPanel } from '../audio/AudioPreferencesPanel';
import { GeneratedSpeechPanel } from '../audio/generated/GeneratedSpeechPanel';
import { BackupPanel } from '../backup/BackupPanel';
import type { useCatalogue } from '../content/useCatalogue';
import { OfflinePanel } from '../offline/OfflinePanel';
import { isAndroidApp } from '../platform/runtime';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { Icon } from '../ui/Icon';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

interface ProfileScreenProps {
  language: TargetLanguage;
  model: LearningModel;
  catalogue: ReturnType<typeof useCatalogue>;
  onOpenEditor: () => void;
  onChangeLanguage?: () => void;
  languageChangeDisabled?: boolean;
}

export function ProfileScreen({ catalogue, onOpenEditor, language, model, onChangeLanguage, languageChangeDisabled }: ProfileScreenProps) {
  const android = isAndroidApp();
  return <View style={[t.page, { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 12 }]}>
    <Text accessibilityRole="header" aria-level={1} style={s.title}>Profile</Text>
    <View style={[t.panelHeader, { paddingVertical: 8 }]}>
      <View style={s.row}><Icon name="globe" color={colors.primary} /><Text style={s.body}>{languageNames[language]}</Text></View>
      {onChangeLanguage && <Button compact quiet onPress={onChangeLanguage} disabled={languageChangeDisabled}>Switch language</Button>}
    </View>
    <Disclosure key={`audio-${language}`} title="Audio & pronunciation" compact icon="speaker">
      <AudioPreferencesPanel language={language} />
      {!android && language === 'fr-FR' && <GeneratedSpeechPanel />}
    </Disclosure>
    <Disclosure title="Offline & backups" compact icon="offline">
      <Text style={s.muted}>{android
        ? 'French and Japanese lessons are bundled for offline study.'
        : 'Offline downloads include French and Japanese.'} Back up both languages before clearing storage or changing devices.</Text>
      {!android && <OfflinePanel />}
      <BackupPanel />
    </Disclosure>
    {!android && language === 'fr-FR' && <Disclosure title="Curriculum tools" compact icon="book">
      <Button onPress={onOpenEditor}>Open curriculum editor</Button>
      <Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button>
      {!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}
      {!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}
    </Disclosure>}
    <Disclosure title="About SmartLingo" compact icon="settings">
      <Text style={s.body}>Your progress and notebook stay on this device.</Text>
      {!model.loadError && <Text style={s.muted}>{model.notebook.length} saved {model.notebook.length === 1 ? 'word' : 'words'} in {languageNames[language]}</Text>}
      {language === 'ja-JP' && <>
        <RecordingCredits />
        <Text style={s.muted}>Synthetic Japanese clips use VOICEVOX:四国めたん.</Text>
      </>}
      <Text style={s.muted}>Bundled lessons are drafts. Completion records practice.</Text>
    </Disclosure>
  </View>;
}
