# Session checkpoint

Updated: 2026-11-21 (Europe/Paris). Free Japanese audio implemented, independently reviewed and validated. The commit containing this note is the checkpoint; resulting SHA and verified origin upload are reported at handoff.

## Request and outcome

Owner reported missing Japanese device speech and requested internet research plus integration. Shared speaker buttons now use matching device speech or a free local VOICEVOX Shikoku Metan fallback. Profile offers automatic/device/free source, speed, preview, availability and isolated Japanese clip removal. Free playback is explicit, local and independent of French paid generation. Played clips can replay offline; text study remains available. No curriculum publication, learner schema/migration, dependency lockfile or deployment change.

Plan0035 and ADR0028 describe scope and architecture; JAPANESE_AUDIO.md records research, rights, operations and limits. A compact pinned Windows x64 CPU runtime (CORE/model0.17.1, ONNX1.17.3, Open JTalk dictionary1.11) installs into ignored data/japanese-voice with a private Python environment. Python3.12+ is an optional voice setup prerequisite. About90MB of pinned artifacts are size/SHA256 verified. Required credit VOICEVOX:四国めたん is displayed. No model/binary/learner database/voice file enters Git or app export.

## Actual validation

- npm.cmd run check PASS repository/TypeScript, repeated after final two stale help-text corrections. npm.cmd test PASS18 tooling /236 application tests; no paid calls.
- Mocked Japanese backend8/8 PASS: strict input, fixed local style/rate, invalid/oversized data, cache/bounds/singleflight, timeouts/abort/close and origin/preflight protections. Existing French speech18/18 PASS. Japanese/French/generated focused audio29/29 PASS after neutral playback-error correction.
- Chromium Japanese/French audio journeys6/6 PASS desktop/small-screen: no device voices, explicit free preview, persisted source/speed, cached offline replay, removal/error, ordinary vocabulary speaker and paid-route isolation. Browser audio is mocked in this suite.
- Compact Python HTTP protocol3/3 PASS with fake inference: no synthesis on metadata/query, fixed style, text/rate/Origin/Host validation, concurrency rejection and sanitized failures. Actual npm.cmd run setup:japanese-voice PASS with official pinned artifacts; model/runtime notices retained locally.
- Real compact runtime/API: status200/available. Real Japanese sample synthesis200 audio/wav,127532bytes in~2.2seconds. PCMmono24kHz,2.656seconds, peak12596/RMS1875.2 (not silence). Native Chromium Audio decoded, played and ended at2.656seconds at1440px and320px with device voices deliberately absent. Both fresh-context cold-offline app launches replayed the real saved clip without another synthesis POST; zero paid requests and no document overflow. Actual hardware sound/native-speaker quality is not inferred.
- Final build:web PASS126assets /10188160bytes, build470b3bfcec2baab62c95035c880fb2e083079bc250cc3bf9ac83aeeb9a0df713. Real exported-build playback/offline script rerun on this build. Native audio cleanup emits an empty-source error after ended; the initial ad-hoc probe incorrectly treated that post-playback cleanup as a decode failure. Another probe used the wrong offline-ready label. Corrected probe assertions only; no source change or timeout increase for either.
- Independent read-only review cleared final source/docs. Resolved one finding: shared clip errors promised device fallback when Japanese playback did not attempt it; now neutral retry/text wording with a rejected-play regression test. Primary also corrected old About/offline help copy. git diff --check PASS; final staged checks before checkpoint.

## Delivery and running preview

Task worktree D:/dev/projects/SmartLingo-sessions/shared-language-learning, branch feat/free-japanese-audio, clean fetched base244d9b9 matched origin/feat/friendly-learning-report. Original D:/dev/projects/SmartLingo remains feat/daily-course-continuation with unrelated tests/e2e/backup.spec.ts status preserved. No direct main update, merge, force push or deployment.

Preview http://localhost:8082 (existing normal server session55302) serves the final export. Japanese voice service session98491 on127.0.0.1:50021 and API session26388 on127.0.0.1:3001 are running for owner testing. Choose Japanese, then Profile / Preview Japanese voice or any ordinary speaker. Fresh browser data was used for tests; owner learning storage was not opened or changed. Services must restart after reboot; saved clips may replay without them. Install/start commands are in JAPANESE_AUDIO.md.

Stage only task files, run check:staged and cached whitespace checks, commit and push this task branch normally, verify live origin SHA. If delivery fails, preserve work and record exact blocker. After delivery, owner auditions pronunciation/naturalness in the running preview.

## Delegation and limits

API and UI builders owned separate backend/frontend paths and tests. Primary owned runtime/setup, package scripts, docs, integration, checks/Git and two small help-text corrections. Independent reviewer remained read-only. All helpers used exposed gpt-6.1-sol /medium with fresh contexts and explicit role instructions. Usage reporting unavailable, no allowance inferred; no automatic-resume schedule configured.

Full official VOICEVOX engine compatibility is source-reviewed, not executed; actual integration used the compact CORE runtime. Physical audio output, qualified Japanese pronunciation review, Safari/native/mobile hardware and screen-reader validation remain open. HTTP cancellation stops waiting/playback/cache writes; native inference can finish its bounded current job internally. New uncached phrases require the local services or an installed device voice; app downloads do not install the voice engine or pre-generate the curriculum.
