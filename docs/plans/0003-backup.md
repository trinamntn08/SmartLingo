# Learner backup and merge restore

Status: completed; historical implementation record. The committed outcome is recorded below; current recovery instructions are in [local operations](../LOCAL_OPERATIONS.md).
Owner: primary agent

## Outcome
Download a versioned learning backup from Profile. Choose a backup file, inspect counts/date and merge rules, explicitly restore, then reload to see recovered notebook/progress/cached publications. Repeat restore without duplicate attempts. Invalid/corrupt/unsupported/oversized files and immutable-ID conflicts cannot partially change data. Existing personal notes always win over imported notes with the same ID. No data deletion/reset or server curriculum import in this slice.

## Contracts and ownership
- Primary owns packages/domain backup schema, LearningRepository exportBackup/restoreBackup, IndexedDB implementation/tests, web file adapter, App Profile entry, E2E and docs/manifests.
- UI builder owns only apps/learner/src/backup/BackupPanel.tsx (and focused UI helpers within that directory except files.ts). Not alone in repo; preserve others. Use shared controls/theme.
- Independent reviewer remains read-only for integrity/privacy/validation.

Domain LearningBackup fields: format smartlingo-learning-backup, version1, createdAt ISO datetime, events, notebook, publishedLessons. Runtime validation rejects duplicate IDs and draft lesson cache. File limit 5,000,000 UTF-8 bytes; 20,000 events, 5,000 notes, 200 cached publications. No recordings, provider keys, editor drafts or server database in this export. Files are private and not encrypted.

Repository exportBackup(): Promise<LearningBackup> reads one consistent transaction. restoreBackup(backup): Promise<RestoreReport> validates then merges all three stores in one atomic transaction. Events identical by ID are kept; conflicting same ID aborts. Notes with existing ID stay unchanged. Cached lessons keep newer local revisions; same-revision changed payload aborts. Return actual counts eventsAdded/eventsKept/notesAdded/notesKept/lessonsUpdated/lessonsKept. No automatic retry, clear or overwrite mode.

File adapter apps/learner/src/backup/files.ts exports downloadBackup(backup):void and readBackupFile(file: File):Promise<LearningBackup>. UI opens repository via openLearningRepository, shows errors without false success, previews selected backup counts/createdAt/merge policy and trusted-file acknowledgement, offers explicit Restore backup then a Reload learning button (location.reload). Explain that reloading makes restored data visible; do not leave app state falsely updated. Preserve failed-file selection/retry as appropriate. HTML file input is acceptable in this web-specific panel.

## Validation
Schema/file-size boundaries, consistent round-trip, duplicate import, conflicting events/lessons rollback, existing-note preservation, invalid data, browser download/upload preview→restore→reload. Inspect desktop/320px screenshots. Run npm check/test/e2e/build and independent review, then staged checks and local commit. Keep generated backup files ignored; never restore into real owner storage during automated tests.

## Progress
Branch feat/learner-backup from validated editor commit `7a84e60`. Continuing owner's broad implementation request; allowance/reset capability unavailable. No paid calls or real data deletion authorised/performed. Physical-device and upstream audit limitations remain as previously recorded.

All 39 application/16 tooling tests and TypeScript pass. A strict UTF-8 decode fix addresses the independent review finding about replacement-character corruption, with an invalid-byte regression test. Final independent review found no remaining actionable issue. Final browser run: 17 passed, one duplicate publication skip; real download/upload/fresh-browser restore and repeat merge preserve personal edits. Narrow screenshot inspected and final web export passed. Primary stages/reviews task paths and commits before the next slice.
