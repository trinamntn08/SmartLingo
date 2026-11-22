# French A1–A2 curriculum research and review pack

Navigation: [current course catalogue](../COURSE_CATALOGUE.md) · [authoring and publication guide](../CONTENT_GUIDE.md) · [review-pack overview](README.md).

Prepared 2026-11-16 for English-speaking adult newcomers to France. Original AI-assisted editorial work using the repository French curriculum researcher and French authoring skills. **All proposals remain drafts.** The French runtime still ships 25 banks / 123 lessons; this pack does not publish or register candidates.

Scope checked 2026-11-22: this pack's ledger, fingerprints, counts and proposed progression concern French only. The shared learner also includes Japanese: 13 banks / 65 short lessons, a separate 13-day draft course and 20 basic-kana row lessons. Start with [the current catalogue](../COURSE_CATALOGUE.md), [Japanese course sources](japanese-course-sources.md), [shared lessons](japanese-shared-lessons.md), [topic vocabulary](japanese-topic-vocabulary.md) and [alphabet sources](japanese-alphabet-sources.md). Their selected B1 task labels do not make this French review pack a B1 course or establish CEFR/JLPT completeness.

Start with [the per-topic review](topic-review.md), then [the structured progression](topic-progression.json). The latter covers every current French lesson, two or more coherent lexical subclusters per bank, A1/A2 outcomes, a communicative task with French/English model and success criteria, planned transfer/revision, gaps and B1/B2 extensions. Every vocabulary reference resolves to the [canonical ledger](vocabulary-ledger.json), which contains its full current French, English meaning, example/translation, gender where supplied, notes and all lesson occurrences. This avoids maintaining another divergent copy of each study card.

[Six bridge lessons](bridge-lessons.json) and [their teaching notes](bridge-notes.md) address selected gaps. [Five corrected existing-lesson candidates](refined-lessons.json) fix confirmed grammar-support defects while preserving all other fields and IDs. The change records give exact before/after text. These are complete runtime `Lesson` objects inside review envelopes; the progression and ledger are research manifests, **not** the skill's optional research-topic schema or app import files.

## Architecture findings and conversion boundary

Reviewed [the architecture](../ARCHITECTURE.md), [domain content contract](../../packages/domain/src/content.ts), [topic builder](../../packages/content/src/build-topic.ts), [bundle assembly](../../packages/content/src/index.ts), [canonical reuse](../../packages/content/src/shared-vocabulary.ts), [course ordering](../../packages/content/src/course-sequence.ts), [revision persistence](../../apps/api/src/repository.ts), [editor constraints](../CONTENT_GUIDE.md) and [recognition scheduling](../../packages/domain/src/review.ts).

| Boundary | Finding and consequence for this pack |
| --- | --- |
| Content versus domain | `lessonSchema` is authoritative. Runtime permits foundation/A1/A2/B1 (B1 is used by Japanese task drafts), 6–10 target items, bilingual support, dialogue, grammar and matching/sentence activities. Planning metadata stays outside this contract. |
| Sense versus topic | A stable vocabulary ID owns one exact support payload. Aliases are explicit; the builder replaces shared entries with canonical support. Use lesson dialogue for contextual reuse. Changing a shared card requires coordinated review of every occurrence. |
| Ordering versus learning path | The app now consumes bank ordering, beginning with greetings. It does not consume this pack's two-pass route, prerequisites, transfer tasks or B1/B2 goals. Prerequisites are support guidance, not access locks. |
| Draft versus publication | SQLite keeps immutable revisions. New drafts do not replace publications; exact seed baselines protect owner edits. These files never open an owner database or modify baseline hashes. |
| Candidate versus editor command | The editor supports existing headings/support/grammar/dialogue edits, not arbitrary new targets/lesson creation. Bridge JSON needs deliberate bundled-content integration and tests; it cannot be posted as an import. Existing grammar corrections can be entered through the editor, using the actual latest revision, saved preview and explicit publication. |
| Learning record versus coverage | Notebook entries and revision-scoped learning events remain intact. A teaching-concept link in research does not merge IDs, rewrite saved cards or award review success. |
| Ordinary lesson versus AI/media | These candidates need no provider call. All use honest text-supported meaning matching. Images, recorded listening and audio quality need separate review; no media coverage is invented. |

No boundary change, storage migration, runtime level extension, dependency addition or new importer is needed for research. A later integration should preserve the architecture rather than adding research fields to production `Lesson` objects. Rebase correction candidates against actual current heads; `revision + 1` here refers only to the bundled baseline and cannot override an owner-edited head.

## French inventory and deduplication

The ledger fingerprints **the full payload** of all 123 current French lessons, including dialogues, grammar and activities. It also verifies identical support for every repeated canonical ID. French inventory: 765 appearances, 722 canonical IDs, 713 exact written forms. Counts are content measures, not acquired vocabulary or proficiency.

Forty-three appearances already reuse an existing ID. One additional same-sense pair is explicitly linked for teaching: `fr.routine.petit-dejeuner` (le petit déjeuner) and `fr.accommodation.breakfast` (un petit déjeuner). The research route therefore counts **721 provisional teaching concepts and 44 recycled appearances**, preserving both historical IDs and their exact examples. This is conservative editorial deduplication, not a claim that all semantic overlap has been eliminated.

Nine same-form groups have recorded decisions in the ledger: après, une place, jusqu’à, un guichet, un horaire, ça me va, ouvrir, manquer and une expérience. Some are distinct meanings; others transfer a familiar word into a new context. Keep their IDs and explain the relationship rather than inflate novel-root counts or merge on spelling alone. Retain accents and sense distinctions; case/apostrophe normalization is for comparison, not a French-correction algorithm.

Related formulas are intentional support: je ne comprends pas / je n’ai pas compris contrast present and completed misunderstanding; lentement / plus lentement contrast manner and a request for slower speech. Un ticket / un ticket de caisse overlap as receipt language but have different specificity; teach the connection. Synonyms and grammatical chunks must be recorded as alternatives or transfer, not automatically deleted. Do not collapse distinct tasks merely to maximise unique-word totals.

The [historical all-word review](../CURRICULUM_TOPIC_AUDIT.md) remains useful for its original 741 appearances. Its recommendations are not all confirmed errors, and its statements that bonsoir/opening greetings are absent are now historical. The current pack includes the three new greeting lessons and checks all 765 appearances. It does not silently replace the old audit's evidence or fingerprints.

## Comparison with CEFR and FLE material

All successful accesses recorded in [the source ledger](sources.json) occurred on 2026-11-16. Source claims below are paraphrases; all examples, tasks and the proposed route are original editorial choices.

| Reference actually inspected | Comparison and curriculum consequence |
| --- | --- |
| [Council of Europe global scale](https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale) | Separate supported basic exchanges from routine autonomy. Topic labels describe estimated task demands, never official word levels or a completed CEFR course. |
| [CEFR Companion volume, selected scales](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4) | Printed pp. 77–78 distinguish simple requests/transactions from effective complaints and negotiation. Keep A2 payment/repair tasks predictable and scaffolded; put disputes and negotiated remedies in B1/B2. Printed pp. 82–84 support short practical messages. |
| [Eaquals/CIEP inventory, introduction and A1/A2 summaries](https://www.eaquals.org/wp-content/uploads/Inventaire_ONLINE_full.pdf) | Printed pp. 56–58 connect functions, grammar and everyday themes. Simple invitations/appointments and some past formulas can appear early; A2 increases reasons, sequencing and comparison. A full job-interview example is placed at B1, so SmartLingo A2 job search stays a short supported exchange. |
| [TV5MONDE Première classe](https://apprendre.tv5monde.com/fr/exercices/premiere-classe) | Daily-life pathways support family/origins, housing, meals, work, health and travel. SmartLingo covers those domains but needs transfer beyond matching and sentence assembly. |
| [Hachette Cosmopolite 1 contents](https://hachettefle.pl/wp-content/uploads/2022/07/Cosmopolite_1_spis_tresci.pdf) | Early spelling/identity/numbers support keeping a genuine beginner entrance. Alphabet/letter-name and listening practice remain gaps despite existing épeler formulas. |
| [Hachette Cosmopolite 2 contents](https://hachettefle.pl/wp-content/uploads/2022/07/Cosmopolite_2_spis_tresci.pdf) | Tasks connect travel, accommodation, paperwork, work experience and practical instructions. SmartLingo should revisit these with a reason, an alternative or a short past account. Do not copy the course's full sequence or assume its harder grammar is required for every A2 task. |
| [CLE beginner A1](https://progressive.cle-international.com/9782090398489) and [intermediate A2/B1](https://progressive.cle-international.com/9782090398571) public resource labels | Communicative contexts reinforce role-play and recurring daily-life themes. The mixed intermediate label cautions against treating an entire course as A2. Underlying audio and proprietary exercises were not inspected or imported. |

[Council of Europe language-specific descriptions](https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions) distinguish general competence scales from French-specific inventories. Neither these checks nor a level tag certifies coverage. The inaccessible FEI advice page, Didier A2 companion and CLE business product/companion pages are recorded as unavailable and excluded from evidence. For banking, the [FIPF/DramaFLE A2 activity overview](https://bop.fipf.org/2015-06-30-14-06-26/) and Eaquals' selected simple-bank-exchange passage (printed p. 19) provide two independent FLE references for a bounded information task. The new charge-clarification vocabulary and difficulty remain editorial choices supported by the CEFR routine-transaction scale and dictionary usage, without a claim to verified textbook banking inventories. No complete textbook inventory, course dialogue or exercise has been reproduced.

Specific draft usage checks: [TV5MONDE pain patterns](https://apprendre.tv5monde.com/fr/aides/grammaire-avoir-mal), [TV5MONDE colour pairs](https://apprendre.tv5monde.com/fr/aides/vocabulaire-les-meubles-et-les-couleurs-0), [Académie number spelling](https://www.academie-francaise.fr/questions-de-langue), and [Larousse banking débiter](https://www.larousse.fr/dictionnaires/francais/d%C3%A9biter/21816). These support bounded linguistic claims, not all words in a bank, medical advice or financial/legal procedures.

## Reconcile the 32 unreviewed seed areas

Seeds remain planning candidates. “Present” below means relevant existing tasks, not an exhaustive lexical match. Do not import the 481 seed rows or replace stable runtime IDs with seed IDs. Each row maps to the current topic plan; the broader historical 30-area reorganisation is still optional.

| Seed area | Current teaching home and refinement |
| --- | --- |
| A1 greetings | Greetings; current opening present, register/leave-taking transfer throughout. |
| A1 identity | People; origin/name present, contact details currently dispersed through services/digital. |
| A1 numbers/dates | Numbers + Calendar; all weekdays/months and basic sequence present, compound-price bridge supplied. |
| A1 family | People; close-family bridge supplies core relatives/partners. |
| A1 daily routine | Routine; action chunks present, add schedule transfer. |
| A1 time/appointments | Routine + Calendar + Health; confirm a date/time before A2 changes. |
| A1 home/rooms | Housing; rooms/furniture present, keep basic description separate from rental conditions. |
| A1 neighbourhood | Directions; services/landmarks and short route present. |
| A1 transport | Transport; tickets/destination present, retain receptive timetable practice gap. |
| A1 bakery | Bakery; complete purchase present, collection-name formula remains a candidate. |
| A1 groceries | Groceries; food/quantity/checkout present, transfer with a short shopping list. |
| A1 restaurant | Restaurant; requests/bill present, bound allergy tasks as language only. |
| A1 clothing | Shopping; colour bridge expands two current colours. |
| A1 weather | Leisure; weather/seasons mixed with activities, use distinct subclusters. |
| A1 basic health | Health; body-location bridge extends existing head/stomach/back. |
| A1 leisure | Leisure; activity/taste language present, add an invitation transfer. |
| A2 rental | Housing; basic rent/charges/agreement questions present, full rental negotiation is future work. |
| A2 home problems | Housing + Accommodation; predictable not-working/missing reports present, diagnosis/repair commitments excluded. |
| A2 job search | Jobsearch; supported experience/availability examples present, spontaneous full interview belongs later. |
| A2 workplace | Work + Education + Digital; schedule/task/clarification present, add reason/alternative. |
| A2 medical appointments | Health + Calendar; appointment changes/duration present, no eligibility or treatment claims. |
| A2 medicine/instructions | Health pharmacy; partial only. No complete dosage/notice-comprehension lesson; requires separate careful authoring with fictional labels, no treatment recommendations. |
| A2 banking/payments | No dedicated bank; bounded payment-clarification bridge under Administration. Accounts/transfers/direct debits remain gaps. |
| A2 administration | Administration; forms/attachments/deadlines present, eligibility/procedure facts need separate live checks. |
| A2 travel booking | Transport + Accommodation; date/room/check-in present, add option comparison. |
| A2 disruptions | Transport; delay/cancellation/alternative present, autonomous complex complaints deferred. |
| A2 cooking | Cooking + Groceries; preparation verbs and sequence present, add a complete fictional recipe task. |
| A2 social plans | Social + Leisure; invite/change/confirm present, retain simple A1 versions. |
| A2 past experiences | Past; short sequencing present, transfer requires connected production and listening. |
| A2 opinions/choices | Opinions; simple comparison/reasons present, sustained argumentation deferred. |
| A2 customer service | Shopping + Groceries + Restaurant; predictable issue report present, dispute resolution B1/B2. |
| A2 education | Education; courses/goals present, basic classroom/attendance language can be supported earlier. |

## Progressive revision and communicative practice

Use the plan as a **recommended two-pass route**: first the current foundation/A1 lessons in topic order; then the A2 lessons with earlier support available. This prevents an early bank's A2 lessons from being a barrier to the next bank's basics. Learners can revisit a relevant A2 task earlier once its support is comfortable. The ledger's `new` / `recycled` and `recycledFrom` labels describe that proposed route, not today's source order or an individual's knowledge.

| Revisit | Activity and evidence |
| --- | --- |
| Same session | Read meanings/examples directly; identify a useful chunk; use it in the scripted dialogue and matching/sentence task. Mark this as supported practice. |
| Next study session | Retrieve 3–5 saved items, then change one detail (person, quantity, time, place). Show a model after an attempt if desired; accept help without treating it as independent success. |
| About 3 and 7 days | Mix a few earlier-topic items with the current task: greeting + price, spelling + registration, calendar + invitation. Complete a short role-play with a clear outcome. |
| About 14 and 30 days | Transfer to a different setting and add an A2 demand: explain a delay, suggest another time, compare two options or recount a recent event. Revisit sooner if recall needs help. |

These are editorial review prompts, not empirically calibrated optimal intervals. The app's existing **manually rated notebook recognition** scheduler uses 1/3/7/14/30 calendar-day intervals after eligible independent successes, resets after help/forgotten and stores events. It does not schedule this complete curriculum, assess listening/production, run the new role-plays or infer CEFR attainment. New transfer tasks can be done on paper or with a partner without AI; automated task assessment would be a separate feature.

For each communicative task, check whether the learner conveyed the requested information and responded appropriately, recording support separately. A model answer is an example, not the only acceptable wording. Role-play prompts can use fictional details; no personal disclosure is required. Keep English study support visible and speaking optional.

## Grammar and skill coverage still needing work

A1 support is present for questions/negation, articles/gender, present verbs, polite modal chunks, number/date/time expressions, locations, partitives and reflexive routines. A2 introduces useful past/future formulas, sequencing, duration, comparisons and reasons. Examples do not establish systematic acquisition: build a focused diagnostic/checklist before claiming full grammar coverage. Explicit letter names/sound contrasts, time/price listening, reading signs/timetables/menus, short forms/messages, agreement choices, present/past contrasts and pronoun reference need planned practice beyond word matching.

The review pack adds a writing model but the existing runtime activity contract has no free-writing assessment or document-reading exercise. It cannot validate real-world listening merely by playing synthetic speech beside a transcript. Native-teacher/owner linguistic review, listening-media suitability, pronunciation, accessibility/device checks and learner trials remain outstanding. Medical/banking/administrative scenarios teach language only.

For B1/B2, preserve existing topic slugs as parents, canonical sense IDs and separate extension goals in each plan record. B1 develops connected accounts, explanations and less predictable problems; B2 adds nuanced viewpoints, trade-offs and negotiation. Further French grammar/assessment/media and B1/B2 curriculum require deliberate product work. This pack adds no B1/B2 runtime records, empty lesson stubs or speculative storage fields. The shared runtime already permits B1 for selected Japanese task drafts; it has no B2 lesson level.

## Validation and review

Run from repository root:

```text
node --import tsx scripts/verify-curriculum-review.mjs --self-test
node --import tsx scripts/verify-curriculum-topic-audit.mjs
npm.cmd run check
node --import tsx --test packages/domain/tests/topics.test.ts packages/domain/tests/examples.test.ts packages/domain/tests/greetings.test.ts packages/domain/tests/learning.test.ts packages/domain/tests/review.test.ts
```

The new validator checks all current French full-payload fingerprints/canonical support; topic/lesson coverage, bands, prerequisites, vocabulary references, tasks and future goals; six new runtime-schema drafts; five precisely bounded correction candidates; all candidate accepted sentence paths and matching choices; notebook field limits; draft state and encoding. Existing lessons require at least one buildable sentence: legacy accepted spelling variants such as sœur/soeur can share one fixed token spelling. Eight negative fixtures exercise invalid references/prerequisites, missing coverage, stale fingerprints, unsolvable sentences, changed canonical support, unrecorded edits and accidental publication.

The ledger can be regenerated deliberately with `--refresh-inventory` after reviewing catalogue changes. That option updates only the derived ledger and does not bless changed content. Source date/structure validation is not an online recheck. Structural tests cannot establish natural French, pedagogical effectiveness or complete CEFR coverage. Final executed results and independent review are recorded in [the session checkpoint](../SESSION_CHECKPOINT.md).
