import { Text, View } from 'react-native';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
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
import { ScreenHeader } from '../ui/ScreenHeader';
import { Icon } from '../ui/Icon';
import { toolsStyles as t } from '../ui/learnerToolsStyles';

interface ProfileScreenProps {
  language: TargetLanguage;
  model: LearningModel;
  catalogue: ReturnType<typeof useCatalogue>;
  onOpenEditor: () => void;
}

export function ProfileScreen({ catalogue, onOpenEditor, language, model }: ProfileScreenProps) {
  const android = isAndroidApp();
  return <View style={t.page}>
    <ScreenHeader title="Profile" subtitle={android ? 'Manage your audio and learning data.' : 'Manage your audio, offline lessons and learning data.'} />
    <View style={t.board}>
      <View style={[t.main, { flexBasis: 600 }]}>
      <Text accessibilityRole="header" style={t.sectionTitle}>Learning settings</Text>

    <Disclosure key={`audio-${language}`} title="Audio & pronunciation" description={android ? 'Choose a device voice and adjust the pace.' : 'Choose a voice, adjust the pace and manage saved audio.'}>
      <AudioPreferencesPanel language={language} />
      {!android && language === 'fr-FR' && <GeneratedSpeechPanel />}
    </Disclosure>

    <Disclosure title="Offline & backups" description={android ? 'Study bundled lessons and keep a private copy of your learning.' : 'Download lessons and keep a private copy of your learning.'}>
      <Text style={[s.muted, { paddingHorizontal: 8 }]}>{android
        ? 'French and Japanese lessons are bundled for offline study. Learning backups include both languages.'
        : 'Offline app downloads and private learning backups include both French and Japanese.'}</Text>
      {!android && <OfflinePanel />}
      <BackupPanel />
    </Disclosure>

    {!android && language === 'fr-FR' && <Disclosure title="Curriculum tools" description="Load published lessons or open the local draft workshop.">
      <View style={t.inset}>
        <Text style={s.heading}>Local curriculum workshop</Text>
        <Text style={s.body}>Edit a draft, preview its saved revision, and review it before explicitly publishing to the local catalogue.</Text>
        <Button onPress={onOpenEditor}>Open curriculum editor</Button>
      </View>
      <View style={t.inset}>
        <Text style={s.heading}>Published lessons</Text>
        <Text style={s.body}>Load owner-published local revisions into this browser. Draft edits stay in the workshop. Earlier practice and personal notes stay recorded when a new revision arrives.</Text>
        <Button disabled={catalogue.busy} onPress={() => void catalogue.refreshPublished()}>{catalogue.busy ? 'Loading published lessons…' : 'Load published lessons'}</Button>
        {!!catalogue.error && <Text accessibilityRole="alert" style={s.body}>{catalogue.error}</Text>}
        {!!catalogue.message && <Text accessibilityLiveRegion="polite" style={s.body}>{catalogue.message}</Text>}
      </View>
    </Disclosure>}

    <Disclosure title="About SmartLingo" description="Study support and draft content.">
      <View style={[t.stack, { padding: 8, gap: 16 }]}>
        {!android && language === 'ja-JP' && <>
          <Text accessibilityRole="header" style={s.heading}>Japanese study support</Text>
          <Text style={s.body}>Japanese lessons, kana readings, listening and guided speaking work without AI. Optional AI conversation, Azure neural audio and the curriculum workshop currently support French only.</Text>
        </>}
        <Text style={s.body}>Bundled lessons don’t need the local API or an AI key. {android
          ? 'Listening uses a device voice when available.'
          : language === 'ja-JP' ? 'Japanese listening uses a device voice, saved clip or free local VOICEVOX voice.' : 'French listening uses a device voice or explicitly saved neural audio.'} You can always read and practise from the text.</Text>
        <Text style={s.muted}>Session completion records practice, not a language level or proficiency score.</Text>
        <Text style={s.muted}>Draft lessons, photographs and illustrations still need owner review. {android ? 'Keep private learning backups separately.' : 'Keep private learning backups separately; browser storage may be cleared or evicted.'}</Text>
      </View>
    </Disclosure>
      </View>
      <View style={t.side}>
        <View style={[t.panel, { backgroundColor: colors.sageTint }]}>
          <View style={[t.icon, { backgroundColor: colors.card }]}><Icon name="settings" size={24} /></View>
          <View style={t.stack}>
            <Text accessibilityRole="header" style={s.heading}>{languageNames[language]} with English explanations</Text>
            {!model.loadError && <Text style={t.detail}>{model.notebook.length} saved {model.notebook.length === 1 ? 'word' : 'words'}</Text>}
          </View>
          <View style={s.divider} />
          <Text style={t.detail}>{android
            ? 'Your progress and notebook stay in this app on this phone. There is no account or sync.'
            : 'Your progress and notebook stay in this browser on this device. There is no account or sync.'}</Text>
        </View>
        <View style={t.panel}>
          <View style={s.row}><Icon name="offline" size={22} /><Text accessibilityRole="header" style={t.sectionTitle}>Yours to keep</Text></View>
          {android ? <Text style={t.detail}>Clearing app storage or uninstalling removes your learning data. Export a private learning backup before clearing storage or changing phones.</Text>
            : <><Text style={t.detail}>Download the app for offline study. Export a private learning backup before clearing browser data or changing devices.</Text>
              <Text style={t.detail}>Audio is optional. A microphone is only requested when you choose to record in French AI practice.</Text></>}
        </View>
      </View>
    </View>
  </View>;
}
