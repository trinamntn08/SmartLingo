# Visual vocabulary and direct topic navigation

Status: completed
Owner: primary agent

## Outcome and acceptance
The owner requests a topic list on the right of the web view, fast access to words without going through each individually, and photos/drawings that explain new words. Provide a persistent desktop topic sidebar, horizontal topic access on narrow screens, word grids before optional practice, and all lesson words visible together. Retain direct meanings/examples/explanations and atomic notebook capture. Add broad original SVG drawings for concrete words, with honest alt text and text-only support for abstractions.

## Contracts and ownership
Primary owns App/sidebar, lesson overview and domain event interpretation, shared exports, integration/tests/docs. UI builder (gpt-6.1-sol medium) owns TopicCatalogue and reusable VocabularyCard; media builder (gpt-6.1-sol medium) owns separate content visual data and WordIllustration; bounded test worker (cheaper gpt-6-luna medium) updates existing browser journeys. A read-only reviewer runs after a helper slot is free. At most three helpers concurrently; usage/reset tools unavailable.

Topic selection is controlled by App and resets obsolete search/level filters when choosing another topic. The sidebar remains outside the main scroll area. VocabularyCard shows a drawing when truthful, target, meaning, example/translation, explanation, Listen and Save. Media mappings are guarded by current target text and do not change owner lesson payloads or publication status. Legacy pictures remain valid. No new dependency or external image fetch.

One explicit Continue to dialogue action records that the learner reviewed the displayed vocabulary set, via an idempotent vocabulary event with itemId equal to lesson.id. The domain interprets this event only for that lesson/revision; old per-entry viewed events remain valid. Merely opening a word bank does not record study or proficiency. Matching, sentence and completion still need deliberate actions.

## Validation
Run repository/TypeScript and application tests, full isolated browser journeys, desktop/right-sidebar and 320px layout checks, direct topic jumps while practising, visible-word and save/retry/reload checks, media identity/coverage/rights checks, real SVG decode/render checks and web export. Inspect final diff and screenshots, update status/checkpoint, stage deliberate paths and commit locally. No owner publication or remote operation.

## Result
Implemented persistent desktop right pane, narrow horizontal topics, controlled direct selection/filter reset, word banks before optional lessons and six-word lesson overviews. One explicit review-set action preserves old progress and retry semantics. Added 125 target-guarded word visuals (122 distinct original drawings) across all twelve topics, with descriptive alt text and abstraction fallback. No curriculum payload, storage schema or dependency changes.

Final repository/type checks, 16 tooling/60 application tests, browser run (29 passed/one deliberate duplicate-publication skip), web export and all 125 data-URI decode checks passed. Contact sheets plus desktop/320px layouts inspected. Independent review resolved the inherited-property lookup defect; no remaining actionable finding. Owner media/language review, physical native/Safari and assistive-technology testing remain gaps. Local checkpoint commit identity is reported after Git confirms it.
