# ADR 0029: One Learn destination, distinct ways to practise

Status: accepted, 2026-11-21

## Context

Explore and Practice rendered the same topic catalogue. The owner found them redundant and could not find oral comprehension or video/audio resources, particularly in Japanese, where the French-only library was absent.

## Decision

Use one Learn destination with Vocabulary & lessons, Listening & videos and Speaking sections. Today links directly to listening and speaking. Topic navigation and lesson exits return to the vocabulary section; opening a lesson selects Learn. Existing lesson IDs, revisions, saved events, notebook/review and reports remain unchanged.

Listening comprehension derives whole-sentence questions from existing authored examples and their English meanings. It separates target languages, omits ambiguous sentence mappings and requires distinct meanings for distractors. Replay, answer feedback, transcript support and audio failure/text alternatives are explicit. Guided speaking uses existing scripted dialogues, role selection, model replies, partner playback and repeat. Both activities use the shared language-specific speech adapter and keep answers in memory; they do not write lesson completions, listening assessments or proficiency claims. Existing optional French AI conversation stays explicit in Speaking and clears its temporary session/recordings when leaving that section.

External video/audio recommendations use one language-aware resource widget. Existing French metadata stays intact; Japanese recommendations have separate dated primary-source evidence. No provider media is embedded, fetched or downloaded on browsing. Provider links open explicitly, outside the app, with access/text-support notes.

## Consequences

Same navigation and activity widgets for French and Japanese. No new storage, migration, paid playback, recording requirement or curriculum publication. Lesson exercises and notebook review remain the existing durable practice paths. Voice availability and external media access are separate capabilities; transcripts remain available when speech cannot play. Native-speaker review and actual external-media listening are distinct from browser flow verification.
