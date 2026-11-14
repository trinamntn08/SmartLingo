# French content guide

Initial learner: an English-speaking adult newcomer to France, from complete beginner through A2.

## Draft a lesson
- State one useful outcome and approximate level.
- Teach 6-10 items in a situation rather than an isolated list.
- Group short lessons into topic banks with 30–50 distinct words/phrases per topic. Keep at least one A1 and one A2 lesson; labels are estimates subject to review.
- Include noun articles/gender, a specific sense, natural French examples, English meaning, and register.
- Pair concrete vocabulary with unambiguous pictures; use alt text.
- Use explicit meaning matching for abstract/unillustrated entries. A contextual notebook is not a literal depiction; do not test an abstract word against it as a picture.
- Topic banks and lesson overviews show words together. Original bundled drawings in `packages/content/src/visuals.ts` associate stable IDs with exact targets without rewriting lesson revisions; see [media records](MEDIA_SOURCES.md). An abstraction can stay text-supported.
- Include a short dialogue and sentence-building activity with accepted alternatives.
- Show meanings, example translations and explanations directly in study material. Keep deliberate recall reveals within review practice.
- Keep IDs stable and distinguish shared curriculum from learner-edited notebook entries.

## Review and publication
Use draft -> owner review -> published -> revised/archived. Never automatically publish generated material.
Review language, translation, difficulty, answer variants, pictures, audio, and practical usefulness.
Record sources and media usage rights. Create original examples and avoid copying whole course collections.
Label AI speech and uncertain level estimates. Do not claim native-speaker validation, exam alignment, or certification without evidence.

## Feedback
Use supportive beginner feedback. Normalise harmless presentation differences; show corrections for missing accents. Do not ignore differences that change meaning.
Store hints/attempt types so supported completion does not imply independent recall.
Voice transcripts can be wrong; do not use transcription success as a pronunciation score.

The runtime schema lives in `packages/domain/src/content.ts`; original drafts live in `packages/content/src/index.ts` and its `topics/` modules, built through `build-topic.ts`. [Research and review limits](CURRICULUM_RESEARCH.md) accompany the topic expansion. Application tests check schema/IDs, distinct topic counts, sentence-piece solvability, exercise references and notebook-compatible field limits. These checks do not establish French linguistic correctness. The local editor supports first fields, immutable draft saves and a saved-revision preview with answer keys/provenance. Publication requires an explicit review acknowledgement and valid preview receipt. Seed drafts remain unapproved until the owner performs that review; agent tests publish only isolated test data.
