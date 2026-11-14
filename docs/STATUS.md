# Project status

Updated: 2026-11-14 (Europe/Paris).

SmartLingo is a runnable local web preview with first editor fields and explicit local draft preview/publication. Physical-phone and voice checks still prevent claiming the full M1 gate complete.

## Current Git state

- Implementation branch: `feat/local-editor`, based on validated learner checkpoint `83c5573`.
- This step is a local checkpoint only. No push, publication, merge, or history rewrite was performed. Origin remains the owner-selected `https://github.com/trinamntn08/SmartLingo.git`.
- Inspect live remote history before any future integration. A local checkpoint is not remote backup.

## Implemented

- npm/TypeScript workspaces: Expo learner, Fastify local API, shared domain contracts, validated draft content.
- Cream/yellow/green responsive navigation and original code-drawn pictures inspired by the supplied references, with English interface text.
- Restaurant customer and bakery customer draft lessons: six useful items each, optional meanings/translations/grammar, short dialogue, picture matching, sentence building, hints and helpful retry feedback.
- Restaurant completion through persisted progress, with revision-scoped events and supported-attempt history. Completion records practice, not proficiency.
- Browser IndexedDB version-1 adapter; idempotent attempt retries, conflicting event-ID rejection, notebook save/edit and reload. Atomic lesson capture preserves personal edits across stale tabs.
- Optional French synthetic device voice with cancellation/error/text fallback. No API key, paid generation, microphone, recording, or external AI service is used.
- Loopback curriculum API with immutable SQLite revisions. Latest drafts and published catalogue are selected separately; a newer draft cannot replace the current publication. Startup seeds preserve local content.
- Separate local editor: lesson headings/outcome, vocabulary meanings/examples/notes and grammar fields; saved-revision lesson preview uses memory-only practice. Explicit owner review plus a bounded, expiring saved-preview receipt is required for publication. Conflicting/stale saves cannot overwrite newer revisions.
- Exact loopback Host/origin, JSON/custom-header and CORS guards protect local browser editing. These are not account authentication; public/LAN hosting remains unsupported.
- IndexedDB v2 migration retains v1 attempts/notebook and adds validated published-content caching. Explicit Profile load keeps publications available after API shutdown/reload and preserves earlier learner history.
- Development tooling, 16 tooling tests, 36 application tests, browser checks, web export and run instructions. See [verification](TESTING.md) and [editor execution plan](plans/0002-editor.md).

## Verified in this step

TypeScript, all 16 tooling/36 application tests and the web export pass. Browser regression scope includes desktop/390px/320px learner journeys, storage failures, two-tab captures and local editor availability. The isolated editor publication test verifies preview isolation, explicit publication, separation of newer drafts, cache/reload and history preservation. Current exact browser/review/commit outcomes are recorded in [the checkpoint](SESSION_CHECKPOINT.md). Publication tests use only an in-memory test API; no owner curriculum was approved or published by the agent.

Known dependency issue: three moderate npm audit findings in Expo's fingerprint/minimatch build-tool chain. No forced SDK downgrade or ineffective override retained; see [testing limitations](TESTING.md). This is a local preview, not a distribution-ready release.

## Not implemented

- Full editor (target/exercise/media editing, create/archive/restore/import/export/unpublish) and actual owner content approval.
- Downloaded offline packs/service worker, spaced review scheduling, backup/export/import and reset controls.
- AI audio/cache, vocabulary assistant, push-to-talk/conversations, usage controls, provider adapters.
- Native storage/audio and Android/iOS packages; onboarding/preferences and cloud accounts/deployment.

Bundled lessons run with the API stopped, but web assets still need to load. Browser storage can be cleared/evicted and has no backup UI yet. Native/device voice quality, Safari, physical-phone behaviour and screen-reader testing are unverified.

## Next task

Continue with local learner backup/export/import so browser storage can be recovered, followed by calm review scheduling. Owner review and physical-phone storage/audio testing remain needed. Keep actual curriculum unapproved until the owner uses the review/publication flow. Address the build-tool audit chain before wider distribution. Full downloaded packs and editor completion remain later work.

No public launch date is committed. Hook/role files do not prove runtime loading/trust; no usage-limit lookup or automatic resume capability was available in this session.
