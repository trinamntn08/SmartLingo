# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised work and completed checkpoints

Owner asked to continue French curriculum/product features while away, prioritising optional API French conversation, without repeated confirmation. Current branch: `feat/french-course-rework`. Completed and preserved focused local checkpoints:

- `baa3679`: independently completed curriculum rework,24 banks/120 draft lessons,741 appearances/689 senses/680 forms. Existing60 lessons revision3, additions revision1; exact historical seed upgrades preserve owner edits/publications/history. See [catalogue](COURSE_CATALOGUE.md), [research](CURRICULUM_RESEARCH.md) and [plan0016](plans/0016-french-course-rework.md). This feature effort preserved the concurrent curriculum work and did not claim its authorship.
- `dece895`: optional French text/recorded-input conversation, explicit English help, visible translation/feedback, device replay and editable notebook phrase capture. Server-only configurable adapters, bounded expiring memory sessions, daily reserved attempts, single flight, stable replay/terminal failure recovery, timeout/cancel and microphone cleanup. No persistent raw recordings; only explicit saved phrases persist. [Plan0017](plans/0017-ai-french-practice.md), [ADR0016](decisions/0016-optional-ai-practice.md).
- `90634c2`: whole-minute1–60 duration editing with no-write invalid input, saved preview, unsaved navigation/review protection, publication/cache checks. [Plan0018](plans/0018-edit-lesson-duration.md).
- `57a2f25`: direct personal vocabulary creation, validated French/English/optional example, personal UUID IDs, confirmed saving, same-entry failure retry and existing edit/review/backup support. [Plan0019](plans/0019-personal-notebook-entries.md).
- The commit containing these notes: notebook search across French/English/examples with accent/case/apostrophe normalization, match/clear/empty states and hidden unsaved edit preservation. Also refreshed README overview and removed obsolete fixed lesson count from offline download text. [Plan0020](plans/0020-search-notebook.md). Report actual commit hash after Git confirms it.

## Validation and review

Repository/TypeScript checks pass. Application suite:136/136 passed for unchanged API/domain/storage modules. Final full Chromium desktop/narrow browser suite:57 passed/one intentional duplicate-publication skip. Focused intermediate runs: duration9pass/1skip; notebook/AI/review/backup24pass; notebook search/review12pass. Tests cover temporary text/voice flow, English help, no paid calls on load/start, safe retries, denied/late microphone, explicit transcription before editable Send, transcript edit lock/discard, notebook persistence/review/backup, invalid duration no POST and cached publication separation.

Independent instructionally read-only reviewer resolved terminal retry recovery, transcript overwrite and incorrect transcription action guidance, with no remaining actionable AI finding. API/UI/reviewer actual routing: `gpt-6.1-sol`, medium, exclusive feature ownership. Primary self-reviewed small duration/notebook changes, staged diffs and narrow screenshots. No manifests/dependencies/lockfiles/storage-schema changes.

Final production export: ignored `.tmp/final-session-export`,4 hashed files/1,415,858 bytes, build `0bb10acfaef70a836c4c2ac21a28a822bc96e2262c79b9fcc12b6cb39a6cc67a`. Private ephemeral-port390px smoke verifies unavailable AI, explicit download, cold offline lesson and offline personal entry creation/search with no page errors/owner API/data access. Temporary smoke server closed. Earlier candidate exports remain ignored; they are not deployed releases.

## Preserved previews, limits and next work

Owner preview8082/API3001 were not restarted/replaced or used for learner writes/publication. Separate curriculum candidate8083 was preserved. Initial known owner PIDs:30084/16248; check listeners before future work. Code changes require a fresh learner build/dev launch; real AI requires local server environment `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL` and optional `OPENAI_TRANSCRIPTION_MODEL`, then deliberate API restart. Never request keys through chat/browser. No real .env reads, paid calls, retained recordings, owner publication, push, merge or deployment occurred. Origin remains the owner-selected GitHub repository.

Provider/model compatibility, French/transcription quality, actual microphone/audio hardware, Safari/native, screen readers and owner curriculum approval remain unverified. Local attempt/token counters reset on server restart and are not billing totals; transcription tokens are not included. Generated/downloaded French speech/cache, realtime duplex voice, remaining editor tools, per-topic packs, reset controls and native apps remain future slices. Three moderate Expo/fingerprint/minimatch audit findings remain unresolved; no dependency changes made here.

Next authorised bounded slice can implement generated French speech/cache with explicit calls, server-only credentials and fake-provider tests, or another editor capability. Inspect current source/status before starting. Keep actual curriculum unapproved until owner review/publication. Latest usage observation11:25 Europe/Paris: account allowance lookup unavailable, not zero/unlimited. Automatic resume is not configured.

Final staged checks/local commit/log/clean-tree verification are the remaining bookkeeping for this completed search step. If they fail, preserve work and record the actual failure; never claim a successful commit before Git confirms it. Local commits are not off-device backups.
