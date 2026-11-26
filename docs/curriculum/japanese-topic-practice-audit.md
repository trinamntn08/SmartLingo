# Japanese topic practice audit

Draft review, 2026-11-26. The review uses `cd9d078` (`feat/android-phone-redesign`), which includes four starter lessons added after `28f1f4e`. The daily course and kana program have separate companion content and checks.

## Inventory and review scope

The library contains 69 lessons, 414 vocabulary appearances and 385 canonical vocabulary IDs: the original 13 banks × five lessons (390 appearances, 380 canonical IDs), plus four starter lessons across three banks. Shared starter aliases reuse canonical senses and their complete readings/examples/notes. No IDs, vocabulary payloads or existing lesson revisions were replaced for this work.

The source review traversed all 52 expansion drafts in `japanese-vocabulary/foundations.ts`, `routines.ts` and `discussion.ts`, all shared entries, the 13 original lesson adapters/sentence activities, and all four `topics/japanese.ts` starters. The daily-course author reviewed the original course payload separately. Review surfaces were IDs/reuse, target and kana, example and English meaning, dialogue role/register/translation, grammar, prompt/answer compatibility, counters and practical outcome. This is an AI-assisted editorial review, not qualified/native-speaker approval.

The existing vocabulary coverage was generally coherent and already supplied useful reading, example and register support. The grammar note in bank 11 now teaches the complete perspective construction **にとって**. The day-1 reader now describes the available audio using current study copy. Earlier course data continues to preserve learner history.

## Implemented practice

`packages/content/src/japanese-topic-practice.ts` attaches 154 tasks through the shared `japanesePractice` contract:

- 69 distinct authored situations requiring a practical response, each with a model, content criteria, form/register criteria, valid alternative guidance and a retry action. Foundation, A1 and A2 prompts use speaking self-review. B1 prompts use writing self-review. The model gives one example that meets the criteria.
- 69 bounded hiragana checks tied to an actual kanji-bearing vocabulary entry in that lesson. The prompt requests its taught reading, so synonyms, romaji and a different script do not accidentally pass. Kana length, small kana and voiced marks remain meaningful.
- 16 fresh cumulative source passages: the fifth lesson in every original bank, the second greetings lesson and the single introduction/café lessons. Each has a source-dependent choice about actionable details followed by the cumulative practical response. Distractors change quantities, time, negation, source certainty or action status. Answer positions vary.

The existing in-lesson example listening remains available. The new checkpoint passages mix listening and reading. Every fresh passage has a full kana transcript and English meaning. Furigana follows selected word spans authored for those passages. The spoken source is Japanese, with kana and meaning available separately. Audio naturalness and pronunciation require listening review.

## Recommended sequence and prerequisite map

Begin kana study alongside the starter route through greetings, courtesy, a first introduction and a café order. Direct topic links remain freely accessible. Within each original bank, take the five lessons in order. The fifth combines the bank’s skills in a fresh situation. These recommendations are visible in every practice set’s prerequisites and revisit guidance.

| Bank | Editorial estimate | Useful prior skills | Transfer/checkpoint evidence |
| --- | --- | --- | --- |
| 1 Repair and scripts | Foundation | No prior Japanese · basic hiragana with audio/reading support | Evening greeting, polite repetition/slowing request, tomorrow farewell · understand a written-name request |
| 2 Introductions | A1 | Bank 1 repair and です · name kana | Name/origin/work/home/interest, question back · distinguish origin from current residence |
| 3 Purchases | A1 | Bank 1 requests · numbers and general quantities | Order three bread items and a bottle, total/payment/receipt · match 三つ vs 一本 and card negation |
| 4 Directions and time | A1 | Bank 1 attention/repair · bank 3 numbers | Place/time for waiting and journey duration · distinguish opposite vs behind, a.m. vs p.m., clock time vs duration |
| 5 Routines | A1 | Bank 2 statements/residence · bank 4 clock time | Weekday commute, weekend chore and frequency · contrast に time, で transport/action place and negative weekend work |
| 6 Past experience/help | A2 | Bank 5 polite actions · bank 1 repair · supported past/te-form bridge | Known umbrella loss and staff requests · distinguish unsuccessful search from successful recovery |
| 7 Plans/permission | A2 | Bank 4 schedules · bank 6 supported te-forms | Planned visit, hours, belongings and reservation questions · preserve a stated prohibition |
| 8 Service problems | A2 | Bank 6 requests · bank 3 payment · bank 7 plans | Report symptoms, request repair and ask deadline · distinguish planned repair/check from confirmed result |
| 9 Invitations/comparisons | A2 | Bank 4 places/time · bank 7 plans · bank 8 reasons | Decline one invitation, preserve another arrangement, confirm meeting point · distinguish invitation, agreement and an unspecified future date |
| 10 Connected experience | B1 selected tasks | Bank 6 past/loss · bank 9 connected explanations | Setting → setback → response → result → precaution · do not infer train cancellation from inability to board |
| 11 Reasoned views | B1 selected tasks | Bank 5 work · bank 9 comparisons · bank 10 connectors | Balance benefit/concern, conditional support, one-month trial and review · avoid turning trial support into permanent adoption |
| 12 Accurate announcements | B1 selected tasks | Bank 4 time · bank 7 instructions · bank 10 reports | Preserve check-in/start, belongings, condition and explicitly undecided next date · keep unmentioned fees unknown |
| 13 Negotiation | B1 selected tasks | Bank 3 costs · bank 7 plans · bank 11 conditions · bank 12 faithful summaries | Check people/time/full cost, confirm completed booking and record named future tasks/deadlines |

## History and limits

Practice is additive and independently attempted. Revision-1 core completion does not imply a practice attempt or a checkpoint pass, and new practice does not invalidate old completion. Tests preserve the original course and reviewed core lesson hashes after accounting for the new practice and the day-1 audio copy. Existing lesson IDs continue to match saved data. The independent practice event contract is owned by the shared domain/persistence implementation.

Meaningful automated checks verify that every exported lesson has a unique transfer prompt and task IDs, a schema-valid set, a reading answer matching its taught entry, one fresh cumulative checkpoint per bank, distinct choices, ordered furigana and complete kana/English support. Existing tests still check original vocabulary ID consistency, lesson schemas, answer-piece solvability and matching references.

SmartLingo authored the new passages, models, distractors and English support. Qualified Japanese review, listening to the actual selected voice, broader kanji teaching and coverage beyond these situations remain outstanding. The editorial level estimates do not establish complete CEFR/JLPT coverage. A successful self-review records the learner’s comparison of their speech or writing against the model and criteria.
