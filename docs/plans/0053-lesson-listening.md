# Add listening to the learner's lessons

Status: complete

## Outcome

Every bundled French and Japanese short lesson has a Listen step after key phrases. Every guided lesson offers a short listening check beside its dialogue. Hiragana and katakana recognition present a sound prompt with a written reading available on demand. All three paths allow audio replay and continued study without a device voice.

## Implementation scope

- Reuse the existing listening player and audio adapters. Retain the separate listening practice and media library.
- Build questions from the lesson's own dialogue and examples. Curate targeted questions for the opening journeys and use same-lesson alternatives for catalogue coverage. [Curriculum design](../curriculum/in-lesson-listening.md)
- Keep the existing stages addressable and preserve course return routes, learning events and completion. Treat listening answers and transcript support as practice within the current visit.
- The primary agent owns short-lesson routing, kana recognition, integration and validation. The listening player, question construction and guided course integration are independently owned during implementation.

## Validation

Check corpus question coverage and ambiguity, grade feedback and replay, verify no new learning events from listening, and check the keyboard, narrow layouts, browser history, guided course links and cold offline transcripts.

Corpus tests cover every bundled short and guided lesson, and reject stale tailored prompts after a revision or ambiguous Japanese readings. The exported preview passed four-width interaction checks from 320 to 1,440 px. Chromium covered the standalone and in-lesson player, both guided courses, kana, history and saved progress. The final offline rerun confirmed transcript fallback after audio failure and an exact return to the guided lesson. [Work log](../WORK_LOG.md#2026-11-23-add-listening-to-every-lesson)
