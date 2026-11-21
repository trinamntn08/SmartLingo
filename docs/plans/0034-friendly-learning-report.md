# Task: Friendly shared learning dashboard and report

Status: completed
Owner: primary agent

## Outcome
Use the owner's attached dashboard reference for a warm cream/burgundy/yellow interface with rounded cards, bold readable headings, friendly icons, clear actions, four real summary metrics and a weekly activity chart. Today provides a welcoming dashboard and useful next lesson. A Report route shows actual language-scoped lesson, vocabulary, course-day and weekly activity summaries plus topic detail. French and Japanese use exactly the same widgets. Keep language selection, saved progress and existing course/lesson/editor journeys.

Owner confirmed the asynchronous clarification: an in-app progress dashboard. No downloadable output requested. No copied brand/name/age bands/fixture numbers, fabricated stars/streak/achievements or proficiency claims. All actions open implemented journeys. Calm weekly activity supports returning after breaks.

## Relevant context
Owner supplied screenshot and requested a report and friendly widgets on 2026-11-21. Base4122183 matches origin/feat/japanese-topic-vocabulary; current worktree is clean and original root owner backup.spec.ts status remains untouched. [Architecture](../ARCHITECTURE.md) keeps aggregation pure and read-only, with a separate persistence adapter. [Shared-language decision](../decisions/0026-shared-language-learning.md) applies. No database/schema/provider change or publication/deployment.

## Steps and ownership
- Primary owns report domain aggregation/types/tests, read-only report loading hook and persistence refresh, domain exports, docs and combined checks/Git.
- UI builder owns App.tsx, ui/theme.ts, controls.tsx, BrandHome.tsx, TopicSidebar.tsx, TopicCatalogue.tsx if needed, and new dashboard/* components except useLearningReport.ts. Shared responsive desktop/320px design; actual data, accessible text/chart and loading/empty/error/retry states.
- Browser helper owns only new tests/e2e/learning-report.spec.ts and tests/offline/learning-report.spec.ts; shared contracts agreed first. Existing regression adaptations remain primary-owned.
- Independent reviewer stays read-only after implementation.

## Shared contracts
LearningReportInput/Report/ReportDay/ReportTopic live in packages/domain/src/report-types.ts. buildLearningReport aggregates current-revision lessons/course days; words explored are distinct canonical IDs explicitly studied through lesson vocabulary or saved course vocabulary sections. Saved words reflect active-language notebook; legacy absent language is French. Weekly actions count saved learning attempts, course study/choice/reflection/completion and recognition ratings, deduplicated by event ID within each store, filtered to the selected language; navigation/support and mere notebook edits/browsing do not count. Ignore future timestamps for activity counts. Dates use the current viewer timezone, Monday–Sunday calendar week with future-day flags. Historical valid revisions may contribute activity, but current completion/word totals remain revision-scoped. No fabricated minutes or proficiency.

Hook useLearningReport({language,lessons,courses}) -> {report:LearningReport|null,loading:boolean,error:string,refresh:()=>Promise<void>}. It reads events/notebook/review/course stores without writing, refreshes on mount/focus/minute and exposes retry. Report is null with an error (no invented zero) if storage fails. A refresh must not clobber or invent learner history. UI report cards use test IDs report-lessons/report-explored/report-saved/report-days and report-week; topic progress report-topic-list. Navigation Report button is shared for both languages. Today remains the default after choosing a language, and old start/continue labels remain accessible for regressions.

## Validation
Pure tests: language isolation, UUID deduplication, current/old revisions, actual vocabulary study vs navigation, local midnight/DST/week boundaries/future data, review/course activity and no input mutation. npm.cmd run check/test; exported browser desktop/320px first-use and seeded activity/report/continue/change-language/reload/storage failure; complete relevant existing journeys; cold-offline report/chart/retry/learning navigation. Inspect screenshots against owner reference. Run staged/whitespace checks, focused commit and verified normal push.

## Progress and decisions
Selected sll-deliver-feature, read role/workflow instructions explicitly. UI/browser helpers use exposed gpt-6.1-sol medium fresh contexts; independent reviewer follows once slots available. Usage reporting unavailable, no automatic-resume schedule. Keep attached reference as owner input; no redistribution of its logo/media or new raster generation needed.

## Handoff
Delivered shared friendly Today and Report screens with cream/burgundy/gold styling, responsive navigation, rounded metrics, weekly rhythm/chart, next lesson and real topic actions. The owner confirmed an in-app dashboard. All metrics derive from saved language-scoped history; report visits are read-only. No dependency, migration, server/provider, content, account, publication or hosting change.

Actual verification (2026-11-21): npm.cmd run check PASS; npm.cmd test PASS18 tooling/221 application tests, including five report tests for language isolation, duplicate/revision rules, local week/year/DST boundaries, future dates, edited-note history, valid course completion and no mutation. Independent read-only review found no remaining source defects. Initial runtime inspection reproduced 491px document width at320px and missing lesson-role metadata; actual source constraints/role badge fixed both while retaining global overflow assertions.

Final source build PASS126 assets/10,171,778 bytes/build347b65412e0f7ee1b7d4164ce46e05f6a939729480eeedf05f523777a6715cb4. Exported report suite PASS6/6 desktop/320px: empty/scoped metrics, actual chart dates/actions/topic detail, readonly snapshots, reload/focus refresh, resume, language switch and storage-error retry/browsing. Primary visually inspected desktop Today, seeded Report and320px Today against the supplied reference.

Full Chromium regression on final application source:117 passed/1 intentional duplicate-publication skip/2 failures from an older single-alert selector, now scoped to the learning-data alert because Report has its own unavailable state. Corrected focused rerun results are in the checkpoint; do not claim a new single all-green full run. Full offline run:21 passed/1 download-readiness timing failure while other suites ran (113/126 files still downloading at10seconds). Unchanged-limit standalone download rerun PASS2/2 desktop/narrow (6.7/6.5seconds). This covers all22 offline scenarios across the runs, including new Report cold start/language switching/read failure/retry without remote requests. No application change or timeout increase for that rerun.

Existing curriculum hashes/progress, editor/publication, optional mocked providers, notebook/review and downloads remain covered by the regression/application suites. Final staged secret/whitespace checks and verified normal task-branch push are recorded at handoff. Local preview restarted on8082 after isolated offline tests. Limits: no actual screen-reader/physical-phone/Safari/native, live audio/provider or independent proficiency acceptance; delayed async and automatic minute/midnight refresh are source-reviewed and calendar-unit-tested, with focus/route refresh exercised in browser. Owner visual acceptance remains pending.
