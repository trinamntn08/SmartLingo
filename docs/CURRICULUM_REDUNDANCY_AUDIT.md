# Vocabulary overlap and useful-gap audit — draft

Audit date: 2026-11-15 (Europe/Paris). Original AI-assisted editorial review for English-speaking adult newcomers to France. All recommendations and replacement text are **drafts for owner review**. No publication, native-speaker review, certified CEFR coverage, exhaustive frequency study or learner trial is claimed.

## Scope and result

Reviewed the vocabulary inventory of all **24 banks / 120 lessons / 741 appearances**, the canonical alias table, the nine identical-written-form groups, and task-level overlap across the full catalogue. Inspected dialogue/exercise dependencies for the three replacement lessons and two sense clarifications. This is a complete inventory/coherence audit, not dictionary verification of every word or an exhaustive linguistic review of all 120 dialogues.

The strongest avoidable overlap is concentrated in three lessons. Replace **16 slots**, retaining **un jour** and **fonctionner**. Keep the older senses in their specialist banks and preserve their canonical IDs. Two additional support-only clarifications make the two **horaire** entries teach transport service times versus working hours. No recommendation silently deletes existing notebook/history data.

The exact WordDraft tuples, old/new ID mappings, three full ShortLessonDraft recommendations and two complete support clarifications are in [the original replacement brief](curriculum-review-replacements.json). That file is a review artifact, not an API import or an approved lesson pack.

| Measure | Audited baseline | Projected after the 16 replacements |
| --- | ---: | ---: |
| Banks / lessons | 24 / 120 | 24 / 120 |
| Vocabulary appearances | 741 | 741 |
| Distinct canonical entry IDs | 689 | 705 |
| Distinct exact written targets | 680 | 696 |
| Canonical IDs appearing in multiple lessons | 48 | 33 |
| Additional appearances beyond first occurrence | 52 | 36 |
| Identical written forms assigned different IDs | 9 | 9 |

These are identifier/string counts, not a psycholinguistic count of known words. Formula/verb pairs, morphology and related senses remain separate teaching entries where useful. Exact-form grouping uses the existing NFC text, preserving accents and articles; it does not strip **un/une/le/la**, verb complements or polarity and then pretend the result proves redundancy.

## Concrete replacement list

All affected introduction slots are in `packages/content/src/topics/daily-life.ts`. Retain the historical lesson IDs even though their titles change. Use new sense IDs for new meanings; never repurpose `fr.routine.zero` to mean “wake up”. The brief supplies target, English meaning, original French example, faithful English example, note and applicable gender for every replacement.

| Historical lesson / old entry ID | Proposed new entry ID | New French — English | Why this slot |
| --- | --- | --- | --- |
| `fr.routine.small-numbers` / `fr.routine.zero` | `fr.routine.wake-up` | se réveiller — to wake up | Numbers now supplies zero; waking up is missing and differs from getting out of bed. |
| same / `fr.routine.deux` | `fr.routine.get-dressed` | s’habiller — to get dressed | Numbers supplies two; a usable morning action. |
| same / `fr.routine.trois` | `fr.routine.brush-teeth` | se brosser les dents — to brush one’s teeth | Numbers supplies three; practical body-part/reflexive chunk. |
| same / `fr.routine.quatre` | `fr.routine.hurry` | se dépêcher — to hurry | Numbers supplies four; explains getting ready under time pressure. |
| same / `fr.routine.cinq` | `fr.routine.ready` | être prêt — to be ready | Numbers supplies five; short usable readiness phrase. |
| same / `fr.routine.dix` | `fr.routine.on-time` | à l’heure — on time | Numbers supplies ten; contrasts with existing en retard. |
| `fr.routine.calendar` / `fr.routine.aujourdhui` | `fr.routine.every-day` | tous les jours — every day | Dates supplies today; introduces frequency for routine. |
| same / `fr.routine.semaine` | `fr.routine.weekdays` | en semaine — on weekdays | Dates retains the noun week; adds a useful time phrase. |
| same / `fr.routine.lundi` | `fr.routine.weekend` | le week-end — at the weekend / on weekends | Dates supplies Monday; adds habitual weekend contrast. |
| same / `fr.routine.samedi` | `fr.routine.early` | tôt — early | Dates supplies Saturday; an important missing timing adverb. |
| same / `fr.routine.date` | `fr.routine.late` | tard — late / late in the day | Dates supplies date; distinguish late in the day from en retard. |
| `fr.administration.internet` / `fr.administration.connexion` | `fr.administration.procedure` | une démarche (f.) — an administrative procedure / step | Digital retains connection; paperwork needs its task noun. |
| same / `fr.administration.mot-de-passe` | `fr.administration.attestation` | une attestation (f.) — a certificate / written confirmation | Digital and Accommodation retain password; paperwork needs a common document type. |
| same / `fr.administration.reseau` | `fr.administration.submit-file` | déposer un dossier — to submit an application file | Digital retains network; adds the action beyond naming dossier. |
| same / `fr.administration.se-connecter` | `fr.administration.deadline` | une date limite (f.) — a deadline / final date | Digital retains log in; distinguishes a cutoff date from a délai. |
| same / `fr.administration.piece-jointe` | `fr.administration.acknowledgement` | un accusé de réception (m.) — an acknowledgement of receipt | Digital retains attachment; receipt is a useful next step after submission. |

The morning lesson becomes **Get ready and leave on time** (estimated A1), the calendar lesson becomes **Describe when you usually do things** (estimated A1), and the internet lesson becomes **Ask how to submit an application** (estimated A2). Each still has six entries. The two retained entries keep their original serialized payloads in the draft. Register is familiar **tu** between friends in routine dialogues and neutral/polite **vous** at the service desk. These level estimates are editorial choices.

The administrative dialogue is a fictional service exchange. “For this procedure” bounds the offered reception-desk route; it does not assert that every procedure can be submitted there. An acknowledgement confirms receipt, not approval. No generic processing deadlines, eligibility rules or legal advice are taught. **Accusé de réception** is a longer A2 recognition chunk; owner review should assess whether it needs extra scaffolding.

## Stable IDs, dialogues, exercises and revisions

The primary integration design preserves the **16 exact old canonical Vocabulary payloads** in a separate shared-entry source and resolves existing aliases to those stable IDs. Their surviving Numbers, Calendar, Digital and Accommodation appearances must retain their current content. Do not let alias resolution replace a canonical old example with a different donor example accidentally. This audit did not edit runtime source files.

Expected content changes are the three full replacement lessons plus `fr.transport.understand-a-journey` and `fr.work.organise-work` for horaire support. Keep the three historical sentence activity IDs. New accepted answers belong to the new revision; existing accepted answers remain in historical immutable revisions. The calendar replacement explicitly accepts **Je me lève tard le week-end.** and **Le week-end je me lève tard.**, both constructible from the supplied unpunctuated pieces. The two other replacement sentences have one supported answer each; no arbitrary paraphrase is marked correct when the pieces cannot construct it.

Rebuild the three meaning activities against their new vocabulary IDs. Do not retain `entryId` or choice references to removed lesson slots. Matching remains text-supported unless reviewed media is separately attached. Existing illustrations bind both stable ID and target: new senses must never inherit an old number/network drawing because they occupy the same array position.

Bump runtime revisions only for actual changed payloads, expected **revision 3 → 4 for the five affected lessons**, and append exact prior-revision fingerprints. Compare the full catalogue before/after; preserved donor entries should not cause unrelated lesson revisions. Preserve historical revision-1/2 fingerprints and owner-edited/newer draft/publication safeguards; update their intended seed successor only through the existing migration design. No old revision, unapproved owner draft, publication, personal edit or event should be rewritten. Final application/seed migration verification belongs to the primary integration, not this report.

## Identical written forms with multiple IDs: nine groups

| Form | Exact IDs | Decision |
| --- | --- | --- |
| ça me va | `fr.shopping.fits-me`; `fr.social.suits-me` | Keep: clothing fit/suitability versus accepting a plan. Explicit notes already distinguish context. |
| ouvrir | `fr.housing.open`; `fr.digital.open` | Keep: physical opening versus opening a file/app. Classroom opening reuses the physical sense. |
| un guichet | `fr.transport.ticket-counter`; `fr.administration.guichet` | Keep contextual IDs: ticket counter versus general service counter. These are related, not separate unrelated lemmas. |
| un horaire | `fr.transport.timetable`; `fr.work.horaire` | Clarify both support fields, keep IDs and targets. Current “scheduled time” gloss overlaps too loosely with transport time. |
| manquer | `fr.administration.manquer`; `fr.past.miss` | Keep: something missing versus missing a service/event; different argument patterns. |
| après | `fr.routine.apres`; `fr.past.afterwards` | Keep: before a complement versus standalone sequence marker. Notes should retain this grammatical distinction. |
| une place | `fr.directions.square`; `fr.social.place` | Keep: town square versus an available spot for a person. |
| jusqu’à | `fr.directions.as-far-as`; `fr.accommodation.until` | Keep: spatial endpoint versus temporal endpoint. |
| une expérience | `fr.jobsearch.experience`; `fr.past.experience` | Keep: professional experience versus a lived event. Job-search gloss can be reviewed for count/mass interpretation, but IDs should not be merged casually. |

The Académie distinguishes timetable/service hours from the arrangement of working hours. The precise support drafts therefore give transport **“a service time / transport timetable”** with *Je vérifie les horaires des trains*, and work **“working hours / a work schedule”** with *Mon horaire de travail change lundi*. See the actual [dictionary entry](https://www.dictionnaire-academie.fr/article/A9H0926). These remain contextual teaching senses. The clearer work meaning overlaps naturally with **un emploi du temps** in Education; that is useful task-based recycling, not a reason to relabel either old ID.

## Twenty near-overlap classes considered

This is an editorial classification, not a fuzzy-string score or a claim that exactly twenty semantic relationships exist in French. The full target inventory below was scanned; these are the meaningful near-overlap decisions raised by it.

| Class and exact relevant IDs | Decision |
| --- | --- |
| merci / merci beaucoup: `fr.merci`, `fr.essentials.thank-you` | Keep short basic thanks and intensified thanks; use notes instead of treating both as wholly unrelated vocabulary. |
| lentement / plus lentement: `fr.people.lentement`, `fr.essentials.more-slowly` | Keep adverb and request for a slower pace; comparison is meaningful. |
| comprendre / present and past repair formulas: `fr.work.comprendre`, `fr.essentials.not-understand`, `fr.people.pas-compris`, `fr.essentials.understood` | Keep verb plus usable negative/affirmative/tensed chunks. |
| répéter / repair requests: `fr.health.repeter`, `fr.essentials.repeat-please`, `fr.essentials.again-please` | Keep verb and functional requests. Do not count every formula as a new lemma. |
| aider / aide / help request: `fr.work.aider`, `fr.administration.aide`, `fr.essentials.help-me` | Keep verb, noun and directly usable polite formula. |
| un peu / un peu de: `fr.people.un-peu`, `fr.cooking.a-little` | Keep standalone quantity versus quantity before a noun. |
| breakfast with article: `fr.routine.petit-dejeuner`, `fr.accommodation.breakfast` | Keep contextual cards: habitual meal **le** versus a hotel breakfast **un**. Related same-lemma/article variant; do not market as two unrelated new words. |
| receipt: `fr.restaurant.receipt`, `fr.shopping.proof-of-purchase` | Keep contextual short **un ticket** and explicit **un ticket de caisse**. Restaurant note should make receipt context visible; ticket alone has other senses. |
| reception: `fr.administration.accueil`, `fr.accommodation.reception` | Keep common labels used in different service environments. |
| depuis / pendant: `fr.health.depuis`, `fr.past.during` | Keep ongoing-to-now versus bounded duration; merging would teach the wrong tense relationship. |
| availability: `fr.health.disponible`, `fr.social.free`, `fr.jobsearch.disponibilite`, `fr.health.creneau` | Keep adjective, phrase, availability noun and bookable slot. Context changes task and construction. |
| annuler / déplacer / reporter: `fr.health.annuler`, `fr.health.deplacer`, `fr.leisure.reporter` | Keep cancel, move/reschedule and postpone; moving does not always mean later. |
| diplôme / qualification: `fr.jobsearch.diplome`, `fr.jobsearch.qualification` | Keep documented diploma versus broader professional qualification. Owner review should check whether both fit the six-item skills task naturally. |
| puis / ensuite: `fr.past.then`, `fr.routine.ensuite` | Keep two common sequence connectors; Past explicitly reuses ensuite. Near-synonyms alone are not padding. |
| avoir mal / douleur: `fr.health.mal`, `fr.health.douleur` | Keep a usable symptom construction and the noun pain; not duplicate cards. |
| avoir envie de / longer chunk: `fr.opinions.feel-like`, `fr.past.do-again` | Keep broad desire phrase and task-specific desire to repeat an experience. |
| une tranche / une part: `fr.bakery.slice`, `fr.bakery.portion` | Keep a thin slice of bread and a portion/slice of a dish; related but not freely interchangeable. |
| fit problems: `fr.shopping.too-small`, `fr.shopping.too-tight`, `fr.shopping.too-long` | Keep size, tightness and length: each explains a different practical problem. |
| positive/negative fit: `fr.shopping.fits-me`, `fr.shopping.does-not-fit` | Keep contrasting usable formulas, not a uniqueness target. |
| liking/choice: `fr.leisure.aimer`, `fr.opinions.love`, `fr.opinions.like-appeal`, `fr.opinions.prefer` | Keep intensity, different verb constructions and comparative preference. Likewise **meilleur/mieux** teach adjective/adverb, not redundant “better”. |

## Per-bank editorial decisions

Every bank retains five short lessons. The generated baseline table below quantifies all 24 banks. These decisions explain the overlap review independently of those counts.

| Bank | Coherence / gap decision |
| --- | --- |
| Restaurant | Keep menu/card versus set-menu distinction, meal stages, dietary needs and payment. Allergy/bring/interior reuse is useful. No defensible deletion. |
| Bakery | Keep bread/pastry/lunch/order task split. Tomorrow is useful in collection context; no reason to remove it merely for uniqueness. |
| Groceries | Keep product, quantity, aisle and payment clusters. Looking/checking verbs use canonical reuse. No forced synonym deletion. |
| Clothes and shopping | Keep size versus shoe size and distinct fit problems. Refund, exchange and return action are complementary. |
| Home and housing | Keep room/building/rental/repair tasks; live/open reuse is marked. A deposit/guarantor extension could be useful later, with separate research. |
| Transport | Keep mode/ticket/connection/disruption tasks. Clarify horaire as service times. Mode versus taking that mode is useful noun/chunk scaffolding. |
| Health and appointments | Keep symptom nouns and phrase constructions. Tomorrow/availability/cancel/confirm are needed in appointments; no treatment instructions introduced. |
| Work and study | Keep workplace learning as a specific task despite Education. Clarify working-hours sense. Desk/office dual meaning could benefit from future contextual examples, not deletion. |
| Services and paperwork | Replace the five general connection entries in Internet with submission/document/receipt language; keep fonctionner. Other desk/contact/post/form tasks are coherent. |
| People and introductions | Keep family and repair language even where Essentials teaches chunks. Mother/father/partner are potential future gaps, not substitutes for useful siblings/friend/neighbor by fiat. |
| Time and daily routine | Replace six digit slots and five calendar slots. Keep un jour and add morning readiness plus habitual timing; Numbers/Dates now own the detailed introductory tasks. |
| Leisure and weather | Keep the invitation lesson as a short A2 task bringing activity/weather language together. Its overlap with Social is intentional, but do not count the repeated senses as new. |
| Essential conversation tools | Keep polite formulas, grammar frames and verb chunks. Related forms are productive beginner tools; no removal for lexical similarity alone. |
| Numbers and quantities | Keep the systematic number sequence. The routine lesson is the weaker duplicate location. Not all integers are listed; the bank teaches a sequence and building patterns rather than claiming exhaustive numeracy. |
| Dates and availability | Keep weekdays/months/nearby days; the routine calendar lesson is the weaker duplicate location. Today/tomorrow reuse also remains useful in real transactions. |
| Finding your way on foot | Keep landmarks, positions, turns and walking-distance tasks; mairie/poste/rue reuse is authentic task support. |
| Cooking | No cross-bank canonical repeats. Related wash/clean and cut/peel actions are distinguishable. No artificial uniqueness change. |
| Accommodation | Keep booking/arrival/room-help/check-out. Password reuse is essential; meal article and room-type compounds carry context. |
| Education and learning | Keep classroom/attendance/homework/progress; reused ouvrir and prévenir do not make these tasks redundant. |
| Finding a job | Keep application/skills/interview/follow-up. Professional experience and availability are contextual senses; keep original IDs and explicit notes. |
| Phone and digital communication | Keep six connection/file/email/call tasks as the specialist home for network/password/login language. General paperwork should not repeat nearly the same connection task. |
| Invitations and shared plans | Twelve canonical senses recycle other banks, but sub-tasks develop bringing food, joining, declining, arranging and changing. Keep this deeper social interaction bank; useful repetition is disclosed. |
| Talking about recent experiences | Keep sequence connectors recycled from routine; past narration is a harder task. Event-experience and miss-service senses need their explicit English. |
| Preferences and simple comparisons | Keep opinion markers, contrastive comparison forms and reasons. Better adjective/adverb distinction is necessary; no arbitrary synonym cut. |

Further useful gaps considered but **not drafted for this change**: basic family parents/partner, a few emergency-help phrases, housing deposit/guarantor language, pharmacy frequency/dosage comprehension, and banking/account tasks. These require their own bounded lesson outcomes and source review; they are not a reason to inflate the present banks or imply legal/medical instruction. No complete A1/A2 coverage claim follows from the inventory.

## Evidence actually inspected and rights

All accesses below occurred on **2026-11-15**. Sources support usage or the broad competence/context frame; they do not license copying courses or prescribe this exact vocabulary list. All proposed examples, English notes, dialogues and sentence tasks are newly composed editorial text. No photos/audio/source exercises were downloaded or reused during this audit. Source websites retain their own rights.

| Source | Evidence and limits |
| --- | --- |
| [Council of Europe global scale](https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale) | A1 familiar concrete exchanges and A2 simple routine exchanges support the chosen outcomes. Does not certify the words or lessons. |
| [TV5MONDE daily-life exercise overview](https://apprendre.tv5monde.com/fr/exercices/a1-debutant/nous-parlons-de-notre-quotidien) and [daily-life catalogue](https://apprendre.tv5monde.com/fr/vocab/la-vie-quotidienne) | Independent FLE context: daily-life/moments-of-day material at beginner level. Overview inspected; no exercise content or recording copied. |
| [CLE beginner vocabulary resource page](https://progressive.cle-international.com/9782090398489) | Second independent FLE scope check: adult beginner communication includes invitation, getting lost, encounters and recipes. Public resource labels only; not proof of a specific word level or access to full book text. |
| [Académie: horaire](https://www.dictionnaire-academie.fr/article/A9H0926) | Masculine noun, timetable/service-hours and organisation-of-working-hours uses; supports keeping and clarifying both contextual IDs. |
| [CNRTL/TLFi: réveiller](https://www.cnrtl.fr/definition/r%C3%A9veiller) | Pronominal use means leaving sleep; supports distinguishing waking up from se lever. No source example reproduced. |
| [CNRTL/TLFi: attestation](https://www.cnrtl.fr/definition/attestation) | Feminine noun and written confirmation/document use. Does not identify one mandatory administrative form. |
| [CNRTL/TLFi: démarche](https://www.cnrtl.fr/definition/d%C3%A9marche) | Feminine noun with action/toward-a-goal use; practical administrative sense is contextual. |
| [Service Public: requests by mail/internet](https://www.service-public.gouv.fr/particuliers/vosdroits/F33312) and [paper requests](https://www.service-public.gouv.fr/particuliers/vosdroits/F2547) | Actual official usage of dossier, attestation and accusé de réception, including receipt acknowledgement in electronic requests. Used for language/context, not to teach universal procedures, timing or approval rules. |

The following lexical checks map the sixteen new senses to precise inspected primary dictionary pages. They support meanings/constructions, not a certified A1/A2 assignment. The illustrations and original example sentences from those pages were not imported.

| New target | Specific usage evidence |
| --- | --- |
| se réveiller | [CNRTL/TLFi réveiller](https://www.cnrtl.fr/definition/r%C3%A9veiller): pronominal leaving sleep, distinct from getting up. |
| s’habiller | [CNRTL/TLFi habiller](https://www.cnrtl.fr/definition/habiller), pronominal section: putting on clothes; the h is mute. |
| se brosser les dents | [CNRTL/TLFi brosser](https://www.cnrtl.fr/definition/brosser): the tooth-brushing collocation and reflexive pronoun with a definite body-part article. |
| se dépêcher | [Académie dépêcher, ninth edition](https://www.dictionnaire-academie.fr/article/A9D1457?history=0): pronominal hurrying. The attempted CNRTL page returned no readable content and is not evidence. |
| être prêt | [CNRTL/TLFi prêt, adjective](https://www.cnrtl.fr/definition/pr%C3%AAt/adjectif): readiness and prêt à plus infinitive; adjective agrees in gender. The noun prêt is a different entry. |
| à l’heure | [CNRTL/TLFi heure](https://www.cnrtl.fr/definition/heure), agreed/fixed-time section: punctuality. Other senses such as hourly payment do not apply here. |
| tous les jours | [CNRTL/TLFi jour](https://www.cnrtl.fr/definition/jour), repeated/distributive time section: daily frequency. |
| en semaine | [CNRTL/TLFi semaine](https://www.cnrtl.fr/definition/semaine): usual working-week period; the draft avoids assuming everyone has identical working days. |
| le week-end | [CNRTL/TLFi week-end](https://www.cnrtl.fr/definition/week-end): masculine weekend noun; its habitual article in the draft is an editorial grammar application. |
| tôt | [CNRTL/TLFi tôt, adverb](https://www.cnrtl.fr/definition/t%C3%B4t/adverbe): early timing; the unrelated noun entry is not used. |
| tard | [CNRTL/TLFi tard, adverb](https://www.cnrtl.fr/definition/tard/adverbe): advanced point in the day, including getting up/going to bed late; distinguishes the draft's time sense from missing an expected arrival. |
| une démarche | [CNRTL/TLFi démarche](https://www.cnrtl.fr/definition/d%C3%A9marche) and [Service Public electronic requests](https://www.service-public.gouv.fr/particuliers/vosdroits/F33312): feminine action/step noun and administrative context. |
| une attestation | [CNRTL/TLFi attestation](https://www.cnrtl.fr/definition/attestation): feminine written confirmation/document sense. |
| déposer un dossier | [Académie déposer](https://www.dictionnaire-academie.fr/article/A9D1558): submitting a request/file to the relevant service. No universal desk/online route inferred. |
| une date limite | [CNRTL/TLFi limite](https://www.cnrtl.fr/definition/limite): temporal cutoff and date-limite combination; “deadline” is the draft's English contextual gloss. |
| un accusé de réception | [Académie accusé](https://www.dictionnaire-academie.fr/article/A9A0344) and [Service Public electronic requests](https://www.service-public.gouv.fr/particuliers/vosdroits/F33312): acknowledgement of receipt, including electronic administrative use; receipt does not establish approval. |

## Validation performed and unresolved review

Performed a runtime import of all 120 baseline lessons and computed exact entry/form/canonical reuse groups; inspected every target/meaning in the inventory and all alias mappings. The appended inventory is generated from the primary's pre-integration JSON snapshot, so it remains an audit baseline even if runtime source later changes. Checked the original three lesson payloads and both horaire entries against the replacement brief.

Parsed the JSON brief; built the three candidates **in memory** through the existing `buildTopic`; validated all 120 projected lesson objects with `lessonSchema`; checked 16 old IDs exist, 16 new IDs are absent from baseline, six entries remain in each changed lesson, the two retained entries serialize identically, and **all four accepted answer strings across the three exercises** can be constructed from their supplied pieces. Computed the projected counts above. These checks passed. One initial retained-object comparison failed only because the JSON snapshot omits an optional `gender: undefined` property; the corrected comparison checks serialized persisted payloads and passes. No French-content correction was hidden by that adjustment.

Manual language checks covered articles/gender in the new noun targets, reflexive pronouns, prêt/prête, late-time versus late-arrival notes, tu/vous consistency, and French/English correspondence of all new examples/dialogues. These are agent editorial checks, not native-speaker or teacher validation. Unresolved owner review: naturalness and scaffolding of the longer administrative receipt chunk, suitability of the morning dialogue, appropriate pace of the two A1 tasks and fictional desk exchange. No independent human review, learner observation, listening/voice evaluation or photo-rights validation occurred here.

This audit did not run the full application suite, `npm run check`, browser preview or API migration checks; the primary agent owns final combined verification. No paid calls, real `.env` reads, source edits, publication or commits were performed by this audit agent. Available account allowance was not exposed to this agent; no balance or reset is inferred.

## Baseline inventory appendix

The following tables are generated from the pre-integration baseline. Counts and recommendation labels refer to that baseline, not a claim that the replacement brief was published.

### All 24 banks: measured baseline

| Bank | Lessons | Appearances / within-bank IDs | IDs also found in other banks |
| --- | ---: | ---: | ---: |
| Restaurant | 5 | 34 / 34 | 5 |
| Bakery | 5 | 30 / 30 | 3 |
| Groceries | 5 | 34 / 34 | 2 |
| Clothes and shopping | 5 | 33 / 33 | 1 |
| Home and housing | 5 | 35 / 35 | 2 |
| Transport | 5 | 35 / 35 | 1 |
| Health and appointments | 5 | 30 / 30 | 5 |
| Work and study | 5 | 30 / 30 | 3 |
| Services and paperwork | 5 | 30 / 30 | 10 |
| People and introductions | 5 | 30 / 30 | 2 |
| Time and daily routine | 5 | 30 / 30 | 13 |
| Leisure and weather | 5 | 30 / 30 | 9 |
| Essential conversation tools | 5 | 30 / 30 | 3 |
| Numbers and quantities | 5 | 30 / 30 | 6 |
| Dates and availability | 5 | 30 / 30 | 7 |
| Finding your way on foot | 5 | 30 / 30 | 3 |
| Cooking | 5 | 30 / 30 | 0 |
| Accommodation | 5 | 30 / 30 | 1 |
| Education and learning | 5 | 30 / 30 | 2 |
| Finding a job | 5 | 30 / 30 | 1 |
| Phone and digital communication | 5 | 30 / 30 | 7 |
| Invitations and shared plans | 5 | 30 / 30 | 12 |
| Talking about recent experiences | 5 | 30 / 30 | 2 |
| Preferences and simple comparisons | 5 | 30 / 30 | 0 |

### All 48 same-canonical-ID repeat groups

A group marked Replace loses only the selected routine/admin appearance; the original sense survives elsewhere. Password still has two useful appearances after its administrative slot is replaced. All other listed groups remain deliberate cross-task recycling.

| Canonical ID / French | All baseline lesson appearances | Decision |
| --- | --- | --- |
| `fr.bonjour` ? bonjour | `fr.restaurant.customer`; `fr.bakery.customer`; `fr.people.first-meeting` | Keep task-based recycling |
| `fr.silvousplait` ? s’il vous plaît | `fr.restaurant.customer`; `fr.bakery.customer`; `fr.essentials.polite-help` | Keep task-based recycling |
| `fr.restaurant.inside` ? à l’intérieur | `fr.restaurant.find-a-table`; `fr.leisure.change-plans` | Keep task-based recycling |
| `fr.restaurant.allergy` ? une allergie | `fr.restaurant.explain-food-needs`; `fr.health.pharmacy` | Keep task-based recycling |
| `fr.restaurant.bring` ? apporter | `fr.restaurant.finish-the-meal`; `fr.social.invite` | Keep task-based recycling |
| `fr.bakery.tomorrow` ? demain | `fr.bakery.order-for-later`; `fr.health.appointment`; `fr.calendar.nearby-days` | Keep task-based recycling |
| `fr.groceries.look-for` ? chercher | `fr.groceries.find-products`; `fr.shopping.everyday-clothes` | Keep task-based recycling |
| `fr.work.verifier` ? vérifier | `fr.groceries.check-before-paying`; `fr.work.clarify-request` | Keep task-based recycling |
| `fr.people.habiter` ? habiter | `fr.housing.rooms-at-home`; `fr.people.where-from` | Keep task-based recycling |
| `fr.housing.open` ? ouvrir | `fr.housing.arrive-at-a-building`; `fr.education.class-actions` | Keep task-based recycling |
| `fr.transport.bicycle` ? un vélo | `fr.transport.choose-transport`; `fr.leisure.sport` | Keep task-based recycling |
| `fr.health.disponible` ? disponible | `fr.health.appointment`; `fr.calendar.dates-and-slots` | Keep task-based recycling |
| `fr.health.annuler` ? annuler | `fr.health.change-appointment`; `fr.social.change-plan` | Keep task-based recycling |
| `fr.health.confirmer` ? confirmer | `fr.health.change-appointment`; `fr.social.change-plan` | Keep task-based recycling |
| `fr.work.envoyer` ? envoyer | `fr.work.simple-tasks`; `fr.digital.messages` | Keep task-based recycling |
| `fr.work.ensemble` ? ensemble | `fr.work.clarify-request`; `fr.social.organise` | Keep task-based recycling |
| `fr.administration.mairie` ? une mairie | `fr.administration.reception`; `fr.directions.local-places` | Keep task-based recycling |
| `fr.administration.rue` ? une rue | `fr.administration.contact-details`; `fr.directions.street-landmarks` | Keep task-based recycling |
| `fr.administration.epeler` ? épeler | `fr.administration.contact-details`; `fr.essentials.clarify` | Keep task-based recycling |
| `fr.administration.adresse-mail` ? une adresse mail | `fr.administration.contact-details`; `fr.digital.email-address` | Keep task-based recycling |
| `fr.administration.poste` ? un bureau de poste | `fr.administration.post`; `fr.directions.local-places` | Keep task-based recycling |
| `fr.administration.connexion` ? une connexion | `fr.administration.internet`; `fr.digital.connection` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.administration.mot-de-passe` ? un mot de passe | `fr.administration.internet`; `fr.accommodation.settle-into-your-room`; `fr.digital.connection` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.administration.reseau` ? un réseau | `fr.administration.internet`; `fr.digital.connection` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.administration.se-connecter` ? se connecter | `fr.administration.internet`; `fr.digital.connection` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.administration.piece-jointe` ? une pièce jointe | `fr.administration.internet`; `fr.digital.files` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.zero` ? zéro | `fr.routine.small-numbers`; `fr.numbers.zero-five` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.deux` ? deux | `fr.routine.small-numbers`; `fr.numbers.zero-five` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.trois` ? trois | `fr.routine.small-numbers`; `fr.numbers.zero-five` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.quatre` ? quatre | `fr.routine.small-numbers`; `fr.numbers.zero-five` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.cinq` ? cinq | `fr.routine.small-numbers`; `fr.numbers.zero-five` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.dix` ? dix | `fr.routine.small-numbers`; `fr.numbers.six-eleven` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.aujourdhui` ? aujourd’hui | `fr.routine.calendar`; `fr.calendar.nearby-days` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.semaine` ? une semaine | `fr.routine.calendar`; `fr.calendar.nearby-days` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.lundi` ? lundi | `fr.routine.calendar`; `fr.calendar.working-week` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.samedi` ? samedi | `fr.routine.calendar`; `fr.calendar.nearby-days` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.date` ? une date | `fr.routine.calendar`; `fr.calendar.dates-and-slots` | Replace selected introduction slot; preserve canonical sense elsewhere |
| `fr.routine.d-abord` ? d’abord | `fr.routine.sequence`; `fr.past.sequence` | Keep task-based recycling |
| `fr.routine.ensuite` ? ensuite | `fr.routine.sequence`; `fr.past.sequence` | Keep task-based recycling |
| `fr.leisure.inviter` ? inviter | `fr.leisure.invitations`; `fr.social.invite` | Keep task-based recycling |
| `fr.leisure.ca-te-dit` ? ça te dit ? | `fr.leisure.invitations`; `fr.social.invite` | Keep task-based recycling |
| `fr.leisure.avec-plaisir` ? avec plaisir | `fr.leisure.invitations`; `fr.social.join-plan` | Keep task-based recycling |
| `fr.leisure.une-autre-fois` ? une autre fois | `fr.leisure.invitations`; `fr.social.decline` | Keep task-based recycling |
| `fr.leisure.occupe` ? occupé | `fr.leisure.invitations`; `fr.social.decline` | Keep task-based recycling |
| `fr.leisure.plutot` ? plutôt | `fr.leisure.invitations`; `fr.social.change-plan` | Keep task-based recycling |
| `fr.leisure.reporter` ? reporter | `fr.leisure.change-plans`; `fr.social.change-plan` | Keep task-based recycling |
| `fr.essentials.example` ? un exemple | `fr.essentials.clarify`; `fr.jobsearch.interview` | Keep task-based recycling |
| `fr.education.prevenir` ? prévenir | `fr.education.attendance`; `fr.social.organise` | Keep task-based recycling |

### All 120 lessons and 741 vocabulary appearances

Each entry below is the baseline runtime canonical ID, French target and directly visible English meaning. Canonical definitions may be sourced from a different bank through `shared-vocabulary.ts`; the file shown owns the lesson. This full list supports the claim that the audit covered all banks rather than a sample.

#### fr.restaurant.customer ? Order a coffee and ask for the bill

Estimated A1; revision 3; source `packages/content/src/index.ts`.

- `fr.bonjour` ? bonjour ? hello / good morning
- `fr.cafe` ? un café ? a coffee (usually an espresso)
- `fr.eau` ? de l’eau ? some water
- `fr.carte` ? la carte ? the menu
- `fr.addition` ? l’addition ? the bill
- `fr.silvousplait` ? s’il vous plaît ? please

#### fr.bakery.customer ? Your morning at the bakery

Estimated A1; revision 3; source `packages/content/src/index.ts`.

- `fr.bonjour` ? bonjour ? hello / good morning
- `fr.baguette` ? une baguette ? a baguette
- `fr.croissant` ? un croissant ? a croissant
- `fr.sac` ? un sac ? a bag
- `fr.silvousplait` ? s’il vous plaît ? please
- `fr.merci` ? merci ? thank you

#### fr.restaurant.find-a-table ? Find a table

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.restaurant.table` ? une table ? a table
- `fr.restaurant.book-table` ? réserver une table ? to book a table
- `fr.restaurant.reservation` ? une réservation ? a reservation
- `fr.restaurant.terrace` ? une terrasse ? an outdoor seating area
- `fr.restaurant.for-two` ? pour deux ? for two people
- `fr.restaurant.inside` ? à l’intérieur ? inside
- `fr.restaurant.person` ? une personne ? a person

#### fr.restaurant.choose-a-meal ? Choose a meal

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.restaurant.starter` ? une entrée ? a starter
- `fr.restaurant.main-course` ? un plat ? a main course
- `fr.restaurant.dessert` ? un dessert ? a dessert
- `fr.restaurant.set-menu` ? un menu ? a set meal
- `fr.restaurant.ill-have` ? je prends ? I’ll have; I’ll take
- `fr.restaurant.vegetarian` ? végétarien ? vegetarian
- `fr.restaurant.chicken` ? du poulet ? some chicken

#### fr.restaurant.explain-food-needs ? Explain food needs

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.restaurant.allergy` ? une allergie ? an allergy
- `fr.restaurant.egg` ? un œuf ? an egg
- `fr.restaurant.contain` ? contenir ? to contain
- `fr.restaurant.sauce` ? une sauce ? a sauce
- `fr.restaurant.without` ? sans ? without
- `fr.restaurant.on-the-side` ? à part ? separately; on the side
- `fr.restaurant.milk` ? du lait ? some milk

#### fr.restaurant.finish-the-meal ? Finish the meal

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.restaurant.fork` ? une fourchette ? a fork
- `fr.restaurant.bring` ? apporter ? to bring
- `fr.restaurant.napkin` ? une serviette ? a napkin
- `fr.restaurant.bank-card` ? une carte bancaire ? a bank card
- `fr.restaurant.separately` ? séparément ? separately
- `fr.restaurant.receipt` ? un ticket ? a receipt
- `fr.restaurant.knife` ? un couteau ? a knife

#### fr.bakery.choose-bread ? Choose your bread

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.bakery.country-loaf` ? un pain de campagne ? a country-style loaf
- `fr.bakery.wholemeal-bread` ? du pain complet ? some wholemeal bread
- `fr.bakery.which-bread` ? quel pain ? which bread
- `fr.bakery.slice` ? une tranche ? a slice
- `fr.bakery.sliced` ? tranché ? sliced
- `fr.bakery.well-baked` ? bien cuit ? well baked

#### fr.bakery.choose-a-treat ? Choose a sweet treat

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.bakery.pain-au-chocolat` ? un pain au chocolat ? a chocolate-filled pastry
- `fr.bakery.brioche` ? une brioche ? a brioche
- `fr.bakery.apple-turnover` ? un chausson aux pommes ? an apple turnover
- `fr.bakery.tartlet` ? une tartelette ? a small individual tart
- `fr.bakery.anything-else` ? et avec ça ? ? anything else?
- `fr.bakery.two-of-them` ? j’en prends deux ? I’ll have two of them

#### fr.bakery.buy-lunch ? Buy lunch to take away

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.bakery.sandwich` ? un sandwich ? a sandwich
- `fr.bakery.quiche` ? une quiche ? a savoury egg tart
- `fr.bakery.portion` ? une part ? a portion; a slice
- `fr.bakery.lunch-deal` ? une formule ? a set lunch deal
- `fr.bakery.take-away` ? à emporter ? to take away
- `fr.bakery.heat-up` ? réchauffer ? to heat up

#### fr.bakery.order-for-later ? Order for later

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.bakery.cake` ? un gâteau ? a cake
- `fr.bakery.order` ? une commande ? an order
- `fr.bakery.order-in-advance` ? commander ? to order
- `fr.bakery.collect` ? venir chercher ? to come and collect
- `fr.bakery.tomorrow` ? demain ? tomorrow
- `fr.bakery.sold-out` ? il n’y en a plus ? there are none left

#### fr.groceries.fruit-and-vegetables ? Buy fruit and vegetables

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.groceries.apple` ? une pomme ? an apple
- `fr.groceries.need` ? il me faut ? I need
- `fr.groceries.tomato` ? une tomate ? a tomato
- `fr.groceries.carrot` ? une carotte ? a carrot
- `fr.groceries.potato` ? une pomme de terre ? a potato
- `fr.groceries.kilogram` ? un kilo ? a kilogram
- `fr.groceries.banana` ? une banane ? a banana

#### fr.groceries.fill-the-cupboard ? Fill the cupboard

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.groceries.rice` ? du riz ? some rice
- `fr.groceries.pasta` ? des pâtes ? some pasta
- `fr.groceries.flour` ? de la farine ? some flour
- `fr.groceries.buy` ? acheter ? to buy
- `fr.groceries.oil` ? de l’huile ? some oil
- `fr.groceries.packet` ? un paquet ? a packet
- `fr.groceries.sugar` ? du sucre ? some sugar

#### fr.groceries.chilled-foods ? Choose chilled foods

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.groceries.butter` ? du beurre ? some butter
- `fr.groceries.cheese` ? du fromage ? some cheese
- `fr.groceries.yogurt` ? un yaourt ? a yogurt
- `fr.groceries.how-much-cost` ? combien ça coûte ? ? how much does it cost?
- `fr.groceries.ham` ? du jambon ? some ham
- `fr.groceries.price` ? un prix ? a price
- `fr.groceries.cream` ? de la crème ? some cream

#### fr.groceries.find-products ? Find products in a shop

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.groceries.aisle-section` ? un rayon ? a shop section
- `fr.groceries.checkout` ? une caisse ? a checkout
- `fr.groceries.basket` ? un panier ? a shopping basket
- `fr.groceries.look-for` ? chercher ? to look for
- `fr.groceries.frozen-foods` ? les surgelés ? frozen foods
- `fr.groceries.at-the-back` ? au fond ? at the back
- `fr.groceries.trolley` ? un chariot ? a shopping trolley

#### fr.groceries.check-before-paying ? Check before paying

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.groceries.label` ? une étiquette ? a label
- `fr.groceries.promotion` ? une promotion ? a special offer
- `fr.work.verifier` ? vérifier ? to check
- `fr.groceries.change` ? la monnaie ? the change from a payment
- `fr.groceries.cash` ? en espèces ? in cash
- `fr.groceries.price-error` ? il y a une erreur ? there is a mistake

#### fr.shopping.everyday-clothes ? Find everyday clothes

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.shopping.trousers` ? un pantalon ? a pair of trousers
- `fr.shopping.shirt` ? une chemise ? a shirt
- `fr.shopping.t-shirt` ? un tee-shirt ? a T-shirt
- `fr.shopping.dress` ? une robe ? a dress
- `fr.shopping.jumper` ? un pull ? a jumper; a sweater
- `fr.groceries.look-for` ? chercher ? to look for
- `fr.shopping.coat` ? un manteau ? a coat

#### fr.shopping.shoes-and-accessories ? Shoes and accessories

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.shopping.shoes` ? des chaussures ? a pair of shoes; some shoes
- `fr.shopping.trainers` ? des baskets ? trainers; sneakers
- `fr.shopping.socks` ? des chaussettes ? some socks
- `fr.shopping.scarf` ? une écharpe ? a scarf
- `fr.shopping.belt` ? une ceinture ? a belt
- `fr.shopping.wear` ? porter ? to wear
- `fr.shopping.hat` ? un chapeau ? a hat

#### fr.shopping.sizes-and-colours ? Ask about size and colour

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.shopping.clothing-size` ? une taille ? a clothing size
- `fr.shopping.shoe-size` ? une pointure ? a shoe size
- `fr.shopping.another-colour` ? dans une autre couleur ? in another colour
- `fr.shopping.black` ? noir ? black
- `fr.shopping.blue` ? bleu ? blue
- `fr.shopping.too-small` ? trop petit ? too small
- `fr.shopping.colour` ? une couleur ? a colour

#### fr.shopping.try-before-buying ? Try before buying

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.shopping.fitting-room` ? une cabine d’essayage ? a fitting room
- `fr.shopping.try-on` ? essayer ? to try on
- `fr.shopping.jacket` ? une veste ? a jacket
- `fr.shopping.too-tight` ? trop serré ? too tight
- `fr.shopping.too-long` ? trop long ? too long
- `fr.shopping.fits-me` ? ça me va ? it fits me; it suits me

#### fr.shopping.return-an-item ? Ask about a return

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.shopping.exchange` ? un échange ? an exchange
- `fr.shopping.refund` ? un remboursement ? a refund
- `fr.shopping.proof-of-purchase` ? un ticket de caisse ? a till receipt
- `fr.shopping.defect` ? un défaut ? a defect
- `fr.shopping.return-item` ? rapporter ? to bring back
- `fr.shopping.does-not-fit` ? ça ne me va pas ? it does not fit me; it does not suit me

#### fr.housing.rooms-at-home ? Rooms at home

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.housing.apartment` ? un appartement ? a flat; an apartment
- `fr.housing.kitchen` ? une cuisine ? a kitchen
- `fr.housing.bedroom` ? une chambre ? a bedroom
- `fr.people.habiter` ? habiter ? to live / reside
- `fr.housing.bathroom` ? une salle de bains ? a bathroom
- `fr.housing.toilet` ? les toilettes ? the toilet; the toilets
- `fr.housing.living-room` ? un salon ? a living room

#### fr.housing.furniture-and-essentials ? Set up a furnished home

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.housing.bed` ? un lit ? a bed
- `fr.housing.chair` ? une chaise ? a chair
- `fr.housing.sofa` ? un canapé ? a sofa
- `fr.housing.put` ? mettre ? to put
- `fr.housing.fridge` ? un réfrigérateur ? a refrigerator
- `fr.housing.washing-machine` ? un lave-linge ? a washing machine
- `fr.housing.wardrobe` ? une armoire ? a wardrobe

#### fr.housing.arrive-at-a-building ? Arrive at a building

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.housing.key` ? une clé ? a key
- `fr.housing.door` ? une porte ? a door
- `fr.housing.floor` ? un étage ? a floor; a storey
- `fr.housing.lift` ? un ascenseur ? a lift; an elevator
- `fr.housing.open` ? ouvrir ? to open
- `fr.housing.ground-floor` ? le rez-de-chaussée ? the ground floor
- `fr.housing.stairs` ? un escalier ? a staircase

#### fr.housing.ask-about-a-rental ? Ask about a rental

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.housing.rent` ? un loyer ? rent; a rent payment
- `fr.housing.service-charges` ? les charges ? service charges
- `fr.housing.tenancy-agreement` ? un bail ? a tenancy agreement
- `fr.housing.landlord` ? le propriétaire ? the landlord; the owner
- `fr.housing.move-in` ? emménager ? to move in
- `fr.housing.furnished` ? meublé ? furnished
- `fr.housing.tenant` ? un locataire ? a tenant

#### fr.housing.report-a-home-problem ? Report a home problem

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.housing.heating` ? le chauffage ? the heating
- `fr.housing.leak` ? une fuite ? a leak
- `fr.housing.tap` ? un robinet ? a tap; a faucet
- `fr.housing.window` ? une fenêtre ? a window
- `fr.housing.arrange-visit` ? faire venir quelqu’un ? to arrange for someone to come
- `fr.housing.not-working` ? en panne ? out of order; broken down
- `fr.housing.repair` ? une réparation ? a repair

#### fr.transport.choose-transport ? Choose how to travel

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.transport.bus` ? un bus ? a bus
- `fr.transport.metro` ? le métro ? the metro; the underground
- `fr.transport.take-bus` ? prendre le bus ? to take the bus
- `fr.transport.train` ? un train ? a train
- `fr.transport.bicycle` ? un vélo ? a bicycle
- `fr.transport.on-foot` ? à pied ? on foot
- `fr.transport.tram` ? un tramway ? a tram

#### fr.transport.find-your-stop ? Find your stop

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.transport.stop` ? un arrêt ? a bus or tram stop
- `fr.transport.get-on` ? monter dans ? to get on; to board
- `fr.transport.railway-station` ? une gare ? a railway station
- `fr.transport.platform` ? un quai ? a platform
- `fr.transport.line` ? une ligne ? a transport line
- `fr.transport.towards` ? direction ? towards; in the direction of
- `fr.transport.metro-station` ? une station ? a metro station

#### fr.transport.buy-a-ticket ? Buy a ticket

Estimated A1; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.transport.rail-ticket` ? un billet ? a ticket for a journey
- `fr.transport.single` ? un aller simple ? a single ticket; a one-way journey
- `fr.transport.return` ? un aller-retour ? a return ticket; a round trip
- `fr.transport.ticket-machine` ? un distributeur ? a ticket machine
- `fr.transport.buy-ticket` ? acheter un billet ? to buy a ticket
- `fr.transport.validate` ? valider ? to validate a travel ticket or pass
- `fr.transport.ticket-counter` ? un guichet ? a ticket counter

#### fr.transport.understand-a-journey ? Understand a journey

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.transport.departure` ? un départ ? a departure
- `fr.transport.arrival` ? une arrivée ? an arrival
- `fr.transport.connection` ? une correspondance ? a connection; a change of service
- `fr.transport.direct` ? direct ? direct; without a change
- `fr.transport.change-trains` ? changer de train ? to change trains
- `fr.transport.get-off` ? descendre ? to get off
- `fr.transport.timetable` ? un horaire ? a departure or arrival time

#### fr.transport.handle-disruption ? Handle a travel disruption

Estimated A2; revision 3; source `packages/content/src/topics/food-home.ts`.

- `fr.transport.delay` ? un retard ? a delay
- `fr.transport.cancelled` ? annulé ? cancelled
- `fr.transport.replacement-bus` ? un car de remplacement ? a replacement coach or bus
- `fr.transport.how-long` ? dans combien de temps ? ? how long from now?
- `fr.transport.next-service` ? le prochain ? the next one
- `fr.transport.another-route` ? un autre itinéraire ? another route
- `fr.transport.information` ? un renseignement ? a piece of information

#### fr.health.appointment ? Ask for a health appointment

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.health.rendez-vous` ? un rendez-vous ? an appointment
- `fr.health.medecin` ? un médecin ? a doctor
- `fr.health.disponible` ? disponible ? available
- `fr.bakery.tomorrow` ? demain ? tomorrow
- `fr.health.matin` ? le matin ? the morning
- `fr.health.prendre-rendez-vous` ? prendre rendez-vous ? to make an appointment

#### fr.health.symptoms ? Say how you feel

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.health.mal` ? avoir mal ? to be in pain / to hurt
- `fr.health.tete` ? la tête ? the head
- `fr.health.ventre` ? le ventre ? the stomach / tummy area
- `fr.health.dos` ? le dos ? the back
- `fr.health.fievre` ? la fièvre ? a fever
- `fr.health.fatigue` ? fatigué ? tired

#### fr.health.pharmacy ? Speak at a pharmacy

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.health.pharmacie` ? une pharmacie ? a pharmacy
- `fr.health.ordonnance` ? une ordonnance ? a prescription
- `fr.health.medicament` ? un médicament ? a medicine / medication
- `fr.restaurant.allergy` ? une allergie ? an allergy
- `fr.health.notice` ? une notice ? an instruction leaflet
- `fr.health.expliquer` ? expliquer ? to explain

#### fr.health.consultation ? Describe a symptom over time

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.health.depuis` ? depuis ? since / for, continuing to now
- `fr.health.tousser` ? tousser ? to cough
- `fr.health.douleur` ? une douleur ? a pain
- `fr.health.commencer` ? commencer ? to start
- `fr.health.souvent` ? souvent ? often
- `fr.health.repeter` ? répéter ? to repeat

#### fr.health.change-appointment ? Change an appointment

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.health.annuler` ? annuler ? to cancel
- `fr.health.deplacer` ? déplacer ? to reschedule / move
- `fr.health.empechement` ? un empêchement ? a conflicting commitment / something preventing attendance
- `fr.health.creneau` ? un créneau ? a time slot
- `fr.health.confirmer` ? confirmer ? to confirm
- `fr.health.en-retard` ? en retard ? late / running late

#### fr.work.workplace ? Find your way at work

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.work.travail` ? le travail ? work
- `fr.work.bureau` ? un bureau ? an office / a desk
- `fr.work.collegue` ? un collègue ? a colleague
- `fr.work.equipe` ? une équipe ? a team
- `fr.work.responsable` ? la responsable ? the person in charge (woman)
- `fr.work.salle` ? une salle ? a room

#### fr.work.study ? Join French training at work

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.work.cours` ? un cours ? a class / lesson
- `fr.work.professeur` ? une professeure ? a teacher (woman)
- `fr.work.cahier` ? un cahier ? a notebook
- `fr.work.stylo` ? un stylo ? a pen
- `fr.work.exercice` ? un exercice ? an exercise / practice task
- `fr.work.apprendre` ? apprendre ? to learn

#### fr.work.simple-tasks ? Ask for help with a task

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.work.aider` ? aider ? to help
- `fr.work.document` ? un document ? a document
- `fr.work.envoyer` ? envoyer ? to send
- `fr.work.imprimer` ? imprimer ? to print
- `fr.work.ordinateur` ? un ordinateur ? a computer
- `fr.work.comprendre` ? comprendre ? to understand

#### fr.work.organise-work ? Organise a working day

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.work.reunion` ? une réunion ? a meeting
- `fr.work.horaire` ? un horaire ? a scheduled time
- `fr.work.delai` ? un délai ? a time allowed / deadline period
- `fr.work.tache` ? une tâche ? a task
- `fr.work.terminer` ? terminer ? to finish
- `fr.work.urgent` ? urgent ? urgent

#### fr.work.clarify-request ? Clarify a work request

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.work.consigne` ? une consigne ? an instruction
- `fr.work.verifier` ? vérifier ? to check
- `fr.work.probleme` ? un problème ? a problem
- `fr.work.proposer` ? proposer ? to suggest / propose
- `fr.work.solution` ? une solution ? a solution
- `fr.work.ensemble` ? ensemble ? together

#### fr.administration.reception ? Ask at a service desk

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.administration.accueil` ? l’accueil ? reception / the reception area
- `fr.administration.mairie` ? une mairie ? a town hall
- `fr.administration.guichet` ? un guichet ? a service counter
- `fr.administration.formulaire` ? un formulaire ? a form
- `fr.administration.aide` ? une aide ? help / assistance
- `fr.administration.attendre` ? attendre ? to wait

#### fr.administration.contact-details ? Give contact details

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.administration.adresse` ? une adresse ? an address
- `fr.administration.rue` ? une rue ? a street
- `fr.administration.code-postal` ? un code postal ? a postcode
- `fr.administration.epeler` ? épeler ? to spell out
- `fr.administration.numero` ? un numéro ? a number / identifying number
- `fr.administration.adresse-mail` ? une adresse mail ? an email address

#### fr.administration.post ? Send a letter

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.administration.poste` ? un bureau de poste ? a post office
- `fr.administration.lettre` ? une lettre ? a letter
- `fr.administration.timbre` ? un timbre ? a stamp
- `fr.administration.poster` ? poster ? to post / mail
- `fr.administration.colis` ? un colis ? a parcel
- `fr.administration.destinataire` ? le destinataire ? the recipient (man / unspecified)

#### fr.administration.internet ? Ask about an internet connection

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.administration.connexion` ? une connexion ? a connection
- `fr.administration.mot-de-passe` ? un mot de passe ? a password
- `fr.administration.reseau` ? un réseau ? a network
- `fr.administration.fonctionner` ? fonctionner ? to work / function
- `fr.administration.se-connecter` ? se connecter ? to connect / log in
- `fr.administration.piece-jointe` ? une pièce jointe ? an attachment

#### fr.administration.paperwork ? Check what a form asks for

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.administration.dossier` ? un dossier ? an application file / set of documents
- `fr.administration.justificatif` ? un justificatif ? a supporting document / proof
- `fr.administration.signature` ? une signature ? a signature
- `fr.administration.remplir` ? remplir ? to fill in / complete
- `fr.administration.manquer` ? manquer ? to be missing
- `fr.administration.copie` ? une copie ? a copy

#### fr.people.first-meeting ? Introduce yourself

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.bonjour` ? bonjour ? hello / good morning
- `fr.people.s-appeler` ? s’appeler ? to be called / have as a name
- `fr.people.prenom` ? un prénom ? a first name / given name
- `fr.people.nom-de-famille` ? un nom de famille ? a surname / family name
- `fr.people.enchante` ? enchanté ? pleased to meet you
- `fr.people.au-revoir` ? au revoir ? goodbye

#### fr.people.where-from ? Say where you are from

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.people.habiter` ? habiter ? to live / reside
- `fr.people.venir-de` ? venir de ? to come from
- `fr.people.ville` ? une ville ? a town / city
- `fr.people.pays` ? un pays ? a country
- `fr.people.langue` ? une langue ? a language
- `fr.people.parler` ? parler ? to speak

#### fr.people.family ? Introduce people close to you

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.people.ami` ? un ami ? a friend (man)
- `fr.people.voisine` ? une voisine ? a neighbour (woman)
- `fr.people.famille` ? une famille ? a family
- `fr.people.enfant` ? un enfant ? a child
- `fr.people.frere` ? un frère ? a brother
- `fr.people.soeur` ? une sœur ? a sister

#### fr.people.conversation ? Keep a first conversation going

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.people.lentement` ? lentement ? slowly
- `fr.people.un-peu` ? un peu ? a little
- `fr.people.pas-compris` ? je n’ai pas compris ? I did not understand
- `fr.people.question` ? une question ? a question
- `fr.people.reponse` ? une réponse ? an answer
- `fr.people.desole` ? désolé ? sorry

#### fr.people.settling-in ? Talk about settling in

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.people.quartier` ? un quartier ? a neighbourhood
- `fr.people.arriver` ? arriver ? to arrive
- `fr.people.connaitre` ? connaître ? to know / be familiar with
- `fr.people.rencontrer` ? rencontrer ? to meet
- `fr.people.nouveau` ? nouveau ? new
- `fr.people.bienvenue` ? bienvenue ? welcome

#### fr.routine.small-numbers ? Count people and short waits

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.routine.zero` ? zéro ? zero
- `fr.routine.deux` ? deux ? two
- `fr.routine.trois` ? trois ? three
- `fr.routine.quatre` ? quatre ? four
- `fr.routine.cinq` ? cinq ? five
- `fr.routine.dix` ? dix ? ten

#### fr.routine.clock ? Tell the time

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.routine.heure` ? une heure ? an hour / a clock time
- `fr.routine.minute` ? une minute ? a minute
- `fr.routine.midi` ? midi ? noon / twelve midday
- `fr.routine.minuit` ? minuit ? midnight
- `fr.routine.et-demie` ? et demie ? half past
- `fr.routine.soir` ? le soir ? the evening

#### fr.routine.calendar ? Use a simple calendar

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.routine.aujourdhui` ? aujourd’hui ? today
- `fr.routine.jour` ? un jour ? a day
- `fr.routine.semaine` ? une semaine ? a week
- `fr.routine.lundi` ? lundi ? Monday
- `fr.routine.samedi` ? samedi ? Saturday
- `fr.routine.date` ? une date ? a date / calendar date

#### fr.routine.daily-actions ? Describe an ordinary day

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.routine.se-lever` ? se lever ? to get up
- `fr.routine.se-doucher` ? se doucher ? to have a shower
- `fr.routine.petit-dejeuner` ? le petit déjeuner ? breakfast
- `fr.routine.partir` ? partir ? to leave / set off
- `fr.routine.rentrer` ? rentrer ? to come home / return
- `fr.routine.se-coucher` ? se coucher ? to go to bed

#### fr.routine.sequence ? Explain habits and plans

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.routine.d-abord` ? d’abord ? first / first of all
- `fr.routine.ensuite` ? ensuite ? then / next
- `fr.routine.avant` ? avant ? before
- `fr.routine.apres` ? après ? after
- `fr.routine.d-habitude` ? d’habitude ? usually / as a habit
- `fr.routine.parfois` ? parfois ? sometimes

#### fr.leisure.free-time ? Say what you like doing

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.leisure.aimer` ? aimer ? to like / love
- `fr.leisure.lire` ? lire ? to read
- `fr.leisure.musique` ? la musique ? music
- `fr.leisure.film` ? un film ? a film / movie
- `fr.leisure.jardiner` ? jardiner ? to garden
- `fr.leisure.dessiner` ? dessiner ? to draw

#### fr.leisure.weather ? Talk about the weather

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.leisure.beau` ? il fait beau ? the weather is nice
- `fr.leisure.chaud` ? il fait chaud ? it is hot (weather)
- `fr.leisure.froid` ? il fait froid ? it is cold (weather)
- `fr.leisure.pleuvoir` ? il pleut ? it is raining
- `fr.leisure.soleil` ? le soleil ? the sun / sunshine
- `fr.leisure.vent` ? le vent ? the wind

#### fr.leisure.sport ? Arrange a simple sports activity

Estimated A1; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.leisure.sport` ? le sport ? sport / exercise
- `fr.leisure.marcher` ? marcher ? to walk
- `fr.leisure.courir` ? courir ? to run
- `fr.leisure.nager` ? nager ? to swim
- `fr.transport.bicycle` ? un vélo ? a bicycle
- `fr.leisure.piscine` ? une piscine ? a swimming pool

#### fr.leisure.invitations ? Invite a friend and respond

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.leisure.inviter` ? inviter ? to invite
- `fr.leisure.ca-te-dit` ? ça te dit ? ? would you like to? / do you fancy it?
- `fr.leisure.avec-plaisir` ? avec plaisir ? with pleasure / gladly
- `fr.leisure.une-autre-fois` ? une autre fois ? another time
- `fr.leisure.occupe` ? occupé ? busy / occupied
- `fr.leisure.plutot` ? plutôt ? rather / instead

#### fr.leisure.change-plans ? Change a leisure plan

Estimated A2; revision 3; source `packages/content/src/topics/daily-life.ts`.

- `fr.leisure.si` ? si ? if
- `fr.leisure.prevoir` ? prévoir ? to plan / expect
- `fr.leisure.sortie` ? une sortie ? an outing
- `fr.leisure.musee` ? un musée ? a museum
- `fr.leisure.reporter` ? reporter ? to postpone / move to a later date
- `fr.restaurant.inside` ? à l’intérieur ? inside

#### fr.essentials.repair ? Ask someone to repeat

Estimated foundation; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.essentials.not-understand` ? je ne comprends pas ? I do not understand
- `fr.essentials.repeat-please` ? vous pouvez répéter ? ? can you repeat that?
- `fr.essentials.more-slowly` ? plus lentement ? more slowly
- `fr.essentials.again-please` ? encore une fois ? one more time
- `fr.essentials.what-means` ? ça veut dire quoi ? ? what does that mean?
- `fr.essentials.understood` ? j’ai compris ? I understood / I understand now

#### fr.essentials.polite-help ? Get attention and ask for help

Estimated foundation; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.essentials.excuse-me` ? excusez-moi ? excuse me
- `fr.essentials.help-me` ? vous pouvez m’aider ? ? can you help me?
- `fr.silvousplait` ? s’il vous plaît ? please
- `fr.essentials.thank-you` ? merci beaucoup ? thank you very much
- `fr.essentials.welcome-response` ? de rien ? you’re welcome
- `fr.essentials.one-moment` ? un instant ? one moment

#### fr.essentials.yes-and-no ? Say what you can and cannot do

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.essentials.yes` ? oui ? yes
- `fr.essentials.no` ? non ? no
- `fr.essentials.not-yet` ? pas encore ? not yet
- `fr.essentials.no-longer` ? ne… plus ? no longer / not anymore
- `fr.essentials.cannot` ? je ne peux pas ? I cannot
- `fr.essentials.dont-have` ? je n’ai pas de ? I do not have any / a

#### fr.essentials.simple-questions ? Ask a simple question

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.essentials.where` ? où ? ? where?
- `fr.essentials.when` ? quand ? ? when?
- `fr.essentials.how` ? comment ? ? how?
- `fr.essentials.which` ? quel / quelle ? ? which / what?
- `fr.essentials.question-frame` ? est-ce que… ? ? question starter
- `fr.essentials.may-i` ? est-ce que je peux… ? ? can I…?

#### fr.essentials.clarify ? Check a word or instruction

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.essentials.write-it` ? vous pouvez l’écrire ? ? can you write it down?
- `fr.administration.epeler` ? épeler ? to spell out
- `fr.essentials.show` ? montrer ? to show
- `fr.essentials.example` ? un exemple ? an example
- `fr.essentials.is-that-right` ? c’est bien ça ? ? is that right?
- `fr.essentials.in-french` ? en français ? in French

#### fr.numbers.zero-five ? Count from zero to five

Estimated foundation; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.routine.zero` ? zéro ? zero
- `fr.numbers.one` ? un / une ? one
- `fr.routine.deux` ? deux ? two
- `fr.routine.trois` ? trois ? three
- `fr.routine.quatre` ? quatre ? four
- `fr.routine.cinq` ? cinq ? five

#### fr.numbers.six-eleven ? Read a short number

Estimated foundation; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.numbers.six` ? six ? six
- `fr.numbers.seven` ? sept ? seven
- `fr.numbers.eight` ? huit ? eight
- `fr.numbers.nine` ? neuf ? nine
- `fr.routine.dix` ? dix ? ten
- `fr.numbers.eleven` ? onze ? eleven

#### fr.numbers.twelve-seventeen ? Understand twelve to seventeen

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.numbers.twelve` ? douze ? twelve
- `fr.numbers.thirteen` ? treize ? thirteen
- `fr.numbers.fourteen` ? quatorze ? fourteen
- `fr.numbers.fifteen` ? quinze ? fifteen
- `fr.numbers.sixteen` ? seize ? sixteen
- `fr.numbers.seventeen` ? dix-sept ? seventeen

#### fr.numbers.eighteen-fifty ? Count beyond the teens

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.numbers.eighteen` ? dix-huit ? eighteen
- `fr.numbers.nineteen` ? dix-neuf ? nineteen
- `fr.numbers.twenty` ? vingt ? twenty
- `fr.numbers.thirty` ? trente ? thirty
- `fr.numbers.forty` ? quarante ? forty
- `fr.numbers.fifty` ? cinquante ? fifty

#### fr.numbers.sixty-hundred ? Recognise larger numbers and totals

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.numbers.sixty` ? soixante ? sixty
- `fr.numbers.seventy` ? soixante-dix ? seventy
- `fr.numbers.eighty` ? quatre-vingts ? eighty
- `fr.numbers.ninety` ? quatre-vingt-dix ? ninety
- `fr.numbers.hundred` ? cent ? a hundred
- `fr.numbers.how-many` ? combien ? ? how much / how many?

#### fr.calendar.working-week ? Choose a weekday

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.routine.lundi` ? lundi ? Monday
- `fr.calendar.tuesday` ? mardi ? Tuesday
- `fr.calendar.wednesday` ? mercredi ? Wednesday
- `fr.calendar.thursday` ? jeudi ? Thursday
- `fr.calendar.friday` ? vendredi ? Friday
- `fr.calendar.which-day` ? quel jour ? ? which day?

#### fr.calendar.nearby-days ? Talk about nearby days

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.routine.samedi` ? samedi ? Saturday
- `fr.calendar.sunday` ? dimanche ? Sunday
- `fr.routine.aujourdhui` ? aujourd’hui ? today
- `fr.bakery.tomorrow` ? demain ? tomorrow
- `fr.calendar.yesterday` ? hier ? yesterday
- `fr.routine.semaine` ? une semaine ? a week

#### fr.calendar.january-june ? Name a month from January to June

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.calendar.january` ? janvier ? January
- `fr.calendar.february` ? février ? February
- `fr.calendar.march` ? mars ? March
- `fr.calendar.april` ? avril ? April
- `fr.calendar.may` ? mai ? May
- `fr.calendar.june` ? juin ? June

#### fr.calendar.july-december ? Name a month from July to December

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.calendar.july` ? juillet ? July
- `fr.calendar.august` ? août ? August
- `fr.calendar.september` ? septembre ? September
- `fr.calendar.october` ? octobre ? October
- `fr.calendar.november` ? novembre ? November
- `fr.calendar.december` ? décembre ? December

#### fr.calendar.dates-and-slots ? Check a date and your availability

Estimated A2; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.routine.date` ? une date ? a date / calendar date
- `fr.calendar.month` ? un mois ? a month
- `fr.calendar.year` ? une année ? a year
- `fr.calendar.first-date` ? le premier ? the first of the month
- `fr.calendar.next-week` ? la semaine prochaine ? next week
- `fr.health.disponible` ? disponible ? available

#### fr.directions.street-landmarks ? Recognise street landmarks

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.administration.rue` ? une rue ? a street
- `fr.directions.square` ? une place ? a town square
- `fr.directions.crossroads` ? un carrefour ? a crossroads / junction
- `fr.directions.bridge` ? un pont ? a bridge
- `fr.directions.traffic-light` ? un feu ? a traffic light
- `fr.directions.crossing` ? un passage piéton ? a pedestrian crossing

#### fr.directions.location ? Say where a place is

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.directions.where-is` ? où se trouve… ? ? where is…?
- `fr.directions.next-to` ? à côté de ? next to
- `fr.directions.opposite` ? en face de ? opposite / across from
- `fr.directions.between` ? entre ? between
- `fr.directions.behind` ? derrière ? behind
- `fr.directions.in-front-of` ? devant ? in front of

#### fr.directions.route ? Follow a short walking route

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.directions.straight-on` ? tout droit ? straight on
- `fr.directions.turn-left` ? tourner à gauche ? to turn left
- `fr.directions.turn-right` ? tourner à droite ? to turn right
- `fr.directions.cross` ? traverser ? to cross
- `fr.directions.continue` ? continuer ? to continue
- `fr.directions.take-street` ? prendre la première rue ? to take the first street

#### fr.directions.local-places ? Find a useful local service

Estimated A1; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.administration.mairie` ? une mairie ? a town hall
- `fr.administration.poste` ? un bureau de poste ? a post office
- `fr.directions.bank` ? une banque ? a bank
- `fr.directions.library` ? une bibliothèque ? a library
- `fr.directions.supermarket` ? un supermarché ? a supermarket
- `fr.directions.police-station` ? un commissariat ? a police station

#### fr.directions.check-distance ? Check distance and correct your route

Estimated A2; revision 1; source `packages/content/src/topics/foundations.ts`.

- `fr.directions.near` ? près de ? near
- `fr.directions.far` ? loin de ? far from
- `fr.directions.street-end` ? au bout de ? at the end of
- `fr.directions.as-far-as` ? jusqu’à ? as far as
- `fr.directions.turn-back` ? faire demi-tour ? to turn back / turn around
- `fr.directions.how-long-walk` ? à combien de minutes à pied ? ? how many minutes away on foot?

#### fr.cooking.prepare-workspace ? Prepare a place to cook

Estimated A1; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.cooking.chopping-board` ? une planche à découper ? a chopping board
- `fr.cooking.bowl` ? un bol ? a bowl
- `fr.cooking.spoon` ? une cuillère ? a spoon
- `fr.cooking.kitchen-scales` ? une balance ? a set of kitchen scales
- `fr.cooking.wash-hands` ? se laver les mains ? to wash one’s hands
- `fr.cooking.clean` ? nettoyer ? to clean

#### fr.cooking.prepare-vegetables ? Prepare vegetables

Estimated A1; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.cooking.onion` ? un oignon ? an onion
- `fr.cooking.garlic` ? de l’ail ? some garlic
- `fr.cooking.courgette` ? une courgette ? a courgette; a zucchini
- `fr.cooking.wash-vegetables` ? laver ? to wash
- `fr.cooking.peel` ? éplucher ? to peel
- `fr.cooking.cut` ? couper ? to cut

#### fr.cooking.follow-a-recipe ? Follow a simple recipe

Estimated A1; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.cooking.recipe` ? une recette ? a recipe
- `fr.cooking.salt` ? du sel ? some salt
- `fr.cooking.pepper` ? du poivre ? some pepper
- `fr.cooking.add` ? ajouter ? to add
- `fr.cooking.mix` ? mélanger ? to mix; to stir together
- `fr.cooking.a-little` ? un peu de ? a little; a little of

#### fr.cooking.control-the-cooking ? Control the cooking

Estimated A2; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.cooking.saucepan` ? une casserole ? a saucepan
- `fr.cooking.frying-pan` ? une poêle ? a frying pan
- `fr.cooking.oven` ? un four ? an oven
- `fr.cooking.cook` ? faire cuire ? to cook food
- `fr.cooking.boil` ? faire bouillir ? to bring to the boil; to boil
- `fr.cooking.low-heat` ? à feu doux ? over a low heat

#### fr.cooking.serve-and-clear-away ? Serve and put food away

Estimated A2; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.cooking.serve` ? servir ? to serve
- `fr.cooking.let-cool` ? laisser refroidir ? to let cool
- `fr.cooking.lid` ? un couvercle ? a lid
- `fr.cooking.storage-container` ? une boîte ? a container; a box
- `fr.cooking.put-in-fridge` ? mettre au réfrigérateur ? to put in the refrigerator
- `fr.cooking.leftovers` ? les restes ? leftovers

#### fr.accommodation.book-a-room ? Book a room

Estimated A1; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.accommodation.hotel` ? un hôtel ? a hotel
- `fr.accommodation.night` ? une nuit ? a night
- `fr.accommodation.double-room` ? une chambre double ? a double room
- `fr.accommodation.single-room` ? une chambre simple ? a single room
- `fr.accommodation.book-room` ? réserver une chambre ? to book a room
- `fr.accommodation.for-two-nights` ? pour deux nuits ? for two nights

#### fr.accommodation.check-in ? Check in

Estimated A1; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.accommodation.reception` ? la réception ? reception; the front desk
- `fr.accommodation.under-what-name` ? à quel nom ? ? under what name?
- `fr.accommodation.passport` ? un passeport ? a passport
- `fr.accommodation.identity-document` ? une pièce d’identité ? an identity document
- `fr.accommodation.complete-form` ? remplir une fiche ? to fill in a form
- `fr.accommodation.sign` ? signer ? to sign

#### fr.accommodation.settle-into-your-room ? Settle into your room

Estimated A1; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.accommodation.breakfast` ? un petit déjeuner ? breakfast
- `fr.accommodation.wifi-connection` ? une connexion Wi-Fi ? a Wi-Fi connection
- `fr.administration.mot-de-passe` ? un mot de passe ? a password
- `fr.accommodation.bed-linen` ? le linge de lit ? bed linen
- `fr.accommodation.bath-towel` ? une serviette de bain ? a bath towel
- `fr.accommodation.included` ? c’est compris ? ? is it included?

#### fr.accommodation.request-help-during-stay ? Request help during a stay

Estimated A2; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.accommodation.noise` ? du bruit ? noise
- `fr.accommodation.air-conditioning` ? la climatisation ? air conditioning
- `fr.accommodation.hot-water` ? de l’eau chaude ? some hot water
- `fr.accommodation.missing` ? il manque ? something is missing
- `fr.accommodation.change-rooms` ? changer de chambre ? to change rooms
- `fr.accommodation.someone-can-come` ? quelqu’un peut venir ? ? can someone come?

#### fr.accommodation.check-out ? Check out and leave bags

Estimated A2; revision 1; source `packages/content/src/topics/food-travel.ts`.

- `fr.accommodation.leave-room` ? libérer la chambre ? to vacate the room
- `fr.accommodation.luggage` ? les bagages ? luggage; bags
- `fr.accommodation.leave-bags` ? laisser mes bagages ? to leave my luggage
- `fr.accommodation.until` ? jusqu’à ? until
- `fr.accommodation.invoice` ? une facture ? an invoice; an itemised bill
- `fr.accommodation.extra-charge` ? un supplément ? an extra charge

#### fr.education.enrol ? Ask to join a French course

Estimated A1; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.education.inscription` ? une inscription ? an enrolment / registration
- `fr.education.s-inscrire` ? s’inscrire ? to enrol / register
- `fr.education.niveau` ? un niveau ? a level
- `fr.education.debutant` ? débutant ? beginner / just starting
- `fr.education.en-ligne` ? en ligne ? online
- `fr.education.en-presentiel` ? en présentiel ? in person / in a classroom

#### fr.education.class-actions ? Follow a simple classroom instruction

Estimated A1; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.education.ecouter` ? écouter ? to listen to
- `fr.education.page` ? une page ? a page
- `fr.housing.open` ? ouvrir ? to open
- `fr.education.souligner` ? souligner ? to underline
- `fr.education.recopier` ? recopier ? to copy out
- `fr.education.travailler-a-deux` ? travailler à deux ? to work in pairs

#### fr.education.attendance ? Check the class schedule and report an absence

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.education.seance` ? une séance ? a session
- `fr.education.emploi-du-temps` ? un emploi du temps ? a timetable / schedule
- `fr.education.duree` ? une durée ? a duration / length of time
- `fr.education.pause` ? une pause ? a break
- `fr.education.absent` ? absent ? absent / not attending
- `fr.education.prevenir` ? prévenir ? to let someone know / notify

#### fr.education.homework ? Prepare homework with useful tools

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.education.devoirs` ? les devoirs ? homework
- `fr.education.reviser` ? réviser ? to revise / review
- `fr.education.s-entrainer` ? s’entraîner ? to practise / train
- `fr.education.chercher-un-mot` ? chercher un mot ? to look up / look for a word
- `fr.education.traduction` ? une traduction ? a translation
- `fr.education.dictionnaire` ? un dictionnaire ? a dictionary

#### fr.education.progress ? Explain a learning difficulty and set a goal

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.education.progres` ? des progrès ? progress / improvements
- `fr.education.faire-une-erreur` ? faire une erreur ? to make a mistake
- `fr.education.reussir` ? réussir ? to succeed / manage
- `fr.education.objectif` ? un objectif ? a goal / objective
- `fr.education.avoir-du-mal-a` ? avoir du mal à ? to find it difficult to
- `fr.education.a-son-rythme` ? à son rythme ? at one’s own pace

#### fr.jobsearch.job-goal ? Say what kind of work you want

Estimated A1; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.jobsearch.metier` ? un métier ? an occupation / trade
- `fr.jobsearch.emploi` ? un emploi ? a job / employment
- `fr.jobsearch.chercher-un-emploi` ? chercher un emploi ? to look for a job
- `fr.jobsearch.temps-plein` ? à temps plein ? full-time
- `fr.jobsearch.temps-partiel` ? à temps partiel ? part-time
- `fr.jobsearch.travailler` ? travailler ? to work

#### fr.jobsearch.application ? Ask how to apply for a vacancy

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.jobsearch.offre-d-emploi` ? une offre d’emploi ? a job advertisement / vacancy
- `fr.jobsearch.poste` ? un poste ? a position / post
- `fr.jobsearch.candidature` ? une candidature ? a job application
- `fr.jobsearch.postuler` ? postuler ? to apply for a job
- `fr.jobsearch.cv` ? un CV ? a CV / résumé
- `fr.jobsearch.lettre-de-motivation` ? une lettre de motivation ? a covering letter / cover letter

#### fr.jobsearch.skills ? Describe a skill and relevant experience

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.jobsearch.experience` ? une expérience ? an experience / work experience
- `fr.jobsearch.competence` ? une compétence ? a skill
- `fr.jobsearch.diplome` ? un diplôme ? a qualification / diploma
- `fr.jobsearch.qualification` ? une qualification ? a professional qualification / skill level
- `fr.jobsearch.savoir-utiliser` ? savoir utiliser ? to know how to use
- `fr.jobsearch.autonome` ? autonome ? able to work independently

#### fr.jobsearch.interview ? Introduce yourself in a short interview

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.jobsearch.entretien` ? un entretien ? a job interview
- `fr.jobsearch.se-presenter` ? se présenter ? to introduce oneself
- `fr.jobsearch.parcours` ? un parcours ? a background / career path
- `fr.jobsearch.disponibilite` ? une disponibilité ? an available time / availability
- `fr.jobsearch.motive` ? motivé ? motivated / keen
- `fr.essentials.example` ? un exemple ? an example

#### fr.jobsearch.follow-up ? Ask about next steps after an interview

Estimated A2; revision 1; source `packages/content/src/topics/study-work.ts`.

- `fr.jobsearch.contrat` ? un contrat ? a contract
- `fr.jobsearch.salaire` ? un salaire ? a salary / pay
- `fr.jobsearch.embaucher` ? embaucher ? to hire
- `fr.jobsearch.recontacter` ? recontacter ? to contact again / get back to
- `fr.jobsearch.accepter` ? accepter ? to accept
- `fr.jobsearch.refuser` ? refuser ? to decline / refuse

#### fr.digital.phone ? Make and answer a call

Estimated A1; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.digital.phone` ? un téléphone ? a phone
- `fr.digital.call-noun` ? un appel ? a phone call
- `fr.digital.call-verb` ? appeler ? to call
- `fr.digital.pick-up` ? décrocher ? to answer / pick up the phone
- `fr.digital.hang-up` ? raccrocher ? to hang up
- `fr.digital.voicemail` ? la messagerie vocale ? voicemail

#### fr.digital.email-address ? Read out an email address

Estimated A1; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.administration.adresse-mail` ? une adresse mail ? an email address
- `fr.digital.email` ? un mail ? an email
- `fr.digital.at-sign` ? une arobase ? an at sign / @
- `fr.digital.dot` ? un point ? a dot / full stop
- `fr.digital.hyphen` ? un tiret ? a hyphen / dash
- `fr.digital.underscore` ? un tiret du bas ? an underscore

#### fr.digital.messages ? Send and reply to a message

Estimated A1; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.digital.message` ? un message ? a message
- `fr.digital.text-message` ? un SMS ? a text message
- `fr.work.envoyer` ? envoyer ? to send
- `fr.digital.reply` ? répondre ? to reply
- `fr.digital.receive` ? recevoir ? to receive
- `fr.digital.forward` ? transférer ? to forward

#### fr.digital.connection ? Get connected and describe a problem

Estimated A2; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.administration.connexion` ? une connexion ? a connection
- `fr.digital.wifi` ? le Wi-Fi ? Wi-Fi
- `fr.administration.reseau` ? un réseau ? a network
- `fr.administration.mot-de-passe` ? un mot de passe ? a password
- `fr.administration.se-connecter` ? se connecter ? to connect / log in
- `fr.digital.log-out` ? se déconnecter ? to disconnect / log out

#### fr.digital.files ? Share and keep a file

Estimated A2; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.digital.download` ? télécharger ? to download
- `fr.digital.upload` ? mettre en ligne ? to upload / put online
- `fr.digital.link` ? un lien ? a link
- `fr.administration.piece-jointe` ? une pièce jointe ? an attachment
- `fr.digital.open` ? ouvrir ? to open a file or app
- `fr.digital.save` ? enregistrer ? to save

#### fr.social.invite ? Invite someone for a meal

Estimated A1; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.leisure.inviter` ? inviter ? to invite
- `fr.leisure.ca-te-dit` ? ça te dit ? ? would you like to? / do you fancy it?
- `fr.social.come-to-mine` ? venir chez moi ? to come to my place
- `fr.restaurant.bring` ? apporter ? to bring
- `fr.social.invitation` ? une invitation ? an invitation
- `fr.social.dinner` ? un dîner ? a dinner / evening meal

#### fr.social.join-plan ? Accept and join a plan

Estimated A1; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.leisure.avec-plaisir` ? avec plaisir ? with pleasure / gladly
- `fr.social.suits-me` ? ça me va ? that works for me
- `fr.social.willingly` ? volontiers ? gladly / I’d be happy to
- `fr.social.free` ? être libre ? to be free / available
- `fr.social.place` ? une place ? a place / available spot
- `fr.social.join` ? se joindre à ? to join

#### fr.social.decline ? Decline kindly

Estimated A1; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.social.sorry-cannot` ? désolé, je ne peux pas ? sorry, I cannot
- `fr.social.not-possible` ? ce n’est pas possible ? that is not possible
- `fr.leisure.occupe` ? occupé ? busy / occupied
- `fr.leisure.une-autre-fois` ? une autre fois ? another time
- `fr.social.must-leave` ? je dois partir ? I have to leave
- `fr.social.thanks-anyway` ? merci quand même ? thank you anyway

#### fr.social.organise ? Agree where and when to meet

Estimated A2; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.social.meet-up` ? se retrouver ? to meet up
- `fr.social.set-time` ? fixer une heure ? to set a time
- `fr.social.meeting-place` ? un lieu de rendez-vous ? a meeting place
- `fr.social.what-time` ? à quelle heure ? ? at what time?
- `fr.work.ensemble` ? ensemble ? together
- `fr.education.prevenir` ? prévenir ? to let someone know / notify

#### fr.social.change-plan ? Change a plan and confirm the details

Estimated A2; revision 1; source `packages/content/src/topics/communication.ts`.

- `fr.social.in-the-end` ? finalement ? in the end / as it turns out
- `fr.leisure.plutot` ? plutôt ? rather / instead
- `fr.leisure.reporter` ? reporter ? to postpone / move to a later date
- `fr.health.annuler` ? annuler ? to cancel
- `fr.health.confirmer` ? confirmer ? to confirm
- `fr.social.change-plan` ? changer de programme ? to change plans

#### fr.past.when ? Say when something happened

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.past.last-weekend` ? le week-end dernier ? last weekend
- `fr.past.last-week` ? la semaine dernière ? last week
- `fr.past.day-before-yesterday` ? avant-hier ? the day before yesterday
- `fr.past.recently` ? récemment ? recently
- `fr.past.that-day` ? ce jour-là ? that day
- `fr.past.last-night` ? hier soir ? yesterday evening / last night

#### fr.past.sequence ? Put a short story in order

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.routine.d-abord` ? d’abord ? first / first of all
- `fr.past.then` ? puis ? then
- `fr.routine.ensuite` ? ensuite ? then / next
- `fr.past.afterwards` ? après ? after / afterwards
- `fr.past.at-end` ? à la fin ? at the end
- `fr.past.during` ? pendant ? during / for

#### fr.past.activities ? Describe a day out

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.past.visit` ? visiter ? to visit a place
- `fr.past.discover` ? découvrir ? to discover
- `fr.past.take-photos` ? prendre des photos ? to take photos
- `fr.past.taste` ? goûter ? to taste / try food
- `fr.past.spend-day` ? passer la journée ? to spend the day
- `fr.past.enjoy-opportunity` ? profiter de ? to enjoy / make the most of

#### fr.past.reaction ? Say how an experience went

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.past.it-was` ? c’était ? it was
- `fr.past.went-well` ? ça s’est bien passé ? it went well
- `fr.past.have-fun` ? s’amuser ? to have fun
- `fr.past.memory` ? un souvenir ? a memory / recollection
- `fr.past.experience` ? une expérience ? an experience
- `fr.past.do-again` ? avoir envie de recommencer ? to feel like doing it again

#### fr.past.small-incident ? Explain a small incident

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.past.lose` ? perdre ? to lose
- `fr.past.find-again` ? retrouver ? to find again
- `fr.past.forget` ? oublier ? to forget
- `fr.past.miss` ? manquer ? to miss a service / event
- `fr.past.fortunately` ? heureusement ? fortunately
- `fr.past.unfortunately` ? malheureusement ? unfortunately

#### fr.opinions.preferences ? Say which option you prefer

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.opinions.prefer` ? préférer ? to prefer
- `fr.opinions.love` ? adorer ? to love / really like
- `fr.opinions.hate` ? détester ? to hate / strongly dislike
- `fr.opinions.feel-like` ? avoir envie de ? to feel like / want
- `fr.opinions.like-appeal` ? plaire ? to appeal to / be liked
- `fr.opinions.choose` ? choisir ? to choose

#### fr.opinions.give-view ? Give a simple opinion

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.opinions.in-my-opinion` ? à mon avis ? in my opinion
- `fr.opinions.think-that` ? je pense que ? I think that
- `fr.opinions.find-that` ? je trouve que ? I find / I think that
- `fr.opinions.for-me` ? pour moi ? for me
- `fr.opinions.thats-true` ? c’est vrai ? that’s true
- `fr.opinions.disagree` ? je ne suis pas d’accord ? I disagree

#### fr.opinions.compare ? Compare two everyday options

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.opinions.more-than` ? plus… que ? more… than
- `fr.opinions.less-than` ? moins… que ? less… than
- `fr.opinions.as-as` ? aussi… que ? as… as
- `fr.opinions.better-adjective` ? meilleur ? better
- `fr.opinions.better-adverb` ? mieux ? better
- `fr.opinions.same` ? le même / la même ? the same

#### fr.opinions.qualities ? Explain what matters in a choice

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.opinions.practical` ? pratique ? practical / convenient
- `fr.opinions.comfortable` ? confortable ? comfortable
- `fr.opinions.noisy` ? bruyant ? noisy
- `fr.opinions.quiet` ? calme ? quiet / calm
- `fr.opinions.expensive` ? cher ? expensive
- `fr.opinions.economical` ? économique ? economical / budget-friendly

#### fr.opinions.reasons ? Give a reason and weigh two options

Estimated A2; revision 1; source `packages/content/src/topics/experiences.ts`.

- `fr.opinions.because` ? parce que ? because
- `fr.opinions.so` ? donc ? so / therefore
- `fr.opinions.but` ? mais ? but
- `fr.opinions.however` ? pourtant ? yet / however
- `fr.opinions.it-depends` ? ça dépend ? it depends
- `fr.opinions.hesitate` ? hésiter ? to hesitate / be undecided
