# Documentation index

Use the current guides below. Dated plans, audits and decisions explain earlier work; their counts, ports, test results and next-step suggestions apply to their recorded snapshot. They do not override current owner instructions, source contracts or this checkout's implemented scope.

## Current guides

| Start with | Purpose |
| --- | --- |
| [README](../README.md) | Install/run overview and short command list. |
| [STATUS](STATUS.md) | Implemented capabilities, milestone gates and remaining work. |
| [Session checkpoint](SESSION_CHECKPOINT.md) | Latest task, actual validation, commit/upload state and recovery action. |
| [Product plan](../PROJECT_PLAN.md) | Target requirements and product constraints, including future scope. |
| [Local operations](LOCAL_OPERATIONS.md) | Learner/editor use, backups, offline study and optional speech/AI setup. |
| [Architecture](ARCHITECTURE.md) | Module responsibilities, boundaries and implementation/review standards. |
| [Testing](TESTING.md) | Commands, test isolation, coverage and unverified areas. |
| [Environment](ENVIRONMENT.md) | Pinned runtime, dependency installation and packaging boundaries. |
| [Contributing](../CONTRIBUTING.md) | Development entry point; [session workflow](SESSION_WORKFLOW.md) owns checkpoint/usage/recovery policy. |
| [Codex setup](CODEX_SETUP.md) | Prepared/installed instructions, roles, skills, hooks and activation limits. |
| [Cloud workflow](CLOUD_WORKFLOW.md) | Repository-backed Cloud setup and acceptance; no assumed active environment. |

## Curriculum and media

- [A1–B1 listening resources](curriculum/listening-resource-sources.md): the Practice link library, verified providers, access/text-support notes and external-playback limits.
- [Content guide](CONTENT_GUIDE.md): authoring/publication rules; [course catalogue](COURSE_CATALOGUE.md): bundled lesson order/outcomes/targets.
- [Current curriculum review pack](curriculum/README.md): all-topic A1/A2 plan, deduplicated teaching ledger, communicative/revision tasks and unregistered candidate lessons.
- [Open A1–B1 course integration plan](plans/0027-open-course-integration.md): freely reusable source candidates, full website study, daily progression, phased implementation and parallel ownership; planning only.
- [First daily-course pilot](plans/0028-open-course-pilot.md) and [its source record](curriculum/open-course-pilot-sources.md): one bundled owner-review draft day, bounded CC BY text reuse, attribution and media exclusions.
- [Japanese daily-course route](plans/0029-japanese-course-b1.md) and [authorship/level research](curriculum/japanese-course-sources.md): 13 original draft study days spanning foundations and estimated A1/A2/B1 tasks, with English/kana support; full level coverage and owner/native review remain pending.
- [Curriculum research](CURRICULUM_RESEARCH.md): current versus historical research scope and sources. Earlier [topic-placement audit](CURRICULUM_TOPIC_AUDIT.md) and [redundancy audit](CURRICULUM_REDUNDANCY_AUDIT.md) retain their dated evidence.
- [Photo coverage](PHOTO_COVERAGE.md), [photo rights](PHOTO_SOURCES.md) and [original illustration sources](MEDIA_SOURCES.md): exact media support and gaps. [Voice options](VOICE_OPTIONS.md) records dated investigation and audition criteria.

## Separate review and deployment work

[Free website plan 0025](plans/0025-free-web-testing.md) and the [Cloud continuation prompt](CLOUD_DEPLOY_PROMPT.md) track hosted implementation on a separate branch and its blocked secure deployment. A written prompt or uploaded branch is not a live website. The curriculum pack's eleven candidates likewise remain separate from the bundled catalogue.

## Historical records and templates

- [Execution plans](plans/) preserve scope, acceptance and checks for individual steps. Completed records are history; current priorities belong in STATUS. Plan 0011 records unresolved build-tool audit work; plan 0025 tracks the separate hosting release and blocked deployment; [plan 0026](plans/0026-documentation-cleanup.md) records this documentation audit.
- [Architecture decisions](decisions/) preserve the reasoning and consequences of accepted choices. Later decisions may refine earlier ones; do not delete historical evidence as duplicate instructions.
- [Local preview history](history/local-preview-2026-11.md) retains dated milestone and verification detail removed from STATUS. Full earlier file versions are also recoverable from Git.
- [ADR template](templates/ADR.md) and [execution-plan template](templates/EXECUTION_PLAN.md) are reusable formats, not pending tasks.
- [Visual-reference instructions](../references/AGENTS.md), [fixture boundaries](../tests/fixtures/README.md) and [prepared tooling](../tooling/README.md) explain their specific directories. Installed `.agents/` and prepared `tooling/agents/` skill copies intentionally coexist for repeatable installation.

Keep one authoritative home for each current fact or procedure. Link to it from entry points; put new per-step evidence in its plan/checkpoint rather than appending another competing current-status narrative.
