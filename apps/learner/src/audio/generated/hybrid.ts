import type { AudioPlayer } from '../index';
import type { GeneratedPreferences } from './preferences';
import { speechInputSchema, type SpeechInput, type TargetLanguage } from '@smartlingo/domain';

export interface LocalSpeechLookup { get(input: SpeechInput): Promise<{ bytes: Uint8Array } | undefined> }
export interface ClipPlayer { play(bytes: Uint8Array): Promise<void>; stop(): void }
/** Ordinary speech only looks in the browser cache. It has no provider dependency. */
export class HybridSpeechPlayer implements AudioPlayer {
  private sequence = 0;
  constructor(private readonly device: AudioPlayer, private readonly saved: LocalSpeechLookup, private readonly clips: ClipPlayer,
    private readonly preferences: { get(): GeneratedPreferences }, private readonly notice: (message: string) => void = () => {}) {}
  available(language: TargetLanguage = 'fr-FR') { return this.device.available(language) || (language === 'fr-FR' && this.preferences.get().enabled); }
  speak(text: string, language: TargetLanguage = 'fr-FR'): Promise<void> {
    this.stop();
    // The saved-clip contract is French-only; Japanese never queries that cache.
    if (language !== 'fr-FR') return this.device.speak(text, language);
    // Preserve synchronous device playback startup for the existing controls.
    const settings = this.preferences.get();
    if (!settings.enabled) return this.device.speak(text);
    const sequence = this.sequence;
    return this.savedOrDevice(text, settings, sequence);
  }
  private async savedOrDevice(text: string, settings: GeneratedPreferences, sequence: number): Promise<void> {
    let fallbackNotice = '';
    try {
      const input = speechInputSchema.safeParse({ text, voice: settings.voice, pace: settings.pace });
      // Longer AI replies still support ordinary device playback; they are not
      // invalid study content just because the optional saved-clip limit is lower.
      const saved = input.success ? await this.saved.get(input.data) : undefined;
      if (sequence !== this.sequence) return;
      if (saved) { await this.clips.play(saved.bytes); return; }
    } catch (error) { fallbackNotice = error instanceof Error ? error.message : 'Saved audio is unavailable.'; }
    if (sequence !== this.sequence) return;
    if (fallbackNotice) this.notice(`${fallbackNotice} Using device speech when available.`);
    await this.device.speak(text);
  }
  stop() { this.sequence++; this.clips.stop(); this.device.stop(); }
}
