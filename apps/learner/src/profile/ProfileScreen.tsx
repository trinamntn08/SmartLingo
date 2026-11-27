import { StyleSheet, Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { AudioPreferencesPanel } from '../audio/AudioPreferencesPanel';
import { GeneratedSpeechPanel } from '../audio/generated/GeneratedSpeechPanel';
import { BackupPanel } from '../backup/BackupPanel';
import type { useCatalogue } from '../content/useCatalogue';
import { OfflinePanel } from '../offline/OfflinePanel';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';
import { ScreenHeader } from '../ui/ScreenHeader';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

interface ProfileScreenProps {
  language: TargetLanguage;
  model: LearningModel;
  catalogue: ReturnType<typeof useCatalogue>;
  onOpenEditor: () => void;
}

export function ProfileScreen({ catalogue, onOpenEditor, language, model }: ProfileScreenProps) {
  return <View style={t.page}>
    <ScreenHeader title="Profile" />
    <View style={t.board}>
      <View style={[t.main, profile.settings]}>
        <Disclosure key={`audio-${language}`} title="Audio & pronunciation" description="Voice, playback speed and saved audio">
          <AudioPreferencesPanel language={language} />
          {language === 'fr-FR' && <GeneratedSpeechPanel />}
        </Disclosure>

        <Disclosure title="Offline & backups" description="Lesson downloads and private backups for both languages">
          <OfflinePanel />
          <BackupPanel />
        </Disclosure>

        {language === 'fr-FR' && <Disclosure title="Curriculum tools" description="Local drafts and published lessons">
          <View style={profile.tool}>
            <Text accessibilityRole="header" style={t.sectionTitle}>Local curriculum workshop</Text>
            <Text style={s.muted}>Edit a draft and preview its saved revision before publishing to the local catalogue.</Text>
            <Button onPress={onOpenEditor}>Open curriculum editor</Button>
          </View>
          <View style={[profile.tool, t.listRow]}>
            <Text accessibilityRole="header" style={t.sectionTitle}>Published lessons</Text>
            <Text style={s.muted}>Load owner-published revisions into this browser. Your earlier practice and personal notes stay recorded.</Text>
            <Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button>
            {!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}
            {!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}
          </View>
        </Disclosure>}

        <Disclosure title="About SmartLingo" description="Study support and draft content">
          <View style={profile.tool}>
            <Text style={s.body}>Read and practise from bundled lessons without AI. {language === 'ja-JP'
              ? 'Japanese listening can use a device voice, saved clip or free local VOICEVOX voice.'
              : 'French listening can use a device voice or saved neural audio.'}</Text>
            <Text style={s.muted}>French supports optional AI practice. SmartLingo asks for the microphone when you choose to record.</Text>
            <Text style={s.muted}>Session completion records practice. Draft lessons, photographs and illustrations still need owner review.</Text>
          </View>
        </Disclosure>
      </View>
      <View style={[t.side, t.panel, profile.summary]}>
        <View style={t.stack}>
          <Text style={t.detail}>Study language</Text>
          <Text accessibilityRole="header" style={t.sectionTitle}>{languageNames[language]}</Text>
          <Text style={s.muted}>English explanations{!model.loadError ? ` · ${model.notebook.length} saved ${model.notebook.length === 1 ? 'word' : 'words'}` : ''}</Text>
        </View>
        <View style={s.divider} />
        <Text accessibilityRole="header" style={t.sectionTitle}>Stored in this browser</Text>
        <Text style={s.muted}>Your progress and notebook stay in this browser. Export a private backup before clearing browser data or moving to another device.</Text>
      </View>
    </View>
  </View>;
}

const profile = StyleSheet.create({
  settings: { flexBasis: 560 },
  summary: { gap: 12 },
  tool: { alignItems: 'flex-start', gap: 12, paddingHorizontal: 8, paddingBottom: 8 },
});
