# Daily-life vocabulary placement audit — draft

Editorial review dated 2026-11-15. **Draft for owner review; research recommendations only.** No runtime lessons, accepted answers, canonical IDs, media, owner publications or learner data were changed. This is not native-speaker validation or certified CEFR coverage.

The complete occurrence list is [topic-words-daily.json](topic-words-daily.json): 381 rows, covering all vocabulary in the 60 lessons of the 12 topics below. Each row preserves the exact current target and meaning; its rationale assesses the actual example, English translation, available gender/note support and lesson role. The JSON is the complete word list and individual verdict record; the sections below add scenario-level gaps and concrete editorial proposals.

`firstHome` means the proposed first teaching home, including homes proposed for future restructuring. It is not the ID prefix, present array position or proof that the expression is already taught there. `recycle` preserves a useful contextual occurrence. `revise` can concern support or first introduction rather than the validity of the French expression. `suggestedLevel` estimates an accessible first introduction; a simple word can still participate in a more demanding A2 task. Empty issue arrays mean no categorical defect, including optional improvements to a valid example. No word is moved merely because another topic can use it.

The priority is an opening **Everyday greetings and politeness** foundation: `bonjour`, `bonsoir`, `s’il vous plaît`, thanks and leave-taking before café or shop transactions. Existing greeting IDs must remain stable. `bonsoir` is absent as a target in the all-topic inventory; it is a new candidate, not an existing entry. The master [curriculum topic audit](../CURRICULUM_TOPIC_AUDIT.md) owns external evidence and the overall sequence. The judgements here are editorial and depend on that master evidence review.

| Topic | Lessons | Appearances |
| --- | ---: | ---: |
| Restaurant | 5 | 34 |
| Bakery | 5 | 30 |
| Groceries | 5 | 34 |
| Clothes and shopping | 5 | 33 |
| Home and housing | 5 | 35 |
| Transport | 5 | 35 |
| Health and appointments | 5 | 30 |
| Work and study | 5 | 30 |
| Services and paperwork | 5 | 30 |
| People and introductions | 5 | 30 |
| Time and daily routine | 5 | 30 |
| Leisure and weather | 5 | 30 |

## Restaurant

**Outcome assessment.** The five tasks form a useful progression: order a drink, find a table, choose a meal, explain an ingredient need, finish and pay. The `carte`/`menu` contrast, feminine `une personne`, partitives and napkin sense are supported correctly. The examples for tableware are natural requests. A2 ingredient checking and split payment can remain richer later tasks; the presence of basic nouns does not make those entire scenarios mislevelled. All 34 occurrences have individual JSON verdicts.

**Moves/revisions.** Teach `fr.bonjour` and `fr.silvousplait` first in greetings, then retain them here as recycling. Give `fr.restaurant.egg` and `fr.restaurant.milk` an earlier grocery introduction and `fr.restaurant.allergy` a health home; keep their restaurant occurrences because checking food ingredients is directly relevant. Keep `à part` distinct from an allergy declaration, as the current note already does. `un ticket` is valid for a payment receipt with its contextual note; do not collapse it automatically into `un billet` or the more specific `un ticket de caisse`.

**Missing essentials — candidates, not existing targets.** `je voudrais…` (I would like…), `commander` in an immediate ordering frame, `une carafe d’eau` (feminine; a jug of tap water), `payer`/`payer par carte` (to pay/by card), `c’est tout, merci` (that is all, thank you), `sur place` (to eat here). The current `fr.bakery.order-in-advance` already teaches `commander`; decide whether a contextual extension of that canonical sense suffices. Do not invent another ID solely for restaurant use.

**Prerequisites.** Supply greetings, request frames, numbers, days and basic food words before table sizes, bookings and allergen questions. A supported formula may precede productive conditional grammar. A fresh example could be `Je voudrais une table pour deux.` / “I would like a table for two.”

## Bakery

**Outcome assessment.** Buying bread, choosing a pastry, buying lunch and ordering for collection are coherent. Bread varieties and bake preferences are useful choices, but four named treats are not a substitute for a complete opening purchase. `Et avec ça ?` and `il n’y en a plus` are valuable staff language to understand. The `en` quantity phrase can be learned as a chunk; it need not await mastery of pronouns. All 30 occurrences have JSON verdicts.

**Moves/revisions.** Keep `bonjour`, `s’il vous plaît` and `merci` after their greetings introduction. Their shared café examples are grammatical, but local examples would better match the bakery: `Bonjour, je voudrais une baguette.` / “Hello, I would like a baguette.” Do not rewrite shared canonical content so that another lesson loses its appropriate example; the later implementation must decide between a reusable neutral example and lesson-specific support. `fr.bakery.tomorrow` first belongs in Dates and availability, then recurs naturally for collection. Make `à emporter` available at A1, retaining the later heating/lunch task if desired.

**Missing essentials.** Candidates: `du pain` (masculine; some bread), `ce sera tout` (that will be all), `ça fait combien ?` (how much is that altogether?), `par carte` (by card), `en espèces` (in cash), `sur place` (to eat here). `en espèces` already exists as `fr.groceries.cash`; reuse it. Complete the transaction before expanding bread or pastry varieties.

**Prerequisites.** Teach quantities, `je voudrais`, the ability to recognise a total, and short collection-time exchanges. The collection outcome mentions a name, but no target explicitly supplies `c’est au nom de…` (it is under the name…). Existing accommodation `à quel nom ?` can supply receptive support without a new duplicate sense.

## Groceries

**Outcome assessment.** Produce, dry staples, a deli counter, locating products and checking a price form usable subscenarios. Noun gender, mass/plural distinctions and `kilo de`/`paquet de` are broadly sound. `nature`, `beurre doux` and `en promotion` have practical support. All 34 occurrences are reviewed in JSON.

**Moves/revisions.** Retain `fr.work.verifier` as genuine accuracy-check recycling. Its example `Je vais vérifier les numéros.` is grammatical but poorly anchored to a shopping discrepancy; prefer `Vous pouvez vérifier le prix ?` / “Can you check the price?” Keep the ID. The seven `find-products` entries support a short supported A1 shopping task; introduce them earlier while allowing fuller A2 problem-solving. A2 `check-before-paying` remains plausible when it involves explaining a discrepancy.

**Missing essentials.** Recycle existing `fr.restaurant.egg` (`un œuf`, masculine), `fr.restaurant.milk` (`du lait`, masculine), `fr.restaurant.bank-card` and `fr.sac`; these are absent from this bank, not absent globally. New candidate chunks: `faire les courses` (to do the grocery shopping), `c’est combien le kilo ?` (how much is it per kilo?), `un litre de…` (masculine; a litre of…), `je voudrais…`, `payer`. `un supermarché` already exists in Finding your way on foot.

**Prerequisites.** Teach polite requests, basic numbers, prices and quantities before a weighed purchase. Use short location and payment exchanges, rather than adding more isolated produce nouns to reach a count. Existing partitive notes are useful optional grammar; learners should also see the complete request.

## Clothes and shopping

**Outcome assessment.** Finding an item, choosing shoes, asking for size/colour, trying it on and returning it form a practical shopping arc. French singular `un pantalon`, plural feminine footwear, size versus shoe size, and adjective agreements are supported. Return conditions are phrased as questions rather than guarantees. All 33 occurrences have JSON verdicts.

**Moves/revisions.** `fr.groceries.look-for` belongs here as recycling; its frozen-food example is the misplaced element. Use `Je cherche un pantalon noir.` / “I am looking for black trousers.” The six `try-before-buying` entries support a basic A1 fitting-room exchange; retain more demanding A2 defect/return discussions. Do not move the scarf, belt or hat merely because the lesson outcome foregrounds footwear; they form a clear accessories subcluster.

**Missing essentials.** Candidates: `je le prends`/`je la prends` (I will take it; introduce as supported variants), `la taille en dessous` (feminine; the next size down), `trop grand` (too big; feminine `trop grande`). Recycle `un prix`, the price question and payment formulas. Colours are only black and blue as targets here, although white occurs in an example; a later small basic-colours foundation can provide `blanc/blanche`, `rouge`, `vert/verte` with examples, without an exhaustive colour list.

**Prerequisites.** Number support must precede size forty; staff questions such as `Vous faites quelle pointure ?` need to be marked receptive. Provide both a request and a reply before asking for free role-play. The current `ça me va` and `ça ne me va pas` are a useful positive/negative contrast, not automatically redundant entries.

## Home and housing

**Outcome assessment.** Rooms, essential furniture, building entry, rental questions and repairs form a coherent bank. Room meanings, plural toilettes, baux, landlord/tenant gender alternatives and ground-floor numbering are explained. The repair task is appropriately more complex than naming rooms. All 35 occurrences have JSON verdicts.

**Moves/revisions.** Keep `habiter` as recycling from personal introductions. No furniture item needs removal. In `fr.housing.tap`, `Le robinet de la cuisine coule.` can describe ordinary running water; the English “is leaking” assumes an unwanted fault. Prefer `Le robinet de la cuisine goutte sans arrêt.` / “The kitchen tap keeps dripping.” This is a proposed example correction, not a new target or a confirmed dictionary verdict. Keep the existing `un robinet` target and masculine gender. Preserve A2 support for `faire venir quelqu’un` as a whole request chunk.

**Missing essentials.** Candidates: `une maison` (feminine; a house), `il y a…` (there is/are…), `réparer` (to repair), `fermer` (to close). `une table` is already a Restaurant target and can be recycled as furniture rather than duplicated. `de l’eau chaude`, `du bruit`, `c’est compris ?` already exist in Accommodation; reuse them when needed. `une fenêtre` is currently taught only in the repair slice; make it available earlier in a home description.

**Prerequisites.** Supply location expressions and small numbers before a viewing; larger numbers and months before rent. Legal or rental-procedure explanations need separate current evidence. No new legal requirements are asserted by this audit.

## Transport

**Outcome assessment.** Choosing a mode, locating a stop, buying a ticket, checking a change and handling disruption are practical tasks. `gare`/`station`, direction labels, rail-ticket context, `à vélo`/`à pied`, and direct versus non-stop are sensibly supported. All 35 occurrences have JSON verdicts.

**Moves/revisions.** No vocabulary move is required. `descendre` should be introduced with basic boarding/getting-off at A1, then reused in the A2 connection task. Retain `un car de remplacement`, cancellation and alternatives in A2. `valider` is appropriately framed as a question; do not turn this into a universal instruction about tickets. `un horaire` is supported by a natural plural example and transport-specific note.

**Missing essentials.** Candidates: `ce bus va à… ?` (does this bus go to…?), `c’est le bon arrêt ?` (is this the right stop?), `un ticket` in an explicitly local-transport sense, and `un abonnement` (masculine; a pass/subscription). The existing Restaurant receipt `un ticket` has a different contextual sense: do not overwrite its meaning to add transport. Route and network terms should be selected for learner need, not an exhaustive mode list. `à quelle heure ?` already exists in Invitations and shared plans and should be reused here.

**Prerequisites.** Numbers, clock time, days, destination questions, polite requests and brief directions must be available before a ticket purchase. Teach a two-turn direction check before a disruption scenario. Real ticket media, validation rules and fare products need current transport-source checks during implementation.

## Health and appointments

**Outcome assessment.** Booking, simple symptoms, pharmacy support, describing onset and changing an appointment are coherent. `avoir mal` with body parts is usable, prescription/medicine nouns have articles and gender, and examples avoid diagnosing or prescribing. All 30 occurrences have JSON verdicts.

**Moves/revisions.** Keep allergy language in both health and restaurant contexts with one stable sense. `demain` and `disponible` should be known from calendar/availability; `le matin`, `souvent` and `en retard` need routine/time support. Teach repetition from foundations, then recycle `fr.health.repeter` in an A2 consultation. This does not mean the complete symptom-onset task must be relabelled foundation. Keep `annuler` and `confirmer` first in appointment management, with social-plan reuse later.

**Missing essentials.** Candidates: `je suis malade` (I am ill), `la gorge` (feminine; the throat), `avoir mal à la gorge`, `c’est urgent` (it is urgent), `j’ai besoin d’aide` (I need help). Existing `une aide`, `aider`, and `urgent` are related support rather than proof those full chunks are taught. `avoir mal à…` is already explained in the note, but showing that complete frame beside `avoir mal` would make body-part substitution clearer.

**Prerequisites.** Small body-part and time clusters should precede an open consultation. Keep `depuis`, onset in a supported past phrase, `un empêchement` and `un créneau` in A2 scheduling/consultation practice. Medical-service and emergency instructions require appropriate factual checking; none are added here.

## Work and study

**Outcome assessment.** Workplace people, a French class at work, simple office tasks, organising work and clarifying instructions are individually coherent. The combined bank spans two domains: the classroom slice should be taught early with Education and learning, then recycled in a workplace-learning scenario. It is not intrinsically off topic under the current title. All 30 occurrences have JSON verdicts.

**Moves/revisions.** Proposed first homes for `un cours`, `une professeure`, `un cahier`, `un stylo`, `un exercice`, `apprendre` are Education and learning. Keep them as contextual recycling if the workplace-class task remains. Teach `comprendre` as an early repair prerequisite and `envoyer` in digital communication, preserving their workplace uses. Clarify `fr.work.horaire` to “a work schedule”; its singular example and plural working-hours note remain valid. Replace awkward “a time allowed / deadline period” for `fr.work.delai` with “time allowed / a time limit”; distinguish it from `une date limite`.

**Missing essentials.** Recycle existing `travailler` from Finding a job, `une pause` from Education and learning, `un message`/`un fichier` support from digital communication. New candidate chunks: `je travaille comme…` (I work as…), `j’ai besoin de…` (I need…), `vous pouvez me montrer ?` (can you show me?). Existing `montrer` in Essentials should supply the last verb rather than a new duplicate.

**Prerequisites.** Classroom requests and repair need an early home. Large numbers/24-hour time, near-future requests and simple task sequencing must precede meeting/deadline work. Current `une équipe`, colleague and responsible-person gender notes are adequate; no gender correction was identified.

## Services and paperwork

**Outcome assessment.** Reception, contact details, postal errands, online submissions and checking missing documents form useful newcomer tasks. Most terminology has adequate English support. Administrative nouns are not procedural advice. All 30 occurrences have JSON verdicts.

**Moves/revisions.** Teach `épeler` first with early clarification/spelling; keep it here for contact details. Introduce personal address, postcode, identifying number and email-address expressions in People and introductions, then recycle them here and in digital basics. Street, town hall and post-office landmarks first belong in Finding your way on foot. These are useful contextual recurrences. `Où puis-je déposer mon dossier ?` is grammatical and appropriately formal; offer `Où est-ce que je peux déposer mon dossier ?` as a spoken alternative, preserving existing accepted answers. The letter/stamp task and collecting a parcel are adjacent postal tasks: either broaden that lesson outcome or give collection a separate micro-dialogue. No parcel noun deletion is necessary.

**Missing essentials.** Recycle `une pièce d’identité`, `signer` and `en ligne` from their current banks. Candidates: `un justificatif de domicile` (masculine; proof of address), `joindre un document` (to attach/include a document), `c’est complet ?` (is it complete?). These support asking what is required; they must not imply universal documentary requirements. The present supporting-document noun is useful, but not a substitute for a request/response exchange.

**Prerequisites.** Names, digits, spelling and email symbols need an earlier identity/digital scaffold. `une démarche`, `une attestation`, `un accusé de réception` and submission checking are reasonable supported A2 content. The acknowledgement note correctly distinguishes receipt from approval. Official process-specific requirements remain outside this linguistic audit.

## People and introductions

**Outcome assessment.** Names, origin/languages, family, conversational repair and newcomer contact are coherent as short lessons, but core greetings and repair should not wait inside this bank. Family is thin: friend and neighbour are useful relationship words, while parents/partners are absent as explicit targets. All 30 occurrences have JSON verdicts.

**Moves/revisions.** First teach `bonjour`, `au revoir`, `désolé` and `bienvenue` in greetings. Keep them in introductions/settling-in as recycling. Replace the introductory `bonjour` café example with `Bonjour, je m’appelle Alex.` / “Hello, my name is Alex.” Introduce `lentement`/the slower-speech request and `je n’ai pas compris` in foundations as formulas; `un peu`, `une question`, `une réponse` can be A1 support. Retain later A2 conversation practice if the task actually asks for extended clarification. The recent-arrival example with `venir de` justifies A2 scaffolding; it is not the same sense as origin `venir de Londres`.

**Missing essentials.** `bonsoir` is a global gap. Candidate opening chunks: `comment vous appelez-vous ?`, `ça va ?`, `et vous ?`, `comment allez-vous ?` with appropriate familiarity guidance. Family candidates: `une mère`, `un père`, `les parents`, `un conjoint`/`une conjointe` with inclusive alternatives suited to the speaker. Do not imply every adult has children or a partner.

**Prerequisites.** Register and `tu/vous` need visible support before name questions. Teach short self-introduction frames before requiring reflexive-verb analysis. Keep existing feminine alternatives and the distinction between given and family names. No defective noun article/gender was found in this bounded review.

## Time and daily routine

**Outcome assessment.** Getting ready, clock time, habitual timing, daily actions and sequencing are coherent. The stable lesson ID `fr.routine.small-numbers` now contains getting-ready content; preserve the ID rather than renaming it to match the current heading. Basic daily actions placed after A1 getting-ready actions create a dependency inversion. All 30 occurrences have JSON verdicts.

**Moves/revisions.** Introduce `se lever`, `se doucher`, breakfast, `partir`, `rentrer`, `se coucher` at A1, before the existing A1 examples that already use them. The present-tense sequencing examples also fit A1 support; fuller connected accounts can remain A2. Keep `d’abord` and `ensuite` here as their first home, then recycle them in recent-experience narratives. Distinguish `se réveiller` from `se lever`, and `tard` from `en retard`, as the notes already do.

**Missing essentials.** The clock outcome says ask the time, but its target list has no `quelle heure est-il ?` (what time is it?). Add that candidate and recycle existing `à quelle heure ?` for event times. `le matin` exists in Health and appointments and should have an earlier routine home. New candidates: `l’après-midi` (masculine/feminine usage needs an explicit house-style choice and review), `déjeuner`/`dîner` as meal actions, `prendre le petit déjeuner` as a complete chunk. Day names and dates already exist in Dates and availability; use them rather than duplicating a calendar list here.

**Prerequisites.** Supply numbers before clock reading, weekdays before availability, and the present reflexive `je me…` frame before a free routine. `et demie` correctly notes the midi/minuit exception. The bank does not need a long noun inventory to become coherent; it needs a short full day exchange.

## Leisure and weather

**Outcome assessment.** Interests, basic weather, exercise, invitations and weather-related changes are individually useful, but the bank mixes a weather foundation with social planning already covered elsewhere. Keep a clear path: state an interest, describe the weather, suggest a simple activity, then negotiate a change at A2. All 30 occurrences have JSON verdicts.

**Moves/revisions.** Give invitation/acceptance/decline/postponement items their first home in Invitations and shared plans; retain them here as weather/activity recycling. `fr.transport.bicycle` remains legitimate transport recycling, but `Je vais au travail à vélo.` does not demonstrate leisure. Prefer `On fait du vélo au parc ?` / “Shall we go cycling in the park?” `à l’intérieur` with a meal example is still valid if an indoor café is the alternative; a broader indoor-plan example could support the stated outcome better. Neither requires a canonical-ID change.

**Missing essentials.** Recycle existing `écouter`, `préférer` and `le week-end`. Candidate activity chunks: `écouter de la musique`, `regarder un film`, `faire du vélo`, `se promener`. Their component nouns in the bank do not mean those chunks are explicit targets. Weather candidates: `il neige` (it is snowing), `il va pleuvoir` (it is going to rain), and a small seasons cluster only when the plan needs it. Do not extend to exhaustive meteorological terminology.

**Prerequisites.** `aimer + infinitive` and basic weather frames belong early. Familiar `ça te dit ?` requires the visible `vous` alternative already provided. The `si` condition, postponement and alternative plan justify later A2 integration. Acceptance formulas can be offered much earlier without relabelling the whole negotiation task.

## Sources, rights, uncertainty and validation

Inspected local evidence: the inventory exported from the [bundled content entry point](../../packages/content/src/index.ts), its [committed baseline and fingerprints](topic-word-audit-baseline.json), [content guide](../CONTENT_GUIDE.md), [project plan](../../PROJECT_PLAN.md), [status](../STATUS.md), [session checkpoint](../SESSION_CHECKPOINT.md), [session workflow](../SESSION_WORKFLOW.md), [research skill](../../.agents/skills/french-curriculum-researcher/SKILL.md), its [framework](../../.agents/skills/french-curriculum-researcher/references/curriculum.md) and [source rules](../../.agents/skills/french-curriculum-researcher/references/sources.md), and the [author skill](../../.agents/skills/sll-author-french/SKILL.md). The temporary inspection file `.tmp/curriculum-topic-audit/inventory.json` contains all 120 lessons and 741 appearances; cross-topic homes and missing-target statements were checked against all of it. Reproduce the inventory from the committed content and use the committed baseline to detect drift; the temporary file is not a durable documentation dependency.

No external reference was independently retrieved by this subreview. Its language/progression judgements are editorial, with live evidence maintained by the primary audit. New example alternatives above are original editorial drafts. No course text, media or paid API was used, copied or licensed by this step; no new media-rights assertion is made.

Unresolved language/editorial questions: decide whether to keep the existing broad tap-flow example with a literal “is running” translation or sharpen it to an unwanted drip; decide the display style for `l’après-midi`; choose first-teaching homes for shared contextual nouns without erasing legitimate reuse; decide how lesson-specific examples can coexist with canonical shared payloads. The current `couler` example is ambiguous, not proof that the verb never means leak. Independent human French review, owner preview and explicit publication remain separate work.

Validation performed: parsed JSON; checked exact scope, every `(lessonId, vocabularyId)` once, 381 expected versus 381 actual, no outside or missing pairs; checked unchanged target/meaning strings against the inventory; checked required fields, action/issue/level values, nonempty individual rationales and consistent first homes within this file; reviewed UTF-8 output after correcting shell-input corruption in editorial rationale text. No runtime schema validation or learner-browser test was needed for these research-only artifacts; this review does not claim that tests establish linguistic correctness. The primary agent owns combined repository checks and the checkpoint commit.
