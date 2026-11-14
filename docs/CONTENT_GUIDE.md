# French content guide

Initial learner: an English-speaking adult newcomer to France, from complete beginner through A2.

## Draft a lesson
- State one useful outcome and approximate level.
- Teach 6-10 items in a situation rather than an isolated list.
- Include noun articles/gender, a specific sense, natural French examples, English meaning, and register.
- Pair concrete vocabulary with unambiguous pictures; use alt text.
- Include a short dialogue and sentence-building activity with accepted alternatives.
- Put grammar and translations behind optional reveals.
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

The runtime schema lives in `packages/domain/src/content.ts`; original drafts live in `packages/content/src/index.ts`. Application tests check schema/IDs, exercise references and notebook-compatible field limits. These checks do not establish French linguistic correctness. The local editor supports first fields, immutable draft saves and a saved-revision preview with answer keys/provenance. Publication requires an explicit review acknowledgement and valid preview receipt. Seed drafts remain unapproved until the owner performs that review; agent tests publish only isolated test data.
