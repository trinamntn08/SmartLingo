export function voiceId(voice: SpeechSynthesisVoice): string {
  return JSON.stringify([voice.voiceURI, voice.name, voice.lang]);
}

function language(voice: SpeechSynthesisVoice): string { return voice.lang.toLowerCase().replaceAll('_', '-'); }

export function frenchVoices(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter(voice => language(voice) === 'fr' || language(voice).startsWith('fr-'));
}

/** Locale and locality are useful defaults, not a ranking of voice quality. */
export function selectFrenchVoice(voices: readonly SpeechSynthesisVoice[], preferredId = ''): SpeechSynthesisVoice | undefined {
  const french = frenchVoices(voices);
  return french.find(voice => preferredId && voiceId(voice) === preferredId)
    ?? french.find(voice => language(voice) === 'fr-fr' && voice.localService)
    ?? french.find(voice => language(voice) === 'fr-fr')
    ?? french.find(voice => voice.localService)
    ?? french[0];
}

export function getFrenchVoices(): SpeechSynthesisVoice[] {
  try { return frenchVoices(globalThis.speechSynthesis?.getVoices() ?? []); }
  catch { return []; }
}

/** Never fall back to another target language when a matching voice is absent. */
export function selectTargetVoice(voices: readonly SpeechSynthesisVoice[], target: 'fr-FR' | 'ja-JP', preferredId = ''): SpeechSynthesisVoice | undefined {
  if (target === 'fr-FR') return selectFrenchVoice(voices, preferredId);
  const japanese = voices.filter(voice => language(voice) === 'ja' || language(voice).startsWith('ja-'));
  return japanese.find(voice => preferredId && voiceId(voice) === preferredId)
    ?? japanese.find(voice => language(voice) === 'ja-jp' && voice.localService)
    ?? japanese.find(voice => language(voice) === 'ja-jp')
    ?? japanese.find(voice => voice.localService) ?? japanese[0];
}

export function getTargetVoices(target: 'fr-FR' | 'ja-JP'): SpeechSynthesisVoice[] {
  try {
    const prefix = target.split('-')[0];
    return (globalThis.speechSynthesis?.getVoices() ?? []).filter(voice => language(voice) === prefix || language(voice).startsWith(`${prefix}-`));
  } catch { return []; }
}

export function subscribeVoiceChanges(refresh: () => void): () => void {
  const synthesis = globalThis.speechSynthesis;
  synthesis?.addEventListener?.('voiceschanged', refresh);
  return () => synthesis?.removeEventListener?.('voiceschanged', refresh);
}
