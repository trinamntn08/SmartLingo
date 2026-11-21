# ADR 0030: Japanese begins with kana row lessons

Status: accepted, 2026-11-22

## Context

The owner explicitly requested alphabet lessons before Japanese vocabulary. The existing first topic included limited kana support but did not teach the basic syllabaries. Existing Japanese lessons, history and free exploration must remain usable.

## Decision

Add separate original draft alphabet metadata: ten Hiragana rows followed by ten Katakana rows, covering 46 basic forms per script. New stable row/character IDs do not alter existing Lesson/OpenCourse payloads. English readings/notes, optional sound playback and recognition practice share existing UI controls and the language-specific audio adapter. Corresponding katakana audio prompts reduce isolated Hiragana particle-reading ambiguity; actual phonetic quality still needs owner/teacher review.

Japanese Today first recommends alphabet study, and its Learn destination defaults to Japanese letters. Explicit vocabulary exploration and topic links still open the vocabulary catalogue. French keeps its existing Learn default. Alphabet rows/scripts can be browsed freely; vocabulary is never locked behind completion.

Explicit Mark row studied writes the existing validated LearningEvent completion shape under the row ID/revision and a dedicated completion item ID. No new store/migration/backup version is required. Existing backup/merge retains these events. The model scopes known alphabet IDs to Japanese, and a pure helper derives confirmed current-revision row study and the first unstudied row. Save retry keeps its event identity and advances only after confirmation. Attempting every character allows study completion even after mistakes; it does not certify recognition or mastery.

Alphabet progress is displayed separately in Today and the alphabet screen. Characters do not become vocabulary entries or inflate word-lesson/report totals. Existing word/course reports retain their defined scope; alphabet study is not presented as a word or assessed proficiency metric. Temporary recognition choices and recordings are not persisted.

## Consequences

Complete basic-form opening with saved continuation, text/audio alternatives and free navigation. The introduction excludes voiced marks, small-kana combinations, long-vowel instruction, kanji, handwriting and stroke order; those need later teaching. [Sources and review limits](../curriculum/japanese-alphabet-sources.md) identify factual references, original content and draft status.
