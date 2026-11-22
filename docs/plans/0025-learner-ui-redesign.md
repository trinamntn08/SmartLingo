# Task: Learner UI redesign

Status: completed

## Outcome

Give learners clear entry points to resume a lesson, browse topics, practise and review. Keep lesson content, saved data and the optional local editor accessible through the redesigned interface. On phones, prioritise the current activity and make the topic list available on demand.

## Relevant context

Follow the cream, yellow and green palette, compact cards and inline audio controls in the seven owner-supplied design references. Keep the English interface and practical French learning flow in [the product plan](../../PROJECT_PLAN.md). Start from the clean Cloud checkout at `2249086`.

## Steps and ownership

1. Review the references and existing navigation, catalogue and study journey. The independent reviewer checks the current experience and final diff.
2. The primary agent owns the shared theme, app shell, Today, Review and Profile. The lesson UI builder owns the lesson and vocabulary components. The catalogue UI builder owns the topic catalogue.
3. Verify the complete journey with desktop/narrow browser checks, keyboard focus and the exported offline app. Check ordinary learning, saved notebook entries, returning learner progress, optional audio and editor access using existing fixtures.

## Progress and decisions

The initial review found a crowded persistent mobile topic strip, ambiguous selected navigation, topic cards with competing primary actions and stage changes that could leave the next activity above the viewport. The redesign keeps the desktop topic rail and keeps the horizontal phone topic list in an on-demand panel. Topic pages continue to put vocabulary first, with a shortcut to the short lessons below.

## Validation

- `npm run check`, `npm test` and `git diff --check` passed. The application run covered 18 tooling and 190 application tests.
- The complete Chromium run covered 79 passing cases and the intentional duplicate-publication skip. Two tests still used the old Today status copy or assumed the phone topic strip was already open. After updating those expectations and helpers, both passed in focused Chromium reruns against the final export. The updated keyboard focus checks also passed against that export at narrow desktop and emulated phone settings.
- All eight offline tests passed against the final 127-file, 9,956,921-byte export `340f421b188a`, including a cold load of the bakery image, ordinary practice and saved notebook changes.
- Browser inspection at 320, 390, 820, 1100 and 1440 pixels verified the image, word bank, lesson shortcut, viewport bounds and no page errors on that journey. The Cloud shared browser returned an unavailable runtime, so this verification used Playwright with system Chromium. Physical-device and screen-reader behaviour remains unverified.

## Handoff

The local Git checkpoint containing this plan holds the implementation, regression checks and decisions. The exported preview is built locally from the app workspace. The main learner navigation, catalogue, progress, recognition review, offline assets and owner draft preview were exercised with isolated fixtures.
