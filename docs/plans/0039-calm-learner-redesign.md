# Task: simplify the shared learner interface

Status: completed
Owner: primary agent

## Outcome

The owner requested a complete UI redesign because the homepage is crowded. A fresh learner can choose a language and start the recommended activity directly. Today has one clear next action, compact alternatives and an optional daily course. Learn owns topic discovery; Report owns detailed metrics. Study screens show the current task and next action with English meanings and reading support visible.

Acceptance: French and Japanese entry, study/resume, notebook review, listening/speaking, reports, settings and course progress remain usable on desktop and at 320px. Navigation no longer repeats all topics across every page. Save failures still prevent losing pending learning writes. No content IDs, revisions, storage contracts or provider behavior change.

## Relevant context

[Product plan](../../PROJECT_PLAN.md), [status](../STATUS.md), [architecture](../ARCHITECTURE.md), [design system](../DESIGN_SYSTEM.md) and all seven owner references. Started from clean `786219d` after fetching origin, on `feat/calm-learner-redesign`. Other worktrees and preview services are preserved.

## Steps and ownership

1. Primary: shell, language chooser, shared visual tokens, Review, Report, integration, documentation and Git.
2. UI builder (gpt-6.1-sol, high): TodayDashboard/OpenCoursePanel, then exclusive ProfileScreen/Disclosure follow-up.
3. UI builder (gpt-6.1-sol, high): LearningHub/TopicCatalogue/LessonScreen/JapaneseAlphabet, then offline spec adaptation.
4. Worker (gpt-6.1-sol, high): e2e specs/helpers and combined browser regressions.
5. Independent change reviewer (gpt-6.1-sol, high), read-only: implementation, responsive checks and documentation. Primary integrates and validates the complete result.

Shared contracts remain unchanged. Primary owns shared styles and dependencies; no dependencies are planned. Agents were explicitly assigned exclusive ownership and told to preserve concurrent edits.

## Validation

Run `npm.cmd run check`, application tests and meaningful browser journeys for both languages, including narrow layout, practice, saved history and navigation. Update existing browser journeys to navigate through Learn after removing global topics. Build the exported web app. Inspect rendered desktop/mobile screenshots; record actual results at handoff.

## Progress and decisions

Initial audit found duplicate lesson CTAs, metrics and weekly charts on Today, global topic controls on every destination, verbose stacked introduction cards and course day navigation ahead of current study. Simplify information placement and visual hierarchy without removing learning features.

Implementation complete. [ADR 0032](../decisions/0032-calm-learner-interface.md) records information placement, responsive navigation and retained settings state versus temporary AI cleanup. Independent code review found no actionable defects; documentation review identified two stale operations paragraphs, corrected before handoff.

Repository/TypeScript and 274 tooling/application tests passed. Final exported build has 126 files / 10,228,199 bytes; full isolated cold-offline suite passed 24/24 at desktop/320px. Final full browser regressions passed 143 tests with one pre-existing intentional duplicate-publication skip, after correcting obsolete assertions about the former dashboard and navigation. No application checks were disabled.

Account usage reporting is unavailable in this client on 2026-11-22; no allowance inferred. No automatic-resume scheduler is configured.

## Handoff

Both languages use the simplified interface, with direct study/resume and retained learning history. Primary inspected desktop/320px destination screenshots; independent reviewer separately checked expanded Profile at 320px and navigation at 320–768px. The mobile Learn strip was reduced to one scrollable row after visual inspection. Real device, screen-reader, speech quality and owner acceptance remain open. [Checkpoint](../SESSION_CHECKPOINT.md) records checks and task-branch handoff; no deployment or curriculum publication is part of this step.
