import type { AudioPlayer } from '../index';
import type { TargetLanguage } from '@smartlingo/domain';
import type { AudioRate } from '../preferences';
import type { JapaneseSource } from './preferences';
import type { JapaneseSpeechClient } from './client';
import { validateJapaneseInput } from './client';

export interface JapaneseClipStore {
  begin(): Promise<string | undefined>;
  get(text: string, rate: AudioRate): Promise<Uint8Array | undefined>;
  put(text: string, rate: AudioRate, bytes: Uint8Array, epoch: string | undefined, signal?: AbortSignal): Promise<void>;
}
export class JapaneseSpeechPlayer implements AudioPlayer {
  private sequence = 0;
  private pending?: AbortController;
  constructor(private readonly other: AudioPlayer, private readonly device: AudioPlayer,
    private readonly client: JapaneseSpeechClient, private readonly store: JapaneseClipStore,
    private readonly clips: { play(bytes: Uint8Array, mime?: string): Promise<void>; stop(): void },
    private readonly preferences: { get(): JapaneseSource }, private readonly rate: () => AudioRate) {}
  available(language: TargetLanguage = 'fr-FR'): boolean {
    // Keep the explicit retry available even before status is known, including cached offline clips.
    return language === 'ja-JP' ? this.preferences.get() !== 'device' || this.device.available(language) : this.other.available(language);
  }
  speak(text: string, language: TargetLanguage = 'fr-FR'): Promise<void> {
    this.stop();
    if (language !== 'ja-JP') return this.other.speak(text, language);
    const source = this.preferences.get();
    if (source === 'device' || (source === 'auto' && this.device.available('ja-JP'))) return this.device.speak(text, 'ja-JP');
    const controller = new AbortController();
    this.pending = controller;
    return this.local(text, this.rate(), this.sequence, controller);
  }
  private async local(text: string, rate: AudioRate, sequence: number, controller: AbortController): Promise<void> {
    try {
      validateJapaneseInput(text, rate);
      const saved = await this.store.get(text, rate);
      if (sequence !== this.sequence) return;
      if (saved) { await this.clips.play(saved, 'audio/wav'); return; }
      const epoch = await this.store.begin();
      if (sequence !== this.sequence) return;
      const bytes = await this.client.play(text, rate, controller.signal);
      if (sequence !== this.sequence) return;
      // Start playback before the optional cache write; storage cannot delay hearing the phrase.
      const playing = this.clips.play(bytes, 'audio/wav');
      void this.store.put(text, rate, bytes, epoch, controller.signal).catch(() => {});
      await playing;
    } catch (error) { if (sequence === this.sequence) throw error; }
    finally { if (this.pending === controller) this.pending = undefined; }
  }
  stop(): void {
    this.sequence++;
    this.pending?.abort(); this.pending = undefined;
    this.clips.stop(); this.other.stop(); this.device.stop();
  }
}
