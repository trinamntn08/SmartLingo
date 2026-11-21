# Japanese topic vocabulary expansion

Authored: 2026-11-21 (Europe/Paris). Original AI-assisted draft; owner and qualified Japanese review remain required. This adds vocabulary coverage to the existing shared learning interface, not a proficiency certificate or a claim of complete CEFR/JLPT coverage.

## Scope and structure

Each of the 13 existing topic banks retains its original six-entry lesson and adds four six-entry lessons. The topic overview shows 30 distinct words/phrases across five short lessons: 390 topic appearances and 380 canonical words/phrases overall. New entries include Japanese script, kana reading, a specific English meaning, original example, example reading/translation and a usage note. New lessons include dialogue with readings, English grammar, meaning practice and sentence building. Ordinary Japanese generally has no spaces; sentence exercises explicitly use spaces between teaching chunks.

The original French lessons, 13 original Japanese lessons and the entire Japanese daily course are protected by frozen payload hashes. Their IDs, revisions, canonical vocabulary and previous progress remain unchanged. Additions have separate stable IDs (`ja.expansion.*`, `ja.lesson.day-N.words-2` through `words-5`) and revision 1. Shared senses, such as company, ticket, weekend and items to bring, reuse one canonical payload across topics. Topic counts use distinct normalized targets, not repeated appearances or punctuation variants. Useful quantities/counters and fixed request formulas are counted as distinct teaching entries; arbitrary inflections are not used to fill banks.

The unchanged daily-course day still contains its original selected vocabulary. The expanded bank and five short lessons are available through the same topic sidebar/Explore view used for French. Completing an old course day does not invent completion of newly added exercises.

| Topic | Estimated task level | Entries | Short lessons |
| --- | --- | ---: | ---: |
| Read a little and ask for help | Foundations |30|5|
| Introduce yourself at a class | A1 |30|5|
| Buy a few things | A1 |30|5|
| Find the station and check the time | A1 |30|5|
| Describe an ordinary day | A1 |30|5|
| Tell what happened and ask for help | A2 |30|5|
| Make a plan and ask permission | A2 |30|5|
| Explain a service problem | A2 |30|5|
| Invite someone and compare options | A2 |30|5|
| Tell a connected experience | B1 task draft |30|5|
| Explain a view and acknowledge a trade-off | B1 task draft |30|5|
| Pass on an announcement accurately | B1 task draft |30|5|
| Negotiate a solution and confirm it | B1 task draft |30|5|

## Authorship and research

All new definitions, examples, dialogue, explanations and exercises are original project authoring; no textbook lessons, word lists, recordings, images or full books were imported. Content helpers used their Japanese language knowledge and original source-course context. Primary inspected the Japan Foundation's [Irodori Starter contents](https://www.irodori.jpf.go.jp/assets/data/starter/pdf/X_contents_en.pdf) and [official Starter overview](https://www.irodori.jpf.go.jp/en/starter/pdf.html) on 2026-11-21 to check the broad grouping of greetings, self-introduction, shopping, places and daily routines. This was a topic-coherence reference, not copying, licensing permission, word-by-word verification or endorsement. Existing source-course provenance remains in [Japanese course sources](japanese-course-sources.md).

## Validation and review limits

Automated checks enforce at least 30 normalized distinct targets per topic, bounded short lessons, complete kana/example support, consistent canonical IDs, distinct choice meanings and buildability of every accepted sentence answer. Frozen historical payloads protect earlier progress. Browser/offline checks cover visible topic counts, reading search, saving/editing/review, selected added-lesson completion and reload/backup retention. Actual run results belong in [plan 0033](../plans/0033-japanese-topic-vocabulary.md) and the [checkpoint](../SESSION_CHECKPOINT.md).

Independent AI review checks obvious spelling/reading/meaning and exercise issues; it is not qualified/native teaching acceptance. Owner/native review is still needed for naturalness, register, collocation, translations, answer alternatives and task labels. No paid provider calls, automatic publication, new media licence or audio-quality validation are part of this expansion.
