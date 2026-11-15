import { speechInputSchema, type SpeechInput, type SpeechRequest, type SpeechResponse } from '@smartlingo/domain';
import { SpeechApiError, speechClient, type SpeechClient } from './client';
import { generatedAudioStore } from './store';

export interface SpeechSaver {
  begin(): Promise<string>;
  put(asset: SpeechResponse['asset'], input: SpeechInput, signal?: AbortSignal, epoch?: string): Promise<void>;
}
/** A failed transport reuses its UUID; a confirmed ended attempt needs a new explicit action. */
export class SpeechGeneration {
  private request?: SpeechRequest;
  private response?: SpeechResponse;
  private controller?: AbortController;
  private epoch?: string;
  constructor(private readonly client: SpeechClient = speechClient, private readonly store: SpeechSaver = generatedAudioStore,
    private readonly uuid: () => string = () => globalThis.crypto.randomUUID()) {}
  cancel() { this.controller?.abort(); this.controller = undefined; }
  reset() { this.cancel(); this.request = undefined; this.response = undefined; this.epoch = undefined; }
  async save(input: SpeechInput): Promise<SpeechResponse> {
    if (this.controller) throw new Error('An audio request is already in progress.');
    const valid = speechInputSchema.parse(input);
    if (this.request && JSON.stringify(this.request.input) !== JSON.stringify(valid)) { this.request = undefined; this.response = undefined; this.epoch = undefined; }
    this.request ??= { requestId: this.uuid(), input: valid };
    const controller = new AbortController(); this.controller = controller;
    try {
      // Each deliberate action gets a fresh lease; an earlier response can be saved without another provider call.
      this.epoch = await this.store.begin();
      if (controller.signal.aborted) throw new Error('Audio request cancelled.');
      const result = this.response ?? await this.client.generate(this.request, controller.signal);
      if (controller.signal.aborted) throw new Error('Audio request cancelled.');
      this.response = result;
      await this.store.put(result.asset, valid, controller.signal, this.epoch);
      if (controller.signal.aborted) throw new Error('Audio request cancelled.');
      return result;
    } catch (error) {
      if (error instanceof SpeechApiError && error.terminal) { this.request = undefined; this.response = undefined; }
      throw error;
    } finally { if (this.controller === controller) this.controller = undefined; }
  }
}
