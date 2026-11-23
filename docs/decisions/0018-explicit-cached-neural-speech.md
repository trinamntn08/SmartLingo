# Explicit neural speech and separate saved replay

Date: 2026-11-15. Status: accepted implementation; actual voice quality awaits owner audition.

## Context and owner preference

Owner dislikes the current device voice and chose natural, calm French with no gender preference. Continuing the authorised audio work requires a reviewable generation/replay journey without paid calls on normal playback. Azure's documented France-French Denise/Henri voices are audition candidates; neutral delivery at -10% rate is the gentle option. We do not invent a supported “calm” provider style or claim one voice is best without listening.

## Decision

- Fixed Azure regional REST provider behind a typed adapter; keys stay in server process environment. Escaped SSML, bounded MP3 output, timeouts/cancellation and no automatic paid retries. Only explicit Generate and save can reach the provider. Availability checks and ordinary speaker controls never generate.
- Add the exact localhost/127.0.0.1 port 8084 review-preview origins alongside existing 8081/8082. This allows the new exported UI to use the API after a deliberate configured restart while preserving the older 8082/8083 previews. Arbitrary ports/LAN/public origins remain rejected; this is local origin protection, not account authentication.
- Shared versioned identity includes provider, language, output format, voice, pace and NFC/trimmed exact text. A changed word/settings invalidates the lookup; unchanged spoken text may be reused across lesson revisions. The response carries identity, byte size and SHA256; the browser verifies all before confirming a save.
- A separate version-1 SQLite speech database under ignored data stores synthetic clips/text, request replay records and durable daily reserved attempts. It never opens or migrates the curriculum database. Schema ownership/version checks reject foreign/future files; tests use memory or isolated temporary paths. Reservations and a bounded global flight lease prevent uncontrolled concurrent/retried generation. Cache hits survive restart and do not require provider credentials. Thirty-day replay retention, 10,000 request rows, 512 clips/64 MiB decoded audio and configured 1–200 daily attempts bound storage/spending; counters are not billing totals.
- Separate owned browser CacheStorage stores verified clips for offline replay, outside learner IndexedDB/backups and app asset downloads. Web Locks serialize mutations; a removal epoch prevents an old cross-tab request restoring clips after removal. Read misses create no cache. Confirmed browser removal leaves an epoch marker and preserves learner history, app downloads, unrelated caches and the separate server cache.
- A hybrid player reads only the selected exact local clip on ordinary playback; it uses existing device/text fallback when missing or damaged. The device-voice audition uses the shared dedicated device player so neural preferences cannot change the voice being auditioned. Audio object URLs, pending lookups and playback are cancelled/cleaned on Stop/navigation.
- Profile auditions and per-phrase audio options clearly distinguish paid generation from saved playback. Cancelling ignores late results; uncertain transport retries retain UUIDs, terminal failures require a new explicit attempt, and local save failure can retry a verified response without another API request.

## Privacy and operational limits

Generated French text is sent to Azure when explicitly requested. Synthetic audio and its text remain in the local server cache and, after a successful save, the browser. This differs from temporary raw microphone recordings. Browser removal is not server deletion. Speech caches are unencrypted local data and are excluded from learner/curriculum backup formats; they are not curriculum publication approval.

No real provider call, credential lookup or owner database change is part of implementation tests. Actual Azure configuration, subscription/region compatibility and a listening comparison are still required. Native/phone/Safari and screen-reader checks remain separate. A full server cache/ledger refuses new generation before spending; it does not evict clips and silently regenerate them later. Ordinary saved replay/device/text study stays available.

Official references inspected: [Azure REST](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech), [French voice catalogue](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support). See [execution plan](../plans/0022-cached-french-speech.md) and [voice options](../VOICE_OPTIONS.md) for scope and current evidence.
