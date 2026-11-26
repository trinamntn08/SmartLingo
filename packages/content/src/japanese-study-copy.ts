const previousAudioSentence = 'This route uses text and kana support; Japanese audio is not available.';
const currentAudioSentence = 'Use the speaker buttons for Japanese audio, with kana readings and English meanings available as support. Playback depends on the available audio source; you can continue with text if playback fails.';

/** A precise presentation correction leaves the archived day payload and its event identity intact. */
export function currentJapaneseStudyExplanation(explanation: string): string {
  return explanation.replace(previousAudioSentence, currentAudioSentence);
}
