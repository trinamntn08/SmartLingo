# Session checkpoint

Updated: 2026-11-15, 21:49 Europe/Paris.

## Authorised work and outcome

Owner said continue after the vocabulary/photo checkpoint and chose natural, calm French with no gender preference. Branch `feat/cached-french-speech`, based on `7c87a4d`. The commit containing this note is the completed local checkpoint; report its actual hash after Git confirms it. No push, merge or owner publication.

Implemented explicit Azure Denise/Henri generation and saving, gentle/normal pace, opt-in exact saved playback and device/text fallback. Profile and per-phrase dialogs expose generation separately from replay. Normal playback never invokes the API. Verified browser clips survive reload/offline; removal preserves learner history/app downloads/unrelated caches and blocks late cross-tab writes. Dedicated device auditions remain independent. Long AI replies retain device playback.

Server credentials stay in process environment. A separate version-1 SQLite speech cache/attempt ledger provides bounded storage, UTC daily reservations, leased single flight and request-ID replay across restart. Escaped SSML, bounded MP3 validation, no automatic paid retries and exact loopback guards protect the provider boundary. Browser removal does not delete server clips/text. Speech caches are excluded from learner/curriculum backups. See README, ADR0018 and plan0022 for setup/privacy/limits.

Previous `7c87a4d` remains preserved: 24 banks/120 draft lessons/705 senses, sixteen redundant slots replaced, 120 licensed JPEGs covering397 senses with308 explicit gaps, and device-voice choices. This step does not add curriculum/photos or claim complete photo coverage.

## Validation actually completed

- `npm.cmd run check`: repository/TypeScript passes, including final documentation; staged checks also run before committing.
- `npm.cmd test`: 18 tooling and184 application tests pass. Tests use fake providers, memory or isolated temporary databases; no owner SQLite was opened.
- `npm.cmd run test:e2e`: final stable suite69passed/one intentional duplicate-publication skip, including eight desktop/320px generated-speech cases. Real browser MP3 ended events use an original quiet tone, not French/provider speech.
- Final Expo export and offline manifest preparation: `.tmp/cached-speech-export`,126 hashed files/9,685,539bytes, build `11ea6b312dd8f6203e792ab6ee73bf523b2a8c164e807d270a8e5bdceafa761e`.
- Private production1440/320 smoke passes explicit fake generation, real MP3 cold-offline replay, modal layout, cross-tab removal blocking a late write and deliberate cached-response save retry without another API request. App-download caches preserved; zero page errors. Narrow dialog screenshot inspected: controls wrap within320px.
- Six original offline fault/update/removal/stalled-network cases pass (53.3 seconds) against the final export via `.tmp/cached-speech-offline.config.ts`, using fixture-only port8085/path substitutions to preserve owner8082.
- Independent read-only reviewer found no unresolved confirmed actionable defect after fixes. A real HTTP11-second fake-provider response and replay succeeded with one provider attempt; server socket timeout now exceeds the bounded speech operation.

Resolved findings: cancellation previously overwrote/deleted an old verified clip; delayed cache reads could start after Stop; removal epochs blocked deliberate cached retry; awaiting a tee-stream cancellation could hang a test; server10s socket timeout undercut30s provider timeout. Final browser regressions pass after source was frozen: an earlier concurrent Metro edit reset two in-memory practice cases. The first temporary offline fixture copy used PowerShell's default decoding and corrupted curly punctuation expectations; recopying exact UTF-8 fixed the fixture without changing assertions/product. No checks were disabled or weakened.

## Runtime and ownership

Review preview: http://127.0.0.1:8084, tool session49881, serves the final candidate; HTTP200 and matching manifest confirmed. Separate browser storage. Existing owner API3001 PID16248, preview8082 PID30084 and previous8083 PID20296 remain untouched. Check listeners before future work. The running owner API predates speech routes and needs a deliberate configured restart for live generation. No real .env reads, paid calls, retained recordings, owner learner writes or data migration.

Actual delegation: API builder gpt-6.1-sol/high owned speech modules/tests; UI builder gpt-6.1-sol/high owned generated learner modules/player/controls/tests; independent read-only reviewer gpt-6-astra/high covered SQLite, spending/retry/cancellation and integration. Primary owned domain contracts, integration, final fixes, docs and combined validation. No dependency/lockfile or learner-storage-schema change. Roles were invoked explicitly; file presence is not runtime-loading evidence.

## Remaining and exact next step

Use README's optional saved neural French audio setup to configure matching Azure Speech key/region in the local API environment. Deliberately restart the API and compare Denise/Henri at gentle/normal pace in8084 before selecting a preferred voice. The user preference is known; actual voice quality/region compatibility has not been verified. No provider call is authorised by automated playback/tests.

Continue owner curriculum/media review before explicit preview/publication. Prioritize clear photos for remaining concrete gaps. Bulk approved-content audio, server-cache management UI, per-topic packs, full editor, learner reset/onboarding and native work remain future steps. Physical phone/Safari, screen reader, actual provider/billing, real multiprocess contention and power-loss behavior remain unverified. Existing three moderate build-tool findings are unchanged; no dependency remediation claimed.

Usage observation21:47 Europe/Paris: account allowance capability is not exposed; unavailable, not zero/unlimited. No automatic resume is configured. No new work is pending within this completed implementation slice; real listening requires local Azure setup.
