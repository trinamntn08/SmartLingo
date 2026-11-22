# Original French opening and guided lesson labels

Status: implemented for local review
Owner: primary agent

## Outcome

The French course uses an original Foundation teaching block and updated visible guidance in Lesson 1. The active web and offline build retires the earlier adaptation and its credit. Older exports retain the original credit and rights record. Current guided items are numbered Lesson 1, Lesson 2 and so on in both languages.

## Relevant context

The [historical source record](../curriculum/open-course-pilot-sources.md) identifies the previous adaptation. [ADR 0025](../decisions/0025-append-course-days-with-stable-progress.md) defines when teaching changes require a fresh progress scope. [Course architecture](../ARCHITECTURE.md) documents the stable learner URLs and event contracts.

## Steps and ownership

The curriculum author owns the original Lesson 1 content and its provenance note. The UI builder owns learner copy and the credit disclosure. The test worker owns compatibility and learner regressions. The primary owns shared contracts, operational documents, combined validation and the preview.

## Progress and decisions

Lesson 1 receives progress revision 5. Stable course, lesson and block IDs keep existing bookmarks valid. Earlier attempts stay in their recorded scope. Lessons 2–5 keep their existing scopes. Daily course names the activity. Lessons are available at any time.

## Validation

Validate the authored course, bilingual guidance, source absence in the served bundle, old completion isolation and continued progress for other lessons. Verify the first lesson, outline, recommendation, return from related practice, Japanese authorship and course report labels in Chromium and cold offline.

## Handoff

The existing preview serves export `12d4ae0f7311`. The authored material is a draft. The [work log](../WORK_LOG.md#2026-11-22-rewrite-the-french-opening-and-label-guided-lessons) records the passed tests and the checked widths.
