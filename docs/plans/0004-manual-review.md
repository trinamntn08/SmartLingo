# Calm manual notebook review

Status: completed
Owner: primary agent

## Outcome
Review saved vocabulary as French→meaning recognition cards, reveal the meaning, then manually rate Again / Needed help / Remembered. Persist immutable ratings and schedule by local calendar date; no automatic mastery/proficiency claim. Existing notebook remains editable below the queue. Ratings survive reload and versioned backup restore; version1 backups remain importable without ratings.

## Shared contracts and ownership
- Primary: review-schema.ts, LearningRepository methods/storage v3, backup v2 migration, App/Notebook integration, backup UI counts, integration/browser tests/docs.
- Domain worker (existing API agent): exclusively packages/domain/src/review.ts and packages/domain/tests/review.test.ts; implement pure schedule helpers and meaningful timezone/day/dedup tests. No other edits.
- UI builder: exclusively apps/learner/src/review/**. Imports review contracts, schedule helpers and repository; no other UI edits.
- Independent reviewer: read-only integrity/learning review after implementation. Primary owns manifests/contracts and integration.

reviewEventSchema is in domain/review-schema.ts: immutable UUID, notebookId and entryUpdatedAt revision, recognition/manual, algorithmVersion1, again/helped/remembered, occurredAt ISO, studyDate YYYY-MM-DD, timeZone valid Intl timezone. Study date must match instant/timezone. Domain exports localStudyDate(instant,timeZone) and currentReviewEvents for current notebook revisions. Editing starts fresh practice without deleting previous ratings.

Domain review.ts exports reviewIntervals = [1,3,7,14,30] readonly, reviewState(notebookId,events,today): ReviewState and dueReviewIds(notebookIds,events,today): string[]. Sort events by occurredAt then ID, dedupe identical UUIDs and reject conflicting duplicate IDs. New items due today, step0/independentDays0. Remembered schedules next interval then advances capped step; maximum one independent advancement per distinct study date (repeat same-day remembered keeps existing due/step). Again/helped resets step0 and due tomorrow, without advancing independentDays; repeat remembered later that same day after help cannot claim independent advancement. Historical independentDays counts distinct remembered days not helped that day. Treat a day with any helped/again as supported; do not boost it by later self-rating. Do not shorten or extend due on duplicate remembered events. All calculations are calendar dates (DST safe), not elapsed 24-hour durations. Empty/no-event state uses today.

UI ReviewPanel props notebook: NotebookEntry[]. It loads listReviewEvents via openLearningRepository and displays only due notes. Shows French front, Reveal meaning, then three explicit rating buttons; record stable event before advancing. Retry same pending event on storage failure; no false success. Timestamp/timezone captured at rating. Empty notebook: invite saving words; no due items: calm all-done message. Explain schedule 1/3/7/14/30 days is a heuristic and ratings are manual recognition, not assessment. Recognition only; production/listening remain separate future work. Separate visibility of meaning from the record of using help. One-click double submits locked by ref. Show next due date after save. Use shared warm theme/controls and visible keyboard focus.

Storage v3 adds reviewEvents without clearing existing stores. Export backup format2 includes reviewEvents; parser migrates valid format1 to2 with empty reviewEvents. Atomic restore includes rating events and rejects conflicting UUIDs; duplicate imports do not advance schedule. Existing event/notebook/publication rules stay intact. Files remain bounded and private.

## Validation
Schedule intervals, same-day support and duplicate behavior, timezone/DST dates, migration/persistence, backup v1→v2 compatibility/rollback and new browser rating→reload→backup cycle. Run npm check/test/e2e/build, independent review, deliberate staged checks/commit. No paid calls or curriculum publication.

## Progress
Branch feat/manual-review from clean backup checkpoint bc1b08f. Owner authorised continued implementation; usage/reset capability remains unavailable. Physical-device/voice/audit limits remain.

Domain worker/UI builder completed exclusive modules; primary integrated storage v3, backup v2/v1 compatibility and notebook entry revisions. Independent review found a stale-tab scheduling risk; quiet persisted-history refresh and a domain early-recall guard now prevent it. Thirteen schedule tests plus migration/rollback/rating tests pass within all 54 application tests. Full browser run: 21 passed, one duplicate publication skip; six review/backup cases rechecked after revision scoping also pass. Review/DST/retry/backup, edit-after-rating and stale-focus flows pass. No owner data was rated or published by agent tools. Final export passed; primary creates the local checkpoint recorded in SESSION_CHECKPOINT.md.
