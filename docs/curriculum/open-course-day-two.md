# Day 2: Introduce yourself — original review draft

Authoring date: 2026-11-19. Status: **draft for owner review**. Estimated A1 with beginner foundations; no certified CEFR coverage or native-speaker/teacher review is claimed.

## Outcome and scope

An English-speaking adult newcomer practises giving a name, asking another adult their name with vous, distinguishing first and family names, and closing a first meeting. The setting is a neighbourhood activity. A first name is enough for the dialogue; a family name is optional in the learner's own introduction. Fictional names avoid requiring personal information.

The seven sections are bilingual study, eight canonical vocabulary entries, an original short dialogue, three situational choices and optional spoken/typed self-review with a visible model and checklist. English meanings remain directly available. Grammar is explicitly optional and presented as support for useful formulas. The current daily-course format uses choices rather than a separate picture/sentence-building exercise; existing vocabulary illustrations and support are reused without alteration. Reflection has no automatic free-text answer grader or pronunciation score.

## Provenance and rights

The new study prose, examples, dialogue, prompts, choices, feedback, hints, model and checklist are original SmartLingo AI-assisted drafts created for this repository. No external course text, recording, image or other media was consulted, copied, imported or adapted for day 2. Names are fictional examples. No new media, provider or licence grant is introduced.

Eight existing SmartLingo canonical vocabulary objects are reused in full, including stable IDs, exact target/meaning/example/note, gender and picture support. Their existing repository provenance and rights records continue to apply; this note does not relicense those objects. The day-1 CC BY 4.0 source record remains unchanged and scoped to the identified day-1 adaptation. It is not the source of day-2 original material or canonical vocabulary.

| Canonical ID | Target |
| --- | --- |
| `fr.bonjour` | bonjour |
| `fr.people.s-appeler` | s’appeler |
| `fr.people.prenom` | un prénom |
| `fr.people.nom-de-famille` | un nom de famille |
| `fr.people.enchante` | enchanté |
| `fr.greetings.et-vous` | et vous ? |
| `fr.people.au-revoir` | au revoir |
| `fr.greetings.bonne-journee` | bonne journée |

Original runtime module: `packages/content/src/open-course-day-two.ts`. Canonical name entries originate in `topics/daily-life.ts`, greetings in `topics/greetings.ts`, and the shared bonjour payload in the existing canonical catalogue. Runtime assembly passes the shared course schema. Course release is revision 2; day 2 records progress under revision 2. Day 1 retains progress revision 1 and its original teaching payload.

## Alternatives and review checklist

Choices have one correct option for their precise situational prompt. Feedback explicitly recognises valid phrases outside the supplied options. Self-review accepts je m’appelle or conversational moi, c’est plus a name; comment vous appelez-vous ?, vous vous appelez comment ?, or contextual et vous ?; mon prénom, c’est or mon prénom est plus the first name. Au revoir and bonne journée can appear alone or in either order. Tu questions are valid French but do not match the specified vous exchange. Ça va bien answers how someone is, not what their name is.

Check before publication:

- French naturalness, polite register and faithful English, including the common spoken name-question variant.
- Suitability of estimated A1/foundation demand; useful progression after day 1 without implying complete coverage.
- Masculine articles for un prénom/un nom de famille, and the feminine speaker's written enchantée in the dialogue; adjective agreement has the same pronunciation here.
- Apostrophe in m’appelle, accents in prénom/enchanté/journée and missing accents as writing feedback rather than pronunciation evidence.
- Exact canonical support, situational answer keys and alternate formulations; no valid supplied option is wrongly rejected for the requested function.
- Accessibility, actual optional voice quality and practical usefulness with adult beginners.

No unresolved lexical question was identified during drafting. Owner/native-teacher review, actual audio and learner testing remain outstanding. Source-free original drafting does not itself establish linguistic validation.

## Validation performed

Manual author review checked the bilingual pairs, vous consistency, seven-section structure, choice answer references and situational distractors, noun articles/gender, feminine agreement and documented alternatives.

Author checks run on 2026-11-19: `npm.cmd run check` passed repository checks and TypeScript; `git diff --check` passed. A focused Node/tsx assertion script passed the shared course schema, revision 2/two days, seven day-2 sections/eight exact canonical payloads, and correct/incorrect grading for all supplied choices. Removing only day 1's added progressRevision field produced its protected SHA-256 `79a94a54503782e5af2756bcb2164f74e936d2cc1f312e88d460bf05f8432ff1`. These checks do not establish native-level naturalness or pronunciation quality. Combined application/browser checks remain the primary agent's integration responsibility.
