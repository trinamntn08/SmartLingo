# Free Japanese audio

Research/implementation evidence dated 2026-11-21; this guide was checked against source on 2026-11-22. Linked external terms and quality claims were not freshly revalidated during this documentation sync. Japanese speaker buttons can now work without a Japanese browser voice. The default automatic source uses an available Japanese device voice first, then saved clips or a free local VOICEVOX voice. Profile → Japanese audio also lets you choose the free voice explicitly and preview it.

## Readings and where to listen

Choose **Learn Japanese** on the homepage, then use Today, Learn, Review, Report or Profile. **Learn > Japanese letters** shows basic kana with romaji readings and optional sound; **Learn > Vocabulary & lessons** shows Japanese words and examples with written kana readings. These written aids are bundled and remain available without the API. They are not a universal romaji/IPA pronunciation guide or pronunciation scoring.

Speaker buttons speak their supplied Japanese text through the selected audio source; word cards do not synthesize from the separate reading field. **Profile > Japanese audio** controls the source and Slow/Gentle/Normal speed. In Automatic mode, an available device voice is selected first; a device playback failure does not automatically retry through VOICEVOX. Select Free local voice explicitly to use saved local clips or the engine instead.

## Choice and evidence

| Option | Evidence and practical fit |
| --- | --- |
| **VOICEVOX, Shikoku Metan / normal style 2** | Selected for this local Japanese learner. Dedicated Japanese analysis and synthesis, adjustable speed, CPU support, local processing and no metered API fees. The [official voice page](https://voicevox.hiroshiba.jp/product/shikoku_metan/) provides samples. [CORE documentation](https://github.com/VOICEVOX/voicevox_core/blob/0.17.1/docs/guide/user/usage.md) documents text analysis/synthesis and CPU setup; the [voice/model table](https://github.com/VOICEVOX/voicevox_vvm/blob/0.17.1/README.md) identifies model 0 and style 2. |
| Kokoro-82M | Credible lightweight alternative with [Apache-licensed weights](https://huggingface.co/hexgrad/Kokoro-82M). Its own [voice table](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) lists Japanese voices but limited Japanese training data and C/C+ grades. Those are the author's assessments, not a comparison measured by SmartLingo. It also needs a Japanese text-processing dependency. |
| Browser/device Japanese voice | Simple when already installed and may work offline. Availability, voice quality and any network processing depend on the operating system/browser. It was unavailable in the reported environment, so it cannot be the only playback path. |

This is a practical recommendation, not a universal quality ranking or a native-speaker evaluation. Real synthesis and Chromium decoding were checked separately from pronunciation/naturalness, which the owner should audition. No paid TTS service, unofficial cloud endpoint or API key is used by this feature.

## Install and start on Windows x64

Install Python 3.12+ alongside the normal Node/npm prerequisites. From the repository root, explicitly install the compact CPU runtime once:

```sh
npm run setup:japanese-voice
```

This downloads about 90 MB from pinned official release URLs, verifies SHA-256 and sizes, and installs the self-contained CORE 0.17.1 wheel into a private virtual environment. Model 0.17.1, VOICEVOX ONNX Runtime 1.17.3 and Open JTalk dictionary 1.11 are stored under ignored `data/japanese-voice/`. No administrator access or global Python package installation is needed. Extracted packages retain their notices; model terms are retained in `core/models/TERMS.txt`. Cached downloads allow a verified retry. A failed or interrupted install does not affect learning history; rerun setup.

Start the voice service in one terminal and leave it running:

```sh
npm run dev:japanese-voice
```

Start the API in another terminal:

```sh
npm run dev:api
```

Use the normal learner development server or exported preview. Choose Japanese → Profile → Japanese audio. Availability should say **Free local voice ready: Shikoku Metan.** Choose **Free local voice — Shikoku Metan**, then **Preview Japanese voice**. The usual speaker buttons in vocabulary, lessons and notebook use the same audio adapter. Slow, Gentle and Normal speeds have separate cached clips.

The compact service binds only `127.0.0.1:50021` and exposes the three operations required by the app; it is not the full VOICEVOX editor/engine. Browsers call the existing guarded SmartLingo API at `127.0.0.1:3001`, which calls this local service. Native synthesis may finish its current bounded job after HTTP cancellation, but cancelled/replaced playback cannot play or cache a late result. The service does not log text or retain speech files. Stop it with Ctrl+C when finished. It must be restarted after a computer reboot.

Alternatively, run the [official VOICEVOX engine](https://github.com/VOICEVOX/voicevox_engine#readme) with Shikoku Metan style 2 on `127.0.0.1:50021`; the API uses its standard speakers/audio_query/synthesis operations. This also supplies a route for other operating systems. Do not run two engines on that port. Full-engine execution was not tested here; actual integration used the compact Windows CPU runtime.

## Playback, offline use and removal

- Only an explicit speaker/preview click synthesizes speech. Browsing never generates clips. Profile availability only queries voice metadata.
- Free local speech sends the displayed text only to services on this computer. Device network voices have their browser's separate processing behaviour.
- Played clips are saved best-effort in this browser's separate Japanese audio cache (at most 100 clips / 32 MiB), keyed by exact text, speed and voice identity. With the app downloaded, an already saved clip can play after both services stop. A new phrase/speed still needs a running local engine or installed device voice.
- CacheStorage, Web Crypto and Web Locks are needed for saved clips. Storage refusal/quota/eviction does not prevent requested live speech. The app download does not install the engine or pre-generate all lesson audio.
- Profile → Japanese audio → **Remove saved Japanese audio** removes browser Japanese clips, cancels playback and prevents older in-flight requests from saving again. Future explicit clicks can save new clips. It preserves French audio and learner data. The API's bounded ephemeral cache disappears when its process stops. Runtime/model files are separate from browser clip removal.
- Offline/missing-engine errors keep the text visible and explain how to retry. The API limits text to 500 characters, responses to 5 MiB, synthesis to one request at a time and the HTTP operation to 25 seconds. No paid fallback is attempted.

## Credit and rights

Required displayed credit: **VOICEVOX:四国めたん**. Profile identifies this as synthetic speech. The [model terms](https://github.com/VOICEVOX/voicevox_vvm/blob/0.17.1/TERMS.txt) and [voice terms/common conditions](https://zunko.jp/con_ongen_kiyaku.html) allow commercial and noncommercial generated-audio use with the required credit and their stated conditions. Any onward use of generated audio must retain the applicable conditions and credit. The app bundles generated lesson clips and their exact transcript manifest. Character artwork, third-party recordings and voice binaries are separate. Source download URLs, exact artifact sizes and hashes live in `scripts/japanese_voice/setup.py`.

## Verification

Ordinary application/browser tests mock the synthesis boundary and never download models. Run compact protocol tests separately without a model:

```sh
python -X utf8 -m unittest discover -s scripts/japanese_voice -p test_server.py
```

Live checks require explicit local setup/start above. Automated tests do not establish Japanese pronunciation quality or native/Safari support; the checkpoint records the actual engine and browser runs.

## Bundled Japanese course clips

Course listening questions, kana audio and new Japanese practice use exact Japanese transcript keys from the source. The guided dialogue and key phrases also have bundled playback. The files are original course text rendered in **VOICEVOX:四国めたん** style 2. Foundation and A1 prompts use a gentler base pace. The Japanese playback-speed preference applies to both bundled clips and device or local speech. Other text and personal words can use the selected device or local source.

The app export includes the clip files and SHA-256 manifest, with no voice model or engine. The [pinned model terms](https://github.com/VOICEVOX/voicevox_vvm/blob/0.17.1/TERMS.txt) and [voice and onward-use conditions](https://zunko.jp/con_ongen_kiyaku.html) apply to the generated clips. Keep the credit and these applicable conditions with supplied copies. These are synthetic examples. Listening checks record comprehension or reading support. Speaking tasks use model playback and manual self-review.

[Clip collection](../scripts/japanese_voice/collect-course-clips.ts) uses the same lesson questions and practice sources as the learner. [Rendering](../scripts/japanese_voice/render-course-clips.py) requires locally installed CORE, the official style 2 model, Open JTalk dictionary and ffmpeg. Run the collector with `node --import tsx scripts/japanese_voice/collect-course-clips.ts`. Pass the redirected JSON and a fresh output directory to the renderer, with the installed runtime library, dictionary and model paths. Reconcile the complete output with the authored sources before replacing a clip set. The application checks verify source coverage and file hashes. Device availability, pitch accent naturalness and qualified listening review remain separate from source/hash verification.

### Isolated study vowels

The five single-vowel clips use the same VOICEVOX:四国めたん model and style 2. Isolated synthesis produced a breathy or very quiet onset for some vowels. The renderer now generates the target mora inside a Japanese carrier, checks its vowel phoneme and voicing, and cuts the steady vowel from the model's mora timings. A 40 ms margin at each boundary excludes the neighbouring sounds. The retained vowel lasts about 226 ms at the stored pace, with a short fade at each edge. The renderer matches the vowel level before encoding and rejects a source that would require more than 10 dB of gain.

Run the decoded-media check after regenerating the clips. It uses Python and ffmpeg to measure periodic speech in 20 ms windows, compare levels across the five vowels, and check peak headroom.

```sh
python scripts/japanese_voice/isolated_vowels.py apps/learner/public/japanese-audio
```
