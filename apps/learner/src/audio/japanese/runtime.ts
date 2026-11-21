import { createJapaneseSpeechClient } from './client';
import { JapaneseAudioStore } from './store';
export const japaneseSpeechClient = createJapaneseSpeechClient();
export const japaneseAudioStore = new JapaneseAudioStore();
