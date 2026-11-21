# Japanese lessons in the shared learner interface

Drafted: 2026-11-21. Runtime adapter: `packages/content/src/japanese-lessons.ts`.

This record describes the original 13 source-day lessons, which remain unchanged. The [topic vocabulary expansion](japanese-topic-vocabulary.md) appends 52 original lessons: the current learner has 13 topic banks of 30 distinct entries each, 65 short lessons total. Earlier lesson/course progress is preserved; new lessons have separate IDs.

The shared catalogue presents each of the 13 existing Japanese course days as a `Lesson`, with a distinct topic using the day title. It preserves all 78 canonical vocabulary records, including IDs, meanings, examples and kana readings, and each day’s actual dialogue lines and readings. The first study block supplies the grammar title and explanation. The source `japaneseCourse` and its immutable IDs, revision and progress scopes are unchanged. Shared lessons have separate stable IDs `ja.lesson.day-1` through `ja.lesson.day-13`, revision 1, draft status, Japanese targets and English support. The ten-minute estimate describes this shorter shared activity view, not completion of the full course day or its open production task.

The [existing authorship and research record](japanese-course-sources.md) applies to reused text. The adapter and 13 explicit sentence assembly exercises are original AI-assisted SmartLingo work. No external lesson text, media, recordings or proprietary course content is imported; no Creative Commons licence or third-party endorsement is claimed.

Each meaning-match activity uses three existing vocabulary entries with distinct targets and meanings and asks for the first entry’s actual English meaning. Original vocabulary meanings remain visible in study. The activities are labelled meaning matching because these abstract expressions do not have literal pictures.

## Sentence activities

Each exercise assembles an expression already taught in that source day. Every supplied token is used once. Valid alternatives for day 1 request modifiers, day 3 quantity placement, day 5/day 7 place and object order and day 9 comparison placement are explicit accepted answers. Prompts constrain clause order where needed for coherent reasoning, reporting or negotiation. Space-separated answers match the shared widget exactly. Each explanation discloses that the spaces mark teaching chunks: ordinary Japanese generally has no word spaces. These exercises do not test ordinary Japanese typography or independently generated writing.

| Day | Sentence focus |
| --- | --- |
| 1 | Request one slower repetition |
| 2 | Give an origin with から |
| 3 | Request two bread items |
| 4 | Ask where the station is |
| 5 | Describe eating breakfast at home |
| 6 | Ask to see existing photos |
| 7 | Ask permission to use a computer here |
| 8 | Connect a cold room to a blanket request |
| 9 | Compare two restaurants’ prices |
| 10 | Connect getting lost to asking for directions |
| 11 | Contrast a view about work location with consultation needs |
| 12 | Relay a written instruction to bring a drink |
| 13 | Keep booking conditional on everyone’s availability |

All content remains draft pending owner and qualified Japanese/native-speaker review of naturalness, readings, translation, register, prerequisites, answer alternatives and estimated difficulty. The inherited foundation/A1/A2/B1 labels describe selected tasks. Neither these short lessons nor source-course completion establish complete CEFR coverage, assessed proficiency or JLPT equivalence. The adapter does not replace the course’s contextual choices, extended study examples or manual reflection with an equivalent assessment.
