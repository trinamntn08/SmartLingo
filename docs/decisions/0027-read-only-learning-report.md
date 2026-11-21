# ADR 0027: Derive the learning report from saved activity

Date: 2026-11-21 (Europe/Paris)
Status: accepted by explicit owner request

## Context
The owner requested an in-app progress dashboard and friendly widgets inspired by the supplied reference, confirming that no downloadable report is required. SmartLingo serves adult French/Japanese learners with shared UI and durable lesson/course/review history. Reference numbers, brand, names, child ages and levels are design input rather than learner data.

## Decision
Provide one shared friendly Today dashboard and Report route. Use warm cream, burgundy, gold, rounded cards, accessible activity bars, useful next-lesson/topic actions and actual saved metrics. Retain the language gateway, notebook, editor and daily-course journeys. No new database, migration, provider or account system.

A pure domain function derives current-revision lesson completions, explicitly explored canonical vocabulary, active-language notebook count and valid completed course days. Weekly actions are saved lesson attempts/completions, course study/choices/self-review/completion and recognition ratings. Mere browsing/navigation, practice-hint reveals and note edits do not add actions. Saved actions describe activity; none of these metrics assigns proficiency, mastery, time studied or a points economy.

Deduplicate event IDs within each store; conflicting immutable IDs prevent a report instead of guessing. Ignore future activity and unknown/future content scopes. Historical known revisions may contribute to weekly activity, while completion/explored totals remain current-revision scoped. Shared canonical words count once. A bare course completion does not bypass the existing section-completion gate.

Use the viewer's current timezone and Monday–Sunday calendar dates, including DST transitions. Review event timestamps are displayed in this report timezone without rewriting their original review schedule or study date. Future days stay empty. Language changes guard old async reads, including when content arrays are recreated with the same IDs/revisions.

A separate read-only hook opens existing repository contracts, reads history and closes its own connections. Refresh on entering Today/Report, completed writes, window focus and a one-minute timer. Failed or unavailable storage shows a retryable unavailable report, never fabricated zero counts. Report visits write no learning event. Existing pending-save guards continue to protect navigation.

## Consequences
Metrics remain reconstructable from backed-up history and work with the exported offline app. They are not an assessment of independent ability or an account-wide cross-device report. Existing labels and data remain intact. Browser and domain tests verify language isolation, duplicate/revision/date handling, readonly behavior, refresh/error recovery and cold-offline access; visual/screen-reader and physical-device acceptance remain separate.
