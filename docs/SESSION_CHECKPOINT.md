# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Current request and outcome

Owner requested that clicking SmartLingo return to the first page and that topics move to the left. Completed on fix/home-link-and-left-topics from clean visual-browser checkpoint 1ffb044. See [plan 0008](plans/0008-home-and-left-topics.md) and the owner correction in [ADR 0010](decisions/0010-visual-word-overviews.md).

Shared BrandHome control now works by mouse, Enter and Space through the existing native button semantics, with a visible keyboard-focus border. Learner and editor headers call the same root home action: close the editor view and reset the learner to Today, clearing open lesson/topic selection and scrolling to the top. The editor stays mounted, preserving unsaved text. Its Return to learning control remains available. Desktop topic pane renders before the main content, with the divider on its right edge. The horizontal phone list remains.

Primary handled this small sequential change and self-review; no delegation or new dependencies. Inspected callback/effect reset behaviour, editor preservation and focus/geometry. No curriculum, domain, persistence, media or API changes. No owner data edits, publication, paid calls, push or merge.

## Validation

- npm.cmd run check: repository/TypeScript passed; repeated on final staged documents before committing.
- npm.cmd run test:e2e: 29 passed, one existing deliberate duplicate publication skip. Updated geometry verifies left sidebar; brand click returns home from a topic bank, Enter returns home from a lesson, editor brand returns home and reopening the editor keeps unsaved text. Existing 320px navigation, learning/reload/retry, notebook, publication isolation, backup and manual-review journeys pass.
- npm.cmd run build:web: passed.
- Additional private-context smoke check returned home from Groceries; desktop left-pane screenshot inspected. No owner browser/storage used.
- git diff --check passed before final note. Stage only this task's UI/tests/docs, run staged-secret/whitespace checks and commit locally. Actual commit identity is reported only after Git confirms it; if interrupted first, preserve changes and finish those steps.

Prior visual-browser checkpoint passed 16 tooling/60 application tests and all 125 image decodes. Those modules are unchanged; no unnecessary repeat of the domain/storage/media suite. Physical phone/Safari/screen reader, audible voice quality and owner content/media review remain unverified. Three previously documented moderate upstream Expo build-tool audit findings remain unrelated. Usage/reset tools unavailable; no allowance estimate or automatic resume claimed.

## Git and next action

Expected local checkpoint title: fix: return home from brand and move topics left. No unrelated initial edits existed. Exclude screenshots, test results, exports, caches, databases and keys. Verify actual commit hash and clean working tree after checks.

Refresh localhost:8081: topics are on the left, and SmartLingo returns to Today. Learner/API remain at localhost:8081 and 127.0.0.1:3001; check listeners before duplicate starts. Broader offline installation, full editor tools and AI speaking remain planned, outside this request.

Prior checkpoints: 1ffb044 visual vocabulary; 042086d topic expansion; 3653a5e direct details; 546965d manual review; bc1b08f backup; 7a84e60 editor; 83c5573 foundation. Local commits are not remote backups. Inspect remote history before future integration.
