# Content guide

Reviewed against source: 2026-11-22. French and Japanese use the shared `Lesson` contract and learner widgets, with English interface and explanations. The [course catalogue](COURSE_CATALOGUE.md) separates their runtime inventories, daily courses and Japanese letters. All bundled content remains draft pending owner review/publication; structural checks do not establish language accuracy or complete level coverage.

## Language-specific authoring

The French guidance below remains for practical metropolitan French. For Japanese, follow the existing original-content and review boundaries in [course sources](curriculum/japanese-course-sources.md), [shared lessons](curriculum/japanese-shared-lessons.md), [topic vocabulary](curriculum/japanese-topic-vocabulary.md) and [alphabet sources](curriculum/japanese-alphabet-sources.md). Japanese runtime content lives in `japanese-course.ts`, `japanese-lessons.ts`, `japanese-expansion.ts`, `japanese-vocabulary/` and `japanese-alphabet.ts` under `packages/content/src/`.

Japanese vocabulary needs target script, a kana reading, specific English meaning, an original example with kana reading and English translation, and a usage/register note. Dialogue lines retain kana readings. Use meaning matching when no literal picture exists. Sentence assembly discloses spaces as teaching chunks; ordinary Japanese generally has no word spaces. Preserve kana dakuten and distinctions that change meaning when searching or comparing answers. French articles/gender rules do not transfer to Japanese. Foundation/A1/A2/B1 labels in Japanese are editorial task estimates, without JLPT equivalence or a complete-course claim. Qualified Japanese review remains necessary.

Original restaurant/bakery seed lessons now live in [topics/preview-lessons.ts](../packages/content/src/topics/preview-lessons.ts); the content entry point assembles the catalogue. This is an exact payload extraction, not a curriculum revision or publication. Keep new authored payloads in cohesive content modules rather than growing the package export file.

The 20 basic-kana row lessons use their own typed content and explicit row-study progress. The 13-lesson Japanese guided course has its own stable progress scopes. The shared library includes 65 course-related lessons and four [starter lessons](../packages/content/src/topics/japanese.ts) on greetings, courtesy, introductions and ordering at a café. New topic lessons preserve existing canonical vocabulary and its history, and track their own completion.

## French authoring scope

Initial learner: an English-speaking adult newcomer to France, from complete beginner through A2.

For current lesson inventory, use the [course catalogue](COURSE_CATALOGUE.md). The [curriculum review pack](curriculum/README.md) owns the latest full-payload review, proposed progression and separate unpublished bridge/correction candidates. For topic progression, research sources and vocabulary-coherence audits, use the repository [French curriculum researcher](../.agents/skills/french-curriculum-researcher/SKILL.md). Its 32 proposed topics and seeds are unreviewed planning material; the optional research schema is separate from runtime `lessonSchema`. Reconcile existing senses and convert proposals into the lesson structure below before owner preview/review. Installing the skill does not add or approve lessons.

For the guided French route, use the [daily-course plan and level maps](plans/0043-french-daily-course.md). They specify the proposed unit goals, one lesson per study day and the review tasks that carry language into later situations.

Design for about 10 minutes in the guided opening lessons, with the sentence exercise and feedback as the final practice. Allow 10–12 minutes for a topic lesson with its optional response task. For that task, change a detail from the study material and supply an idiomatic French model, a faithful English meaning and one or two criteria the learner can check. Use a single clear request or reply at foundation/A1 and add a condition, reason or follow-up where appropriate at A2. Offer the model after the prompt. [Pacing and coverage review](curriculum/french-lesson-pacing.md)

## Draft a lesson
- State one useful outcome and approximate level.
- Teach 6-10 items in a situation rather than an isolated list.
- Group short lessons into topic banks with 30–50 distinct words/phrases per topic. Use foundations, A1 and A2 where the communicative demands justify them; a foundations bank or an A2-only bank need not force an unsuitable level merely for symmetry. Labels are estimates subject to review.
- Include noun articles/gender, a specific sense, natural French examples, English meaning, and register.
- Prefer short, complete examples that actually demonstrate the target sense. Do not impose a minimum word count or add subordinate clauses merely to make an example longer. Teach common formulas before their full grammar when helpful, and explain that choice.
- Pair concrete vocabulary with clear SmartLingo-generated pictures when useful. Add alt text and follow the [generation and rights workflow](MEDIA_SOURCES.md#generated-image-workflow).
- Use explicit meaning matching for abstract/unillustrated entries. A contextual notebook is not a literal depiction; do not test an abstract word against it as a picture.
- Topic banks and lesson overviews show words together. Original bundled drawings in `packages/content/src/visuals.ts` associate stable IDs with exact targets without rewriting lesson revisions; see [media records](MEDIA_SOURCES.md). An abstraction can stay text-supported.
- Include a short dialogue and sentence-building activity with accepted alternatives.
- Include a listening check based on a complete line from the lesson. Give the learner a concrete detail or meaning to listen for, with replay, an optional transcript and helpful feedback. [In-lesson listening design](curriculum/in-lesson-listening.md)
- Show meanings, example translations and explanations directly in study material. Keep deliberate recall reveals within review practice.
- Keep IDs stable and distinguish shared curriculum from learner-edited notebook entries.

## Review and publication

The greeting-first opening is a deliberately compact exception to the larger-bank guideline: 24 expressions across three eight-item foundation lessons. Do not pad it merely to reach 30 words. It reuses exact existing canonical vocabulary support and adds new stable IDs only for new expressions. See [decision 0019](decisions/0019-greetings-first-drafts.md).

Use draft -> owner review -> published -> revised/archived. Never automatically publish generated material.
Review language, translation, difficulty, answer variants, pictures, audio, and practical usefulness.
Record sources and media usage rights. Write examples, dialogues and exercises independently. Use the current generated-only policy when selecting pictures for the French daily course.
Label AI speech and uncertain level estimates. Do not claim native-speaker validation, exam alignment, or certification without evidence.

## Feedback
Use supportive beginner feedback. Normalise harmless presentation differences; show corrections for missing accents. Do not ignore differences that change meaning.
Store hints/attempt types so supported completion does not imply independent recall.
Voice transcripts can be wrong; do not use transcription success as a pronunciation score.

The runtime schema lives in `packages/domain/src/content.ts`; original French drafts live in `packages/content/src/index.ts` and its `topics/` modules, built through `build-topic.ts`. [Research and review limits](CURRICULUM_RESEARCH.md) accompany the topic expansion. Application tests check schema/IDs, distinct topic counts, sentence-piece solvability, exercise references and notebook-compatible field limits. These checks do not establish French linguistic correctness. The local editor supports headings/topic/learner role/estimated level/vocabulary support/grammar and existing dialogue roles, French lines and English translations, with immutable draft saves and a saved-revision preview with answer keys/provenance. Dialogue line count/order, vocabulary targets, pictures and exercise answers remain fixed. Use the same learner role label in relevant dialogue lines; role labels are edited separately. French foundation/A1/A2 labels describe estimated content difficulty, not proficiency or certification. The shared schema also permits B1 for the existing Japanese task drafts; this does not add a French B1 curriculum. Review changed topic/level grouping and dialogue for coherent roles, register and faithful English in the real temporary lesson preview. Publication requires an explicit review acknowledgement and valid preview receipt. Seed drafts remain unapproved until the owner performs that review; agent tests publish only isolated test data.
