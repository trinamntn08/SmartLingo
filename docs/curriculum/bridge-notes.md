# Six bridge lesson candidates — draft for owner review

Prepared 2026-11-16. `reviewStatus: draft`; `exampleOrigin: editorial_example`.

These six original candidates address bounded practical gaps identified against the current 25-bank catalogue. A1/A2 assignments are editorial estimates, not certified coverage or proof of proficiency. B1/B2 are future planning, with no lessons added here. Family examples are fictional and optional: learners can describe people who matter to them without disclosing real personal details.

## Scope and integration boundary

`bridge-lessons.json` contains complete runtime `lessonSchema` objects in a review envelope. It remains outside `packages/content` and the shipped catalogue. This is **not an API import**: the current API creates revisions only for registered lesson IDs, and the editor cannot add arbitrary vocabulary targets or activity structures. Integration would require deliberate bundle conversion, review of bank placement and stable IDs, combined application validation, a saved-revision owner preview, and explicit owner publication. No automatic publication, running preview change, catalogue change, media addition, learner-data migration or remote operation occurred.

All candidates are revision 1 drafts. No existing ID, accepted-answer alternative, revision, lesson or vocabulary payload was changed. Nineteen appearances reuse eighteen complete canonical entries; `fr.work.verifier` appears in two candidates. Thirty-five distinct candidate senses are new; there are 54 vocabulary appearances and 53 distinct senses in this review package. A repeat of known eighty or black is recycling, not new coverage. Traditional and 1990 number spellings are acknowledged; basic days, months and the zero–hundred/tens sequence are not reauthored.

All new text and dialogue were composed for this task. Exact pre-existing SmartLingo examples are reused only through their full canonical payloads. No third-party course text, image, recording or audio was copied. The runtime `context` picture and honest notebook alt text are text support, not a newly created or sourced illustration. Meaning matching is explicit; no abstract word is presented as a literal picture quiz. No generated audio or external media rights claim is made.

## Proposed placement and prerequisites

| Candidate | Estimated level; existing parent bank | Prerequisites and purpose | New / reused appearances |
| --- | --- | --- | --- |
| `fr.people.immediate-family` | A1; People and introductions | After names, `s’appeler`, family/child/brother/sister and `habiter`; introduce relatives and a romantic partner using `voici`, `mon/ma/mes`. | 8 / 1 |
| `fr.shopping.basic-colour-choices` | A1; Clothes and shopping | After common clothes, `chercher`, shopping questions and existing noir/bleu; choose an item by colour, with optional agreement. | 8 / 2 |
| `fr.health.locate-body-pain` | A1; Health and appointments | After `avoir mal`, tête/ventre/dos and short vous questions; expand named locations and au/à la/à l’/aux. | 6 / 4 |
| `fr.numbers.compound-price-checks` | A1; Numbers and quantities | After the complete current basic numbers/tens, `euros`, simple price questions and clarification; compose selected numbers instead of treating repeated tens as missing. | 6 / 3 |
| `fr.administration.payment-clarification` | A2; Services and paperwork | After card/payment/receipt/refund, `vérifier`, price checking and basic past-event support; a predictable information check using fixed formulas. | 4 / 4 |
| `fr.digital.short-postponement-message` | A2; Phone and digital communication | After appointments, availability, absence, `reporter`, `parce que`, greetings and days/times; combine known language into one short email. | 3 / 5 |

These are suggested lesson homes, not executed bank edits. Calculated against the current runtime catalogue, every proposed bank remains within the current 30–50 distinct-target guideline. Hypothetical totals after adding one candidate each are: People 30 → 38; Shopping 33 → 41; Health 30 → 36; Numbers 30 → 38; Administration 30 → 38; Digital 30 → 38. ID and written-target counts agree for each total. Cross-bank recycling adds two known targets to Numbers, four to Administration and five to Digital; those increase a bank’s coverage without creating new canonical senses. Banking currently has no standalone bank: Services and paperwork is an editorial temporary home, with explicit recycling from shopping/restaurant. Written messages remain a practical writing task under Digital rather than a list of unrelated technology nouns.

## Stable ID and sense inventory

### Immediate family

Reuse exactly: `fr.people.famille`.

New: `fr.people.mother`, `fr.people.father`, `fr.people.parents-family`, `fr.people.son-family`, `fr.people.daughter-family`, `fr.people.male-partner`, `fr.people.female-partner`, `fr.people.here-is-person`.

`La fille` here means daughter, while its common girl sense is explained rather than merged. `Le fils` is son, with silent l and pronounced final s. `Les parents` means parents rather than all relatives. Compagnon and compagne are separate gender-specific romantic-partner senses, not gender aliases for a single payload; no marital-status rule is inferred. Existing `une famille` is recycled with its original support.

Offline extension: introduce two people from a fictional family, and identify how they are related. Model: **« Voici ma mère, Anne. Voici mon compagnon, Karim. Mon fils s’appelle Hugo. »** / “This is my mother, Anne. This is my partner, Karim. My son is called Hugo.” Success: at least two clear relationships, suitable mon/ma/mes, and a name or other simple detail. Learners may substitute family members or describe a fictional household.

Review question: confirm that partner vocabulary is preferable to spouse-first vocabulary for this audience, and that the eight new targets fit the proposed family placement. No unresolved confirmed gender or sense defect is known from the bounded editorial review; no native review was performed.

### Basic colours

Reuse exactly: `fr.shopping.black`, `fr.shopping.blue`.

New: `fr.shopping.red`, `fr.shopping.green`, `fr.shopping.yellow`, `fr.shopping.white`, `fr.shopping.grey`, `fr.shopping.pink`, `fr.shopping.orange-colour`, `fr.shopping.brown`.

Orange is a colour, not the fruit; rose is a colour, not a flower; marron is brown, not a chestnut. White/feminine blanche and the invariability of simple orange/marron are made explicit. Existing noir/bleu are not counted as new senses. `Une couleur` and clothing nouns are prerequisites rather than duplicated new entries.

Offline extension: choose a coat/jacket and ask for a colour option, then choose another item. Model: **« Vous avez cette veste en vert ? Je cherche aussi une chemise blanche. »** / “Do you have this jacket in green? I am also looking for a white shirt.” Success: a clear item and colour, a simple request, and one correctly used agreement form; a pointing gesture or drawing can support a spoken attempt.

Review question: ten colour entries fill the schema maximum. An owner may prefer a smaller first group and later recycling, but the present ten form one coherent choice task. No new swatches or image associations have been supplied or visually reviewed.

### Body and pain location

Reuse exactly: `fr.health.mal`, `fr.health.tete`, `fr.health.ventre`, `fr.health.dos`.

New: `fr.health.arm-body`, `fr.health.leg-body`, `fr.health.foot-body`, `fr.health.hand-body`, `fr.health.ear-body`, `fr.health.teeth-body`.

The new body nouns are not duplicates of `à pied`, `se laver les mains`, or `se brosser les dents`: those existing targets are transport or routine-action chunks. The pedagogical extension isolates body nouns and applies a known pain expression across contraction patterns. New `les dents` has feminine gender and singular `une dent` in its note. The lesson preserves the existing `avoir mal` entry rather than inventing a second canonical pain formula. No medical diagnosis, urgency classification or treatment advice is included.

Offline extension: point to three locations in a sketch or use fictional location cards, then say where it hurts. Model: **« J’ai mal au bras, à la main et à l’oreille. J’ai aussi mal aux dents. »** / “My arm, hand and ear hurt. My teeth also hurt.” Success: intelligible location naming and at least three of au/à la/à l’/aux with suitable nouns. These are separate language examples, not a recommended symptom checklist.

Review question: three recycled nouns are useful anchors but leave six new body nouns plus the existing pain formula in a ten-item lesson. Review cognitive load and any later image choices. The right/left ear dialogue labels are supported by English, with full adjective agreement deliberately optional.

### Compound numbers and prices

Reuse exactly: `fr.numbers.eighty`, `fr.work.verifier`, `fr.essentials.is-that-right`.

New: `fr.numbers.twenty-one`, `fr.numbers.thirty-one`, `fr.numbers.sixty-one`, `fr.numbers.seventy-one`, `fr.numbers.eighty-one`, `fr.numbers.ninety-one`.

The existing basic sequence includes zero–sixteen, teen composition, all tens through ninety and hundred, including eighty. This lesson fills an application task with selected compounds; it is not a new basic-number sequence. The known parts twenty/thirty/sixty/seventy/eighty/ninety remain untouched. Composition contrasts et un / et onze with quatre-vingt-un / quatre-vingt-onze, including the s in standalone quatre-vingts. Prices are fictional, whole euros only. No current retail-price claim is made.

Offline extension: prepare price cards for 21, 31, 61, 71, 80, 81 and 91 euros. One person reads a price, the other writes digits and checks one ambiguity. Model: **« Soixante et onze euros, c’est bien ça ? »** / “Seventy-one euros, is that right?” Success: accurately identify 61 versus 71 and 80 versus 81/91, and use a clarification formula; spelling the number can be checked separately from hearing it.

Review question and interface limit: traditional `trente et un` and 1990 `trente-et-un` are both valid. The study note accepts both orthographies. The runtime sentence builder uses fixed `trente et un` pieces and cannot construct the alternate hyphenated form; only the buildable traditional answer is listed for that exercise. This is a constrained-piece exercise, not a general French spelling evaluator. No platform change was made to normalize hyphens or internal commas. Owner review should decide whether future free-entry practice must accept both orthographies.

### Payment clarification

Reuse exactly: `fr.restaurant.bank-card`, `fr.shopping.refund`, `fr.shopping.proof-of-purchase`, `fr.work.verifier`.

New: `fr.administration.bank-statement`, `fr.administration.account-transaction`, `fr.administration.charged-twice`, `fr.administration.payment-amount`.

The receipt target is the clear existing `un ticket de caisse`, not the broader/ambiguous `un ticket` alias. Card, refund and check retain their complete canonical entries. New `un relevé bancaire` and `une opération` support one statement-checking task, while `un montant` supplies the missing amount noun. Opération is explicitly an account transaction, not a medical operation or mathematical calculation. The dialogue uses a feminine speaker (`débitée`); the target note supplies masculine/feminine alternatives explicitly. `Je crois que` presents the possible duplicate charge as something to clarify: two statement lines are not asserted as proof of two completed charges.

Offline extension: use a fictional statement card with two lines, identify the amount and date, and ask for help checking them. Optional follow-up: ask for information about a refund or point to a receipt. Model: **« Bonjour, je crois que j’ai été débité deux fois. Je vois deux opérations de trente et un euros, vendredi. Voici mon ticket de caisse. Vous pouvez vérifier, s’il vous plaît ? »** / “Hello, I think I have been charged twice. I can see two transactions for thirty-one euros, on Friday. Here is my till receipt. Can you check, please?” Feminine speaker: **« Je crois que j’ai été débitée deux fois. »** Success: an understandable observation, amount/date, receipt reference and polite clarification request; no need to negotiate, assert a right, describe a bank process, or resolve a dispute.

Review question: the fixed passive past formula is useful but grammatically heavier than the other A2 items. Keep it as an optional model-supported chunk; independent extended complaint, remedy negotiation and financial/legal procedure are outside this bounded lesson. No entitlement, processing deadline, bank policy or cause of a failure was researched or asserted.

### Practical written message

Reuse exactly: `fr.education.absent`, `fr.health.empechement`, `fr.leisure.reporter`, `fr.health.disponible`, `fr.opinions.because`.

New: `fr.digital.write-to-explain`, `fr.digital.polite-possible-request`, `fr.digital.email-closing`.

Five known senses are deliberately recycled into a writing task. The three new formulas supply purpose, a polite request and a neutral email closing. This is not an absence/appointment list counted as new vocabulary. `Reporter` moves an appointment later; cancellation is a different action. `Un empêchement` supplies an optional general reason when private details are unnecessary. The original full message and response are bilingual in the runtime dialogue; they are fictional examples, not messages sent to anyone.

Offline extension: write a four-to-six-line message to a teacher moving Thursday’s appointment to Friday. Give one short reason, propose a time, and close. Model: **« Bonjour Madame, je vous écris pour reporter notre rendez-vous. Je serai absente jeudi parce que je dois travailler. Serait-il possible de venir vendredi à dix heures ? Cordialement, Alex Martin. »** / “Hello Madam, I am writing to you to postpone our appointment. I will be absent on Thursday because I have to work. Would it be possible to come on Friday at ten o’clock? Kind regards, Alex Martin.” Masculine speaker: **« Je serai absent. »** Success: purpose, reason, usable alternative day/time, consistent vous register and a closing. A reader should understand the requested change without inferring missing appointment details.

Review question: future `serai` and conditional `serait-il possible` are taught as practical formulas, not claimed as fully mastered grammar. Review the salutation/closing for the intended recipient; cordialement fits a neutral email, while a familiar SMS may use a different closing.

## Sources and evidence limits

- Directly inspected repository sources: `packages/domain/src/content.ts`, the complete current runtime vocabulary inventory through `packages/content/src/index.ts` and its canonicalization, `packages/content/src/build-topic.ts`, and `packages/domain/tests/topics.test.ts` / `greetings.test.ts` / `editor.test.ts`. These support compatibility, canonical reuse and validation requirements, not independent French-language authority.
- Internal authoring instructions: `docs/CONTENT_GUIDE.md`, `PROJECT_PLAN.md` sections 4–7, `.agents/skills/sll-author-french/SKILL.md`, and the research skill’s curriculum framework/source rules. Seed clusters were treated as unreviewed planning, not a course to copy or runtime payloads to import.
- No external page was directly browsed by the bridge author. Live Council of Europe/FLE source comparisons are owned by the primary research agent and recorded in `docs/curriculum/sources.json`, including reported source IDs `tv5-pain`, `tv5-colours`, `academie-numbers`, `coe-companion` and `larousse-debiter`; these notes do not fabricate retrieval dates, word-level dictionary checks, or independently verified publisher sequences. Level estimates, target selection, examples and placement remain editorial decisions requiring owner review.
- The primary agent reported inspecting [TV5MONDE — Grammaire / Avoir mal](https://apprendre.tv5monde.com/fr/aides/grammaire-avoir-mal) for the A1 au/à la/aux pattern and Council of Europe Companion Volume descriptors for routine A2 transactions and short messages. That source report informs scope; the bridge author did not independently retrieve those pages. It does not establish that every target is an official A1/A2 lexical requirement.

## Validation actually performed

`node --import tsx .tmp/bridge-author-drafts.mjs` passed after authoring corrections:

- All six candidates pass the existing runtime `lessonSchema`; each contains 6–10 entries, bilingual examples and dialogue, optional English grammar, a meaning activity, sentence activity and provenance.
- All 722 existing canonical entries were compared for exact normalized target collisions; each reused ID retains its full serialized payload. No new target duplicates an existing canonical target under the repository search normalization. Manual inventory review distinguishes the near-overlapping body/action chunks, compositional numbers and gender-specific family senses described above.
- Lesson IDs are new and unique. Existing canonical entries with candidate IDs are reused rather than overwritten. All new IDs follow the existing parent-bank prefix.
- Meaning choices reference lesson entries and have distinct normalized meanings. Each lesson’s full target set is unique under the repository search normalization, including all eight payment targets. All exercise answers are constructible from exactly the supplied tokens, using the existing prefix-pruned solver pattern plus exhaustive permutation comparison for every listed answer. Case and equivalent-apostrophe acceptance pass. The single explicitly supported almost-answer in the ear exercise returns `almost`.
- All vocabulary entries fit the actual notebook-entry schema/limits.
- Initial validation caught unbuildable internal comma and number-hyphen variants; accepted answers were corrected to match the actual fixed-piece contract. No runtime normalizer was changed. The traditional number spelling remains the only form constructible from its exercise pieces, with the valid alternate spelling disclosed in study notes.

`npm.cmd run check` also passed (repository tooling and TypeScript), and `git diff --check` passed. These checks do not activate or preview the candidate lessons. The temporary script is reproducible authoring/validation support under `.tmp`, not a committed feature or a production import tool. Independent review, combined validation after other agents’ changes, and source-ledger validation remain owned by the primary agent and must be reported from actual results. Browser preview, media/audio quality, native-speaker review, owner approval and publication were not performed by this author. Schema and solvability checks cannot establish naturalness, communicative success or comprehensive CEFR coverage.
