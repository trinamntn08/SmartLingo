# Task: continue the daily course without losing earlier study

Status: completed, independently reviewed and validated; content remains draft. Owner: primary agent. Started 2026-11-19 (Europe/Paris).

## Outcome

Under the owner's instruction to continue useful work during their absence, advance the existing [open-course plan](0027-open-course-integration.md) by one bounded journey: two draft study days with free selection, independent progress, exact-section resume, and a clear next-day action. Add an original beginner day for introducing yourself in a polite adult exchange, reusing 6–10 unchanged canonical vocabulary entries. Keep direct bilingual support, optional speaking, manual self-review, offline use, and notebook capture.

Acceptance: day 1's existing activity/completion survives the app update; switching days returns to that day's saved section; reloading resumes the most recently visited valid day; completing day 1 offers day 2; learners may revisit either day without locks or calendar penalties. Backup/restore preserves both days. Save failures cannot silently navigate or award completion. No automatic publication, deployment, provider calls, new runtime level, source-media import or dependency change.

## Contracts and ownership

Course release becomes revision 2. Existing day 1 is byte-for-byte unchanged apart from explicit `progressRevision: 1`; the optional day field selects the immutable course-event scope of a day whose entire teaching payload is unchanged. Omitted values keep the existing course-revision behaviour. New day 2 uses revision 2. Changed teaching payloads must use a new progress revision; never reinterpret old attempts. Existing storage/backup schemas need no migration. Primary owns shared domain contracts/tests, docs, offline tests and Git. See the decision record added with this slice.

Curriculum author owns only the new day module, pilot assembly and a new original-content provenance note. UI builder owns `OpenCoursePanel.tsx`, `tests/e2e/open-course.spec.ts` and an optional feature-local chooser component. Shared helper: `courseDayProgressRevision(course, day)` from `@smartlingo/domain`; use it for new event scopes and scoped result display. Neither builder owns manifests, lockfiles, storage adapters or shared domain files. Independent reviewer stays read-only. All preserve unrelated edits, especially `tests/e2e/backup.spec.ts`.

## Steps and validation

1. Freeze contracts and record original day-1 SHA-256: `79a94a54503782e5af2756bcb2164f74e936d2cc1f312e88d460bf05f8432ff1` over `JSON.stringify(day)` before the new optional field. Verify the protected payload in tests.
2. Implement the original second day and responsive chooser/resume journey in parallel.
3. Verify domain revision isolation, canonical vocabulary, browser day switching/completion/reload, storage failure, real backup/restore and cold-offline day 2 at desktop/320px. Run `npm.cmd run check`, `npm.cmd test`, production export and `git diff --check`.
4. Resolve independent review findings, update status/checkpoint, deliberately stage, run staged checks, commit and push the topic branch; compare live remote head.

## Progress and limits

Account allowance reporting is unavailable in this client; no automatic-resume schedule is configured. Existing backup-test working-tree edit is unrelated and excluded. No owner/native-teacher review, real audio quality, physical-phone/Safari/native/screen-reader or hosted acceptance is established by automated checks.

## Completed outcome and actual validation

The course now has two draft days with free selection and separate status/cursors. Day 2 teaches a polite introduction using eight unchanged canonical entries, bilingual original study/dialogue, three situational choices and optional self-review. Existing day-1 completion remains valid under progress revision 1; new day-2 events use revision 2. Save-before-switch, retry/discard, browse-only storage failure and deliberate return to completed days are covered. Completion offers an unfinished day without automatically moving the learner.

- `npm.cmd run check`: PASS repository/documentation and TypeScript; final documentation/staged checks run again before delivery.
- `npm.cmd test`: PASS 18 tooling / 205 application tests, including eight focused course tests for canonical identity, frozen day-1 payload, revision isolation, completion and resume.
- Focused Chromium course suite: PASS 12/12 desktop/narrow. After final additional 320px day-2 bounds/screenshot assertions, the main journey rerun passed 2/2. Includes keyboard day selection, independent exact cursors, prior revision-1 completion, final-day stability, failed day-switch retry/discard, storage-unavailable browsing and actual downloaded backup/fresh-context restore for both days.
- `npm.cmd run build:web`: PASS. Export contains 126 assets / 9,753,641 bytes; build `7f13348a4d4bd319ab28c2bedd9f5a80b9cd004dcb29292ec9436f89965ea494`.
- Final focused production cold-offline suite: PASS 4/4 desktop/320px. Both days survive cold start; all seven day-2 sections, hints/model, canonical notebook save, explicit completion, reload and independent revisit work offline. No external source/media/provider requests. API is aborted by the test. Used standard isolated port 8082 after checking no owner listener.
- First offline run identified an old ambiguous status selector after adding the chooser, and a whole-document descendant assertion that included the app shell's intentional horizontal topic scroller. Scoped the former to the day status, and the latter to the course panel while retaining a document-width assertion. Diagnostic rerun confirmed the scroller was the only out-of-viewport content. No runtime workaround or unrelated layout change was needed. Final suite passed after these test corrections.
- Independent read-only review found no actionable runtime/content defect; primary inspected the integrated diff and 320px exported screenshot. `git diff --check` passed. Final staged secret/index/whitespace checks and Git upload verification are recorded at handoff.

No dependencies, IndexedDB/backup versions, API/storage adapters, legacy lessons, publications, provider configuration or source media changed. More days, complete-course coverage and general course authoring/import/publication remain future work. The per-day compatibility assertion is deliberately explicit and guarded for the existing payload; it is not a general immutable release authoring system.
