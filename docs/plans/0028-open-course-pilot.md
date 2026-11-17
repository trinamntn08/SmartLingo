# Task: first openly reusable daily-course pilot

Status: first pilot complete, reviewed and validated; curriculum remains an owner-review draft. Started 2026-11-17 (Europe/Paris), baseline `2fc5f51`, branch `feat/open-course-pilot`.

## Outcome and acceptance

Implement one complete draft beginner day inside the learner, beginning [plan 0027](0027-open-course-integration.md). The learner opens the course from Today, studies bilingual material and canonical vocabulary, practises reviewed choices, self-reviews a short exchange, saves words, completes the day and resumes the exact section after reload. Course events are separate from existing lesson completion and included in backward-compatible learning backups. No calendar skipping, proficiency claim, external book dependency or paid call.

The source scope is small: adapt only the textual greetings on [BCcampus Basic greetings](https://opentextbc.ca/francaisinteractif/chapter/00-basic-greetings/), which has a page-level CC BY 4.0 notice, with original SmartLingo dialogue/practice and unchanged canonical vocabulary support. Include source/creator/copyright/licence and change notices in the app and offline export. Exclude the source photo, audio, H5P, embedded content and external UT materials. Record actual inspected scope and source evidence separately; do not claim legal clearance of a whole textbook. All curriculum remains a bundled draft preview, without automatic owner publication.

## Contracts and ownership

Primary owns new domain course contracts, all shared exports/manifests, integration, docs/ADR, combined tests and Git. Separate `OpenCourse`/day/block contracts preserve existing `Lesson` and events; new immutable course events permit resumable study/navigation/practice/completion. No new API/editor/import workflow or server SQLite schema is needed for this bundled pilot. The full general editor and source importer remain future work.

Curriculum author exclusively owns `packages/content/src/open-course-pilot.ts` and `docs/curriculum/open-course-pilot-sources.md`. Persistence builder owns assigned browser persistence/backup files and focused migration tests after contracts are frozen. UI builder owns new learner course screens/hook and browser tests after interface agreement. Independent reviewer is read-only and rotates into a free agent slot. Nobody stages/commits except primary; preserve shared edits.

## Validation

Run domain/schema/rights/choice/progress tests, IndexedDB upgrade and immutable-event/backup merge/legacy restore failure tests, existing application suites, `npm.cmd run check`, focused desktop/narrow browser and cold-offline pilot checks, export/credit inspection and independent review. No live providers, imported recordings or actual voice-quality claims. Update STATUS/checkpoint and commit/push deliberately reviewed paths after final checks.

## Completed implementation and actual checks

The pilot is reachable from Today and includes all seven sections, exact-section reload/resume, hints and feedback, gated completion, canonical notebook capture, temporary optional writing and full source credits. Independent course events use IndexedDB v4 and backup v3; older v1/v2 backups remain importable. No server/SQLite, legacy lesson payload or dependency change was needed. Full course authoring/import/publication remains outside this first slice.

- `npm.cmd test`: PASS 18 tooling and 202 application tests. Focused source/schema/progress and migration/backup tests passed; independent reviewer also ran 16 focused tests successfully.
- `npm.cmd run check`: PASS repository/documentation checks and TypeScript; final metadata/staged checks follow at checkpoint.
- Focused Chromium run: PASS 20 desktop/narrow tests covering the pilot, existing greetings/resume/publication overrides and backup UI. Extended the pilot journey with real backup download and fresh-browser restore of completed course/history/notebook/cursor: PASS both viewport projects in the follow-up run.
- Production Expo export to ignored `.tmp/open-course-export`: PASS. Final source-rights wording refresh: 126 offline-manifest assets, 9,730,168 bytes, build ID `2df1b92a8a4e9253d0bc85812d3f719be3c8b4777645967c5e5b4712d92673c3`. Normal `apps/learner/dist` and the owner's running previews were not overwritten.
- New cold-offline pilot tests: PASS desktop and 320 px projects, including source credits, notebook save, cursor after reload and zero external source/licence requests. Used ignored temporary fixture/config copies on port 18184; the final wording refresh uses port 18185 while the clean task preview keeps 18184. Initial port 8084 attempt refused to reuse the owner's existing listener; selected a free port without stopping it. Existing owner listeners on 8082/8084 remain untouched. This is the focused pilot offline check, not a rerun of every existing offline-suite test.
- Independent read-only review identified inconsistent restored choice-result feedback; fixed it to validate the offered choice and computed grade before displaying correctness. Browser regression passes. Final code/test/docs review found no unresolved actionable defect. A 320 px screenshot was inspected; no horizontal overflow was observed.

A separate loopback-only task preview was started from the tested export at `http://localhost:18184`; HTTP 200 verified. It is a local preview, not a hosted deployment. No publication, permission request, paid provider call or native-teacher/device/audio acceptance was performed. Keep source credits/exclusions attached to this adapted text; the source record does not clear a whole textbook.
