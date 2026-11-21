# ADR 0028: Free local Japanese speech fallback

Status: accepted, 2026-11-21

## Context

The owner encountered missing Japanese device voices and requested internet research and actual free voice integration. The shared Japanese learning UI must play speech without routing Japanese through French Azure generation or introducing paid ordinary playback. Browser voice installation cannot be assumed.

## Decision

Add a language-scoped Japanese AudioPlayer around the existing French hybrid. Default automatic selection uses a matching Japanese device voice when present, otherwise a saved Japanese clip or explicitly clicked free local VOICEVOX synthesis. Profile supports an explicit free/device source, speed, preview, availability and cache removal. French provider contracts and learner databases remain unchanged.

The existing loopback API exposes strict guarded `/speech/japanese/status` and `/speech/japanese/play` routes. A small injected service talks only to 127.0.0.1:50021, style 2 (Shikoku Metan), limits response/input/time/concurrency and keeps a bounded ephemeral cache. Free generation is allowed only in response to a speaker click; browsing/status has no synthesis or paid side effect. Errors disclose no provider text. Browser clips use a separate bounded cache and mutation lock/removal epoch. Cancellation suppresses late playback/cache writes.

An explicitly installed compact Windows CPU runtime uses pinned official CORE/model/ONNX/dictionary artifacts and a private Python environment under ignored data/. Its minimal HTTP adapter only supplies the operations needed by SmartLingo. The same Node provider supports the full official VOICEVOX engine protocol. This concrete boundary avoids shipping hundreds of megabytes with the learner app or requiring a cloud account. Server/native CPU inference cannot be interrupted mid-call, even though HTTP/playback cancellation settles promptly.

VOICEVOX is the selected practical Japanese option; research does not establish an objective quality winner. Preserve `VOICEVOX:四国めたん` credit, applicable voice/model terms and synthetic disclosure. [Research, rights and operations](../JAPANESE_AUDIO.md) records source evidence and limits.

## Consequences

No API key, metered requests, new database migration, provider dependency or learner-data rewrite. Cached phrases replay offline, while new free phrases require the local services. The compact installer currently supports Windows x64/Python3.12+; other hosts can use the official engine. Physical-device, full-engine and native-speaker quality assessment remain separate verification.
