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

export function subscribeVoiceChanges(refresh: () => void): () => void {
  const synthesis = globalThis.speechSynthesis;
  synthesis?.addEventListener?.('voiceschanged', refresh);
  return () => synthesis?.removeEventListener?.('voiceschanged', refresh);
}
