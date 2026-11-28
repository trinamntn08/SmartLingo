# Task: clarify Today study navigation and the course outline

Status: completed

## Outcome

Today retains its recommended lesson and offers one clear route to the full topic catalogue, course choices and skills in the active language. The course outline identifies the course, its full scope and the current lesson. It links to the catalogue and to the guided course choices on Today. Both sidebars use the same interaction and visual conventions on desktop and compact screens.

## Steps and ownership

- Primary owns the Today section route, application wiring, shared sidebar rows, checks and preview.
- Today UI agent owns TodayDashboard. Outline UI agent owns CourseOutline and OpenCoursePanel. A read-only reviewer checks the integrated slice.
- Preserve existing course and topic IDs, progress, saved steps, history and offline entry points.

## Validation

Check French A1 Lesson 3 resume and Unit 2 access, A2/B1 course selection, both paths to the topic library, Japanese Foundations and level filters, skills, keyboard access, narrow layouts and offline navigation. Capture before and after views and verify the shared preview against its export.

## Progress and decisions

The focus of the redesign is curriculum discovery and course orientation. Reuse the warm paper surfaces, existing green and yellow accents, and Inter labels. The yellow marker belongs to the lesson currently open.

The course outline opens matching units for an explicit level filter and uses a disclosure when the viewport is too short for a useful scroll area. Course selection and the topic library are accessible directly below the outline. [Navigation decision](../decisions/0051-learner-sidebar-navigation.md)

## Handoff

Repository and TypeScript checks, 327 tooling and application tests, 60 Chromium cases and ten cold-offline cases passed. The finished export passed a fresh cold-offline test covering the French spelling lesson and both catalogue links. Verified the served asset digests for build `a9ef9ad1f2e9` at `http://localhost:8082`. Desktop and phone captures are in `test-results/learner-sidebar-navigation/`. [Verification record](../WORK_LOG.md#2026-11-28-redesign-today-study-navigation-and-the-course-outline)
