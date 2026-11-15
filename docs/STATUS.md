# Project status

Updated: 2026-11-15 (Europe/Paris).

SmartLingo is a runnable local web preview with first editor fields and explicit local draft preview/publication. Physical-phone and voice checks still prevent claiming the full M1 gate complete.

## Current Git state

- Current branch: `feat/offline-web-downloads`, based on validated example/control checkpoint `f40ddcf` (navigation `8009796`, visual browser `1ffb044`, topic expansion `042086d`, visible study `3653a5e`, manual review `546965d`, backup `bc1b08f`, editor `7a84e60`, foundation `83c5573`).
- This step is a local checkpoint only. No push, publication, merge, or history rewrite was performed. Origin remains the owner-selected `https://github.com/trinamntn08/SmartLingo.git`.
- Inspect live remote history before any future integration. A local checkpoint is not remote backup.

## Implemented

- npm/TypeScript workspaces: Expo learner, Fastify local API, shared domain contracts, validated draft content.
- Cream/yellow/green responsive navigation and original code-drawn pictures inspired by the supplied references, with English interface text.
- Twelve practical draft topics with 30 distinct words/phrases each across 60 six-item lessons (36 A1, 24 A2). Covers food, shops, housing, transport, health, work, services, people, routine and leisure/weather. There are 360 topic entries, 353 stable sense IDs and 351 distinct target forms; shared senses reuse IDs. All canonical entries now have fuller original everyday examples/translations in draft revision 2, including the two starter lessons; targets, meanings and exercises stay unchanged. Compact m./f./m./f. metadata sits beside words, useful notes remain and empty notes are omitted. [Research and owner-review limits](CURRICULUM_RESEARCH.md) accompany the expansion; these are estimated levels, not a complete CEFR course.
- Searchable topic banks show meanings/examples/translations/explanations directly, support A1/A2 filtering and direct notebook capture, and link to short lessons. New unillustrated/abstract vocabulary uses explicit meaning matching; existing picture practice is retained. Dialogue grammar and notebook meanings remain visible directly. [ADR 0009](decisions/0009-topic-banks.md) records the backward-compatible matching mode; [ADR 0008](decisions/0008-visible-study-details.md) records the owner's direct-display preference.
- Persistent left-hand desktop topic navigation and a horizontal narrow-screen topic list switch directly into word banks from any learner page or open lesson. SmartLingo is a keyboard-accessible home button in learner and editor headers; returning home preserves unsaved editor fields. Topic words appear before optional practice. Reusable compact cards show all six lesson words together, with no Next word sequence. Explicit Continue to dialogue records the reviewed set in one retry-safe, revision-scoped event; older per-word progress remains valid. Merely browsing creates no study claim. See [ADR 0010](decisions/0010-visual-word-overviews.md).
- Original bundled SVG media for 125 vocabulary IDs (122 distinct drawings, 108 literal/17 context) across all 12 topics, plus legacy pictures. Stable-ID/target guards prevent stale new images after target edits; unknown and inherited-property IDs fall back safely. Media stays separate from curriculum revisions and does not approve content. Abstract terms retain text support; no remote media/paid calls. [Media records](MEDIA_SOURCES.md) document origin and limits.
- Removed repeated synthetic-voice labels, study filler, home feature slogans and the persistent footer. Synthetic speech remains disclosed in Profile; errors, saving feedback and draft/publication status remain visible. Editor selection is searchable with unique lesson labels and a bounded scroll area.
- Restaurant completion through persisted progress, with revision-scoped events and supported-attempt history. Completion records practice, not proficiency.
- Browser IndexedDB version-1 adapter; idempotent attempt retries, conflicting event-ID rejection, notebook save/edit and reload. Atomic lesson capture preserves personal edits across stale tabs.
- Optional French synthetic device voice through labelled, keyboard-accessible 44px speaker icons beside vocabulary, dialogue and notebook text, with cancellation/error/text fallback. No API key, paid generation, microphone, recording, or external AI service is used.
- Loopback curriculum API with immutable SQLite revisions. Latest drafts and published catalogue are selected separately; a newer draft cannot replace the current publication. Startup appends updated seed drafts only above exact historical revision-1 fingerprints; owner edits/newer drafts/publications remain untouched, with no automatic approval. See [ADR 0011](decisions/0011-example-revisions-and-gender.md).
- Separate local editor: lesson headings/outcome, vocabulary meanings/examples/optional notes/gender and grammar fields; saved-revision lesson preview uses memory-only practice. Explicit owner review plus a bounded, expiring saved-preview receipt is required for publication. Conflicting/stale saves cannot overwrite newer revisions.
- Exact loopback Host/origin, JSON/custom-header and CORS guards protect local browser editing. These are not account authentication; public/LAN hosting remains unsupported.
- Versioned IndexedDB migrations retain prior attempts/notebook/cache; v3 adds immutable manual review ratings. Explicit Profile load keeps publications available after API shutdown/reload and preserves earlier learner history.
- Private learner backup download and explicit merge restore with file preview, version/UTF-8/5 MB validation, consistent snapshots, idempotent events, personal-note preservation and all-store atomic rollback on conflicts. Reload shows restored data. Server drafts/credentials/recordings are excluded; backups are unencrypted and do not back up the server database.
- Calm manual recognition review for saved notebook revisions, with explicit reveal/rating, 1/3/7/14/30-day heuristic, separate supported days, local calendar/timezone handling and stable retries. No early/same-day schedule boosting; focus/date refresh keeps tabs current. Note edits start fresh practice without deleting historical ratings. Backup format2 includes ratings; version1 imports remain compatible.
- Explicit Profile offline download of the exported app, all 60 bundled draft lessons and pictures (about 1.25 MB). Available/saved complete-copy sizes, progress, ready/incomplete status, failure/retry/update and confirmed asset removal are shown. SHA256/size validation and staged completion records preserve prior copies on failed updates; root navigation falls back after a three-second stalled-network deadline. Removing owned asset caches preserves all learner IndexedDB stores and unrelated caches. Web Locks serialize worker-generation changes; browser management requires their support. Optional installation uses a web manifest/original SVG icon. Loopback export preview runs on 8082 with exact API origin access; development on 8081 remains a separate browser store. See [ADR 0012](decisions/0012-offline-web-assets.md) and [run instructions](../README.md#test-the-offline-ready-preview).
- Development tooling, 18 tooling tests, 79 application tests, browser checks, offline exported-build checks, web export and run instructions. See [verification](TESTING.md) and [offline plan](plans/0010-offline-web-downloads.md).

## Verified in this step

Repository/TypeScript, all 18 tooling/79 application tests and the current web export pass. Existing browser regressions: 31 passed/one deliberate duplicate publication skip. Real exported-app checks: all six desktop/320px cases pass for explicit download, cold offline launch, publication/notebook/practice/review persistence, interrupted download/retry, corrupted update retaining the old copy, successful new-copy fallback, removal preserving all four stores/unrelated cache and stalled-navigation/query fallback. Desktop ready and narrow error screenshots inspected. Independent read-only review found and confirmed the fix for the unbounded navigation wait; no remaining actionable finding. Tests use isolated browser state and synthetic/in-memory publications, never actual owner approval/publication. Exact results are in [the checkpoint](SESSION_CHECKPOINT.md).

For owner testing, a stable exported preview was started at `http://localhost:8082`, with the actual local curriculum server at `http://127.0.0.1:3001`; HTTP 200 and health ok were confirmed. API startup applies the reviewed immutable seed policy to the local database. No learner writes or publication were performed by the agent in that preview. Check current listeners before starting duplicates.

Known dependency issue: three moderate npm audit findings in Expo's fingerprint/minimatch build-tool chain. No forced SDK downgrade or ineffective override retained; see [testing limitations](TESTING.md). This is a local preview, not a distribution-ready release.

## Not implemented

- Full editor (target/exercise/media editing, create/archive/restore/import/export/unpublish) and actual owner content approval.
- Per-topic offline packs/downloaded speech, production/listening or adaptive review, server curriculum backups and data reset controls.
- AI audio/cache, vocabulary assistant, push-to-talk/conversations, usage controls, provider adapters.
- Native storage/audio and Android/iOS packages; onboarding/preferences and cloud accounts/deployment.

Explicitly downloaded app assets cold-load with network/API unavailable in Chromium. Browser storage can be cleared/evicted; keep private backup files separately. Actual phone/Safari installation, SVG install-icon compatibility, native/device voice quality and screen-reader testing are unverified. Downloads require Web Locks; no public/LAN hosting is supported.

## Next task

Recheck the documented Expo build-tool audit chain for an upstream-compatible resolution before wider distribution; preserve the stable owner preview while doing so. Then address server curriculum backup/recovery or the next bounded editor slice. Owner review and physical-phone storage/audio/installation testing remain needed. Keep actual curriculum unapproved until the owner uses the review/publication flow. Per-topic packs, downloaded speech and full editor completion remain later work.

No public launch date is committed. Hook/role files do not prove runtime loading/trust; no usage-limit lookup or automatic resume capability was available in this session.
