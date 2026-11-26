# Japanese curriculum redesign

Status: Implemented and verified

## Outcome

English-speaking adults can start an everyday conversation while building kana literacy, then move from guided exchanges to signs, messages and connected tasks. Japanese learners can find the next script, topic or guided lesson and resume previous work. The catalog keeps its established URLs and learning history. Each program gives learners practice they can apply to a new situation and feedback on the specific language to revisit.

## Baseline

The environment initially provided the older French-only Cloud checkout. A separate checkout compares all 68 fetched references with live GitHub. The selected bilingual learner is `cd9d0789d3a5050ede678b11799b90b4f7a67efb` on `feat/android-phone-redesign`. It includes the 20 kana rows, the 13-lesson guided route and the 69 Japanese topic lessons. The standalone typography branch `28f1f4e` is an earlier related revision. The selected baseline already contains direct lesson routes, bilingual guided and topic study, the Japanese listening and speaking tools and the Android wrapper.

## Work

- Kana curriculum and row reader. Preserve the original 20 row identities. Introduce sound patterns through real words, script-specific entry and fresh cumulative checks.
- Guided course. Keep the original daily lesson sources and core progress. Add progressively independent original reading, listening, speaking and writing tasks with practical outcomes and checkpoint review.
- Topic catalog. Review the 69 existing lessons including the four starters. Keep useful vocabulary, dialogues and links. Add source-authored application across all banks and cumulative unit checks.
- Shared learner. Implement Japanese answer validation, composition-safe entry, contextual furigana, audio replay, self-review and persisted practice. Use existing Japanese navigation, notebook and review storage.
- Verify language sources, IDs, asset/transcript consistency, scoped progress and backup compatibility. Exercise primary entry, error/retry, checkpoint and resume in Chromium at desktop and phone sizes. Review changes before pushing the separate task branch.

## Curriculum reference

Practical outcomes follow the Japan Foundation Standard approach to communication. Lessons use original Japanese and English. Foundation, A1, A2 and B1 describe the demands of selected tasks and support. See [JF Standard](https://www.jfstandard.jpf.go.jp/pdf/jfs2024_pamphlet_en.pdf) and [Irodori](https://www.irodori.jpf.go.jp/en/about.html).


## Result

The [curriculum audit](../curriculum/japanese-curriculum-redesign.md) and [complete inventory](../curriculum/japanese-lesson-inventory.md) document the 135 lessons, stable IDs and activity types. The [checkpoint](../SESSION_CHECKPOINT.md) records actual verification, the final offline export and physical-device and qualified review limits.
