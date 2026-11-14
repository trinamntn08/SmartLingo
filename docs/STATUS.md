# Project status

Updated: 2026-11-14 (Europe/Paris).

SmartLingo is a runnable local web preview with first editor fields and explicit local draft preview/publication. Physical-phone and voice checks still prevent claiming the full M1 gate complete.

## Current Git state

- Current branch: `fix/visible-lesson-details`, based on validated manual-review checkpoint `546965d` (backup `bc1b08f`, editor `7a84e60`, foundation `83c5573`).
- This step is a local checkpoint only. No push, publication, merge, or history rewrite was performed. Origin remains the owner-selected `https://github.com/trinamntn08/SmartLingo.git`.
- Inspect live remote history before any future integration. A local checkpoint is not remote backup.

## Implemented

- npm/TypeScript workspaces: Expo learner, Fastify local API, shared domain contracts, validated draft content.
- Cream/yellow/green responsive navigation and original code-drawn pictures inspired by the supplied references, with English interface text.
- Restaurant customer and bakery customer draft lessons: six useful items each, directly visible meanings/examples/translations/explanations and dialogue grammar, picture matching, sentence building, hints and helpful retry feedback. Saved notebook meanings are also visible directly. This follows the owner's simplified-view preference in [ADR 0008](decisions/0008-visible-study-details.md).
- Restaurant completion through persisted progress, with revision-scoped events and supported-attempt history. Completion records practice, not proficiency.
- Browser IndexedDB version-1 adapter; idempotent attempt retries, conflicting event-ID rejection, notebook save/edit and reload. Atomic lesson capture preserves personal edits across stale tabs.
- Optional French synthetic device voice with cancellation/error/text fallback. No API key, paid generation, microphone, recording, or external AI service is used.
- Loopback curriculum API with immutable SQLite revisions. Latest drafts and published catalogue are selected separately; a newer draft cannot replace the current publication. Startup seeds preserve local content.
- Separate local editor: lesson headings/outcome, vocabulary meanings/examples/notes and grammar fields; saved-revision lesson preview uses memory-only practice. Explicit owner review plus a bounded, expiring saved-preview receipt is required for publication. Conflicting/stale saves cannot overwrite newer revisions.
- Exact loopback Host/origin, JSON/custom-header and CORS guards protect local browser editing. These are not account authentication; public/LAN hosting remains unsupported.
- Versioned IndexedDB migrations retain prior attempts/notebook/cache; v3 adds immutable manual review ratings. Explicit Profile load keeps publications available after API shutdown/reload and preserves earlier learner history.
- Private learner backup download and explicit merge restore with file preview, version/UTF-8/5 MB validation, consistent snapshots, idempotent events, personal-note preservation and all-store atomic rollback on conflicts. Reload shows restored data. Server drafts/credentials/recordings are excluded; backups are unencrypted and do not back up the server database.
- Calm manual recognition review for saved notebook revisions, with explicit reveal/rating, 1/3/7/14/30-day heuristic, separate supported days, local calendar/timezone handling and stable retries. No early/same-day schedule boosting; focus/date refresh keeps tabs current. Note edits start fresh practice without deleting historical ratings. Backup format2 includes ratings; version1 imports remain compatible.
- Development tooling, 16 tooling tests, 54 application tests, browser checks, web export and run instructions. See [verification](TESTING.md) and [review plan](plans/0004-manual-review.md).

## Verified in this step

TypeScript, application/tooling tests and final web export pass. Final browser run: 21 passed, one intentionally skipped duplicate publication writer. Coverage includes desktop/390px/320px learning/editor journeys, backup download/restore, manual rating/retry/reload, cross-tab refresh and calendar-day scheduling across Paris DST. Current exact test/review/commit outcomes are in [the checkpoint](SESSION_CHECKPOINT.md). Publication tests use only an in-memory test API; no owner curriculum was approved or published by the agent. Browser data in automated tests is isolated from actual owner storage.

Known dependency issue: three moderate npm audit findings in Expo's fingerprint/minimatch build-tool chain. No forced SDK downgrade or ineffective override retained; see [testing limitations](TESTING.md). This is a local preview, not a distribution-ready release.

## Not implemented

- Full editor (target/exercise/media editing, create/archive/restore/import/export/unpublish) and actual owner content approval.
- Downloaded offline packs/service worker, production/listening or adaptive review, server curriculum backups and data reset controls.
- AI audio/cache, vocabulary assistant, push-to-talk/conversations, usage controls, provider adapters.
- Native storage/audio and Android/iOS packages; onboarding/preferences and cloud accounts/deployment.

Bundled/cached lessons run with the API stopped, but web assets still need to load. Browser storage can be cleared/evicted; keep private backup files separately. Native/device voice quality, Safari, physical-phone behaviour and screen-reader testing are unverified.

## Next task

Continue with downloaded web assets/offline installation, explicit cache size/status/removal and recoverable downloads; preserve learner storage when removing cached assets. Owner review and physical-phone storage/audio testing remain needed. Keep actual curriculum unapproved until the owner uses the review/publication flow. Address the build-tool audit chain before wider distribution. Full editor completion remains later work.

No public launch date is committed. Hook/role files do not prove runtime loading/trust; no usage-limit lookup or automatic resume capability was available in this session.
