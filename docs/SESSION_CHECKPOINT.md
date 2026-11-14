# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Authorised work

Owner requested “continue till out of token”. Continuing local implementation in validated slices. Account allowance/reset tools remain unavailable; no known remaining balance or automatic resume is claimed. No push, public hosting, merge or actual curriculum approval/publication was performed.

## Completed editor slice

Branch `feat/local-editor` from clean learner checkpoint `83c5573`. [Plan 0002](plans/0002-editor.md) is complete: first editor fields, immutable draft revisions, temporary saved-revision preview, explicit reviewed local publication, latest-published selection independent of later drafts, and IndexedDB v2 publication caching. Prior attempts/notebook survive migration and loading new revisions. Profile exposes editor and explicit published-content loading. Review/publication tests use an isolated in-memory API on port3002; the owner's database stays unapproved.

Primary owned contracts, catalogue/client/cache, integration, tests/docs and commits. Existing API/UI agents owned exclusive paths; independent reviewer stayed read-only. Actual model routing: `gpt-6.1-sol`, fresh original contexts, API medium/UI high/reviewer high; no fallback or runtime role auto-loading claim. At most three subagents concurrently. All stopped mutations before integration review.

Review found a content/notebook field-limit mismatch; aligned target300/meaning500/example1000 with UI/contract regressions. Browser validation caught missing checkbox ARIA state; corrected. Final independent review found no remaining actionable defects. Original curriculum remains draft; owner language/rights review is still needed.

## Validation

- `npm.cmd run check`: repository and TypeScript passed.
- `npm.cmd test`: all 16 tooling and 36 application tests passed. Covers preview receipts/expiration, conflicts, immutable revisions, Host/origin/CORS guards, v1→v2 note/event preservation, publication cache, content timeouts and notebook capacity.
- `npm.cmd run test:e2e`: 15 passed, one deliberately skipped duplicate mobile publication writer. Includes prior learner regressions, editor unavailable state, 320px keyboard fields/unsaved-form preservation, isolated preview→publication→new draft→learner cache→reload/history preservation.
- `npm.cmd run build:web`: real final Expo web export passed. Desktop and 320px editor screenshots inspected.
- No dependencies changed; the previously documented three moderate Expo/fingerprint/minimatch audit findings remain. Physical phones, Safari/native/screen readers and audible voice quality remain unverified.

Primary reviewed the deliberate staged paths and source/documentation diff. `npm.cmd run check:staged`, `git diff --cached --check` and `git diff --check` passed; repeat staged checks on this final note before committing. The checkpoint is the commit containing this file, titled `feat: add local draft editor and reviewed publication`; report its actual hash only after Git confirms it. If interrupted before that commit exists, preserve task files, complete staged checks and commit verification before starting another slice. No learner database/cache, exports, recordings, traces or keys are staged.

## Next exact step

Implement learner backup/export/import with versioned validated files, preview/counts, explicit restore, atomic transactions and idempotent event merge; preserve local notebook edits through a clear conflict rule. Provide download/upload UI and test round-trip/corrupt-file/error paths without paid calls. Full review scheduling, downloadable offline installation, editor create/restore/unpublish/media/exercise fields and mobile adapters remain later steps. Owner can review the preview independently; no approval is inferred from development tests.

## Recovery and remote

Run learner with `npm run dev` (localhost:8081) and local content server with `npm run dev:api` (127.0.0.1:3001); editor origin must be the documented localhost/loopback8081 origin. Processes may stop between sessions; restart as needed. Inspect live remote history before any future integration. Local checkpoints are not remote backups. Previous local learner commit `83c5573` is verified; no remote operation occurred in this continuation.
