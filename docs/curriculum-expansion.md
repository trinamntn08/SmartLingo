# Additional practical French banks — editorial draft

Authored and sources inspected 2026-11-15. These eight banks are original AI-assisted drafts for an English-speaking adult newcomer to France. They add 40 short lessons and 240 target slots, each bank containing five lessons of six distinct targets. This is a count of taught targets within banks, **not 240 previously untaught senses**. Recycled senses below must reuse canonical IDs during integration. Owner review and explicit publication remain separate. No certified CEFR coverage, native-speaker review or audio review is claimed.

## Outcomes and progression

| Bank | Estimated levels | Practical can-do goal | Five task clusters | Prerequisites |
| --- | --- | --- | --- | --- |
| Essential conversation tools | foundation, A1 | Ask for help, repair misunderstanding and check a word | Repeat; polite help; yes/no and limitations; simple questions; written clarification | No prior French for the first two lessons; recognise je/vous and a few present-tense chunks for later lessons |
| Numbers and quantities | foundation, A1 | Give small quantities, recognise numbers and check a price | 0–5; 6–11; 12–17; 18–20 and 30–50; 60–100 and combien | No prior French for the first two lessons; simple price questions for later lessons |
| Dates and availability | A1, A2 | Give a day/month and confirm an exact date | Working week; nearby days; January–June; July–December; dates and slots | Numbers; je peux; basic present tense. Final lesson coordinates a changed date rather than merely naming it |
| Finding your way on foot | A1, A2 | Find a local service, follow a short route and check a missed turn | Street landmarks; positions; route actions; local services; distance and correction | Polite attention/repair phrases, simple place nouns. Final lesson combines walking time, turn-back and destination instructions |
| Phone and digital communication | A1, A2 | Make contact, dictate an address and handle a simple file/connection exchange | Phone actions; email characters; messages; connection; files | Alphabet names for dictation (not taught as a complete alphabet here); present-tense requests. A2 adds reflexive connection chunks and describing a difficulty |
| Invitations and shared plans | A1, A2 | Invite, accept or decline, then agree or change a plan | Invitation; joining; refusal; meeting details; changed plans | Days, times, basic tu/vous. Tu is used between established friends; service requests retain vous |
| Talking about recent experiences | A2 only | Tell a short recent event in sequence and give an outcome | Recent time; sequence; activities; reaction; small incident | Basic present tense, avoir/être, common past chunks and a few irregular participles. This introduces a supported short account, not an exhaustive tense course |
| Preferences and simple comparisons | A2 only | Choose between familiar options and give a short reason | Preferences; opinion starters; comparisons; practical qualities; reasons and drawbacks | Basic adjectives, agreement, present tense and familiar nouns. Opinions concern concrete everyday choices, not abstract argumentation |

Numbers cover every whole number from zero through twenty, then the tens from thirty through ninety and cent. The thirtieth target is combien. Compound building after twenty is supported in English grammar notes. Prices, contact codes, quantities and shared totals appear in the examples; they do not inflate the target count. This bank does not teach every possible phone-number reading or all written-number conventions.

Days and months intentionally appear in their useful date forms without an article: lundi, en janvier. Notes distinguish a particular Monday from recurring le lundi. Nouns used as ordinary objects have articles and explicit gender fields. Functional frames and inflected chunks are taught as usable expressions; recognising one does not establish mastery of the underlying grammar.

## Recycling and sense decisions

The comparison against `.tmp/pre-rework-lessons.json` found 40 literal target matches. Two clearly require distinct senses: social **ça me va** agrees to a plan rather than describing clothing fit; past **manquer** means miss a bus rather than something being missing. Past **après** is taught as standalone afterwards; the existing routine sense may be a preposition. Preserve that distinction if the reworked routine bank teaches a following noun. The remaining matches are reuse candidates, not new lexical discoveries:

- Essentials: `fr.essentials.please` → `fr.silvousplait`.
- Numbers: zero/two/three/four/five/ten → `fr.routine.zero`, `.deux`, `.trois`, `.quatre`, `.cinq`, `.dix`.
- Calendar: monday/saturday/today/week/date → `fr.routine.lundi`, `.samedi`, `.aujourdhui`, `.semaine`, `.date`; tomorrow → `fr.bakery.tomorrow`; available → `fr.health.disponible`.
- Directions: street/town-hall/post-office → `fr.administration.rue`, `.mairie`, `.poste`.
- Digital: phone/email-address/connection/network/password/log-in/attachment → `fr.administration.telephone`, `.adresse-mail`, `.connexion`, `.reseau`, `.mot-de-passe`, `.se-connecter`, `.piece-jointe`; send → `fr.work.envoyer`.
- Social: invite/fancy/with-pleasure/busy/another-time/rather/postpone → `fr.leisure.inviter`, `.ca-te-dit`, `.avec-plaisir`, `.occupe`, `.une-autre-fois`, `.plutot`, `.reporter`; together → `fr.work.ensemble`; cancel/confirm → `fr.health.annuler`, `.confirmer`.
- Past: first/next → `fr.routine.d-abord`, `.ensuite`; afterwards requires a sense comparison with `fr.routine.apres` before deciding reuse.

These are pre-rework comparisons. Integration must also compare other newly authored banks. Parent integration owns the alias map, canonical entry wording, stable revisions and final unique-sense totals. Several clear distinctions need separate support: directions **une place** is a square, social **une place** is an available spot; digital **ouvrir** is opening a file or app; **un souvenir** here is a memory; **une expérience** here is a lived event; spatial **jusqu’à** is a destination. Infinitives reused in examples are supporting vocabulary, not extra targets. Specific chunks such as *avoir envie de recommencer* build on the more general *avoir envie de*; they are transparent pedagogical recycling, not evidence of an entirely new lemma.

## Sources and rights

All sources below were actually opened on 2026-11-15. Examples, translations, dialogues, grammar notes and activity sentences were composed for SmartLingo. No course inventory, dialogue, exercise or audio was copied. The modules add no media files, download no source media and make no new reuse-permission claim. Their abstract prompts use the existing meaning activity; an existing contextual notebook illustration is not presented as a literal depiction of an abstract word.

| Source | Evidence type | What was inspected and what it supports |
| --- | --- | --- |
| [Council of Europe: CEFR global scale](https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale) | cefr_descriptor | A1 supported simple interaction and A2 familiar routine exchanges guide the communicative load. This is not a French word-level inventory |
| [Council of Europe: CEFR Companion Volume](https://rm.coe.int/common-european-frameworkof-reference-for-languages-learning-teaching/16809ea0d4) | cefr_descriptor | A2 sustained monologue on describing experience explicitly includes past activities and personal experiences. Used to bound the brief supported recent-event bank; extended narrative and abstract argumentation remain outside this draft |
| [TV5MONDE: vocabulary aids](https://apprendre.tv5monde.com/fr/aides/vocabulaire) | inspiration | The index presents thematic daily-life vocabulary and links number-writing, fractions, office communication and question/suggestion support. It informs task grouping, not an authoritative level for every target |
| [CLE: Vocabulaire progressif du français, débutant A1](https://progressive.cle-international.com/9782090398489) | inspiration | Publisher description and resource labels show communicative contexts including invitations, finding one’s way, encounters and communication. No audio, paywalled lesson or vocabulary inventory inspected or reused; the publisher’s A1 label does not assign a level to these original lessons |
| [Dictionnaire de l’Académie française: août](https://www.dictionnaire-academie.fr/article/A9A2062) | usage_validation | Confirms /u/ with optional final /t/, masculine month name and accepted aout spelling. Used to correct the pronunciation note, not to copy an example |

The two independent FLE indexes triangulate practical scope only. Individual usage, frequency and estimated lesson difficulty remain editorial judgements except for the explicitly checked août note. No frequency corpus or exhaustive dictionary validation was performed.

## Validation and owner review

Actual checks on 2026-11-15:

- Imported all three modules through `tsx` and built every lesson through `buildTopic`/`lessonSchema`: eight banks, five lessons and thirty distinct raw targets each; six items per lesson; at least three translated dialogue lines per lesson; draft status supplied by the shared builder.
- Checked each sentence token inventory against the expected answer, with at most eight pieces. An initial punctuation-insensitive inventory check missed a misplaced full stop in the calendar sentence; the repository’s real solvability test found it, and the tokens were corrected.
- Ran `node --import tsx --test packages/domain/tests/topics.test.ts packages/domain/tests/examples.test.ts` after integration wiring: all five tests passed, including exact-piece answer solvability, distinct topic targets, shared-entry consistency, translated examples and separate noun-gender metadata. Removed redundant gender-only notes as required by those checks.
- Manually reviewed short examples/translations, coherent roles/register, completed exchanges, noun articles, distinctions between physical/digital actions and past participle notes. This is AI editorial checking, not native-speaker validation.

The primary integrator runs the repository-wide checks and records their actual results separately. Browser presentation, audible synthetic pronunciation and owner publication were not tested by this authoring agent. Remaining owner review questions: whether the A2 connection, comparison and past chunks need more intermediate practice; whether *se joindre à* should be moved later despite its practical usefulness; whether grammatical agreement side notes distract beginners; and which compound numbers need additional listening practice. The drafts keep these explanations optional and do not equate lesson completion with proficiency.
