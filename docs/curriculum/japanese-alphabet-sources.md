# Japanese kana lessons and draft provenance

Original AI-assisted opening draft dated 2026-11-22 (Europe/Paris). The expanded kana path was authored on the Japanese curriculum redesign branch and adapted to the shared web learner on 2026-11-27. The lessons remain drafts for owner and qualified Japanese-teacher review.

## Scope and progression

The owner requested Japanese alphabet lessons before vocabulary. Each script begins with ten groups covering the 46 modern basic characters. The final basic group combines wa, o (wo) and nasal n. The 20 basic groups retain their original IDs, revision 1 and recognition practice. Word examples and optional recall add reading and script typing to those groups.

The expanded path has 53 groups, including reading checkpoints, dakuten and handakuten, contracted sounds, small tsu, long vowels, and borrowed katakana combinations. The new groups use stable IDs. To save a group, the learner checks each word task and completes any self-review the group includes. Learners can jump to either script and explore any group. The [kana patterns and checkpoints](../../packages/content/src/japanese-kana-support.ts) come from Japanese curriculum redesign checkpoint `afe9d7e1df57328cfc8c8004b73b4141819b7581`.

English summaries and notes are original. Romaji supports reading and uses shi, chi, tsu, fu and o (wo). Typed recall checks the requested script and preserves distinctions in size, voicing and vowel length. Pronunciation and handwriting are opportunities for learner self-review.

## Factual sources inspected

- [Japan Foundation, Erin's Challenge: Hiragana & Katakana A-I-U-E-O Chart](https://www.erin.jpf.go.jp/en/extra/syllabary/) and its [romaji PDF](https://www.erin.jpf.go.jp/materials/extra/syllabary/download/erin_aiueo_romaji.pdf), accessed 2026-11-22. Official basic-chart reference; no page, illustration, layout or audio is bundled. The page states all rights reserved; availability to download does not establish a redistribution licence.
- [Japan Foundation, Irodori resources](https://www.irodori.jpf.go.jp/en/resources.html), specifically [Hiragana Words and Katakana Words](https://www.irodori.jpf.go.jp/assets/data/Kana_all.pdf), accessed 2026-11-22. Readable PDF facts confirm row membership, basic readings, nasal n, the modern o reading, the wo input spelling, and the distinction between basic and extended kana. This reference informs facts only; no exercises, example words, prose, artwork or recordings are copied.
- [Agency for Cultural Affairs reference PDF](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/seikatsusha/h24_nihongo_program_a/pdf/a_56.pdf) was attempted on 2026-11-22 but the browser fetch rejected its size. It was not read and supplies no claimed verification.

## Audio and rights

Kana playback uses the shared Japanese audio adapter. Isolated basic prompts use matching katakana for both scripts to reduce the risk of は and へ being interpreted as particles. The prompts for を and ヲ use オ, and nasal n uses ン. For timing signs such as small っ, playback uses a complete example word. See [Japanese audio](../JAPANESE_AUDIO.md) for recording sources and voice options.

## Review and validation

Automated content tests check the basic-form inventory and original order, stable IDs and revisions, the 53-group path, answer schemas, and coverage of contracted sounds and mora timing. Progress tests cover the original completion events and new word recall resume. Browser tests cover navigation, review and saved study. Actual results are recorded in the [work log](../WORK_LOG.md).

Manual comparison with the readable Irodori chart checked basic row membership and displayed readings. The original explanations were reviewed for beginner readability, modern o and keyboard wo, and nasal n. Qualified review of the expanded explanations, lesson sequence and audio remains pending.
