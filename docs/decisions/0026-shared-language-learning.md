# ADR 0026: One learner interface for French and Japanese

Date: 2026-11-21 (Europe/Paris)
Status: accepted by explicit owner instruction

## Context
The Japanese branch implemented a separate daily-course entry and vocabulary widget while the French branch added further course days and listening resources. The owner requires choosing French or Japanese at the homepage, followed by exactly the same core widgets and learning journey.

## Decision
Use a language chooser and one shared Today, topic catalogue, lesson, vocabulary, notebook and recognition-review interface. English remains the UI/explanation language. Filter the merged bundled/publication catalogue, learning-event display and notebook by the active target language. The selector is a separate browser preference; it never rewrites learner history. Missing legacy notebook language means French. Shared cards render optional kana and example readings.

Project the existing 13 Japanese daily-course days into separate schema-validated Lesson records, preserving canonical vocabulary, readings, study explanations and dialogue. Original explicit sentence exercises add the shared sentence-building journey. New ja.lesson.* IDs own new lesson events; existing daily-course events remain unchanged. Keep the original daily-course payloads and free day/section resume available through the same active-language course panel. Preserve French day progress revisions and unchanged-day history.

Lesson contracts allow B1 task labels for the existing Japanese material; this does not claim full CEFR/JLPT coverage or expand French AI context levels. The French `lessons` export and server seeds stay French; a separate `japaneseLessons` export joins them in the learner. General Japanese authoring/publication remains outside this slice.

Retain Japanese backup format v4 to preserve language/readings; v1/v2/v3 import remains supported. No IndexedDB store/version migration. Personal entries may be created for either active language. Both languages use the same device-speech/voice-settings widget with separate preferences and strict target-language voice selection. Japanese never queries the French saved-speech cache or generation provider. Optional French AI/listening/neural services retain their explicit French scope.

Pending/failed notebook, course and review writes prevent leaving their screen until resolved. Retry preserves immutable IDs; failed idle review ratings also have an explicit dismiss/reload-history action so unavailable storage cannot trap all navigation.

## Consequences
The core interface and learning logic are shared, while course content and optional service availability differ. Old daily-course completion remains daily-course activity rather than invented completion of new lesson exercises. Backups contain both languages; an older app cannot import v4. Language choice/audio preferences remain separate from learning backups. Text study and exported offline lessons require no provider. Qualified Japanese, real audio, physical-device and accessibility acceptance remain outstanding.
