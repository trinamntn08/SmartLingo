"""Render and check the five isolated Japanese vowel models for kana study."""

import array
import io
import json
import math
from pathlib import Path
import subprocess
import sys
import wave


# A preceding voiced kana keeps the VOICEVOX model from whispering isolated
# utterances. Only the steady middle of the target mora goes into the clip.
CARRIER_PREFIX = {"ア": "ヨ", "イ": "ヨ", "ウ": "ミ", "エ": "マ", "オ": "マ"}
VOWEL_PHONEMES = dict(zip(CARRIER_PREFIX, "aiueo"))
SAMPLE_RATE = 24_000


def rms(samples):
    return math.sqrt(sum(value * value for value in samples) / len(samples))


def samples_from_pcm(raw):
    samples = array.array("h", raw)
    if sys.byteorder != "little":
        samples.byteswap()
    return samples


def render_vowel(synthesizer, text, speed):
    query = synthesizer.create_audio_query(CARRIER_PREFIX[text] + text + "です", 2)
    first, target, *_ = [mora for phrase in query.accent_phrases for mora in phrase.moras]
    if target.text != text or target.consonant or target.vowel != VOWEL_PHONEMES[text] or not target.pitch:
        raise ValueError(f"Expected a voiced, isolated {text} mora")
    query.speed_scale = 1
    query.pre_phoneme_length = 0.06
    # Keep enough steady vowel to cut clear of both mora transitions.
    sample_seconds = 0.19 / speed
    margin = 0.04
    target.vowel_length = sample_seconds + 2 * margin
    onset = query.pre_phoneme_length + (first.consonant_length or 0) + first.vowel_length
    raw = synthesizer.synthesis(query, 2)
    with wave.open(io.BytesIO(raw), "rb") as wav:
        if (wav.getframerate(), wav.getnchannels(), wav.getsampwidth()) != (SAMPLE_RATE, 1, 2):
            raise ValueError("Expected mono 24 kHz signed 16-bit speech")
        wav.setpos(round((onset + margin) * SAMPLE_RATE))
        core = samples_from_pcm(wav.readframes(round(sample_seconds * SAMPLE_RATE)))

    gain = (32768 * 10 ** (-19 / 20)) / max(1, rms(core))
    if gain > 10 ** (10 / 20) or max(map(abs, core)) * gain > 32767:
        raise ValueError(f"{text} would need excessive gain or clip")
    attack, release = round(.012 * SAMPLE_RATE), round(.022 * SAMPLE_RATE)
    samples = array.array("h", [0]) * round(.025 * SAMPLE_RATE)
    for i, value in enumerate(core):
        envelope = min(1, i / attack, (len(core) - 1 - i) / release)
        samples.append(round(value * gain * envelope))
    samples.extend([0] * round(.045 * SAMPLE_RATE))
    if sys.byteorder != "little":
        samples.byteswap()
    output = io.BytesIO()
    with wave.open(output, "wb") as wav:
        wav.setparams((1, 2, SAMPLE_RATE, 0, "NONE", "not compressed"))
        wav.writeframes(samples.tobytes())
    return output.getvalue()


def periodicity(frame):
    # Normalized autocorrelation across plausible speaking pitches (130–500 Hz).
    mean = sum(frame) / len(frame)
    centered = [x - mean for x in frame]
    best = 0
    for lag in range(SAMPLE_RATE // 500, SAMPLE_RATE // 130 + 1):
        left, right = centered[:-lag], centered[lag:]
        denominator = math.sqrt(sum(a*a for a in left) * sum(b*b for b in right))
        if denominator:
            best = max(best, sum(a*b for a, b in zip(left, right)) / denominator)
    return best


def check_decoded_vowels(directory):
    manifest = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
    levels = []
    for text in CARRIER_PREFIX:
        raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", str(directory / manifest[text]["file"]),
                                       "-ar", str(SAMPLE_RATE), "-ac", "1", "-f", "s16le", "pipe:1"])
        audio = samples_from_pcm(raw)
        window = SAMPLE_RATE // 50
        voiced = []
        for start in range(0, len(audio) - window + 1, window):
            frame = audio[start:start + window]
            if rms(frame) >= 32768 * 10 ** (-32 / 20) and periodicity(frame) >= .70:
                voiced.extend(frame)
        duration_ms = len(voiced) * 1000 / SAMPLE_RATE
        if duration_ms < 160:
            raise ValueError(f"{text} has only {duration_ms:.0f} ms of audible periodic speech")
        level = 20 * math.log10(rms(voiced) / 32768)
        peak = 20 * math.log10(max(map(abs, audio)) / 32768)
        print(f"{text}  {duration_ms:.0f} ms voiced  {level:.1f} dBFS voiced RMS  {peak:.1f} dBFS peak")
        if not -23 <= level <= -16 or peak > -1:
            raise ValueError(f"{text} is outside the intended playback level")
        levels.append(level)
    if max(levels) - min(levels) > 2:
        raise ValueError("Vowel levels differ by more than 2 dB")


if __name__ == "__main__":
    check_decoded_vowels(Path(sys.argv[1]))
