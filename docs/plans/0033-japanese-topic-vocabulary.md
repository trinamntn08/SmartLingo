# Task: At least 30 Japanese entries per topic

Status: completed
Owner: primary agent

## Outcome
All 13 existing Japanese topics show at least 30 distinct written words/phrases in the shared topic vocabulary grid. Add four coherent six-entry lessons to each original six-entry lesson: 312 additions, 390 topic appearances and 65 short lessons total. Every new entry has Japanese script, kana reading, English meaning, original example/example reading/translation and useful usage support. Each short lesson has original dialogue, grammar, meaning practice and solvable sentence building. Keep the existing language-selection/shared UI.

## Relevant context
Owner request on 2026-11-21 explicitly requires at least 30 words per topic. Base origin/feat/shared-language-learning 337d922 is synced with the clean task worktree; original root's unrelated backup.spec.ts status is preserved. Use [shared architecture](../decisions/0026-shared-language-learning.md), stable IDs/revisions and [Japanese provenance](../curriculum/japanese-course-sources.md). Count distinct normalized targets, not repeated spellings or arbitrary inflection padding. Estimates are not full CEFR/JLPT coverage or publication.

## Steps and ownership
- Primary owns expansion contract/builder, catalogue integration, compatibility/count tests, browser/offline checks, docs and Git. No dependency/schema/storage/UI changes intended.
- Content helper one owns only src/japanese-vocabulary/foundations.ts (topics1–4); helper two owns only routines.ts (topics5–8); helper three owns only discussion.ts (topics9–13), under packages/content. Each adds exactly24 distinct topic-appropriate lexical entries in four coherent lessons. Do not edit existing course/lesson payloads or shared contracts.
- Primary audits canonical duplicates across groups and source material, then a separate independent read-only reviewer checks linguistic coherence, immutable data, solvability and gaps.

Shared contract: JapaneseTopicExpansion {dayNumber, lessons: JapaneseLessonDraft[4]}, each lesson vocabulary[6], title/outcome/role, bilingual dialogue with reading, grammar and explicit sentence tokens/answers/hint/explanation. word/line helpers in japanese-expansion.ts. Additive IDs ja.expansion.* and ja.lesson.day-N.words-2..5; original ja.lesson.day-N and original course IDs/revisions/payloads remain unchanged. Data stays bundled and draft. No paid provider calls/publication.

## Validation
Frozen French lessons, original Japanese lessons and full original Japanese course payload hashes; all-topic distinct target counts >=30; canonical ID payload consistency; complete readings/examples and lesson schema; fair choices and all-token sentence solvability. npm.cmd run check and npm.cmd test; focused exported desktop/320px search/save/edit/review/resume/backup and representative added-lesson completion; cold-offline new vocabulary/search/notebook/language switch without providers. Refresh the existing localhost8082 export after verification.

## Progress and decisions
Selected skill sll-deliver-feature. Japanese content uses explicit task instructions, not French gender/article requirements. Three exposed gpt-6.1-sol medium content helpers with fresh contexts per SESSION_WORKFLOW; independent read-only review after authoring slots free. Usage-reporting capability unavailable, no automatic-resume schedule or paid calls. Task branch feat/japanese-topic-vocabulary in existing isolated shared-language-learning worktree.

## Handoff
Delivered all 13 topic banks at exactly 30 distinct normalized entries across five short lessons each: 65 Japanese lessons, 390 topic appearances and 380 canonical words/phrases. Added 52 original lessons; the original French lessons, 13 Japanese lessons and entire Japanese daily-course payload remain hash-identical. Shared senses reuse exact canonical IDs/payloads across banks. The same topic/lesson widgets remain unchanged.

Actual validation on 2026-11-21: npm.cmd run check PASS; npm.cmd test PASS 18 tooling / 216 application tests, with final rerun after content refinements. Focused domain expansion/shared/source compatibility PASS 7/7 initially; final focused content checks PASS after prompt/answer refinements. Every accepted sentence answer is buildable with all supplied pieces. All entry and example readings are present and free of unconverted kanji.

Final production export PASS: 126 assets / 10,151,432 bytes / build6aeb5f2f4657f10edc85558ba7cb90b02af9d7b1d74e74b0c6f517cd8d43ba52. Exported Chromium desktop/320px suite PASS20/20: visits every topic, verifies30 cards/five lessons, kana search, representative added foundations/A1/A2/B1 completion, notes/edit/review/backup, independent original resume, French greetings and shared-language regressions. Full cold-offline suite PASS20/20, including new topic search/save/complete/reload, old Japanese B1/day history, both French days, downloads/update/removal and no external provider/source/media requests in the added-vocabulary journey.

Independent read-only review cleared source after resolving a calendar spelling note and explicitly accepting/constraining natural answer variants. Primary reviewed integration/diffs and desktop/320px expanded-topic screenshots. Original project checkout/owner status preserved. Updated preview uses localhost8082 after isolated test teardown. Final staged secret/whitespace checks, commit and verified normal push recorded at handoff.

Remaining limits: original AI-assisted drafts require owner/qualified Japanese review; no publication, complete CEFR/JLPT coverage, independent proficiency or real audible/device acceptance established. Existing daily-course selected six-entry blocks stay unchanged; expanded30-entry banks and five lessons appear under the topic sidebar/Explore.
