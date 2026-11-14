# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Current request and outcome

Owner requested meanings, examples and explanations directly visible without dropdowns, using the restaurant vocabulary screenshot. Completed on `fix/visible-lesson-details` from clean manual-review commit `546965d`. [Plan 0005](plans/0005-visible-study-details.md) and [ADR 0008](decisions/0008-visible-study-details.md) record the explicit replacement of the earlier optional-reveal default for study material.

Vocabulary cards now show meaning, French example, English translation and labelled explanation together. Dialogue translations/grammar and saved notebook meanings are also visible directly. Editor previews share the same lesson component. Narrow screens use a small illustration beside the word. Removed the unused generic study Reveal component and updated product copy/instructions plus existing browser expectations. Aligned the repository UI role and French-authoring workflow with this preference in both prepared sources and installed files; no runtime role auto-loading claim. Recall cards and exercise hints remain practice controls. No content revision, grading, rating rule, persistence or storage schema changed; no owner data was modified by tests.

## Ownership and validation

Primary handled this small sequential UI/documentation change and self-review; no subagents or new dependencies needed. Preserved the initial clean tree and inspected the focused source diff for obsolete controls, reset risks, accessibility and narrow layout. Account usage/reset tools remain unavailable; no remaining allowance or automatic resume claimed.

- `npm.cmd run check`: repository and TypeScript passed after final responsive change.
- `npm.cmd test`: all 16 tooling and 54 application tests passed; no domain/storage code changes.
- Final `npm.cmd run test:e2e`: 21 passed, one deliberate duplicate mobile publication skip. Existing assertions verify visible vocabulary/translation/explanation and dialogue grammar without expanding controls; notebook, editor, backup, ratings, retry/reload and 320px flows pass.
- Final `npm.cmd run build:web`: passed after compact mobile layout change.
- `npm.cmd run setup:codex:plan`: all nine installed/prepared files match after the preference update.
- Desktop and narrow vocabulary screenshots inspected. No horizontal overflow in the narrow browser flow. Long text can still require scrolling. Physical phone/voice/Safari/screen-reader limitations and three documented moderate upstream build-tool audit findings remain.

Primary inspected and staged only this task's UI/tests/preference/workflow/plan/status/checkpoint files. Staged-secret and whitespace checks passed and are repeated on this final note before committing. Intended checkpoint title: `fix: show study details without dropdowns`; its actual hash is reported only after Git confirms it. If interrupted first, preserve task files and finish staged checks/commit verification. No test artifacts, databases, backups, recordings or keys are staged. No push, merge, public hosting or owner curriculum approval/publication performed.

## Previous completed checkpoints

`83c5573` learner foundation; `7a84e60` editor/preview/publication; `bc1b08f` backup/atomic restore; `546965d` manual notebook review. All are local commits, not remote backups.

## Next implementation step

The next broader product slice remains downloaded web assets/offline installation, explicit cache status/size/removal and recovery while preserving notebook/events/ratings. Actual owner curriculum review and physical-phone tests remain separate. Full editor tools, native packages and AI speaking remain planned. Resume the already-authorised broader work from the current status without reverting this direct-display preference.

## Run and recovery

Learner: `npm run dev` at localhost:8081. Local API: `npm run dev:api` at 127.0.0.1:3001. Existing browser may hot reload; refresh if needed. Check running processes before starting duplicates. Inspect live remote history before future integration; no remote operation occurred in this task.
