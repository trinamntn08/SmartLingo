# Task: show guided lessons and Japanese writing entry points

Status: completed

## Outcome

Browse guided courses opens a language-scoped catalogue listing every guided lesson by course and unit. The learner can select any lesson and open its saved step. Japanese learners can open Hiragana and Katakana topics directly from Today, the guided catalogue and the course outline.

## Steps and ownership

- Primary owns the route, learner integration, course cursor recording and verification.
- Guided catalogue UI agent owns the catalogue component. Japanese writing UI agent owns the shared writing links and their placement in Today and the outline. Preserve existing learner routes and use the existing kana topic cards and progress.

## Validation

Check the 13 Japanese and 17 French guided lessons, exact saved-step navigation and return to the list, kana access without opening Lesson 1, keyboard use, narrow layouts and the downloaded copy. Verify the exported build served at port 8082.

## Handoff

Repository and TypeScript checks, 327 automated tests, 58 Chromium cases and six cold-offline cases passed. The final build passed a further cold-offline completion check and desktop and narrow catalogue walkthroughs, including save retry. All 814 served assets matched build `9bd295e49902`. [Work log](../WORK_LOG.md#2026-11-28-show-guided-lessons-and-make-japanese-writing-easier-to-reach)
