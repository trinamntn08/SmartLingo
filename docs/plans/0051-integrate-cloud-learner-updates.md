# Task: Integrate the Cloud learner updates

Status: completed
Owner: primary agent

## Outcome

Bring the Cloud learner redesign at `563fdaa` and curriculum expansion at `47eebaf` into the primary French and Japanese learner on `http://localhost:8082`. The shared preview should offer the photo-led Today, quick topic access, a vocabulary-first topic screen, short guided steps and the new draft lessons. Keep existing deep links, learning history, offline downloads and French draft publication controls working.

## Relevant context

The primary branch and origin start at `6ab10fd`. Both Cloud checkpoints were made on an older branch, with a shared merge base at `1c5b5d4`. Adapt their feature changes to the current runtime and preserve the original Cloud refs. The [current architecture](../ARCHITECTURE.md), [content guide](../CONTENT_GUIDE.md) and [local operations](../LOCAL_OPERATIONS.md#test-the-offline-ready-preview) apply.

## Steps and ownership

1. Bring over the Today photo, recommended activity styling and starter tiles. The Today builder owns the dashboard, feature art and featured course card.
2. Make topic study vocabulary-first with a lesson shortcut and a narrow horizontal topic picker. The Explore builder owns the catalogue, topic sidebar and lesson cards.
3. Carry over activity progress and next-step keyboard focus. The Lesson builder owns the lesson and vocabulary components.
4. The primary owns shell integration, Review and Profile, draft curriculum, shared contracts, tests, preview build and the checkpoint. Apply French topics and Japanese starter payloads to the current catalogue and preserve established lesson IDs and routes.
5. Obtain independent read-only review, reconcile findings, verify browser and offline flows, update the existing review preview and upload the primary checkpoint.

## Validation

- `npm.cmd run check`, all 18 tooling and 269 application tests, and Git whitespace checks passed.
- The broad Chromium sweep passed 186 cases with one existing skip. The two Japanese catalogue cases and the desktop French course case passed after corrections. The focused rerun passed all four desktop and small-screen cases, including the repeated French case. Isolated checks from 320 to 1,440 px covered layout, keyboard focus and existing navigation.
- All 30 cases passed in `npm.cmd run test:offline`, including a cold launch of the Cloud photo, both new French topics, and the Japanese café lesson and sentence exercise.

## Progress and decisions

The shared learner includes the Cloud Today, topic and short-lesson changes and fourteen draft lessons. The equivalent French and Japanese entries retain their canonical IDs. The original 123 French lesson payloads, the Japanese guided course and its core lessons passed their existing hash assertions. Independent review found a dropped course-title heading, which was restored in Today. The Japanese catalogue case now checks the expanded and starter topics against their expected sizes.

## Handoff

The existing preview at `http://localhost:8082` serves export `ce2c55012fde` with 136 files totalling 8,178,292 bytes. The served manifest, learner bundle and Cloud photo match the local export. Fresh Chromium checks at 390 and 1,440 px loaded Today and representative new French and Japanese lessons. Physical-device, screen-reader and qualified language review remain open.
