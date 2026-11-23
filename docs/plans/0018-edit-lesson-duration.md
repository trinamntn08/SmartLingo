# Edit estimated lesson duration

Status: completed
Owner: primary agent

## Outcome

The owner can enter a whole-minute lesson estimate from 1 to 60, save an immutable draft, inspect the estimate in a saved preview and explicitly publish it. Published estimates survive browser caching/reload. Blank, fractional, negative, exponent and out-of-range input cannot send a draft save. Unsaved estimates follow existing navigation protection and invalidate preview/review approval.

## Context and ownership

Existing lessonSchema already validates durationMinutes as an integer from 1 to 60. Preserve schemas, API/storage/history and French content. Primary owns DraftFields, CurriculumEditor, focused browser assertions and documentation; this is a small sequential feature with primary self-review.

## Validation

Run repository/TypeScript, focused editor desktop/narrow browser checks (including publication/cache and zero invalid POSTs), export and final staged checks. No paid calls, owner API/database changes or publication outside isolated test fixtures.

## Handoff

Implemented raw duration text with strict whole-minute validation, unsaved navigation protection, review invalidation and explicit saved-preview display. Repository/TypeScript passes; focused editor browser suite: nine passed/one intentional duplicate-publication skip. Invalid values cause zero draft POSTs; unsaved values survive learner navigation, discard restores saved values, and published twelve-minute estimate survives cached reload despite a later thirty-minute draft. Production export to ignored `.tmp/duration-export` passes. Primary self-reviewed this small change and inspected the 320px screenshot. Domain/API/storage/curriculum unchanged; preceding all136 application/twelve AI browser checks remain valid. Owner API/preview and real data untouched. Lesson order and remaining target/exercise/media tools remain separate capabilities.
