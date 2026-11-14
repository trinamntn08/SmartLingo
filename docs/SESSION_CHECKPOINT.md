# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Authorised continuation

Owner requested “continue till out of token”. Continuing in coherent validated local slices; usage/reset tools unavailable, so no known allowance balance or automatic resume claimed. No push/merge/public hosting, provider calls or actual curriculum approval/publication performed. Preserve local data and unrelated work.

## Latest completed slice

`feat/learner-backup` from clean editor checkpoint `7a84e60` (foundation `83c5573`). [Backup plan](plans/0003-backup.md) completed: Profile download, bounded versioned UTF-8 file preview, explicit trusted-file restore, all-store atomic merge, actual counts and reload. Snapshots contain notebook/events/cached publications only; existing notes win, identical attempts deduplicate, immutable conflicts abort. Server database/drafts, credentials and recordings are excluded. Files are unencrypted and not automatically stored off-device.

Primary owned shared contracts/storage/file adapters, integration/tests/docs/commits; existing UI agent owned only BackupPanel. Existing independent reviewer stayed read-only. Actual model routing unchanged: exposed `gpt-6.1-sol`, UI high/reviewer high; no fallback/autoload claim. API agent was not used for this slice. Review found nonfatal UTF-8 decoding could silently corrupt imported text; fixed with fatal decoding and invalid-byte regression. Final independent review found no remaining actionable findings.

## Validation

- `npm.cmd run check`: repository/TypeScript passed.
- `npm.cmd test`: 16 tooling and 39 application tests passed; all three backup tests rechecked after the final UTF-8 fix. Tests cover consistent round-trip, repeat restore, note preservation, cross-store conflict rollback, invalid versions/IDs/draft caches, file size and invalid UTF-8.
- `npm.cmd run test:e2e`: 17 passed, one deliberate duplicate mobile publication skip. Includes prior learner/editor checks plus actual download/upload/fresh-context restore, no-write file preview, repeat merge, reload and newer-note preservation. Narrow backup screenshot inspected.
- Final `npm.cmd run build:web` passed after the decoding fix.
- No dependency changes; three moderate upstream Expo/fingerprint/minimatch audit findings remain documented. Physical phones, Safari/native/screen readers and audible voice quality unverified. Actual owner curriculum remains draft.

Primary reviewed deliberate index paths and source/documentation diff. Staged-secret and whitespace checks passed; repeat on this final note before committing. Checkpoint identity is the commit containing this file, titled `feat: add private learner backup and atomic restore`; report its hash only after Git confirms it. If interrupted before the commit exists, finish review, `npm.cmd run check:staged`, `git diff --cached --check`, commit and verify `git log -1`/`git status --short` before starting another slice. Backups/test downloads/caches/databases are excluded from the index.

## Next exact step

Implement calm manual notebook review with a transparent versioned schedule and idempotent ratings, preserving the distinction between helped and independent recall and local study dates/timezones. Include review records in versioned backups and avoid changing ordinary lesson completion into proficiency. Keep full offline installation/downloaded packs, complete editor tools, native adapters and AI conversations separate. Owner curriculum/device review remains needed.

## Run and recovery

Learner: `npm run dev` at localhost:8081. Local editor API: `npm run dev:api` at 127.0.0.1:3001; approved browser origins use port 8081. Processes may stop between sessions; restart as needed. Local snapshots do not back up server curriculum SQLite. Inspect live remote history before future integration; local checkpoints are not remote backups.
