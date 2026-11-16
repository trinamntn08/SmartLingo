# Topic placement and beginner progression — review draft

Audit: 2026-11-15, Europe/Paris. Baseline: `aac20dc`. Audience: English-speaking adult newcomers to France. Original AI-assisted editorial research using the French curriculum researcher skill. **Recommendations only; no runtime curriculum, owner publication, learner history or saved vocabulary changed.**

Implementation follow-up, 2026-11-16: the [greeting-first opening](plans/0023-greetings-first.md) is now converted into three draft lessons, and the learner consumes explicit course ordering. The findings below describe the historical 120-lesson inventory; broader recommendations remain proposals. The integrity checker still verifies that historical scope and its unchanged support fingerprints, and reports the current runtime count separately. No owner publication or native-teacher approval is implied.

## Finding

The owner's example is correct: **everyday greetings and politeness should be the first teaching topic**. `bonjour`, `bonsoir`, `s’il vous plaît`, `merci` and `au revoir` should be taught together before a restaurant transaction. Their later appearances in a bakery or restaurant are useful contextual practice.

The existing inventory has 24 banks, 120 lessons, 741 appearances, 705 canonical sense IDs and 696 exact written targets. These counts measure content, not course completeness. The previous overlap review addressed redundant slots; it did not establish a coherent beginner entrance to the course.

There are two separate problems:

1. **Selection and teaching homes:** the Essential conversation tools bank starts with repair requests. Greetings are dispersed, while several basic greeting forms are absent as vocabulary targets. Family, colours, body parts, spelling and time need more systematic foundations. Some coherent everyday tasks are deferred to A2 despite being teachable as supported A1 exchanges.
2. **Presentation order:** `course-sequence.ts` suggests Essentials first, but no learner runtime consumer uses it. `index.ts` exports Restaurant first; `mergeLessonCatalogue` preserves that insertion order; `groupLessonTopics` preserves first-seen topics; Today falls back to `lessons[0]`. A fresh bundled catalogue therefore starts with Restaurant. A research document alone will not fix this behaviour. Cached owner publications may also change the visible topic labels/content.

Evidence: [bundled catalogue](../packages/content/src/index.ts), [suggested sequence](../packages/content/src/course-sequence.ts), [merge](../packages/domain/src/catalogue.ts), [grouping](../packages/domain/src/topics.ts), [Today](../apps/learner/App.tsx), [catalogue loading](../apps/learner/src/content/useCatalogue.ts). The review inspected source and imported the bundled catalogue; it did not open the owner's browser or databases.

## Complete review records

- [Readable word-by-word review of all 741 appearances](audits/all-topic-words.md), grouped by current topic and lesson.
- [Daily-life and transaction review](audits/topic-words-daily.md), with [every occurrence and its recommendation](audits/topic-words-daily.json).
- [Foundations and extended-topic review](audits/topic-words-foundations.md), with [every occurrence and its recommendation](audits/topic-words-foundations.json).

Each JSON row identifies the lesson and stable vocabulary ID, preserves the current French target and English meaning, gives a first teaching home, an action, an individual rationale, issue tags and any proposed target/meaning/level correction. The accompanying topic notes identify missing candidates and task-level changes. These files are research artifacts, **not editor imports or runtime lessons**.

Actions mean:

| Action | Meaning |
| --- | --- |
| keep | Appropriate here as an introduction; support or sequencing notes can still apply. |
| recycle | Appropriate here as contextual practice, with first teaching elsewhere. Retain its canonical ID. |
| move | Its current teaching slot belongs elsewhere or needs a different lesson task. This does not mean deleting dialogue uses. |
| revise | Correct or clarify a gloss, form, example, register, level or prerequisite. The French expression itself may be valid. |

`firstHome` is a proposed pedagogical home, not an ID prefix or the first position in today's source array. Related chunks and inflections are not automatically duplicate senses. Word-level rows must be read with their lesson notes: a basic word can legitimately recur in a more demanding A2 task. A proposed level is an editorial estimate, never an official CEFR word classification.

Integration clarification: personal address, postcode, identifying number and email-address expressions first belong with identity/contact details (recorded as People and introductions), then recur in services and digital tasks. Spelling is an early foundations submodule. Digital message verbs should be introduced before office sending tasks, even if the full technical-problem extension comes later. These early subclusters can be taught before their current larger bank; the proposed map is not a requirement to complete whole banks in a rigid sequence.

## What established resources actually support

All successful accesses below occurred on 2026-11-15. No complete proprietary course inventory was copied or reconstructed. The new sequence and candidate selections below are SmartLingo editorial decisions informed by the current inventory and learner needs.

| Source | Inspected evidence and supported claim | Limit |
| --- | --- | --- |
| [TV5MONDE — Première classe](https://apprendre.tv5monde.com/fr/exercices/premiere-classe) | The beginner overview opens with personal introductions/origins and includes daily-life learning paths for leisure, housing, meals, work, health and travel. | Supports coverage and communicative grouping, not a mandatory word-by-word sequence. Its greetings also recur in a work setting. |
| [TV5MONDE — A1 greeting usage](https://apprendre.tv5monde.com/fr/aides/vocabulaire-saluer-prendre-conge-0) | The visible transcript distinguishes everyday `bonjour`, evening `bonsoir`, informal `salut`, and leave-taking formulas. It illustrates polite greetings in shops and restaurants. | Supports the greeting/register distinctions below; does not prescribe our complete opening bank. |
| [Hachette — Cosmopolite 1 contents](https://hachettefle.pl/wp-content/uploads/2022/07/Cosmopolite_1_spis_tresci.pdf) | Opening material combines introductions, spelling, numbers and classroom communication; an early unit includes greetings and leave-taking. Later coverage includes family, daily activities, transactions and travel. | Publisher-hosted overview inspected; not evidence that every SmartLingo target belongs to that course or level. |
| [Hachette — Cosmopolite 1 transcripts](https://catalogues.hachette-education.com/heeb/datas/fle/docs/Cosmopolite/transcriptions_cosmopolite1_LE.pdf) | Pages 1–2 concretely place greeting/name exchanges, spelling, early numbers and repair formulas near the beginning. | Only the opening was used for detailed sequencing evidence. No dialogues or exercises reproduced. |
| [Council of Europe — global scale](https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale) | A1 concerns supported basic everyday interaction and personal details; A2 concerns familiar routine exchanges and simple descriptions. | Describes performance, not an official exhaustive vocabulary list. |
| [Council of Europe — language-specific descriptions](https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions) | Distinguishes the general framework from language-specific lexical/grammatical descriptions produced by national teams. | Those full French reference inventories were not audited here; no claim of complete alignment. |
| [TV5MONDE — Avoir mal à](https://apprendre.tv5monde.com/fr/aides/grammaire-avoir-mal) | A1 examples explicitly combine the pain expression with body parts and contracted articles. | Supports teaching `avoir mal à… / au… / aux…` as a usable pattern; not medical advice or verification of the entire health bank. |

The Édito A1 2022–2024 product page was accessible initially, but the companion-unit link redirected to an inaccessible page and subsequent product reads timed out. It is **not used as evidence for Édito's exact sequence or lexical inventory**. TV5MONDE and Hachette provide the two independent FLE references for this review. Course families, editions and teaching contexts differ; there is no single shared set of exact topics and words to reproduce.

## Corrected first topic: Everyday greetings and politeness

French working title: **Salutations et politesse au quotidien** — the owner's “chào hỏi thường ngày”. Keep the learner interface title in English. Can-do: greet a stranger or acquaintance, exchange a short check-in, make a polite request and close the exchange. No prior lesson required. Teach `vous` as the default with unfamiliar adults and introduce the marked `tu` alternatives without requiring conjugation mastery.

The following is an original **24-expression opening proposal**, split into three eight-item lessons. It is a bounded teaching module, not a decision to shrink all production banks below the existing 30–50-expression guideline. Do not pad the first experience just to reach that guideline; a later conversion must document whether this becomes an opening module within a larger bank or a justified smaller bank.

| Proposed short lesson | Draft target set |
| --- | --- |
| Say hello and goodbye | bonjour · bonsoir · salut · au revoir · à bientôt · à demain · bonne journée · bonne soirée |
| Be polite in everyday exchanges | s’il vous plaît · s’il te plaît · merci · merci beaucoup · de rien · pardon · excusez-moi · excuse-moi |
| Ask how someone is | comment allez-vous ? · comment ça va ? · ça va bien · très bien, merci · pas très bien · et vous ? · et toi ? · à tout à l’heure |

These common formulas are intentionally related. They are not 24 unrelated lemmas or a proficiency measure. English glosses, existing-ID reconciliation and candidate status are in [the opening proposal](audits/greeting-first-proposal.json). This brief does not include all runtime fields or claim schema-valid lessons.

Usage notes:

- `bonjour` works during the day, including the afternoon; the present gloss “hello / good morning” is incomplete as a usage explanation, rather than wholly false. Recommend “hello / good morning / good afternoon” with a daytime note.
- `bonsoir` greets in the evening; do not teach an arbitrary universal switch time. TV5MONDE explicitly says the boundary varies.
- `bonne journée` and `bonne soirée` wish someone a good day/evening when leaving. They do not serve as the standard greeting equivalents of `bonjour` and `bonsoir`.
- `salut` is informal. `s’il te plaît`, `excuse-moi` and `et toi ?` belong with `tu`; their `vous` partners belong together in stranger-facing dialogues.
- `pardon` can serve a small apology or request to repeat depending on tone/context; show the intended function. Keep `bonne nuit` as a later bedtime/parting variant, not an evening-arrival replacement.
- Keep `enchanté / enchantée` with first introductions and teach its written agreement. Recycle it beside greetings when useful.

Original micro-dialogue, not a source quotation:

| Speaker | French | English |
| --- | --- | --- |
| Neighbour A | Bonjour ! Comment allez-vous ? | Hello! How are you? |
| Neighbour B | Très bien, merci. Et vous ? | Very well, thank you. And you? |
| Neighbour A | Ça va bien, merci. | I'm well, thank you. |
| Neighbour B | Bonne journée ! | Have a good day! |
| Neighbour A | Merci, à bientôt ! | Thank you, see you soon! |

Practice: choose arrival versus departure formulas; pair `tu`/`vous` forms; build a two-turn greeting; choose a polite response to a small request. Do not test abstract politeness against a falsely literal photograph. Full examples, grammar, sentence answers and media need authoring/preview during runtime conversion.

## Proposed teaching map

This is a **candidate map of 30 teaching areas**, not 30 shipped banks or a copied table of contents. It separates combined fields that currently obscure gaps. An implementation may use submodules rather than create a bank for every row. Stable existing lesson/sense IDs survive a change of teaching home.

First teach the supported A1 versions of daily tasks. Return to their A2 extensions after those foundations; do not make a learner finish every advanced lesson in one bank before meeting the next basic topic. Free exploration stays available. Prerequisites below are recommended language support, not locks.

| Order | Teaching area / French working title | First-pass outcome and lexical focus | Prior support; later extension |
| --- | --- | --- | --- |
| 1 | Everyday greetings and politeness / Saluer au quotidien | Greet, thank, apologise and leave; opening set above. | None; reuse throughout. |
| 2 | Understanding and asking for help / Comprendre et demander de l’aide | Ask to repeat or slow down, say yes/no, ask a basic question. | 1; later clarify a multistep instruction. |
| 3 | Alphabet, sounds and spelling / Épeler et reconnaître les sons | Spell a name and recognise letter names and key sound contrasts. | 1–2; support identity throughout. |
| 4 | Numbers, quantities and payment / Compter et payer | Build numbers, ask a total, recognise prices and common payment forms. | 1–2; later compare totals and resolve an error. |
| 5 | Identity and contact details / Se présenter | Name, origin, residence, languages, age, telephone/address/email. | 1–4; later explain arrival/settling in. |
| 6 | Family and people / Présenter ses proches | Identify immediate family, friends and neighbours; basic descriptions. | 5; later describe relationships/background. |
| 7 | Days, dates and availability / Donner une date | Days, months, today/tomorrow, calendar dates and availability. | 4; later change a planned date. |
| 8 | Time and daily routine / Parler de sa journée | Ask/tell time and describe getting up, meals, leaving and returning. | 4, 7; later sequence habits and changes. |
| 9 | Neighbourhood and directions / Se repérer dans le quartier | Name local services, locate them and follow a short route. | 1–2; later check distance or correct a route. |
| 10 | Public transport / Prendre les transports | Identify a stop/platform, choose a ticket and ask the destination. | 4, 7–9; later manage delay/cancellation/change. |
| 11 | Bakery and café counter / Acheter au comptoir | Choose a basic item, order politely, give a quantity and pay. | 1, 4; later arrange collection. |
| 12 | Food shopping / Faire les courses | Common foods, amounts, sections and checkout; complete a purchase. | 4, 11; later check labels/price discrepancies. |
| 13 | Restaurant meals / Commander au restaurant | Find a table, choose food/drink, state a simple need and ask for the bill. | 1, 4, 12; later explain allergies and split payment. |
| 14 | Clothes, colours and sizes / Choisir des vêtements | Find clothing, name colours/sizes and ask to try it on. | 4; later explain a defect or request exchange. |
| 15 | Rooms and home life / Décrire son logement | Rooms, furniture, building entry and simple object locations. | 5, 9; later ask rental questions/report a fault. |
| 16 | Weather and seasons / Parler du temps | Describe weather, season and appropriate plans/clothing. | 7, 14; later adjust an outing. |
| 17 | Leisure and tastes / Parler de ses loisirs | Say what you like doing; use activity chunks, not only object nouns. | 8, 16; later explain a preference. |
| 18 | Invitations and arrangements / Organiser une sortie | Invite, accept/refuse politely, choose a place/time. | 1, 7–8, 17; later postpone/cancel/confirm with a reason. |
| 19 | Body and simple health needs / Dire où on a mal | Basic body locations, symptoms and a pharmacy request. | 1–2; later describe duration/frequency. |
| 20 | Appointments / Prendre rendez-vous | Ask for an appointment and confirm date/time. | 7–8, 19 as a context; later reschedule/explain an obstacle. |
| 21 | Cooking and sharing food / Préparer un repas | Tools, basic preparation verbs and a short recipe. | 12, 15; later follow a sequence and discuss leftovers. |
| 22 | Phone and digital messages / Téléphoner et communiquer en ligne | Call, send a short message, reuse a personal email address and connect. | 3–5; later send an attachment/explain a technical problem. |
| 23 | Travel and accommodation / Séjourner à l’hôtel | Reserve/check in, ask about room facilities and departure. | 4–5, 7, 10, 15, 22; later handle a booking or room problem. |
| 24 | Learning and education / Apprendre et étudier | Classroom objects, simple instructions and course enquiries. | 2–5, 7; later discuss a learning goal/schedule. |
| 25 | Work and colleagues / Communiquer au travail | Identify a role, place and colleague; clarify a simple task. | 2, 5, 8, 22, 24; later organise deadlines and propose solutions. |
| 26 | Public services and paperwork / Faire une démarche | Ask at reception, identify/fill a form and provide basic details. | 5, 7, 9, 22; later discuss supporting documents/deadlines. |
| 27 | Post and everyday service counters / Envoyer une lettre ou un colis | Address, stamp and send a letter/parcel; complete a counter exchange. | 4–5, 9; banking vocabulary remains a later scoped gap, not existing coverage. |
| 28 | Finding a job / Chercher un emploi | A2 focus: describe skills/experience and arrange an interview. | 5, 22, 24–25; preserve professional versus lived-experience senses. |
| 29 | Recent experiences / Raconter une expérience | A2 focus: say what happened and give a short sequence/reaction. | 7–8, 17–18; explicit past-tense support. |
| 30 | Preferences and comparisons / Comparer et donner un avis | A2 focus: compare practical options and give a simple reason. | 4, 14, 17, 29; introduce basic `aimer/préférer` earlier. |

A2 revisit route: social arrangements → shopping/meal problems → travel/accommodation problems → housing/health appointments → paperwork/digital tasks → workplace/job search → short past accounts → comparisons/reasons. This is an editorial dependency route, not a certification pathway.

## Rules for converting the review into draft lessons

1. Use the complete occurrence records and topic notes to move **first teaching**, while retaining appropriate greetings/payment/help in later dialogues. Do not erase useful recycling merely to increase unique-word totals.
2. Preserve canonical sense IDs even when their historical prefix names a different bank. Reuse the existing `fr.bonjour`, `fr.silvousplait`, `fr.merci`, etc.; give genuinely new senses new IDs. Do not rewrite notebook captures or old learning events.
3. Keep 6–10 target items per short lesson with a realistic outcome, original bilingual examples/dialogue, correct noun gender, visible meanings and solvable activities. Do not enforce exactly five lessons or exactly 30 items in every teaching area as a pedagogical requirement.
4. Correct shared examples carefully: `reuseSharedVocabulary` requires identical payloads for a canonical ID and substitutes the canonical support into every occurrence. A clothes lesson cannot independently replace the shared `chercher` payload while groceries uses a different payload. Prefer an agreed reusable example, plus lesson-specific dialogue, or design an explicit contextual-example extension in a separate implementation step.
5. Reassess whole-lesson levels from required performance. A short shop-location or morning-routine exchange can be A1; a longer explanation/problem task can remain A2 even when it contains the same basic word. Teach formulas before full grammatical analysis when useful.
6. Apply actual catalogue ordering in the learner, not just a documentation array. Preserve resume behaviour for existing study, publication overrides, free exploration and offline content. Fresh-user start, sidebar order, A1 filtering and publication merges need regression checks when implemented.
7. New/changed lessons stay drafts, with exact historical seed fingerprints for safe revision refresh. Run runtime schema/content checks, preview saved revisions and obtain owner publication separately. This review does not silently approve the French, pictures or audio.

## Verification and limits

The review covers every bundled vocabulary appearance and its local support fields. Topic recommendations and source comparisons are editorial; automated coverage checks cannot certify French quality. The complete dialogues, exercises and grammar of all 120 lessons were not independently re-authored or exhaustively linguistically reviewed. No dictionary-by-dictionary verification of all 705 senses, native teacher approval, learner study, paid API, owner database access, runtime migration or publication is claimed.

Run `node --import tsx scripts/verify-curriculum-topic-audit.mjs` to compare the review with current bundled lessons and report coverage/action totals. This verifies exact row coverage, preserved snapshot targets/meanings, support fingerprints and structural consistency; it is not a language-quality test. See [session checkpoint](SESSION_CHECKPOINT.md) for actual check results and local checkpoint status.

Final integrated dispositions: **547 keep, 52 recycle, 3 move first introduction, 139 revise**. Revisions include earlier supported introduction, metadata and example/gloss improvements; this is not a count of 139 French mistakes. The opening proposal reuses seven existing IDs and marks seventeen expressions as new target candidates. The readable report and JSON rows cover exactly the same 741 occurrences.

Actual validation: the complete audit validator and `npm.cmd run check` pass; `node --import tsx --test packages/domain/tests/topics.test.ts packages/domain/tests/examples.test.ts` passes eight tests. These existing tests still validate the unchanged bundled lessons, not the proposed research as importable lessons. Full browser/offline/provider suites were not rerun because this step changes research documents and their integrity checker only.
