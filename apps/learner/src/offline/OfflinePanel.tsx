import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { offlineAssets } from './browser';
import type { OfflineAssetManager } from './contracts';
import { useOfflineAssets } from './useOfflineAssets';

function fileSize(bytes: number): string {
  if (bytes < 1_000) return `${bytes.toLocaleString()} bytes`;
  const unit = bytes < 1_000_000 ? 'KB' : 'MB';
  return `${(bytes / (unit === 'KB' ? 1_000 : 1_000_000)).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit} (${bytes.toLocaleString()} bytes)`;
}

export function OfflinePanel({ manager = offlineAssets }: { manager?: OfflineAssetManager }) {
  const { info, busy, progress, error, failedOperation, message, refresh, download, remove } = useOfflineAssets(manager);
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const saved = info?.saved;
  const ready = saved?.state === 'ready';
  const updateAvailable = ready && info?.manifest && saved.buildId !== info.manifest.buildId;
  const retryDownload = failedOperation === 'download' || saved?.state === 'incomplete';
  const downloadLabel = retryDownload ? 'Retry download' : ready ? 'Update offline copy' : 'Download for offline use';
  const percentage = progress && progress.total > 0 ? Math.min(100, Math.round(progress.completed / progress.total * 100)) : 0;

  async function confirmRemove() {
    if (await remove()) setConfirmRemoval(false);
  }

  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Learn offline</Text>
    <Text style={s.body}>Save the bundled draft lessons and their pictures so you can open SmartLingo and study without a connection. Locally published lessons are separate browser learning data and are not part of this app-asset download.</Text>
    <Text style={s.muted}>Speech is not downloaded. The synthetic device voice may need a connection.</Text>

    <View style={[s.notice, ready && { backgroundColor: colors.green }]}>
      <Text accessibilityLiveRegion="polite" style={s.body}>{!info ? error && !busy ? 'Offline status is unavailable. Please retry the status check.' : 'Checking offline status…' : ready ? 'Ready for offline use' : saved?.state === 'incomplete' ? 'Download incomplete — offline launch is not ready.' : 'No offline copy saved yet.'}</Text>
      {saved && <Text style={s.body}>Saved file size: {fileSize(saved.bytes)} total across saved copies.</Text>}
      {saved?.downloadedAt && <Text style={s.muted}>Saved: {new Date(saved.downloadedAt).toLocaleString()}</Text>}
      {updateAvailable && <Text style={s.body}>A different build is available to download. Your current offline copy stays available during the update.</Text>}
      {info?.manifest && <Text style={s.body}>Available download: {fileSize(info.manifest.totalBytes)}.</Text>}
      <Text style={s.muted}>Sizes count saved files; the browser may use extra space. Browser storage can be cleared or evicted. Keep a separate learning backup.</Text>
    </View>

    {info && !info.canDownload && <Text style={s.body}>{info.reason || 'Downloading is unavailable here. Connect to the internet and refresh offline status to try again.'}</Text>}
    {!!busy && <View style={{ gap: 10 }}>
      <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={[s.muted, { flexShrink: 1 }]}>{busy === 'download' ? progress ? `Downloading: ${progress.completed} of ${progress.total} files · ${fileSize(progress.bytes)}` : 'Preparing your offline download…' : busy === 'remove' ? 'Removing downloaded assets…' : 'Checking offline status…'}</Text></View>
      {busy === 'download' && <View accessibilityRole="progressbar" accessibilityLabel="Offline download progress" accessibilityValue={{ min: 0, max: 100, now: percentage }} style={s.progressTrack}><View style={[s.progressFill, { width: `${percentage}%` }]} /></View>}
    </View>}
    {!!error && <View style={s.error}>
      <Text accessibilityRole="alert" style={s.body}>{error}</Text>
      <Text style={s.muted}>{ready ? 'The last confirmed offline copy is shown above. Refresh its status to check again.' : 'Offline readiness has not been confirmed. Refresh the status or retry when connected.'}</Text>
    </View>}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}

    <View style={{ gap: 10, width: '100%', maxWidth: 340 }}>
      <Button primary disabled={!!busy || !info?.canDownload} onPress={() => { setConfirmRemoval(false); void download(); }}>{downloadLabel}</Button>
      <Button disabled={!!busy} onPress={() => void refresh()}>{failedOperation === 'refresh' ? 'Retry status check' : 'Refresh offline status'}</Button>
      {saved && (saved.state !== 'empty' || saved.bytes > 0) && !confirmRemoval && <Button disabled={!!busy} onPress={() => setConfirmRemoval(true)}>Remove downloaded assets</Button>}
    </View>

    {confirmRemoval && <View style={s.notice}>
      <Text accessibilityRole="header" style={s.heading}>Remove downloaded assets?</Text>
      <Text style={s.body}>SmartLingo will no longer launch offline after removal. Your saved notes, learning progress, and loaded publications will stay in this browser. You can download the app assets again when connected.</Text>
      <View style={{ gap: 10, width: '100%', maxWidth: 340 }}>
        <Button disabled={!!busy} onPress={() => void confirmRemove()}>Confirm removal</Button>
        <Button disabled={!!busy} onPress={() => setConfirmRemoval(false)}>Cancel removal</Button>
      </View>
    </View>}
    {ready && <Text style={s.muted}>Optional: use your browser menu’s Install or Add to Home Screen option, if available. Your offline copy is ready without installing.</Text>}
  </View>;
}
