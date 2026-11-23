# Calm French speech generation and saved replay

Status: implemented and validated with fake providers; real voice audition pending
Owner: primary agent

## Outcome and acceptance

Owner preference: natural, calm French, clear and unhurried, no gender preference. Continue from the vocabulary/photo/voice checkpoint by building an explicit audition/generation/cache journey. Azure France-French Denise/Henri are audition candidates, not asserted quality winners. Gentle uses neutral delivery with slower prosody; no unsupported calm style is invented.

Profile lets a learner select a voice/pace, explicitly generate a short sample or phrase (up to 500 characters), listen, and choose saved neural audio. A word/dialogue speaker can explicitly save that exact text with the chosen settings. Ordinary playback only reads local saved clips and uses existing device/text fallback; it never generates paid speech. Changed text/settings require a separate explicit generation. Saved audio replays after reload and offline. Removal clears only owned browser audio, preserving learner history and app downloads. Clear unavailable/quota/corrupt/unsupported states never claim a successful save.

Server-only Azure credentials; fixed regional REST endpoint, escaped SSML, bounded responses/timeouts/cancellation. Persistent separate versioned SQLite speech cache/attempt ledger under ignored data, bounded clips/bytes and daily reserved requests; retry IDs cannot silently spend again. Cache hits survive API restart. Unknown/failed requests need a new deliberate generation attempt rather than automatic retries. No real provider calls or .env reads during implementation.

## Contracts and ownership

Primary owns packages/domain/src/speech.ts + exports, API app/server/local-access/config integration, App Profile mount, manifests and docs. Wire input is {text,voice,pace}; identity includes schema/provider/language/output format and normalized exact text. POST /speech/generate takes {requestId,input}, returns {requestId,asset,cacheHit,usage}; asset carries identity key, exact input, MP3 base64, byteLength and SHA256. GET /speech/status is non-spending. POST requires exact loopback Origin, JSON and X-SmartLingo-Speech:1. No public/LAN support.

API builder owns apps/api/src/speech/** and speech tests; UI builder owns generated browser audio modules/Panel, audio singleton integration, speaker controls and generated-audio tests. Actual routing and review recorded in checkpoint. No shared/dependency edits by helpers. Independent reviewer remains read-only. No account-allowance tool is exposed; keep delegation bounded.

## Validation and limits

Use fake providers/audio boundaries for explicit generation, identity/hash verification, restart/retry/concurrency/failure and offline/remove checks. Run repository/TypeScript, tooling/application, meaningful browser cases and isolated production/offline smoke. Preserve owner8082/API3001 and the previous8083 candidate. No paid audition or actual audible quality claim; owner listens using configured server later. Existing provider/media approval and phone/Safari/accessibility limits remain.

Official references checked 2026-11-15: [Azure REST](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech), [voice catalogue](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support). REST output is audio-24khz-48kbitrate-mono-mp3; fixed fr-FR voices support neutral delivery. Credentials/configuration are process environment only.

## Completed verification and handoff

Repository/TypeScript, 18 tooling/184 application tests, 69 browser regressions (one intentional skip), final production export, desktop/320px cold-offline MP3 replay/cross-tab removal smoke and six original offline failure/update/removal cases pass. Independent review resolved cancellation, delayed playback, removal retry and HTTP timeout findings; a real HTTP eleven-second fake-provider call succeeds and replays with one reserved attempt. No remaining confirmed actionable finding in the bounded review.

Final review preview: http://127.0.0.1:8084. Existing owner8082/API3001 and prior8083 remain intact; live generation requires Azure environment configuration and a deliberate API restart. No paid provider calls, real credentials or owner data were used. Next step is owner listening to Denise/Henri against the stated preference; no claim of better audible quality is made before that comparison.
