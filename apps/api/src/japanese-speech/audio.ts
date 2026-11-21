export const maxJapaneseAudioBytes = 5 * 1024 * 1024;

/** Accept bounded RIFF/WAVE PCM with coherent format and sample data chunks. */
export function validPcmWave(audio: Uint8Array): boolean {
  if (audio.length < 46 || audio.length > maxJapaneseAudioBytes) return false;
  const bytes = Buffer.from(audio.buffer, audio.byteOffset, audio.byteLength);
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WAVE' || bytes.readUInt32LE(4) !== bytes.length - 8) return false;
  let offset = 12, alignment = 0, dataSize = 0;
  while (offset + 8 <= bytes.length) {
    const id = bytes.toString('ascii', offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8;
    if (start + size > bytes.length) return false;
    if (id === 'fmt ') {
      if (alignment || size < 16 || bytes.readUInt16LE(start) !== 1) return false;
      const channels = bytes.readUInt16LE(start + 2), rate = bytes.readUInt32LE(start + 4), bits = bytes.readUInt16LE(start + 14);
      alignment = bytes.readUInt16LE(start + 12);
      if (![1, 2].includes(channels) || rate < 8000 || rate > 192000 || ![8, 16, 24, 32].includes(bits) || alignment !== channels * bits / 8 || bytes.readUInt32LE(start + 8) !== rate * alignment) return false;
    }
    if (id === 'data') { if (dataSize || !size) return false; dataSize = size; }
    offset = start + size + size % 2;
  }
  return offset === bytes.length && alignment > 0 && dataSize > 0 && dataSize % alignment === 0;
}
