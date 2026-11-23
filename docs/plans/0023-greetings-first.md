# Task: Greetings-first opening curriculum

Status: completed
Owner: primary agent

## Outcome

A fresh learner starts with Everyday greetings and politeness: three eight-item foundation lessons for arrivals/departures, polite exchanges and short check-ins. Today, sidebar and Explore use the same explicit course order. Existing study resumes its current lesson; all previous lesson IDs, revisions, notebook captures and publication overrides survive. Ordinary study works without AI and in an updated offline download. New lessons remain drafts for owner preview/publication.

## Relevant context

[Opening research](../CURRICULUM_TOPIC_AUDIT.md) and [candidate entries](../audits/greeting-first-proposal.json), PROJECT_PLAN sections 3–5 and 7, [architecture](../ARCHITECTURE.md), feature-delivery and French-authoring skills. The 24-entry opening is a deliberately smaller introductory bank; existing larger banks remain intact. Broader audit recommendations and the proposed 30-area restructuring are outside this step.

## Steps and ownership

1. Preserve a local comparison snapshot of the existing 120 full lesson payloads. Primary owns index, course ordering, shared contracts, API/domain regression checks, historical-audit verification, docs and integration.
2. Curriculum-author owns only new greetings module and its focused content tests. Contract: buildGreetingsLessons(existingVocabulary) returns three schema-valid drafts, reusing seven exact canonical payloads and adding seventeen stable IDs.
3. UI-builder owns App.tsx, browser tests and offline browser test adaptations; preserve resume and verify fresh greetings, browsing, filters, save/reload, publication behaviour and offline startup.
4. Integrate, independently review, run combined checks/export and isolated browser/offline tests. Refresh the owner's local preview and API after verification; do not publish any curriculum.

## Validation

Run npm.cmd run check, npm.cmd test, targeted/full browser checks and isolated exported offline checks without disturbing owner data. Compare all old lesson payloads exactly; verify safe seeding and publication retention in temporary databases. Inspect current exported opening at desktop/320px. No provider calls or claim of audible/physical-device/native-teacher approval.

## Progress and decisions

- Started from clean 3bac1c7; topic branch feat/greetings-first. API3001 and preview8082 were running from previous launch. Account allowance unavailable in exposed tools, not zero/unlimited. No automatic resume configured.
- Two exposed role agents use gpt-6.1-sol/high with exclusive ownership; an independent read-only reviewer follows integration. Primary owns shared files; no dependency or storage-schema changes planned.
- Existing canonical support remains byte-equivalent as JSON; bonjour's daytime usage can be clarified in new lesson grammar without changing prior revisions. Existing audit remains a historical 120-lesson review and will be checked explicitly against that scope.

## Handoff

Three greeting drafts and actual default order are implemented; prior 120 full lesson payloads/revisions remain exact and owner publications/resume are preserved. Final check and 18 tooling/190 application tests pass. Initial browser run had three test assumption/timeout failures, fixed and verified by a 14-case affected-file rerun; all new greeting cases passed. Eight isolated exported offline cases pass, including the complete new greeting flow. Primary inspected desktop/narrow screenshots; independent review found no unresolved actionable issue. The verified export and current API are running on localhost8082/API3001. See the [checkpoint](../SESSION_CHECKPOINT.md) for exact commands, initial failures and final export fingerprint. Owner French/level/media/audio review and explicit publication remain pending; phone/Safari/native/screen-reader/real-provider checks are not claimed.
