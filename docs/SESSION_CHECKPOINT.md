# Session checkpoint

Updated: 2026-11-17, Europe/Paris. First daily-course pilot complete, reviewed and validated; curriculum remains draft. The commit containing this note is the checkpoint; its resulting hash and verified remote delivery are reported at handoff.

## Request, scope and source

Owner authorised starting [the open-course integration plan](plans/0027-open-course-integration.md), requiring already reusable material and attribution without negotiating publisher permission. Implemented one complete beginner day as the first bounded slice, not the entire A1–B1 course. [Plan 0028](plans/0028-open-course-pilot.md) owns acceptance and actual checks; [ADR 0023](decisions/0023-open-course-draft-pilot.md) records the contract/storage/source boundaries.

Branch `feat/open-course-pilot`, source `2fc5f51`; started clean from the verified planning checkpoint on `docs/taxi-daily-course`. No unrelated work was found. No merge, deployment, curriculum publication or publisher contact is part of this step.

## Completed behaviour and rights

- Today → Open daily course offers one draft “Meet a neighbour” day: seven sections with visible English study support, eight unchanged canonical phrases, original dialogue, three situational choices, optional manual self-review and deliberate completion. Exact saved section, hints, attempts and completion survive reload. Optional writing is explicitly transient; no raw recording is made. Completion records activity, not proficiency.
- Adapted only the visible textual greeting resource on the BCcampus *Basic greetings* chapter. Source page/home and CC BY 4.0 deed/legal code were actually inspected on 2026-11-17. App/offline credits retain creator, source, copyright, licence and modifications. Source photo, recordings, H5P, scripts and external UT material are excluded. [The source record](curriculum/open-course-pilot-sources.md) distinguishes adaptation, original additions and existing canonical support; it does not claim whole-book clearance or source endorsement.
- Separate typed course/day/block contracts and immutable revision-scoped course events preserve the existing 123 lessons, old events/notebook and server curriculum. IndexedDB v4 adds courseEvents; backup v3 includes them with atomic conflict detection and v1/v2 import compatibility. No server SQLite/schema/snapshot, dependency/lockfile or provider change.
- Learner shows recoverable storage/save errors and retry with the same event ID. Storage-unavailable reading remains possible. Forged/inconsistent restored answer flags receive neutral re-answer feedback and cannot award correct completion.
- Updated STATUS, architecture, local operations and docs index. Course editor/import/release publication, more days, complete open-source coverage, B1 runtime and complete A1–B1 curriculum remain future work.

## Actual validation and review

- `npm.cmd test`: PASS 18 tooling / 202 application tests. Focused course/schema/canonical/answer/progress tests and IDB migration/immutable retry/legacy restore/all-store rollback coverage pass.
- `npm.cmd run check`: PASS repository/documentation and TypeScript; final checkpoint/staged checks run before commit. `git diff --check`: PASS (one harmless CRLF-normalisation advisory in an edited existing test).
- Focused Chromium: PASS 20 tests across desktop/narrow projects for new course and existing greetings, resume, published overrides and backup. Extended full course journey to export backup v3 and restore complete history, notebook and cursor in a fresh browser: PASS both projects in a second run. Existing app code did not change between those runs.
- Production export PASS to ignored `.tmp/open-course-export`: final rights-wording refresh is 126 manifest assets / 9,730,168 bytes / build `2df1b92a8a4e9253d0bc85812d3f719be3c8b4777645967c5e5b4712d92673c3`. Confirmed the built bundle contains the reviewed answer-consistency fix. Source licence/credits remain attached to BCcampus material; original SmartLingo additions are not voluntarily relicensed by this task.
- Focused cold-offline course test PASS in desktop/320 px projects: bundled source credits, notebook capture and persisted cursor/reload with zero source/licence requests. Used ignored temporary server/config copies on free port 18184 because owner listeners occupy 8082 and 8084; final wording refresh tests use 18185 alongside the clean 18184 task preview. Initial 8084 run refused reuse, then succeeded on the isolated port. No owner process stopped or normal dist overwritten; not a claim to have rerun the entire prior offline suite.
- Inspected a 320 px screenshot; no horizontal overflow observed. Three implementation helpers plus an independent read-only reviewer contributed; reviewer independently ran 16 focused tests, verified the live source/licence scope, found one answer-feedback defect that was fixed/tested, and reported no unresolved final code/test/docs findings.
- Final source-licence wording refresh: domain course tests PASS 5/5; fresh-browser course/backup journey PASS in both viewport projects; refreshed production cold-offline checks PASS in both projects. Final `npm.cmd run check` PASS. The independent reviewer confirmed retaining source CC permissions without a voluntary licence grant over independent owner additions.
- No physical-phone/Safari/native/screen-reader, audible speech or native-teacher acceptance claimed. No paid calls or imported third-party media. Draft content remains subject to owner review/publication.

## Local preview and delivery

A separate loopback task preview is running at `http://localhost:18184`, process 12340, from ignored `.tmp/open-course-preview.mjs` and the tested isolated export; HTTP 200 verified. Open Today → Open daily course. It is not a hosted website; localhost storage is distinct from the owner's 8082/8084 previews. Existing owner process 15600/listeners remain untouched. On resume verify listeners before restarting anything; do not stop owner previews.

Commit/push procedure: stage only the deliberately reviewed implementation/tests/docs, excluding all `.tmp`, exports, databases and browser artifacts. Run `npm.cmd run check:staged` and `git diff --cached --check`, commit and push `feat/open-course-pilot` normally, then read live remote ref and compare with local HEAD. Report actual SHA and preserve a precise recovery action here on any failure. Do not merge or force-push. Inspect current local/remote state before repeating delivery on a later resume.

Next proposed course step: owner previews this draft day, then continue one complete reviewed unit using the same per-resource licence evidence and original replacements for unclear assets. More course-authoring/publishing support and B1 work stay in the larger roadmap; this completed checkpoint does not claim those gates achieved.

## Delegation and usage

Exposed `gpt-6.1-sol` / medium with fresh contexts: curriculum-author owned only pilot content/source record; api-builder owned browser persistence/backup panel and focused tests; ui-builder owned new course screens/hook and initial browser cases; independent change-reviewer stayed read-only. At most three subagents ran concurrently, rotating review into a free slot. Primary owned shared domain contracts/exports, integration, extra domain/offline/restore checks, docs, combined verification and Git. Prepared role files are not claimed to have loaded automatically.

Usage observation 2026-11-17: account-allowance reporting tool unavailable, not zero or unlimited. No automatic-resume schedule configured. Temporary build/test/preview artifacts remain ignored and outside the checkpoint.
