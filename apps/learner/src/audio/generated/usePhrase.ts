import { useEffect, useMemo, useRef, useState } from 'react';
import { type SpeechInput } from '@smartlingo/domain';
import { SpeechGeneration } from './generation';
import { generatedAudioStore } from './store';

export function useGeneratedPhrase(input: SpeechInput) {
  const identity = JSON.stringify(input);
  const generation = useMemo(() => new SpeechGeneration(), [identity]);
  const active = useRef(generation); active.current = generation;
  const operation = useRef(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    setBusy(false); setError(''); setSaved(false); setNotice('');
    let mounted = true;
    // Local lookup only; never probes the API on each word.
    if (generatedAudioStore.supported()) void generatedAudioStore.get(input).then(clip => { if (mounted) setSaved(!!clip); }).catch(() => {});
    return () => { mounted = false; operation.current++; generation.cancel(); };
  }, [generation]);
  async function save() {
    if (busy) return;
    const version = ++operation.current;
    setBusy(true); setError(''); setNotice('');
    try {
      await generation.save(input);
      if (active.current !== generation || version !== operation.current) return;
      setSaved(true); setNotice('Saved in this browser. Replay works offline; browser storage may be cleared by your device.');
    } catch (failure) {
      if (active.current !== generation || version !== operation.current) return;
      setError(failure instanceof Error ? failure.message : 'Audio could not be saved. Try again explicitly.');
    } finally { if (active.current === generation && version === operation.current) setBusy(false); }
  }
  function cancel() { operation.current++; generation.cancel(); setBusy(false); setNotice('Request cancelled. Any server attempt may already have used credits. No late result will be saved.'); }
  function reset() { operation.current++; generation.reset(); setBusy(false); setSaved(false); setNotice(''); setError(''); }
  return { busy, error, saved, notice, save, cancel, reset };
}
