# 0021 — Japanese starter in the shared learner interface

Accepted 2026-11-23 for the local preview.

## Context

The owner requested more French lessons and the same learner interface for Japanese. The local preview already had reusable lesson, catalogue and review components. The curriculum workshop, optional AI practice and saved neural speech were built around French.

## Decision

French remains the default course. The header course selector persists the choice locally and uses the existing learner screens for both courses. Japanese starts with four bundled draft lessons and uses the existing lesson schema with optional kana readings, `ja-JP` locale and `ja.` IDs. Search preserves kana voicing. Sentence practice displays joined Japanese tokens and accepts equivalent inter-token whitespace and trailing sentence punctuation.

Keep one learner database and one backup format. Lesson events and saved vocabulary are scoped in the learner view using stable course IDs. Japanese personal words use `personal.ja.` source IDs. Legacy personal words continue to appear in French. Optional Japanese speech uses a browser voice selected for Japanese. French editor/API seeding, publication loading, AI conversation and neural clips stay scoped to the established French workflow.

## Consequences

Existing French lesson payloads, source IDs and draft review workflow carry forward. Both courses are bundled for local and downloaded study. A backup carries progress and notes for both courses. The active course is a separate browser preference. Japanese pronunciation, language and level labels still need owner review and actual device listening checks.
