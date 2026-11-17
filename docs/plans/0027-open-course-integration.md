# Plan: a freely reusable A1–B1 course inside SmartLingo

Prepared: 2026-11-17 (Europe/Paris). **Planning complete; broader implementation remains proposed.** Source baseline: `0ab3feb`, branch `docs/taxi-daily-course`. This planning task imported/published/deployed no book content. Subsequent owner authorisation started [pilot 0028](0028-open-course-pilot.md): one bundled draft day with a bounded CC BY text adaptation, not the full roadmap.

## Owner outcome and recommendation

The owner initially requested Le Nouveau Taxi! **1, 2 and 3 (A1–B1)** usable directly in the website, with one textbook lesson assigned to each study day. The owner's final instruction rules out seeking publisher permission and requires material that can already be reproduced legally with attribution. Preserve the full in-website learning and daily progression goals; replace the proprietary source choice with eligible open materials and original SmartLingo content. A book-reference checklist alone would not fulfil this outcome.

Use this source policy:

| Material | Decision | Requirement |
| --- | --- | --- |
| CC BY and original material — primary route | Build an original SmartLingo daily course adapting eligible open text, exercises and media, with credits and reviewed English support. | Pin exact source files and inspect individual exceptions. Do not impose restrictions that contradict the source licence. |
| CC BY-SA — optional supplementary route | Reuse suitable material only with attribution and required share-alike licensing of adaptations. | Deliberately track the affected educational material and meet its licence; no assumption that attribution alone is sufficient. |
| NC, unclear, proprietary or permission-only material | Exclude from the default course. Use a clearly eligible alternative or original material. | No permission-negotiation task or purchase dependency. Do not copy Taxi pages, dialogues, exercises, images or recordings. |

**Recommendation:** use eligible legacy *Français interactif* material plus the BCcampus activity companion as the beginner pilot sources, then fill practical France-specific and intermediate gaps with original lessons. Validate exact files before import. Keep *Liberté* as an optional share-alike supplement, not a prerequisite. This course must have its own identity and daily lesson structure; it is not Taxi reproduced under a different name. The A1–B1 target is confirmed for this plan; B1 runtime support and curriculum remain future implementation, not existing capability. This is a source-selection recommendation, not a completed rights/content audit.

This request authorises planning and research. Building the engine, importing selected works, merging branches, publishing curriculum and deploying a release are later actions. No message was sent to a rights holder. The plan requires no such contact.

## 1. Permission and free alternatives

Taxi is excluded because its current website terms restrict reuse of extracts/downloads and require prior authorisation for reproduction, adaptation and translation, subject to legal exceptions. Buying a book, finding a PDF or making the website free does not itself supply a grant for this project. This is the publisher's stated position; the selected open route does not rely on an educational exception. [Hachette terms, sections 2, 3 and 5](https://www.hachettefle.com/conditions-generales-dutilisation/).

An open licence can already grant reuse permission without a separately negotiated fee, provided its conditions and asset exceptions are met. CC BY permits commercial reuse/adaptation with attribution; CC BY-SA additionally requires adaptations to use the same licence; NC versions restrict commercial use. Preserve source, author, licence/version and modification notices. [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

### Candidates actually checked

All successful external accesses recorded below were on **2026-11-17**. These are source-level findings, not completed media/rights audits.

| Resource and inspected evidence | Reuse finding | Suitability and next check |
| --- | --- | --- |
| [Legacy Français interactif — UT Austin adoption page](https://www.laits.utexas.edu/fi/page/adopt/) and [official curriculum description](https://coerll.utexas.edu/coerll/oer/francais-interactif/) | Adoption page states CC BY 3.0 for site materials including the textbook, unless otherwise indicated, and names attribution parties. | Strong beginner candidate with text, vocabulary/phonetics, recordings and activities. Pin each actual file's licence: some edition notices differ. Do not extend this notice automatically to linked websites or the new edition. |
| [Le Français Interactif — BCcampus activity companion](https://opentextbc.ca/francaisinteractif/) | CC BY 4.0 except where noted; cover has its own licence. | Independent A1–A2 activity companion with H5P exercises. Useful practice source; not the complete UT book or a complete A1–B1 curriculum. Audit each activity's media and exportability before choosing a converter. |
| [Liberté — current author site](https://www.lightandmatter.com/french/) | Author site identifies current Spring 2024 volumes under CC BY-SA 4.0. Older mirrors/editions carry different NC-SA notices. Audio access is described separately. | A full first-year textbook candidate. Verify the selected files, image exceptions and audio permissions. Keep adapted educational material under the required share-alike licence; do not assume every linked recording or Canvas resource is included. |
| [New Français Interactif — UT Pressbooks](https://utexas.pressbooks.pub/francais-interactif/) | Inspected landing page displays an Attribution–NonCommercial–ShareAlike notice. Later refresh returned HTTP 403. | Several later chapters were marked not ready at inspection. Do not treat it as an interchangeable, fully ready CC BY replacement for the legacy edition. |
| [Le pont — University of Kansas](https://opentext.ku.edu/lepont/) | Official landing page states CC BY-NC 4.0 except where noted; introduction access failed HTTP 403. | Intermediate-to-advanced candidate for a compatible noncommercial route. Not a verified B1 or Taxi 3 replacement; needs substantial level/task review. |

For a future commercial SmartLingo product, prioritise verified CC BY assets and original content; evaluate CC BY-SA adaptations deliberately. NC candidates above are comparison evidence, excluded from the default reuse set. Licence obligations belong to the relevant material/adaptations; this plan does not assert that using a CC textbook automatically relicenses the entire application.

One concrete source conflict: [Tex's French Grammar's own copyright page](https://www.laits.utexas.edu/tex/copyright.html) restricts redistribution, despite open-resource references elsewhere. Exclude that separate site's material from the initial reuse set until the applicable grant for exact files is resolved. Free-to-read resources such as TV5MONDE can inform scope or be linked; this research does not establish permission to copy their exercises or recordings into SmartLingo. [TV5MONDE beginner pathway](https://apprendre.tv5monde.com/fr/exercices/premiere-classe).

No complete, commercially reusable A1–B1 substitute for all three Taxi books was verified. Open materials can supply a foundation; practical France-specific and B1 gaps require original, reviewed authoring. No content-licence fee is promised for excluded assets, and hosting/media delivery, conversion, teacher review and audio production still have costs.

### No-negotiation rights work package

Create an item-level inventory of exact editions/files, text, exercises, images, audio/video, transcripts and answer keys. Preserve each open licence and its scope; record source URL, creator/attribution parties, title, revision/file hash, exceptions, adaptation/English translation, hosting, redistribution, offline and export eligibility. Attribution is required where specified but does not clear unrelated assets. Do not infer that a book-wide notice licenses every linked song, stock photo, third-party video or software component.

Publish readable course credits and per-resource credit details; include source/licence links and modification notices in online and downloaded packs. Preserve eligible content's reuse freedoms in exported adaptations. If a selected asset needs individual permission or has conflicting notices, exclude it and use an eligible replacement/original. Record that substitution in the coverage map instead of starting permission negotiations. No wholesale source copy belongs in public Git before this inventory; retain only material the actual licence permits distributing. These are release checks, not reasons to stop preparing original fixtures or the engine.

Example credit for an eligible adaptation: “Adapted from *Le Français Interactif – An Activity Companion Site*, Mirabelle Tinio (2023), BCcampus, CC BY 4.0. Changes: English learning support, activity format and SmartLingo feedback.” Link the title to the source and the licence to its deed; preserve any additional source notices. Use this only for material actually covered by that licence.

## 2. What full integration means

The target learner journey is: **choose course/book → choose or resume a study day → study all lesson sections → complete exercises on the website → receive reviewed feedback → save words → resume/review later**. A learner should not need a paper book or an external page for required instructional content or tasks in an integrated release. Optional source/credit links remain available.

Use a book library and unit/lesson map alongside Today and free Explore. Preserve the cream/yellow/green visual character and English interface. For each daily lesson provide its outcome, section checklist, French study material, visible English meanings/translations, vocabulary groups, grammar support, reading/listening, interactive exercises, contextual production and review. Cultural lessons may have a different mix from dialogue lessons. Present source/adaptation credits without crowding each learning interaction.

The earlier Taxi reference established the intended A1–B1 breadth: publisher pages identify [Book 1 as A1](https://www.hachettefle.com/livre/le-nouveau-taxi-1-livre-de-leleve-a1-9782011555489/), [Book 2 as A2](https://www.hachettefle.com/livre/le-nouveau-taxi-2-livre-de-leleve-a2-9782011555519/) and [Book 3 as B1](https://www.hachettefle.com/livres-collections-le-nouveau-taxi-3/). Its [Book 1 contents](https://hachettefle-us.3dcartstores.com/assets/images/Pdf%20Links/2987552058.pdf) show 9 units/36 numbered lessons. That is research context only: do not copy its complete table of contents, retain its numbering for different material or promise the open route will take the same number of days.

One textbook lesson is a **parent study day**, containing as many short activities as required. Retain coherent 6–10-item vocabulary micro-lessons rather than compressing every book lesson into one existing runtime `Lesson`. For an open-material route, define bounded daily lessons within source chapters; do not pretend a whole university chapter is one short day or reuse Taxi lesson labels for different content.

Days advance by deliberate learner action. An unfinished day resumes across visits; missed dates do not skip lessons or create overdue lesson debt. Let learners revisit, select another lesson and repeat activities. Additional review-only days are clearly labelled and may extend the calendar beyond the numbered book lessons. Measure daily workload in the pilot before displaying time estimates; full-book/workbook work is not promised to fit the existing ten-minute goal.

Show translations/explanations directly during study. In listening/recall practice, record whether a transcript, translation, replay or hint was used. Offer keyboard/touch controls and alternatives to drag-only input. Speaking is optional with a typed/manual-reflection route; required listening needs actual usable audio and a clearly labelled accessible alternative, not a silent claim of listening success. Free writing/speaking uses reviewed rubrics or self-review unless a validated grading method is deliberately added. Transcription is not a pronunciation score. Completion records activity, not CEFR attainment. [Council of Europe global scale](https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale).

## 3. Inventory and definition of complete

Inventory selected sources before choosing a final exercise engine or estimating book conversion. Use one coverage row per source component, including exercises and tracks, not just one row per lesson title.

| Required coverage | Website destination |
| --- | --- |
| Student text, dialogue, reading and cultural documents | Accessible study blocks with approved English support and source locator. |
| Vocabulary and grammar/phonetics objectives | Sense-linked vocabulary groups, explanations, examples and appropriate listening/production activities. |
| Every in-scope student/workbook exercise | Actual response UI, reviewed alternatives/rubric, hints and useful corrections. |
| Audio/video, transcripts/captions and cross-references | Rights-cleared playback/segments, accessible text support and associated tasks. |
| Unit reviews, evaluations and portfolios | Explicit review/assessment destinations with honest skill evidence. |
| Lexical/grammar/phonetic/reference annexes | Searchable reference destinations and links from relevant lessons. |
| Teacher material/answer keys selected for authoring | Private authoring source and reviewed feedback; do not ship private teacher files by default. |

The manifest records edition/ISBN, component, page/exercise/track locator, stable source ID, can-do/skill, grammar load, new/recycled sense links, prerequisites, rights evidence, website activity IDs, answer/rubric review, French/English review, media QA and owner decision. Keep separate statuses for source inspection, rights, mapping, implementation, review and publication. `Unknown` is not `missing`, and neither is `complete`.

Declare the denominator for each coverage metric. All in-scope rows must have a reviewed, rights-eligible, working destination before claiming a complete book. Exclusions remain explicit and reduce the delivered scope; a same-topic original replacement is not an imported source exercise. A pilot or partial release must identify exactly which units are available.

Existing **123 SmartLingo draft lessons** are optional preparation/review candidates, not equivalent to the books. Build a many-to-many `supports / partial / gap / needs revision` map by outcome, exact sense, grammar and exercised skill. Preserve canonical IDs, owner edits and historical revisions. Existing lesson completion never awards new book-course completion. The six bridge and five correction review candidates remain outside runtime until separately integrated and reviewed. [Current review pack](../curriculum/README.md).

## 4. Technical design to agree before coding

The following are proposed contracts, not new implemented tables, endpoints or scripts. Keep domain rules independent of React, Fastify, SQLite and provider SDKs. Primary owns all shared contracts and writes the architecture decision before parallel implementation. [Architecture standards](../ARCHITECTURE.md).

| Boundary | Proposed change and compatibility rule |
| --- | --- |
| Curriculum structure | Add `Series → BookEdition → Unit → BookLesson → StudyBlock/Exercise` contracts, explicit order and immutable revisions. Printed numbering is display/source metadata, not an ID parser. Keep current micro `Lesson` intact and link it where suitable. |
| Source and rights | Typed `SourceLocator`, `RightsGrant`/open-licence record and content/asset bindings. Evaluate audience, adaptation/translation, hosting, offline and export eligibility separately. Keep private evidence out of learner payloads. |
| Exercises | Versioned discriminated union, initially choice/matching/order/cloze/constrained short answer plus media-backed comprehension and rubric-based open responses. Final types follow source inventory; unsupported tasks block completeness. Pure deterministic grading with reviewed normalization, alternatives, support flags and grader version. |
| Media | Immutable asset IDs/revisions, hashes, MIME, byte size, duration, credits and rights; versioned transcripts/captions/translation and segment references. Keep publisher recordings distinct from synthetic speech. |
| Learner state | Separate idempotent exercise attempts, daily assignments, completion records and exact resume cursor. Pin content/release revisions; preserve local date/timezone and deliberate upgrade behaviour. Do not reinterpret old `LearningEvent` enums. |
| B1 | Extend only relevant course/content/UI/filter/validation paths through a deliberate migration and B1 acceptance review. Keep existing A1/A2 data valid; no mass relabelling or certification claim. |
| Publication | Stage imports as drafts. Saved immutable preview and owner review remain required. Release manifest pins every nested revision and asset hash; publish atomically. Preview must show the exact release to be made available. |
| Persistence and backup | Add versioned SQLite/IndexedDB stores and a backward-compatible learner backup format. Restore legacy v1/v2 files and preserve current data. Include progress and eligible content/references, not binary media or restricted source/answer files. Set evidence-based bounds after inventory. |
| Delivery | Public static original/open-content catalogue with local learner progress first. Keep owner authoring local; authenticate/authorise editor/import/publication routes if hosted later. No restricted textbook service or learner accounts required for this route; origin/CORS checks alone would not protect a hosted editor. |

Concrete current constraints found in source:

- [Runtime content](../../packages/domain/src/content.ts) requires 6–10 words and fixed dialogue/grammar/matching/sentence fields, with levels stopping at A2. This is not a full-book contract.
- [Learning events](../../packages/domain/src/learning.ts), [IndexedDB v3](../../apps/learner/src/persistence/index.ts) and [backup v2](../../packages/domain/src/backup.ts) need coordinated extension. Backup currently limits text to 5 MB and cached lessons to 200; do not raise limits blindly or embed full-book media.
- [Server snapshot validation](../../apps/api/src/curriculum-backup.ts) checks the exact current SQLite schema. New tables require corresponding snapshot/recovery compatibility, not just a migration edit.
- [Current editor](../../apps/learner/src/editor/DraftFields.tsx) cannot author arbitrary targets, exercise answers, media or dialogue structure. Full-book ingestion needs a real validated editor/import journey.
- [Offline download](../../apps/learner/src/offline/contracts.ts) covers the complete exported app. Selective rights-eligible unit/book packs, quota handling and media caching are new work.
- [Local access guard](../../apps/api/src/local-access.ts) is not authentication. Do not expose the loopback API or local draft catalogue as the hosted course backend.

Use bounded staged imports with schema/reference/hash/licence validation, duplicate detection, dry-run reports and no partial publication. Treat imported text/HTML/archives as untrusted data: sanitise rich text, reject scripts/path traversal/unsafe URLs, validate media, and constrain upload/unpacked sizes. Inventory whether a usable structured export exists before planning OCR/H5P conversion; do not promise a universal PDF importer. Any permitted extraction still needs human proofreading and answer-key checks. No paid AI call belongs in imports/tests unless explicitly opted into later.

## 5. Offline and hosting choices

The selected open, publicly redistributable course can use a static learner site with local progress; accounts/sync are not required for its first pilot. Keep authoring/publication private locally or behind a separately authenticated hosted editor. Rights eligibility is a release-time content check, not a new paid-access system. Do not add restrictions that remove CC reuse freedoms. Assessment keys in a downloaded/static client are inspectable, so do not promise secure exams. A future restricted-content delivery system is outside this plan's default route.

Preserve the existing offline engine for existing lessons. Add content/media packs only after measuring actual sizes and licence eligibility. Download into staging, verify hashes/sizes, activate only complete packs and retain the previous usable version on interruption/corruption/quota failure. Allow cancellation, retry and removal without deleting progress/notebook. Ordinary downloaded activities and approved audio must run with API and AI disabled; mark non-downloadable components clearly rather than claiming the entire course is offline.

CC reuse rights are not revocable while their terms are followed; do not introduce access expiry or claim to recall legally downloaded adaptations. If an item was included by mistake or has a genuine third-party rights problem, stop new distribution of that item and offer a corrected pack; independent copies cannot be reliably erased. Preserve historical progress and credits, and keep ineligible source files out of browser backups. Ordinary unpublication from SmartLingo does not cancel a recipient's applicable open-licence rights. [CC BY terms](https://creativecommons.org/licenses/by/3.0/).

The separate hosted branch `origin/codex/free-learner-cloud-deploy` remained at `c88bc41` in the live remote inspection on 2026-11-17. Its checkpoint reports local validation and blocked publication, not a live URL or a hosted API. Inspect and deliberately integrate relevant hosted changes during a future implementation task; this planning branch does not merge or deploy it. [Hosting plan 0025](0025-free-web-testing.md).

## 6. Staged delivery and acceptance

These are future work packages. Use the already stated open licences and original fixtures; no phase depends on obtaining proprietary permission. No calendar estimate is credible before the source inventory and pilot. Record measured conversion/review effort and media size, then estimate the remaining units with explicit uncertainty.

| Phase | Deliverable | Exit gate |
| --- | --- | --- |
| 0 — Pin eligible open sources | Exact legacy Français interactif/BCcampus files and licences; component inventory, rights matrix and coverage denominator. | Each pilot item is already licensed for its planned reuse; permission-only/unclear items replaced or excluded. No full-course promise from a contents page. |
| 1 — Freeze contracts and fixtures | Architecture decision, source/rights contracts, exercise matrix, release/progress model and small original fixtures covering representative task types. | Cross-module contracts agreed; unsupported task families listed; legacy-data/migration and exposure risks reviewed before builders start. |
| 2 — Build one complete lesson | Course/day UI, exercise runners, media support, persistence/backup and draft import/editor/preview/publication for one representative lesson. | A learner studies and answers entirely on the website, receives feedback, saves a word, reloads to the exact task and exports/restores progress. Full selected lesson content works without a paper book. |
| 3 — Pilot one complete unit | All unit lessons plus its selected workbook, culture, phonetics, media, review and reference links. | Owner/teacher reviews language, answers, English support and audio; tests realistic pacing, accessibility, phone layout and rights-eligible cold-offline flow. Missing capabilities are fixed before scaling. |
| 4 — Complete the A1 course | Convert/adapt one reviewed unit per checkpoint; maintain source/website coverage and licence credits. | Every in-scope row accounted for, all references and media checked, full release previewed. Partial units never labelled a complete source book or complete A1 coverage. |
| 5 — Complete the A2 route | Repeat inventory, supported difficulty and unit release process; fill newcomer-task gaps with original material. | Full declared A2 route coverage and data/skill regression checks; no assumed equivalence to Taxi or automatic proficiency upgrade. |
| 6 — Complete the B1 route | Deliberate B1 implementation, original richer reading/listening/writing/interaction and eligible intermediate material. | B1 contracts/filters/backups tested and curriculum professionally reviewed against intended outcomes. Establish a separate B1 inventory; beginner OER alone does not close it, and NC sources stay outside the default course. |
| 7 — Release the complete selected course | Final coverage, rights, language/media, security, backups and deployment audit. | Owner explicitly approves curriculum publication and the chosen deployment; actual HTTPS desktop/phone acceptance recorded. No paid service or licensing purchase enabled implicitly. |

Phase 2 demonstrates a usable vertical slice; Phase 3 tests the source's varied tasks before bulk conversion. Passing engine tests does not approve French content or establish actual audio quality. A complete set of source locators without interactive learning is not an integrated book.

## 7. Parallel agents and ownership

Use at most three subagents concurrently; rotate the reviewer into a free slot. All builders are told they share the checkout and must preserve others' edits. Freeze shared interfaces before parallel implementation. The primary stages, reviews, checks, commits and pushes each coherent checkpoint.

| Owner | Exclusive future work scope | Handoff |
| --- | --- | --- |
| Primary integrator | `packages/domain` contracts/exports, dependency manifests and lockfile, architecture decisions, plan/checkpoint/status, integration entry points and release decision tracking. | Frozen schemas, acceptance criteria and shared fixtures before builders; integrated diff and combined check evidence after them. |
| Curriculum-author/researcher | Assigned source inventory/coverage/provenance and course-draft data only; restricted source material stays outside public Git. No runtime schema changes or publication. | One unit's coverage rows, bilingual learning blocks, accepted answers/rubrics, source/rights evidence and unresolved language/media questions. |
| API builder | Assigned `apps/api` import/repository/publication/media/migration/snapshot paths and tests. Own editor-facing service contracts only after primary agreement. | Validated staged import and exact saved release, migration/recovery evidence and security/error states. |
| UI builder | Assigned new learner book/day/exercise screens, editor UI, browser persistence/backup/offline adapters and relevant tests. Explicitly assign existing entry points per checkpoint. | Responsive accessible journey, exact resume and recoverable loading/save/media failures; no API/schema/manifest edits. |
| Independent change-reviewer | Read-only final diff and relevant flows/tests; no content authoring, editing, staging or committing. | Confirmed findings with evidence, unresolved risks and actual verification gaps; primary resolves findings before delivery. |

Suggested waves: primary contracts + curriculum inventory; then UI/API/unit-authoring in parallel; then independent review with primary integration; repeat per unit. Do not have multiple agents edit a common schema, migration, backup module or application entry point. For this planning task two read-only specialists supplied curriculum and architecture findings, followed by independent plan review; actual models/checks are recorded in the checkpoint, not inferred from role files.

## 8. Verification strategy

For each implementation checkpoint run `npm.cmd run check`, meaningful application tests, `git diff --check`, final staged checks and focused browser journeys. The existing README commands are authoritative; tests described here are requirements to add, not scripts that already exist. Provider/media doubles in tests must not spend credits.

Required evidence before a full-course release:

- Upgrade populated SQLite/IndexedDB and restore legacy learner/server backups while preserving all old events, edited notes, published revisions and owner drafts. Inject import/migration/restore failures and verify atomic recovery.
- Validate every source-to-activity/media reference, duplicate ID, answer/rubric and rights binding. Stale preview/concurrent edits and interrupted release must never expose an incomplete publication.
- Grade reviewed alternatives, accents that change meaning, cloze/matching/order edge cases and support use correctly. Open responses remain honestly rubric/manual-assessed. No transferred legacy completion or automatic skill/proficiency award.
- Verify day selection, exact resume, missed days, local date/timezone/DST boundaries, repeated saves/retries, revision updates and multi-tab behaviour without duplicate events or lost work.
- Test 320–390 px phones and desktop, keyboard/focus/touch, readable translations, text scaling, captions/transcripts and screen-reader paths. Confirm real recording quality on target devices separately.
- Cold-start authorized downloaded content with API/providers unavailable. Exercise corrupt/stalled/cancelled/quota-failed downloads, updates/removal and content eligibility changes; preserve the previous usable pack and learner history.
- Inspect builds, manifests, public endpoints, backups and caches for drafts, ineligible media, private keys/teacher files and answer-key exposure appropriate to the assessment claim. Test authentication/authorisation if the owner editor is hosted; keep that separate from public open-content access.
- Reconcile the final source inventory, bilingual/native-teacher review, media rights and actual hosted/device results. Schema checks and synthetic browser tests do not establish educational effectiveness or certification.

## Planning handoff

Completed now: researched the original Taxi request and freely reusable alternatives, applied the owner's final no-permission-negotiation requirement, recommended a CC BY/original A1–B1 route, inspected current architectural gaps and defined phased acceptance/parallel ownership. No full textbooks, new lessons, engine code, migrations or website features were added. Exact selected files, asset exceptions and the complete A1–B1 coverage inventory still need verification before import.

Next small step: pin the eligible legacy Français interactif and BCcampus pilot files, build their coverage/licence inventory and specify one complete original/adapted daily lesson. Use original material wherever reuse is unclear. Do not bulk-import source books before the pilot establishes usable task coverage, review effort and delivery constraints. Validation and Git delivery for this planning change belong in [the session checkpoint](../SESSION_CHECKPOINT.md).
