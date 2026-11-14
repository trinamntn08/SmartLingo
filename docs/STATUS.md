# Project status

Updated: 2026-11-14 (Europe/Paris).

SmartLingo is now a runnable local web preview. The first M1 learner journey is implemented; the full M1 gate is not yet complete.

## Current Git state

- Implementation branch: `feat/local-foundation`, based on preparation checkpoint `e0639fa`.
- This step is a local checkpoint only. No push, publication, merge, or history rewrite was performed. Origin remains the owner-selected `https://github.com/trinamntn08/SmartLingo.git`.
- Inspect live remote history before any future integration. A local checkpoint is not remote backup.

## Implemented

- npm/TypeScript workspaces: Expo learner, Fastify local API, shared domain contracts, validated draft content.
- Cream/yellow/green responsive navigation and original code-drawn pictures inspired by the supplied references, with English interface text.
- Restaurant customer and bakery customer draft lessons: six useful items each, optional meanings/translations/grammar, short dialogue, picture matching, sentence building, hints and helpful retry feedback.
- Restaurant completion through persisted progress, with revision-scoped events and supported-attempt history. Completion records practice, not proficiency.
- Browser IndexedDB version-1 adapter; idempotent attempt retries, conflicting event-ID rejection, notebook save/edit and reload. Atomic lesson capture preserves personal edits across stale tabs.
- Optional French synthetic device voice with cancellation/error/text fallback. No API key, paid generation, microphone, recording, or external AI service is used.
- Loopback read-only draft-content API (`/health`, `/lessons`, `/lessons/:id`) backed by SQLite versioned migration and immutable revisions. Startup seeds preserve existing local content.
- Development tooling, 16 tooling tests, 19 application tests, 10 browser checks, web export, and run instructions. See [verification](TESTING.md) and [the execution plan](plans/0001-local-foundation.md).

## Verified in this step

`npm.cmd run check`, `npm.cmd test`, all 10 Chromium browser checks, Expo dependency compatibility check, and the final web export passed. Browser checks cover desktop, 390px and 320px widths, keyboard navigation, reload/resume, hidden help, image loading, incorrect attempts/hints, completion, notebook edits, two-tab capture, storage denial, and save retry. Screenshots were inspected. A live loopback API smoke check returned `ok` and two drafts. Final review/staging/commit results are in [the checkpoint](SESSION_CHECKPOINT.md).

Known dependency issue: three moderate npm audit findings in Expo's fingerprint/minimatch build-tool chain. No forced SDK downgrade or ineffective override retained; see [testing limitations](TESTING.md). This is a local preview, not a distribution-ready release.

## Not implemented

- Curriculum editor fields, preview/publication, revision editing UI, owner content approval.
- Downloaded offline packs/service worker, spaced review scheduling, backup/export/import and reset controls.
- AI audio/cache, vocabulary assistant, push-to-talk/conversations, usage controls, provider adapters.
- Native storage/audio and Android/iOS packages; onboarding/preferences and cloud accounts/deployment.

Bundled lessons run with the API stopped, but web assets still need to load. Browser storage can be cleared/evicted and has no backup UI yet. Native/device voice quality, Safari, physical-phone behaviour and screen-reader testing are unverified.

## Next task

Owner can run `npm run dev` and review the first visual/French preview. Keep drafts unapproved until owner review. Continue M1 with the first local curriculum editor fields and a separate preview/publish workflow that never publishes AI drafts automatically; test storage/audio on an actual phone browser. Address the build-tool audit chain before wider distribution. Full downloadable packs and review scheduling remain later milestones.

No public launch date is committed. Hook/role files do not prove runtime loading/trust; no usage-limit lookup or automatic resume capability was available in this session.
