# Project status

Reviewed: 2026-11-16 (Europe/Paris), against this checkout's source. This is the current capability summary; [PROJECT_PLAN](../PROJECT_PLAN.md) describes target requirements, [local operations](LOCAL_OPERATIONS.md) owns run/setup instructions, and [the session checkpoint](SESSION_CHECKPOINT.md) records the latest task and actual checks. A documented localhost address does not establish that a service is currently running.

## Implemented

| Area | Current behaviour |
| --- | --- |
| Learner | Local Expo web preview with Today, Explore, Practice, Review and Profile; desktop topic sidebar/narrow topic list, searchable banks and full vocabulary grids. Meanings, examples, translations and explanations appear directly. Fresh learning starts with greetings; existing lesson resume is preserved. |
| Curriculum | 25 draft banks / 123 short lessons: 7 foundation, 65 A1, 51 A2; 765 vocabulary appearances, 722 canonical sense IDs, 713 written forms. All remain subject to owner review/publication. See the [catalogue](COURSE_CATALOGUE.md). |
| Practice and persistence | Picture or explicit meaning matching, sentence assembly, bilingual scripted dialogue, revision-scoped attempts/completion and browser IndexedDB. Completion records activity, not proficiency. |
| Personal vocabulary | Save/edit curriculum words; add personal French/English entries without an API; accent/case-tolerant notebook search; manual recognition review with supported versus independent ratings. |
| Backups | Private browser learning backup/merge restore, including review history and cached publications. Separate CLI server-curriculum snapshots/recovery validate immutable history and write a new database file; they do not replace the running database. |
| Curriculum editor | Loopback Fastify/SQLite API with immutable drafts, saved-revision preview and explicit owner publication. Edit headings/outcome/topic/role/level/duration, vocabulary support/gender, existing dialogue lines/roles/translations and grammar. New drafts stay separate from publications; exact historical seed guards preserve owner edits. |
| Offline | Explicit complete exported-web download, integrity/size validation, retry/update/removal and cold-offline Chromium use. Removing app assets preserves learner data. Ordinary study uses bundled/cached content without AI. Per-topic packs remain future work. |
| Pictures | Bundled licensed photographs with exact target guards and rights records, original SVG drawings and honest text fallback. [Coverage](PHOTO_COVERAGE.md) identifies remaining gaps; abstract quizzes do not pretend a contextual image is literal. |
| Speech | Optional device French voices/rate preferences. Separate explicit Azure Denise/Henri generation and saved browser replay; normal playback never generates paid audio. Server speech/text and reserved-attempt records live in a separate bounded SQLite cache. Real audible quality remains unverified. |
| Optional AI | Explicit text conversation and temporary recorded-input transcription, visible French/English help/feedback, editable transcript and separate Send. Explicit notebook capture is durable; raw clips and unsaved conversations remain temporary. Server-only credentials and bounded fake-tested provider adapters. |
| Tooling | TypeScript workspaces, repository/secret checks, application/browser/offline suites and GitHub CI configuration. Installed/prepared Codex files are validated copies, not proof of client loading/trust. |

## Research and deployment boundaries

The [A1–A2 review pack](curriculum/README.md) maps all current topics/lessons to a recommended two-pass route, lexical clusters, communicative transfer/revision and B1/B2 extension goals. Six bridge lessons and five grammar-only correction candidates are complete schema-validated **review drafts outside the runtime catalogue**. They are not registered imports or published lessons. The route/transfer tasks are not implemented app features. The ledger's one breakfast teaching link preserves both historical IDs; it does not migrate learner data.

[Free learner website plan 0025](plans/0025-free-web-testing.md) and the [Cloud continuation prompt](CLOUD_DEPLOY_PROMPT.md) describe a static test release. A final remote fetch on 2026-11-16 found implementation on `origin/codex/free-learner-cloud-deploy`, head `c88bc41` at inspection. That branch's checkpoint reports local hosted/browser/offline validation complete and publication blocked by secure account/network access, with no live URL. Those are reported branch results, not checks rerun here. This checkout does not contain that hosted implementation or establish a hosted API; its serving remains loopback-only. Static hosting cannot supply the local editor, provider credentials or cross-device accounts.

Code and documentation have been uploaded on topic branches; that does not mean they were merged into `main`. Inspect live Git/CI state when continuing. Concurrent-session tooling and account-specific work remain on separate task branches; do not assume their commands are available here. The later owner instruction for automatic verified task-branch commits/pushes has been reconciled in [ADR 0021](decisions/0021-automatic-task-branch-pushes.md) without merging those code branches.

## Milestone gates

| Milestone | State |
| --- | --- |
| M0 — planning baseline | Recorded; target requirements remain in PROJECT_PLAN. |
| M1 — local learner foundation | Software journey implemented; physical-phone/audio acceptance still prevents claiming the full gate complete. |
| M2 — speaking/personal vocabulary | Partial: conversation, capture, recorded input and explicit saved speech exist; real-provider/device quality and broader speaking work remain. |
| M3 — personal web beta | Partial: review/search/offline/publication/backups exist; owner approval, full editor, learner controls and per-topic packs remain. |
| M4 — learner observation | Future owner/learner testing and improvement. |
| M5 — mobile | Native storage/audio adapters, packages and device/store preparation remain future work. |

## Verification and limits

Use [TESTING](TESTING.md) for commands, isolation and coverage, and [the checkpoint](SESSION_CHECKPOINT.md) for checks actually run in the latest step. Earlier code-bearing checkpoints include `d5a56ed` (greetings) and `aac20dc` (saved speech). Their automated/browser/export results apply to their tested revisions; they are not new runs of every suite today. Dated milestone detail is preserved in [local preview history](history/local-preview-2026-11.md) and Git.

Open validation: native-teacher/owner content/media review, actual voice/provider quality, microphone hardware, physical-phone/Safari/native and screen-reader testing, independent listening/production and learner trials. Test doubles and schemas do not establish those outcomes or complete CEFR coverage. The last recorded dependency audit reported three moderate build-tool findings; [the investigation](plans/0011-build-tool-audit.md) records the date and failed remediation, rather than claiming a current audit or fix.

## Remaining work

These are opportunities, not blanket authorisation to implement or publish:

1. Owner acceptance of the complete learner journey and draft content; review the six bridge/five correction candidates before deliberate integration. Test real voice quality and supported device/accessibility paths.
2. If continuing the website task, resume the separate hosted implementation branch, verify its current clean artifact/checks against [plan 0025](plans/0025-free-web-testing.md), then resolve secure account/network access for deployment and actual hosted/phone acceptance. No live URL is claimed yet.
3. Extend the editor one journey at a time: target/exercise/media editing, dialogue structure, create/archive/restore/import/export/unpublish, preserving immutable revisions and explicit preview/publication.
4. Add reviewed learner controls: safe data reset, onboarding/preferences, per-topic downloads and production/listening practice. Expand media only with clear targets and rights records.
5. Resolve build-tool audit findings compatibly before distribution. Native packages, accounts/sync, hosted API and realtime voice require separate work.

No launch date, curriculum approval or proficiency claim is established by this status page.
