# Session checkpoint

Updated: 2026-11-19 (Europe/Paris). Completed, reviewed and validated: second draft daily-course day with free selection and independent resume. The commit containing this note is the checkpoint; its actual SHA and verified upload are reported at handoff.

## Request and outcome

Owner asked the agent to continue useful work while away for three hours. Continued the existing daily-course direction with one bounded slice: Today → Open daily course now offers Meet a neighbour and Introduce yourself. Both have seven sections, eight unchanged canonical vocabulary entries, visible bilingual support, three situational choices and optional self-review. The chooser preserves each day's progress and exact section; reload returns to the latest valid visited day. Completion offers another unfinished day explicitly. Failed day-switch writes keep the current day with retry/discard; unavailable storage permits browse-only use.

Course release 2 retains day 1's byte-for-byte teaching payload under explicit progress revision 1, protected by a frozen SHA-256 fixture. Day 2 is original material under revision 2. No historical event rewriting, storage/backup migration, new dependency, paid call, API change, curriculum publication or deployment. Day-1 source attribution and exclusions remain scoped; new day-2 prose does not claim the source's licence.

[Plan 0031](plans/0031-daily-course-continuation.md) owns acceptance and actual results. [ADR 0025](decisions/0025-append-course-days-with-stable-progress.md) records progress compatibility and its authoring limits. [Day-2 provenance](curriculum/open-course-day-two.md) documents original drafting, canonical IDs and review needs.

## Validation actually performed

- npm.cmd run check: PASS repository/documentation and TypeScript; final documentation/staged rerun before delivery.
- npm.cmd test: PASS 18 tooling / 205 application tests. Eight course tests cover frozen day-1 identity, both-day canonical support, revision isolation, explicit completion and valid resume.
- Focused Chromium course suite: PASS 12/12 desktop/narrow. Final main-journey rerun after extra day-2 320px assertions: PASS 2/2. Includes keyboard selection, exact per-day cursors, actual backup download/fresh-context restore for both days, prior revision-1 completion, final completion stability, failed switching retry/discard and unavailable-storage browsing.
- npm.cmd run build:web: PASS. 126 assets / 9,753,641 bytes / build 7f13348a4d4bd319ab28c2bedd9f5a80b9cd004dcb29292ec9436f89965ea494.
- Final focused exported cold-offline course suite: PASS 4/4 desktop/320px, including full day-2 study/completion, notebook capture, hints/model, reload, independent revisit and no external source/media/provider requests. API is aborted by fixture. Isolated port 8082 was free; no owner process stopped.
- Initial offline failures were test assertions: duplicate progress copy after adding chooser, and inclusion of intentional horizontal topic scroller in document descendant bounds. Corrected selector scope; retained global document-width plus complete course-panel descendant bounds. Final suite passed. Independent reviewer confirmed the corrected scope does not hide course overflow.
- Independent read-only review: no actionable defects; primary reviewed diff and exported 320px screenshot. git diff --check PASS. Final index/secret and cached-whitespace checks before commit.

Ordinary local production preview started at http://localhost:8082 with HTTP 200 verified. This is a loopback preview, not a hosted site; its availability depends on the local process. No physical-phone/Safari/native/screen-reader, real audio quality, native-teacher or owner content acceptance established. Course remains draft and incomplete.

## Git and recovery

Branch feat/daily-course-continuation, base a485b8e (completed listening library); origin listening head matched at startup. Preserve unrelated pre-existing tests/e2e/backup.spec.ts working-tree status; it has no content diff and is excluded. Stage only the 13 deliberate course code/test/docs paths. Run final check:staged and git diff --cached --check; commit; inspect live origin task ref; push normally; verify remote SHA equals local HEAD. No merge, force push, main update or publication.

This slice is complete. Next useful course work: review the two draft days, then add further original/reusable day payloads one bounded reviewed checkpoint at a time; changed teaching payloads need fresh progress scopes. General import/editor/publication and full level coverage remain future work. No further unattended feature expansion is part of this checkpoint.

## Delegation and usage

Curriculum author owned only day-2 module, pilot assembly and provenance; UI builder owned course panel and focused e2e tests; independent reviewer stayed read-only. All used exposed gpt-6.1-sol / medium with fresh contexts per SESSION_WORKFLOW. Primary owned domain contracts/tests, offline test, docs, combined verification and Git. Prepared role files were read; automatic client loading is not claimed.

Account allowance reporting unavailable in this client on 2026-11-19; this means neither zero nor unlimited. No automatic-resume schedule configured. Export/screenshots/caches remain ignored and outside the commit.
