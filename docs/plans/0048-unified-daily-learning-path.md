# Unify Today, Daily course and Learn

Status: implemented for local review

Owner: primary agent

## Outcome

French Today recommends one guided study day. Learn offers the same day and saved section and keeps the topic catalogue and skills available for targeted practice. The course can be studied at any pace. Completing a day offers the first unfinished day, and the outline supports free revisiting. Japanese keeps its kana-first entry and shares the daily course access and progress.

Each French day links to relevant existing lessons when the catalogue has a clear match. Extra practice returns to the originating day and section. Lesson events and daily-course events continue to record different activities.

## Relevant context

[Daily-course roadmap](0043-french-daily-course.md), [Today priorities](../decisions/0038-today-study-priorities.md), [shared learner](../decisions/0026-shared-language-learning.md), and [browser navigation](0045-web-navigation-and-lesson-links.md).

## Steps and ownership

1. The primary owns course recommendations, the shared course progress reader, routes, the Learn integration, return links and final verification.
2. The UI builder owns Today and the shared launch card. The curriculum author owns the French practice associations and their evidence note. The test worker adapts existing journeys for the changed Today entry. Each uses the current client model and effort.
3. Review the combined change and verify the primary export on the existing local preview.

## Validation

Check shared recommendations on Today and Learn, saved section resume, explicit day selection, completion and advancement, optional practice and its return link, a fresh and returning Japanese learner, and offline routes. Verify wide and narrow Chromium layouts, legacy links and progress. Run repository, application and staged checks.

## Handoff

The existing local preview serves the combined export. The bundled guided French course currently has five draft days and eight linked practice lessons. The topic library is available for further practical topics. [Verification](../WORK_LOG.md#2026-11-22-synchronize-today-daily-course-and-learn) · [Curriculum rationale](../curriculum/daily-course-and-library.md)
