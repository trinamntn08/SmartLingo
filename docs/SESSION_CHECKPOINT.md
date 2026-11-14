# Session checkpoint

Updated: 2026-11-14 (Europe/Paris).

## Current request and outcome

Owner requested research, many practical A1/A2 topics with 30–50 words each, less unimportant copy, and supplied a Facebook photo-page reference. Completed on feat/expanded-topics from clean checkpoint 3653a5e. See [plan 0006](plans/0006-topic-expansion.md), [research](CURRICULUM_RESEARCH.md) and [ADR 0009](decisions/0009-topic-banks.md).

Twelve topics now have exactly 30 distinct target forms each, across 60 six-item lessons (36 A1, 24 A2). Total 360 topic entries, 353 stable sense IDs, 351 distinct French target forms; shared same-sense entries reuse explicit canonical IDs. Topics cover restaurant, bakery, groceries, clothes/shopping, housing, transport, health/appointments, work/study, services/paperwork, people, time/routine and leisure/weather. All new material is original draft text with visible meanings, examples, translations and explanations; owner language/activity review remains necessary. Levels are estimates, not complete CEFR coverage.

Explore/Practice now browse topic cards, search topics or French/English words, filter A1/A2, open short lessons or read/save directly from word banks. New matching exercises explicitly show English meanings rather than testing a generic image; old picture exercises and persisted activity identifiers remain compatible. Existing two starter lessons are deeply unchanged. No storage migration or dependency changes. Personal edits and published replacements remain preserved. The editor has searchable, uniquely labelled lesson selection. Removed repeated voice labels, study filler, home feature slogans and footer; synthetic speech disclosure remains in Profile, with useful error/progress/draft indicators retained.

Researched official Council of Europe CEFR guidance and FEI A1 scope. The owner-supplied Facebook page was throttled and ID search found no posts; no lists/images were inspected/imported. References and this access limitation are recorded. No paid API calls, account changes, owner curriculum approval/publication, push or merge.

## Ownership and review

Primary owned shared contracts/content builder/index/canonical IDs, topic UI, editor selector, tests, integration and docs. food_home_topics and daily_life_topics: curriculum-author, exposed gpt-6.1-sol, medium, exclusive disjoint content files. simplify_copy: bounded worker, exposed cheaper gpt-6-luna, medium, controls/lesson/illustration cleanup. Independent read-only topic_review: change-reviewer, exposed gpt-6.1-sol, high. At most three helpers ran concurrently; roles read explicitly, no automatic role-loading claim. All preserved others' edits.

Reviewer checked original starter equality, same-sense IDs and matching references, all 60 actual sentence-button permutations, French examples/notes/grammar, publication labels and role copy. Fixed the carotte spelling note, canonical duplicates, draft-label and dialogue-role issues. Primary inspected focused diffs, new source files and desktop/narrow screenshots. No unresolved actionable finding; review is not native-speaker validation or exhaustive answer-alternative approval.

## Validation

- Final npm.cmd run check: repository and TypeScript passed.
- npm.cmd test: tooling 16 passed; initial app run exposed an old two-lesson assertion plus punctuation in the new solvability test. Corrected expectations/check logic. Final npm.cmd run test:app: all 57 passed, including actual token-button solution search for every lesson, per-topic counts, stable IDs and English/French search.
- Stable integrated npm.cmd run test:e2e: 25 passed, one deliberate duplicate mobile publication skip. Covers original learning/editor/backup/review flows and new topic search/filter/capture/reload plus A2 meaning/sentence practice at 320px without API. Earlier run had one backup-form assertion interrupted by source hot reload; stable rerun passed unchanged backup logic.
- Final npm.cmd run build:web: passed after final learner-copy cleanup.
- Desktop topic catalogue and filtered vocabulary, plus long-topic 320px lesson screenshots inspected. Additional isolated 320px 30-word bank overflow check returned false. Synthetic repeated label absent; text support visible without dropdowns.
- Actual local API GET /lessons: HTTP 200, 60 lessons. Existing API startup seed policy preserves local revisions. Learner remains served at localhost:8081; API at 127.0.0.1:3001. Check listeners before starting duplicates.
- git diff --check: passed before final notes. Final deliberate staging, index-secret/whitespace checks and local checkpoint commit follow this note; actual identity is reported only after Git confirms it. If interrupted before commit, preserve all task files, repeat staged checks, commit and verify.

Usage/reset tools unavailable; no allowance/reset estimate or automatic resume claimed. No account settings or scheduler changes. Physical-phone/Safari/voice quality/screen-reader checks, complete CEFR coverage, exhaustive sentence variants and owner review remain gaps. Three previously documented moderate upstream Expo build-tool audit findings remain unrelated and unchanged.

## Git and next steps

This checkpoint commit contains the completed expansion and these notes. Stage only task source/tests/docs; ignore screenshots, export output, test backups, local SQLite data, caches and keys. No unrelated initial changes existed. Expected title: feat: expand beginner topics and vocabulary banks. Verify actual commit hash and clean working tree after checks; never claim a commit before confirmation.

Next owner-facing action: refresh localhost:8081, open Explore and review topic banks/short lessons. Content remains draft until explicit saved preview and owner publication. More topics can be added through the same typed authoring contract. Broader offline installation/downloaded packs, complete editor tools and AI speaking remain planned, outside this request.

Prior local checkpoints: 3653a5e direct study details; 546965d manual recognition review; bc1b08f backup/restore; 7a84e60 editor; 83c5573 learner foundation. Local commits are not remote backups. Inspect remote history before any future integration.
