# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Current request and outcome

Owner requested “start to implement”, then “continue”. First M1 learner slice is complete on `feat/local-foundation`, based on clean preparation checkpoint `e0639fa`. Full M1 is still in progress. See [status](STATUS.md) and [execution plan](plans/0001-local-foundation.md).

Learners can open the Expo web preview, choose restaurant customer practice, study six original illustrated draft entries, reveal meanings/grammar, complete picture/sentence practice, save/edit a notebook word, and reload with progress intact. A second bakery draft also runs. Ordinary text/picture learning needs neither an API key nor an API process. Device synthetic speech is optional. The local read-only Fastify/SQLite API serves draft preview content with versioned migrations and non-overwriting seeds.

## Ownership and review

- Primary owned shared schemas/content, workspace manifests/lockfile, persistence/audio adapters, integration, browser tests, documentation and commits.
- UI builder owned learner UI; API builder owned API source/tests. Both completed and stopped mutations. An independent read-only change-reviewer inspected the combined change and confirmed the stale-tab notebook finding resolved.
- Actual model routing: exposed `gpt-6.1-sol`, fresh contexts; UI high, API medium, reviewer high. Named roles were explicitly supplied; no runtime auto-loading claim. At most three subagents ran concurrently.
- Atomic create-if-absent lesson capture preserves existing personal edits across stale tabs. Regression tests cover it. Primary fixed blank SVG illustrations and narrow header overflow found during visual verification. Curriculum remains draft pending owner review.

## Validation

Completed on 2026-11-14:

- `npm.cmd run check`: repository checks and TypeScript passed.
- `npm.cmd test`: 16 tooling tests and 19 domain/storage/audio/API tests passed.
- `npm.cmd run test:e2e`: all 10 Chromium checks passed, desktop/390px and 320px keyboard layout; reload/resume, hint history, picture loading, completion, notebook edits, stale tabs, storage denial, save retry.
- Expo `install --check`: dependencies compatible. `npm.cmd run build:web`: final real web export passed.
- Live API smoke: `/health` returned ok; `/lessons` returned two drafts. The actual server starts on 127.0.0.1:3001. Expo preview started on localhost:8081. Restart using README commands if those processes have stopped.
- Desktop/phone-sized screenshots inspected. Audible French voice quality, physical phones, Safari/native and screen readers remain unverified.
- `npm audit`: three moderate upstream findings in Expo/fingerprint/minimatch build-time glob processing. No ineffective override, suppression or forced SDK downgrade retained. See [details](TESTING.md).

Final independent review found no actionable findings after fixes. Primary inspected the staged source/documentation and deliberate path list. The first staged whitespace check caught two trailing blank lines in new files; corrected. `npm.cmd run check:staged` and `git diff --cached --check` then passed, including staged-secret checks; repeat on this final checkpoint update before committing. No application data, keys, caches, exports, browser traces or installed packages are staged. Commit verification is the remaining checkpoint operation.

## Checkpoint identity and recovery

The intended checkpoint is the commit containing this file, titled `feat: add local learner preview and restaurant practice`; its actual hash is reported after Git confirms it (a commit cannot contain its own hash). No push, merge, publication, or history rewrite is authorised by this local step. If interrupted before that commit exists, preserve the task files, finish review/staged checks, commit, and verify `git log -1` and `git status --short`.

No unrelated or pre-staged work existed at start. New source paths are `apps/`, `packages/`, `tests/e2e/`, root TypeScript/Playwright config and the new execution-plan/decision documents; the reviewed tooling/product/status/run documentation and manifests are deliberate task changes.

## Exact next implementation step

Review the preview's French and visual character with the owner; keep drafts unapproved. Continue M1 with the first local curriculum editor fields and separate preview/publication, preserving revision/event history. Test storage/audio on a physical phone via an appropriate secure/local route. Resolve build-tool audit findings before wider distribution. Offline packs/service worker, spaced review, backup/export and native adapters are still planned, not implemented. Browser storage can be cleared/evicted; no backup UI exists yet.

## Usage and remote state

Account usage/reset capability unavailable in the exposed tools; no remaining allowance estimate or automatic resume claimed. A new owner message can resume already-authorised unfinished work. Preparation session's live remote check verified main at `1c6e943`; no remote integration occurred in this implementation. Inspect live history before future integration; a local checkpoint is not remote backup.
