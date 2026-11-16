import { speechInputSchema, type SpeechInput } from '@smartlingo/domain';
import type { PreferenceStorage } from '../preferences';

export interface GeneratedPreferences { enabled: boolean; voice: SpeechInput['voice']; pace: SpeechInput['pace'] }
export const generatedPreferenceKey = 'smartlingo.generated-speech-preferences.v1';
const defaults: GeneratedPreferences = { enabled: false, voice: 'fr-FR-DeniseNeural', pace: 'gentle' };
export function createGeneratedPreferences(storage: () => PreferenceStorage | undefined) {
  let current = { ...defaults };
  let lastRaw: string | null | undefined;
  const listeners = new Set<() => void>();
  function get(): GeneratedPreferences {
    try {
      const raw = storage()?.getItem(generatedPreferenceKey);
      if (raw === lastRaw) return { ...current };
      lastRaw = raw;
      if (raw) {
        const value = JSON.parse(raw);
        const settings = speechInputSchema.parse({ text: 'test', voice: value.voice, pace: value.pace });
        if (value.version === 1 && typeof value.enabled === 'boolean') current = { enabled: value.enabled, voice: settings.voice, pace: settings.pace };
      }
    } catch { /* Keep the current visit usable if browser storage is blocked. */ }
    return { ...current };
  }
  return {
    get,
    save(value: GeneratedPreferences): boolean {
      get();
      const settings = speechInputSchema.parse({ text: 'test', voice: value.voice, pace: value.pace });
      current = { enabled: !!value.enabled, voice: settings.voice, pace: settings.pace };
      let persisted = false;
      try { const target = storage(); if (target) { const raw = JSON.stringify({ version: 1, ...current }); target.setItem(generatedPreferenceKey, raw); lastRaw = raw; persisted = true; } } catch { /* Report visit-only settings. */ }
      listeners.forEach(listener => listener());
      return persisted;
    },
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  };
}
export const generatedPreferences = createGeneratedPreferences(() => globalThis.localStorage);
