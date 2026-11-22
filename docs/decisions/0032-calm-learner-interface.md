# ADR 0032: a focused learner interface

Date: 2026-11-22
Status: accepted for the local preview

## Context

The owner requested a total UI redesign because the homepage presented too many competing choices. The former layout repeated topic navigation on every screen, recommended the same lesson twice and put detailed metrics, charts, tools and course navigation together on Today.

## Decision

Keep the shared French/Japanese destinations and learning contracts. Give each destination a clear responsibility:

- The language chooser has two direct starting actions.
- Today presents one recommended activity, the compact daily-course entry and quiet alternatives. Japanese begins with kana; a more recent saved word-lesson activity resumes that lesson.
- Learn owns topic discovery, vocabulary, listening and speaking. Short lessons precede the full topic word grid. Mobile learning modes scroll horizontally instead of taking several rows above the activity.
- Study shows its current step, outcome and saved activity count. All lesson vocabulary and English study support remain directly available. Kana focuses on the current row; row/day/section choosers open deliberately.
- Review puts recall first and keeps personal words editable. Detailed review-method explanations unfold separately.
- Report owns all detailed activity metrics and the weekly chart. Its definitions unfold separately and retain their existing meaning.
- Profile groups audio, offline/backups, French curriculum tools and information behind named expandable controls.

The shell uses top navigation on desktop and five labelled bottom destinations below 600px. Global topic rails are removed. Warm cream, white cards, burgundy text/actions and gold accents preserve the visual references with less visual competition. Base typography has an explicit Arial family to avoid browser font inheritance.

`ui/Disclosure` owns presentation and expansion only. Settings mount on first open and retain state while collapsed, preserving selected backup files and unfinished settings operations. Hidden children have no visible or keyboard-accessible controls. Optional AI conversation uses `keepMounted={false}` so closing it unmounts the temporary conversation/recording and invokes existing cleanup. No paid call occurs on expanding the control; existing explicit send/transcription/generation boundaries remain.

## Consequences

Topics require entering Learn instead of occupying every destination. Advanced settings and optional AI require an additional deliberate expansion. Learning/content identity, revisions, storage schemas, migrations, publications and provider contracts stay unchanged. Ordinary lessons remain independent of AI and the API.

Browser regressions follow the new visible navigation instead of retaining obsolete sidebar controls. Device, screen-reader and teaching-quality acceptance remain separate from Chromium layout and persistence checks. [Execution plan](../plans/0039-calm-learner-redesign.md) and [checkpoint](../SESSION_CHECKPOINT.md) record actual validation.
