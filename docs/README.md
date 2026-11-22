# Documentation index

Use the current guides below. Dated plans, audits and decisions explain earlier work; their counts, ports, test results and next-step suggestions apply to their recorded snapshot. They do not override current owner instructions, source contracts or this checkout's implemented scope.

## Current guides

| Start with | Purpose |
| --- | --- |
| [README](../README.md) | Install/run overview and short command list. |
| [STATUS](STATUS.md) | Implemented capabilities, milestone gates and remaining work. |
| [Repository and branch state](REPOSITORY_STATE.md) | Current Japanese-enabled baseline, separate Android/hosting work, source heads and safe synchronization. |
| [Session checkpoint](SESSION_CHECKPOINT.md) | Latest task, actual validation, commit/upload state and recovery action. |
| [Work log](WORK_LOG.md) | Dated tracking for every task/status request, source synchronization, progress and outcomes. |
| [Session workflow](SESSION_WORKFLOW.md) | Required local/remote synchronization before every request, ongoing documentation and checkpoint procedure. |
| [Product plan](../PROJECT_PLAN.md) | Target requirements and product constraints, including future scope. |
| [Local operations](LOCAL_OPERATIONS.md) | Learner/editor use, backups, offline study and optional speech/AI setup. |
| [Architecture](ARCHITECTURE.md) | Module responsibilities, boundaries and implementation/review standards. |
| [Codebase review](CODEBASE_REVIEW.md) | Generated-file cleanup, completed modular refactors, confirmed fixes and remaining architecture opportunities. |
| [Design system](DESIGN_SYSTEM.md) | Shared tokens, base controls, feature composition, accessibility and extension guidance. |
| [Testing](TESTING.md) | Commands, test isolation, coverage and unverified areas. |
| [Environment](ENVIRONMENT.md) | Pinned runtime, dependency installation and packaging boundaries. |
| [Contributing](../CONTRIBUTING.md) | Development entry point; [session workflow](SESSION_WORKFLOW.md) owns checkpoint/usage/recovery policy. |
| [Codex setup](CODEX_SETUP.md) | Prepared/installed instructions, roles, skills, hooks and activation limits. |
| [Cloud workflow](CLOUD_WORKFLOW.md) | Repository-backed Cloud setup and acceptance; no assumed active environment. |

## Curriculum and media

- [A1–B1 listening resources](curriculum/listening-resource-sources.md): Learn → Listening & videos, 11 French/5 Japanese recommendations, source/access notes and external-playback limits.
- [Content guide](CONTENT_GUIDE.md): authoring/publication rules; [course catalogue](COURSE_CATALOGUE.md): bundled lesson order/outcomes/targets.
- [Current curriculum review pack](curriculum/README.md): all-topic A1/A2 plan, deduplicated teaching ledger, communicative/revision tasks and unregistered candidate lessons.
- [French A1–B1 daily-course plan](plans/0043-french-daily-course.md) maps 24 proposed units and 168 lessons for direct study on the website, with one recommended lesson per day. [Earlier source research](plans/0027-open-course-integration.md) explains the origin of the pilot.
- [First daily-course pilot](plans/0028-open-course-pilot.md), [continuation](plans/0031-daily-course-continuation.md) and [source record](curriculum/open-course-pilot-sources.md): two French owner-review draft days; bounded day-one CC BY text reuse, original day two and media exclusions.
- [Japanese daily-course route](plans/0029-japanese-course-b1.md) and [authorship/level research](curriculum/japanese-course-sources.md): 13 original draft study days spanning foundations and estimated A1/A2/B1 tasks, with English/kana support; full level coverage and owner/native review remain pending.
- [Shared Japanese lessons](curriculum/japanese-shared-lessons.md) and [topic vocabulary](curriculum/japanese-topic-vocabulary.md): 13 banks, 65 short lessons, 390 appearances/380 canonical entries, preserved course history and shared practice widgets.
- [Japanese letters](curriculum/japanese-alphabet-sources.md): 20 basic hiragana/katakana groups, readings, recognition practice and saved row continuation, separate from word totals.
- [Japanese audio](JAPANESE_AUDIO.md): device voices, optional free local VOICEVOX setup, saved clips and credits. [Unified hub](plans/0036-unified-learning-hub.md) records shared listening and guided speaking.
- [Curriculum research](CURRICULUM_RESEARCH.md): current versus historical research scope and sources. Earlier [topic-placement audit](CURRICULUM_TOPIC_AUDIT.md) and [redundancy audit](CURRICULUM_REDUNDANCY_AUDIT.md) retain their dated evidence.
- [Generated image workflow](MEDIA_SOURCES.md#generated-image-workflow), [photo coverage](PHOTO_COVERAGE.md) and [legacy photo rights](PHOTO_SOURCES.md) cover new image production and existing media. [Voice options](VOICE_OPTIONS.md) records dated investigation and audition criteria.

## Separate review and deployment work

[Free website plan 0025](plans/0025-free-web-testing.md) and the [Cloud continuation prompt](CLOUD_DEPLOY_PROMPT.md) track hosted implementation on a separate branch and its blocked secure deployment. A written prompt or uploaded branch is not a live website. The curriculum pack's eleven candidates likewise remain separate from the bundled catalogue.

The separate `feat/android-test-apk` branch contains verified debug-APK tooling for its French preview, not integrated Japanese support. Its instructions and the current hub/remote relationship are recorded in [repository state](REPOSITORY_STATE.md). Commands from that branch are not available automatically here.

## Historical records and templates

- [Execution plans](plans/) preserve scope, acceptance and checks for individual steps. Completed records are history; current priorities belong in STATUS. Plan 0011 records unresolved build-tool audit work; plan 0025 tracks the separate hosting release; [plan 0026](plans/0026-documentation-cleanup.md) records the earlier audit and [plan 0037](plans/0037-current-codebase-documentation.md) the current branch-aware refresh. Older French-only counts/navigation remain historical snapshots, not current all-language claims.
- [Architecture decisions](decisions/) preserve the reasoning and consequences of accepted choices. Later decisions may refine earlier ones; do not delete historical evidence as duplicate instructions.
- [Local preview history](history/local-preview-2026-11.md) retains dated milestone and verification detail removed from STATUS. Full earlier file versions are also recoverable from Git.
- [ADR template](templates/ADR.md) and [execution-plan template](templates/EXECUTION_PLAN.md) are reusable formats, not pending tasks.
- [Visual-reference instructions](../references/AGENTS.md), [fixture boundaries](../tests/fixtures/README.md) and [prepared tooling](../tooling/README.md) explain their specific directories. Installed `.agents/` and prepared `tooling/agents/` skill copies intentionally coexist for repeatable installation.

Keep one authoritative home for each current fact or procedure. Link to it from entry points; track every task in WORK_LOG and keep the latest recovery state in SESSION_CHECKPOINT. Put detailed implementation evidence in linked plans/decisions rather than creating competing capability summaries.
