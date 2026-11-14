# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Authorised continuation

Owner requested “continue till out of token”. Implemented three further coherent slices. Account allowance/reset tools remain unavailable; no exhausted/remaining quota or automatic resume is claimed. No push/merge/public hosting, paid calls or actual owner curriculum approval/publication performed. No unrelated work was present at slice starts.

## Completed checkpoints

- `83c5573`: initial learner/API foundation and restaurant journey.
- `7a84e60`: first draft editor, saved preview, explicit reviewed publication, local request guards and learner publication cache.
- `bc1b08f`: private learner backup and atomic merge restore, strict UTF-8/format/size validation, existing-note preservation.
- Current branch `feat/manual-review`, from clean `bc1b08f`: [manual review plan](plans/0004-manual-review.md) complete. The checkpoint containing this file is titled `feat: add calm manual notebook review`; report its actual hash only after Git confirms it.

Manual recognition ratings are immutable and scoped to the saved notebook revision, with recorded timezone/local study date and algorithm version. Calendar schedule 1/3/7/14/30, supported-day reset, no early/same-day boosting and no mastery claim. Editing starts fresh practice but preserves older ratings. Focus/date refresh and reread-after-save handle other-tab ratings. Stable pending UUIDs support failed-write retries. IndexedDB v3 adds ratings while preserving earlier stores; backup format2 includes them and accepts/migrates version1 files.

## Ownership and review

Primary owned schemas/contracts, storage/backup migration, integration, browser tests/docs/staging. Existing API-role agent owned pure review.ts/tests (actual exposed model gpt-6.1-sol medium); UI builder owned review UI (high); independent reviewer remained read-only (high). Same original fresh contexts reused; no fallback/runtime auto-loading claim. At most three subagents ran concurrently; all mutations stopped before primary integration.

Independent review found stale-tab scheduling could advance before due. Fixed both persisted-history refresh and domain early-recall guard, with unit/browser regression. Primary also added saved-note revision scoping; independent review found no new defect. Final review reports no remaining confirmed actionable findings. Actual owner data was not rated/restored or published by tools; automated browser contexts/test SQLite are isolated.

## Validation

- Final `npm.cmd run check`: repository and TypeScript passed.
- Final `npm.cmd test`: all 16 tooling and 54 application tests passed, including 13 schedule tests, v1/v2→v3 browser migration, backup version1→2, rating deduplication/conflicts/rollback and edited-note scoping.
- Full browser run:21 passed, one deliberate duplicate mobile publication skip. Includes prior learner/editor/backup, rating failure retry/reload, Paris DST and stale-tab refresh.
- Six review/backup browser cases rechecked after final note-revision scoping; all passed, including edit-after-rating fresh practice and rating backup recovery.
- Final web export passed after revision scoping. Narrow review screenshot inspected; physical phones, Safari/native/screen readers and audible speech quality remain unverified.
- No dependency changes. Three moderate upstream Expo/fingerprint/minimatch audit findings remain documented in TESTING.md.

Primary inspected the deliberate staged paths and source/documentation diff. `npm.cmd run check:staged`, `git diff --cached --check` and `git diff --check` passed; repeat staged checks on this final note before the local commit. If interrupted before this commit exists, preserve all task files, finish staged checks, commit and verify `git log -1`/`git status --short` before starting another slice. No test downloads/backups, databases, caches, traces, recordings or keys are staged.

## Next exact step

Implement downloaded web assets/offline installation with explicit status/size and removal/recovery. Keep cached assets separate from notebook/events/ratings; removing downloaded assets must preserve learning data. Verify reload with web/API network unavailable using a production/static local preview and actual service-worker cache, rather than claiming bundled/API-independent lessons are a full offline installation. Continue owner curriculum/device review separately. Full editor tools, native adapters, production/listening review and AI speaking remain later work.

## Run and remote recovery

Learner: `npm run dev` (localhost:8081). Local editor API: `npm run dev:api` (127.0.0.1:3001); editor browser origin uses approved port 8081. Processes may stop between sessions; restart as needed. Private learner files do not back up server curriculum SQLite. Inspect live remote history before future integration; these local checkpoints are not remote backups.
