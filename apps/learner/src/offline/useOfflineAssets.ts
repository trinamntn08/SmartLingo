import { useCallback, useEffect, useRef, useState } from 'react';
import type { DownloadProgress, OfflineAssetManager, OfflineInfo } from './contracts';

type Operation = 'refresh' | 'download' | 'remove';

/** Coordinates panel actions; a focus refresh must never replace active download progress. */
export function useOfflineAssets(manager: OfflineAssetManager) {
  const [info, setInfo] = useState<OfflineInfo | null>(null);
  const [busy, setBusy] = useState<Operation | null>(null);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState('');
  const [failedOperation, setFailedOperation] = useState<Operation | null>(null);
  const [message, setMessage] = useState('');
  const operation = useRef<Operation | null>(null);
  const generation = useRef(0);

  const run = useCallback(async (next: Operation, background = false) => {
    if (operation.current) return false;
    operation.current = next;
    const current = generation.current;
    const active = () => current === generation.current;
    setBusy(next);
    let mutationConfirmed = false;
    if (!background) { setError(''); setFailedOperation(null); setMessage(''); }
    if (next === 'download') setProgress(null);
    try {
      if (next === 'refresh') {
        const result = await manager.inspect();
        if (active()) {
          setInfo(result);
          if (!background) setMessage('Offline status refreshed.');
        }
      } else {
        const saved = next === 'download'
          ? await manager.download(value => { if (active()) setProgress(value); })
          : await manager.remove();
        if (!active()) return false;
        mutationConfirmed = true;
        setInfo(previous => ({ ...(previous ?? { canDownload: false }), saved }));
        setMessage(next === 'remove'
          ? 'Downloaded assets removed. Your saved notes, progress, and loaded publications are preserved.'
          : saved.state === 'ready' ? 'Your offline copy is ready.' : 'The download is not complete. Please retry.');
        const refreshed = await manager.inspect();
        if (active()) setInfo(refreshed);
      }
      return true;
    } catch (failure) {
      if (!active()) return false;
      setError(failure instanceof Error ? failure.message : 'Offline storage could not be updated. Please try again.');
      setFailedOperation(mutationConfirmed ? 'refresh' : next);
      // A failed update may still have an older complete copy. Ask the adapter, never infer readiness.
      if (next !== 'refresh' && !mutationConfirmed) {
        try { const result = await manager.inspect(); if (active()) setInfo(result); }
        catch { /* Keep the last confirmed saved status and the original error. */ }
      }
      return mutationConfirmed;
    } finally {
      if (active()) { operation.current = null; setBusy(null); }
    }
  }, [manager]);

  useEffect(() => {
    generation.current += 1;
    operation.current = null;
    setInfo(null); setProgress(null); setError(''); setMessage(''); setFailedOperation(null);
    void run('refresh', true);
    const refresh = () => { void run('refresh', true); };
    const visible = () => { if (document.visibilityState === 'visible') refresh(); };
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', refresh);
      window.addEventListener('online', refresh);
    }
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', visible);
    return () => {
      generation.current += 1;
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', refresh);
        window.removeEventListener('online', refresh);
      }
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visible);
    };
  }, [run]);

  return { info, busy, progress, error, failedOperation, message,
    refresh: () => run('refresh'), download: () => run('download'), remove: () => run('remove') };
}
