export const audioRates = [0.7, 0.85, 1] as const;
export type AudioRate = typeof audioRates[number];
export interface AudioPreferences { voiceId: string; rate: AudioRate }
export interface PreferenceStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export interface AudioPreferenceStore {
  get(): AudioPreferences;
  save(preferences: AudioPreferences): boolean;
}

const key = 'smartlingo.audio-preferences.v1';
const defaults: AudioPreferences = { voiceId: '', rate: 0.85 };

function validate(value: unknown): AudioPreferences {
  if (!value || typeof value !== 'object') return { ...defaults };
  const candidate = value as Partial<AudioPreferences>;
  return {
    voiceId: typeof candidate.voiceId === 'string' && candidate.voiceId.length <= 2048 ? candidate.voiceId : '',
    rate: audioRates.includes(candidate.rate as AudioRate) ? candidate.rate as AudioRate : defaults.rate,
  };
}

/** Browser settings are separate from learner history and backup data. */
export function createAudioPreferenceStore(storage: () => PreferenceStorage | undefined, storageKey = key): AudioPreferenceStore {
  let current: AudioPreferences = { ...defaults };
  let loaded = false;
  return {
    get() {
      if (!loaded) {
        loaded = true;
        try {
          const raw = storage()?.getItem(storageKey);
          if (raw) current = validate(JSON.parse(raw));
        } catch { /* Keep usable defaults when browser storage is unavailable. */ }
      }
      return { ...current };
    },
    save(preferences) {
      current = validate(preferences);
      loaded = true;
      try {
        const target = storage();
        if (!target) return false;
        target.setItem(storageKey, JSON.stringify(current));
        return true;
      } catch { return false; }
    },
  };
}

export const audioPreferences = createAudioPreferenceStore(() => globalThis.localStorage);
export const japaneseAudioPreferences = createAudioPreferenceStore(() => globalThis.localStorage, 'smartlingo.audio-preferences.ja-JP.v1');
export function preferencesForLanguage(language: 'fr-FR' | 'ja-JP') {
  return language === 'ja-JP' ? japaneseAudioPreferences : audioPreferences;
}
