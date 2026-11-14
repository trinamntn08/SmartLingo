import { useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import type { LearningBackup, LearningRepository, RestoreReport } from '@smartlingo/domain';
import { openLearningRepository } from '../persistence';
import { Badge, Button } from '../ui/controls';
import { colors, styles as s } from '../ui/theme';
import { downloadBackup, readBackupFile } from './files';

async function withRepository<T>(operation: (repository: LearningRepository) => Promise<T>): Promise<T> {
  const repository = await openLearningRepository();
  try { return await operation(repository); }
  finally { repository.close(); }
}

type Operation = 'download' | 'read' | 'restore';

export function BackupPanel() {
  const operation = useRef<Operation | null>(null);
  const [busy, setBusy] = useState<Operation | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<{ filename: string; backup: LearningBackup } | null>(null);
  const [trusted, setTrusted] = useState(false);
  const [report, setReport] = useState<RestoreReport | null>(null);

  function begin(next: Operation): boolean {
    if (operation.current) return false;
    operation.current = next; setBusy(next); setError(''); setMessage('');
    return true;
  }
  function finish() { operation.current = null; setBusy(null); }
  function showError(failure: unknown) {
    setError(failure instanceof Error ? failure.message : 'The backup operation could not be completed. Please try again.');
  }
  async function download() {
    if (!begin('download')) return;
    try {
      const backup = await withRepository(repository => repository.exportBackup());
      downloadBackup(backup);
      setMessage('Backup download requested. Keep the file somewhere private and check that your browser saved it.');
    } catch (failure) { showError(failure); }
    finally { finish(); }
  }
  async function choose(file: File) {
    if (!begin('read')) return;
    setSelected(null); setTrusted(false); setReport(null);
    try { const backup = await readBackupFile(file); setSelected({ filename: file.name, backup }); }
    catch (failure) { showError(failure); }
    finally { finish(); }
  }
  async function restore() {
    if (!selected || !trusted || !begin('restore')) return;
    setReport(null);
    try {
      const result = await withRepository(repository => repository.restoreBackup(selected.backup));
      setReport(result);
    } catch (failure) { showError(failure); }
    finally { finish(); }
  }
  return <View style={s.card}>
    <Text accessibilityRole="header" style={s.heading}>Keep a copy of your learning</Text>
    <Text style={s.body}>Download your notebook, practice history, and cached published lessons as a JSON file. A backup lets you bring them back to this browser or another device.</Text>
    <View style={s.notice}><Text style={s.body}>Backup files are private and unencrypted. They contain your personal notes and learning history. Server curriculum drafts, recordings, and credentials are excluded.</Text></View>
    <View style={s.row}><Button primary disabled={!!busy} onPress={() => void download()}>Download learning backup</Button></View>
    <View style={s.divider} />
    <Text accessibilityRole="header" style={s.heading}>Restore from a backup</Text>
    <Text style={s.body}>Choose a SmartLingo backup to inspect it first. Choosing a file does not change your learning data. Maximum file size: 5 MB.</Text>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 10, color: colors.ink, fontSize: 17, lineHeight: '26px' }}>
      Choose a learning backup
      <input type="file" accept="application/json,.json" aria-label="Choose a learning backup" disabled={!!busy}
        onChange={event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (file) void choose(file);
        }}
        style={{ font: 'inherit', padding: 12, border: `1px solid ${colors.line}`, borderRadius: 12, background: colors.paper, width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }} />
    </label>
    {!!busy && <View style={s.row}><ActivityIndicator color={colors.ink} /><Text accessibilityLiveRegion="polite" style={s.muted}>{busy === 'read' ? 'Checking backup file…' : busy === 'restore' ? 'Merging your learning backup…' : 'Preparing your backup…'}</Text></View>}
    {!!error && <View style={s.error}><Text accessibilityRole="alert" style={s.body}>{error}</Text><Text style={s.muted}>No success has been confirmed. You can choose another file or retry your action.</Text></View>}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text>}
    {selected && <View style={{ gap: 16 }}>
      <View style={s.notice}><Text style={s.eyebrow}>Selected backup · version {selected.backup.version}</Text>
        <Text style={[s.heading, { flexShrink: 1 }]}>{selected.filename}</Text><Text style={s.body}>Created: {new Date(selected.backup.createdAt).toLocaleString()}</Text>
        <View style={s.row}><Badge>{selected.backup.events.length} practice events</Badge><Badge>{selected.backup.notebook.length} notebook entries</Badge><Badge>{selected.backup.publishedLessons.length} cached lessons</Badge><Badge>{selected.backup.reviewEvents.length} review ratings</Badge></View>
      </View>
      <View style={{ gap: 10 }}><Text style={s.heading}>How the merge works</Text>
        <Text style={s.body}>Your existing personal notes stay unchanged when a backup contains the same note ID. New notes are added.</Text>
        <Text style={s.body}>Identical practice events are kept once. Cached published lessons keep the newer revision. Your other local entries and cached lessons are preserved.</Text>
        <Text style={s.muted}>Conflicting data for an immutable event or the same lesson revision stops the entire restore. There is no overwrite or reset option.</Text>
      </View>
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, background: colors.sand, borderRadius: 12, color: colors.ink, fontSize: 17, lineHeight: '26px' }}>
        <input type="checkbox" checked={trusted} disabled={!!busy} onChange={event => setTrusted(event.currentTarget.checked)}
          style={{ minWidth: 22, width: 22, height: 22, margin: '2px 0 0', accentColor: '#246944' }} />
        <span>I trust this backup file and understand the merge policy.</span>
      </label>
      <View style={s.row}><Button primary disabled={!!busy || !trusted} onPress={() => void restore()}>Restore backup</Button></View>
    </View>}
    {report && <View style={[s.notice, { backgroundColor: colors.green }]}>
      <Text accessibilityRole="header" style={s.heading}>Backup merged successfully</Text>
      <Text accessibilityLiveRegion="polite" style={s.body}>Practice events: {report.eventsAdded} added, {report.eventsKept} already kept.{ '\n' }Notebook entries: {report.notesAdded} added, {report.notesKept} existing notes kept.{ '\n' }Cached lessons: {report.lessonsUpdated} added or updated, {report.lessonsKept} kept.</Text>
      <Text style={s.body}>Review ratings: {report.reviewsAdded} added, {report.reviewsKept} already kept.</Text>
      <Text style={s.body}>Reload learning to display the restored progress, notebook, and cached lessons. Save any unsaved curriculum edits before reloading.</Text>
      <View style={s.row}><Button primary disabled={!!busy} onPress={() => { if (typeof window !== 'undefined') window.location.reload(); }}>Reload learning</Button></View>
    </View>}
  </View>;
}
