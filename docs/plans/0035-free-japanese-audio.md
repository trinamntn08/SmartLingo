# Task: Free Japanese speech without an installed browser voice

Status: completed
Owner: primary agent

## Outcome

Japanese speaker buttons and Profile preview work when the browser has no Japanese voice. Default automatic selection uses a matching device voice when available, otherwise free local VOICEVOX speech. Users can choose the local voice explicitly, adjust speed, replay saved clips offline and remove those clips. Text learning and French audio remain usable independently.

## Relevant context

Owner requested integration and internet research after the no-Japanese-device-voice error. Existing Japanese audio bypasses the French Azure cache and depends entirely on browser voices. No paid generation belongs in ordinary playback. Research primary sources: [VOICEVOX engine](https://github.com/VOICEVOX/voicevox_engine), [CORE usage](https://github.com/VOICEVOX/voicevox_core/blob/0.17.1/docs/guide/user/usage.md), [voice terms](https://zunko.jp/con_ongen_kiyaku.html), [Kokoro model](https://huggingface.co/hexgrad/Kokoro-82M) and [Japanese voices](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md).

## Steps and ownership

1. Primary: remote/worktree audit, research, contracts, compact local runtime/setup, manifests, docs and integration.
2. API builder: fixed-loopback VOICEVOX adapter, strict Japanese routes, bounds/cache and API tests; app/local-access integration only.
3. UI builder: Japanese playback/preferences/cache/Profile, audio integration and focused unit/browser tests.
4. Independent read-only reviewer after source stabilises; primary resolves findings and runs combined verification.

Contract: GET `/speech/japanese/status` returns available, voice and credit. POST `/speech/japanese/play` accepts only text (1–500 trimmed characters) and rate (0.7/0.85/1), protected by existing local speech Origin/header rules; returns bounded WAV. Backend talks only to 127.0.0.1:50021, style 2 (Shikoku Metan). No credentials or external synthesis service. Full official engine or compact CORE runtime serves this boundary. Models/runtime/dictionary and Python environment stay ignored under data/.

## Validation

Run repository checks, application/tooling tests, compact runtime tests without inference, focused Chromium journeys with no browser Japanese voice, and actual free local synthesis/playback through the integrated app. Check offline cache, cancellation/deletion, errors and language isolation. Rebuild/restart the preview. Stage deliberate paths, secret/whitespace checks, focused checkpoint commit, normal task-branch push and remote SHA verification.

## Progress and decisions

Clean task base 244d9b9 matched origin/feat/friendly-learning-report after fetch. New task branch feat/free-japanese-audio. Original root checkout remains untouched with its unrelated backup.spec.ts status. Usage reporting unavailable; no allowance inferred. Two bounded implementation helpers use exposed gpt-6.1-sol / medium with fresh context. No scheduler configured.

VOICEVOX is the selected practical free Japanese option, not an independently measured universal quality winner. Kokoro provides Apache-licensed weights and Japanese voices; its own Japanese voice table reports limited training and lower grades than its leading English voice. A small single-model CORE setup avoids downloading the entire multi-voice engine. Voice credit and applicable terms are retained; audible pronunciation still needs owner assessment.

## Handoff

Implemented and independently reviewed. Repository/TypeScript checks pass; full tests pass18 tooling /236 application cases. Japanese/French Chromium audio checks pass6/6; compact Python HTTP tests pass3/3. Actual pinned setup, free API synthesis and native Chromium decoding/ended playback succeed at1440px and320px with no device voices. Both cold-offline launches replay the real cached clip without another POST or paid request. Final export has126assets /10,188,160bytes, build470b3bfcec2baab62c95035c880fb2e083079bc250cc3bf9ac83aeeb9a0df713. Preview, API and compact voice service are running for owner testing; checkpoint records exact sessions/checks and commit/push procedure. Actual hardware/qualified Japanese audition, full official engine execution and Safari/native validation remain open.
