# French content guide

Initial learner: an English-speaking adult newcomer to France, from complete beginner through A2.

For current lesson inventory, use the [course catalogue](COURSE_CATALOGUE.md). The [curriculum review pack](curriculum/README.md) owns the latest full-payload review, proposed progression and separate unpublished bridge/correction candidates. For topic progression, research sources and vocabulary-coherence audits, use the repository [French curriculum researcher](../.agents/skills/french-curriculum-researcher/SKILL.md). Its 32 proposed topics and seeds are unreviewed planning material; the optional research schema is separate from runtime `lessonSchema`. Reconcile existing senses and convert proposals into the lesson structure below before owner preview/review. Installing the skill does not add or approve lessons.

## Draft a lesson
- State one useful outcome and approximate level.
- Teach 6-10 items in a situation rather than an isolated list.
- Group short lessons into topic banks with 30–50 distinct words/phrases per topic. Use foundations, A1 and A2 where the communicative demands justify them; a foundations bank or an A2-only bank need not force an unsuitable level merely for symmetry. Labels are estimates subject to review.
- Include noun articles/gender, a specific sense, natural French examples, English meaning, and register.
- Prefer short, complete examples that actually demonstrate the target sense. Do not impose a minimum word count or add subordinate clauses merely to make an example longer. Teach common formulas before their full grammar when helpful, and explain that choice.
- Pair concrete vocabulary with unambiguous pictures; use alt text.
- Use explicit meaning matching for abstract/unillustrated entries. A contextual notebook is not a literal depiction; do not test an abstract word against it as a picture.
- Topic banks and lesson overviews show words together. Original bundled drawings in `packages/content/src/visuals.ts` associate stable IDs with exact targets without rewriting lesson revisions; see [media records](MEDIA_SOURCES.md). An abstraction can stay text-supported.
- Include a short dialogue and sentence-building activity with accepted alternatives.
- Show meanings, example translations and explanations directly in study material. Keep deliberate recall reveals within review practice.
- Keep IDs stable and distinguish shared curriculum from learner-edited notebook entries.

## Review and publication

The greeting-first opening is a deliberately compact exception to the larger-bank guideline: 24 expressions across three eight-item foundation lessons. Do not pad it merely to reach 30 words. It reuses exact existing canonical vocabulary support and adds new stable IDs only for new expressions. See [decision 0019](decisions/0019-greetings-first-drafts.md).

Use draft -> owner review -> published -> revised/archived. Never automatically publish generated material.
Review language, translation, difficulty, answer variants, pictures, audio, and practical usefulness.
Record sources and media usage rights. Create original examples and avoid copying whole course collections.
Label AI speech and uncertain level estimates. Do not claim native-speaker validation, exam alignment, or certification without evidence.

## Feedback
Use supportive beginner feedback. Normalise harmless presentation differences; show corrections for missing accents. Do not ignore differences that change meaning.
Store hints/attempt types so supported completion does not imply independent recall.
Voice transcripts can be wrong; do not use transcription success as a pronunciation score.

The runtime schema lives in `packages/domain/src/content.ts`; original drafts live in `packages/content/src/index.ts` and its `topics/` modules, built through `build-topic.ts`. [Research and review limits](CURRICULUM_RESEARCH.md) accompany the topic expansion. Application tests check schema/IDs, distinct topic counts, sentence-piece solvability, exercise references and notebook-compatible field limits. These checks do not establish French linguistic correctness. The local editor supports headings/topic/learner role/estimated level/vocabulary support/grammar and existing dialogue roles, French lines and English translations, with immutable draft saves and a saved-revision preview with answer keys/provenance. Dialogue line count/order, vocabulary targets, pictures and exercise answers remain fixed. Use the same learner role label in relevant dialogue lines; role labels are edited separately. Foundations/A1/A2 describe estimated content difficulty, not proficiency or certification. Review changed topic/level grouping and dialogue for coherent roles, register and faithful English in the real temporary lesson preview. Publication requires an explicit review acknowledgement and valid preview receipt. Seed drafts remain unapproved until the owner performs that review; agent tests publish only isolated test data.
