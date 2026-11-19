# Task: Japanese daily-course route through B1

Status: completed implementation; draft curriculum review pending
Owner: primary agent

## Outcome

Today offers a separate original Japanese draft route with foundations, A1, A2 and B1 study days. Learners can browse by level/day, read Japanese with English support and kana readings, complete contextual choices and manual production review, save vocabulary, and resume exact sections after reload. Course events and private backup remain isolated by course ID/revision. French content remains unchanged.

Acceptance: 13 authored days (one foundation and four per CEFR-labelled level), six to ten vocabulary items per day, study/dialogue/two contextual choices/reflection per day; stable Japanese IDs; visible original provenance; no imported textbook text/media; B1 is an estimated draft task level, not complete certified coverage. Existing French pilot, legacy backups and review remain compatible.

## Relevant context

Owner request on 2026-11-19 explicitly extends the earlier French-only scope to Japanese through B1. The fetched origin and local checkout contain no previous Japanese implementation. Follow [architecture](../ARCHITECTURE.md), [content guide](../CONTENT_GUIDE.md) principles and [session workflow](../SESSION_WORKFLOW.md). Japan Foundation level descriptions inform broad outcome research only; no source lessons or media are imported.

## Steps and ownership

1. Primary: shared course contracts, optional notebook language metadata, Japanese notebook/review safeguards, integration/tests/docs/Git. IndexedDB remains v4; backup format advances to v4 to prevent older readers silently dropping Japanese metadata, retaining v1-v3 import support. No dependencies change.
2. Curriculum helper: only `packages/content/src/japanese-course.ts`, original content using the agreed OpenCourse contract; no shared-schema/index edits.
3. UI helper: only `apps/learner/App.tsx`, `apps/learner/src/course/` and `tests/e2e/japanese-course.spec.ts`; language-aware course selection, days/levels, text vocabulary saving and multi-day navigation/resume.
4. Independent read-only reviewer: inspect integrated implementation and correctness; primary resolves findings before final checks.

## Validation

Run repository/TypeScript checks, application/tooling tests, focused Japanese and existing French browser journeys on desktop/narrow views, production export and isolated cold-offline Japanese journey. No paid services, native-speaker, real-device or audible acceptance claimed.

## Progress and decisions

Started clean from `b09b12c` on `feat/open-course-pilot`; fetched origin before starting `feat/japanese-course-b1`. Usage-reporting capability is unavailable in this client; not unlimited. No automatic resume configured.

A separate listening-resource session switched the initial shared checkout during work. Moved Japanese changes into `D:/dev/projects/SmartLingo-sessions/japanese-course-b1` on its own branch and installed independent dependencies/workspace links; retained the other session's listening integration in the original checkout. No listening code is part of this checkpoint. [ADR 0025](../decisions/0025-japanese-daily-course.md) records scope and backup decisions.

All 13 original days are bundled: 78 distinct vocabulary entries, 78 blocks, 26 contextual choices. B1 adds connected experience, reasoned opinion/contrast, accurate announcement summary and conditional negotiation. No textbook text or media copied. Japanese notebook capture/edit/search/manual recognition preserve kana and language; French search still folds Latin accents while preserving Japanese dakuten.

## Handoff

- `npm.cmd run check`: PASS, including final TypeScript after content wording fix. `npm.cmd test`: PASS 18 tooling / 207 application tests. Final focused Japanese domain tests PASS 3/3; storage tests PASS 2/2. No paid service calls.
- Final production export to ignored `.tmp/japanese-export`: PASS, 126 assets / 9,881,666 bytes / build `bf7d1bf20f9a8517eeaf5b03e53e782bbb5878a6585be9855c8edf6de0d8db93`.
- Isolated production Chromium Japanese/French course and backup journeys: PASS 16/16 across desktop and 320px. Earlier two backup failures came from a hardcoded old preview URL; the test now uses configured baseURL and passes. An initial ignored config server path was also corrected before the browser run.
- Cold-offline production Chromium Japanese B1 and French pilot journeys: PASS 4/4; no remote source/media requests, saved vocabulary and exact cursor survive offline reload. One extra narrow Japanese journey PASS after moving the screenshot to the vocabulary card; visually inspected readable Japanese/kana/English with no observed horizontal overflow.
- Independent read-only reviewer: focused tests PASS 16/16, no unresolved actionable code findings. Fixed one misleading Japanese audio sentence; Japanese is explicitly text/kana-only. This is not qualified native-speaker acceptance.
- Git diff/staged checks and verified task-branch delivery are recorded in the session checkpoint and handoff. No merge, deployment or curriculum publication. Broader kana/kanji/listening instruction, complete level coverage, production assessment and owner/qualified Japanese review remain open.
