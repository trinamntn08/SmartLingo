import { Platform, Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { AudioPreferencesPanel } from '../audio/AudioPreferencesPanel';
import { GeneratedSpeechPanel } from '../audio/generated/GeneratedSpeechPanel';
import { BackupPanel } from '../backup/BackupPanel';
import type { useCatalogue } from '../content/useCatalogue';
import { OfflinePanel } from '../offline/OfflinePanel';
import { Button } from '../ui/controls';
import { Disclosure } from '../ui/Disclosure';
import { colors, styles as s } from '../ui/theme';
import type { LearningModel } from '../ui/useLearning';

interface ProfileScreenProps {
  language: TargetLanguage;
  model: LearningModel;
  catalogue: ReturnType<typeof useCatalogue>;
  onOpenEditor: () => void;
}

export function ProfileScreen({ catalogue, onOpenEditor, language }: ProfileScreenProps) {
  return <View style={{ gap: 24 }}>
    <View style={{ gap: 9 }}>
      <Text style={s.eyebrow}>{languageNames[language]} · ENGLISH EXPLANATIONS</Text>
      <Text accessibilityRole="header" style={s.title}>Your preferences</Text>
      <Text style={s.body}>Your progress and notebook stay in this browser on this device. There is no account or sync. Keep a private backup before clearing browser data.</Text>
    </View>

    <Disclosure key={`audio-${language}`} title="Audio & pronunciation" description="Choose a voice, adjust the pace and manage saved audio.">
      <AudioPreferencesPanel language={language} />
      {language === 'fr-FR' && <GeneratedSpeechPanel />}
    </Disclosure>

    <Disclosure title="Offline & backups" description="Download lessons and keep a private copy of your learning.">
      <Text style={[s.muted, { paddingHorizontal: 8 }]}>Offline app downloads and private learning backups include both French and Japanese.</Text>
      <OfflinePanel />
      <BackupPanel />
    </Disclosure>

    {language === 'fr-FR' && <Disclosure title="Curriculum tools" description="Load published lessons or open the local draft workshop.">
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
    </Disclosure>}

    <Disclosure title="About SmartLingo" description="Study support, draft content and photo credits.">
      <View style={[s.card, { borderWidth: 0, boxShadow: 'none' }]}>
        {language === 'ja-JP' && <>
          <Text accessibilityRole="header" style={s.heading}>Japanese study support</Text>
          <Text style={s.body}>Japanese lessons, kana readings, listening and guided speaking work without AI. Optional AI conversation, Azure neural audio and the curriculum workshop currently support French only.</Text>
        </>}
        <Text style={s.body}>Bundled lessons don’t need the local API or an AI key. {language === 'ja-JP' ? 'Japanese listening uses a device voice, saved clip or free local VOICEVOX voice.' : 'French listening uses a device voice or explicitly saved neural audio.'} You can always read and practise from the text.</Text>
        <Text style={s.muted}>Session completion records practice, not a language level or proficiency score.</Text>
        <Text style={s.muted}>Draft lessons, photographs and illustrations still need owner review. Keep private learning backups separately; browser storage may be cleared or evicted.</Text>
        {Platform.OS === 'web' && <a href="/vocabulary-photos/credits.html" target="_blank" rel="noopener noreferrer" style={{ color: colors.ink, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>Photo credits and licences</a>}
      </View>
    </Disclosure>
  </View>;
}
