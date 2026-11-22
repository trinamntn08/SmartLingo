# Work log

Track every work request here, including status checks, reviews and documentation tasks. Follow [the session workflow](SESSION_WORKFLOW.md#repository-check-and-synchronization-first) before reporting status or editing. Keep one dated entry per task, update it as work progresses, and preserve previous entries. Full implementation evidence belongs in linked plans, decisions and Git history; [the checkpoint](SESSION_CHECKPOINT.md) owns the latest recovery action.

## 2026-11-22 French daily-course plan and generated images

- Request. Write an implementation plan covering courses, units and one lesson per day. Carry forward the A1–B1 scope and the first two pilot days. Document the owner's rule to generate images and photos with SmartLingo's models and keep external images out of the course.
- Start. At 15:20 CET, Europe/Paris, `D:/dev/projects/SmartLingo` was clean. `git fetch origin --prune` succeeded. Local, tracking and live `docs/french-course-design-direction` matched at `82bce28748789ff6e64ddaf90a7d5b1f973294c6`, ahead/behind `0/0`. Verified the live course-planning and frontend refs at `2fc5f51da367209dc179c90569fcd4f469c147bd` and `66d03cc85814e1835d37c0e8594d9d63c5dad590` respectively.
- Acceptance. Document every daily lesson with a practical outcome and review, explain website delivery and progress continuity, and establish generated-image provenance and release checks. The work is a plan and an editorial policy update.
- Delivered the [French daily-course plan](plans/0043-french-daily-course.md) and three 56-day level maps. Each unit carries an outcome, an original model-generated photo concept and daily language practice. The last day applies the week's skills in a new situation. The baseline comprises 24 units and 168 days, including the two existing pilot drafts. Study is self-paced with one recommended day at a time.
- Recorded the [generated-only imagery decision](decisions/0037-model-generated-imagery.md) and workflow. Updated the visual skill and its prepared copy. The plan covers inherited stock-photo rendering, separate legacy whole-app downloads and existing day-one open-text credits.
- Three curriculum-author agents drafted the independent maps and a change-reviewer agent reviewed the integrated plan, all on the inherited client model and effort. The review confirmed the existing progress scopes and identified clarifications on offline listening audio, legacy photo bytes and load testing with mature progress. Incorporated all three.
- Validation. Repository and TypeScript checks passed. The map check verified 24 units, exactly seven complete rows per unit, D001–D168 in sequence, the exact two pilot titles against source, relative link targets and skill copy parity. Independent review verified a transfer day per unit. The installer dry run matched all 19 files. Both visual skill copies passed the official quick validator with the workspace's existing PyYAML dependency. `git diff --check` passed. The checkpoint changes documentation and visual skill instructions only.
- Next implementation step. Prepare D003, map spelling phrases to existing vocabulary, and add the generated-only rendering policy with a text fallback. Verify the pilot days' progress at the first draft preview. The map's lesson content, photo briefs and release gates are planning deliverables.

## 2026-11-22 French course copyright question

- The owner asked whether the proposed use of *Le Nouveau Taxi !* as a teaching reference would violate copyright. Scope is the proposed opening week and the applicable copyright distinction.
- At 15:15 CET (Europe/Paris), the clean `D:/dev/projects/SmartLingo` checkout matched its tracking and live `docs/french-course-design-direction` ref at `09dd94a250c1262e825bceee4332d59f5e4b897c`, ahead/behind `0/0`, after `git fetch origin --prune`. The live course planning ref also matched `2fc5f51da367209dc179c90569fcd4f469c147bd`.
- Reviewed the outline and prior source decision. General teaching methods and ordinary topics can inform independent authoring. French law generally requires permission to reproduce or adapt protected expression. An original selection and arrangement can also receive protection. Use a SmartLingo sequence, freshly written dialogues and exercises, and original or appropriately licensed media. Giving credit alone supplies no licence. [WIPO](https://www.wipo.int/en/web/business/copyright) · [Article L122-4](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278911/2026-05-07) · [Article L112-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278879/2026-07-04)
- The outline can proceed as an independently authored course. This assessment covers the outline. Final lesson and media provenance can be checked during authoring and owner review under the existing course source decision. [Course source decision](decisions/0022-open-course-planning.md)
- Reviewed the documentation diff. `npm.cmd run check` and `git diff --check` passed for this documentation checkpoint.

## 2026-11-22 French course materials readiness

- The owner asked whether the book or additional materials are needed to start implementing the first week. This was a readiness check.
- At 15:12 CET (Europe/Paris), the `D:/dev/projects/SmartLingo` checkout was clean. `git fetch origin --prune` succeeded, and the local, tracking and live `docs/french-course-design-direction` heads matched at `fda0447bc1d025962189280acaa23934d8b443ed`, ahead/behind `0/0`. Live refs for the course planning and frontend branches still matched their local tracking heads.
- Inspected the French pilot, the course catalogue, the existing vocabulary and the progress decision. Existing spelling, clarification, time and directions content gives the proposed five days a starting point. The pilot already supports bilingual study, optional device read-aloud audio, contextual choices, review and day/section resume. The publisher's public description was reviewed in the preceding design task. A full textbook copy is unnecessary for original authoring.
- The materials are sufficient to start a first-week draft. New scenarios, exercises and connective teaching material still need authoring and review. Any new photo or recording needs a source and rights record. The next implementation step is to map the proposed days to existing vocabulary and append the first new draft day while retaining the first two days' identities and progress.
- Reviewed the documentation diff. `npm.cmd run check` and `git diff --check` passed. The checkpoint contains documentation only.

## 2026-11-22 French course design

- Request and scope. Assess whether the teaching approach can inform an original SmartLingo website course and propose a concrete opening week. Treat this as a design and feasibility request.
- Started at 15:08 CET (Europe/Paris) in clean `D:/dev/projects/SmartLingo`. `git fetch origin --prune` succeeded. Local, tracking and live `chore/visual-assets-skill` matched at `99204a1d152249ed5d866cfd662abab6694155be`, ahead/behind `0/0`. The earlier `docs/taxi-daily-course` planning branch matched its live ref at `2fc5f51da367209dc179c90569fcd4f469c147bd` and is an ancestor of the selected baseline. Created `docs/french-course-design-direction` from the verified checkout after confirming the new remote ref was absent.
- Inspected on 2026-11-22. Hachette describes a beginner progression with practical tasks, concise grammar support and review. The CEFR descriptors support defining the route around what learners can do. TV5MONDE independently supports introductions as an A1 communication goal. [Hachette FLE](https://www.hachettefle.com/livre/le-nouveau-taxi-1-livre-de-leleve-a1-9782011555489/) · [Council of Europe](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors) · [TV5MONDE](https://apprendre.tv5monde.com/fr/aides/interculturel-se-presenter-ou-presenter-quelquun)
- Use general teaching methods as inspiration. Write the progression, explanations, dialogues and exercises independently. Use SmartLingo branding and original or separately licensed images and audio. This follows the existing source decision for direct website study. [WIPO](https://www.wipo.int/en/web/business/copyright) · [French Intellectual Property Code, Article L122-4](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278911/2026-05-07) · [Course source decision](decisions/0022-open-course-planning.md)
- Proposed opening week. Reuse **Meet a neighbour** and **Introduce yourself** from the two-day French pilot. Then add **Spell your name**, **Ask someone to repeat**, **Confirm a time**, **Ask where to go**, and a review in which the learner checks in for a first session at a neighbourhood workshop. One daily goal, a short bilingual scene, useful phrases with optional audio and a practice task fit the existing daily-course entry. The longer route can revisit familiar settings with new demands, from finding the right bus at A1 to explaining a missed connection at A2 and comparing alternative routes with reasons in selected B1 tasks.
- Outcome. Initial design recorded for owner consideration. Next implementation step, once requested, is to check existing vocabulary and prerequisites for the five proposed days, then draft the smallest complete continuation in the current learner. The course and its estimated levels remain proposals pending content review.
- Validation. Checked the two pilot days against their bundled source, reviewed the documentation diff, and passed `npm.cmd run check` and `git diff --check`. The checkpoint contains documentation only.

## 2026-11-22: SmartLingo visual asset skill and agent

- The owner requested a reusable image, photo and icon workflow based on the two homepage photos they like.
- Started at 15:03 CET (Europe/Paris) in clean `D:/dev/projects/SmartLingo`. After `git fetch origin --prune`, local, tracking and live `feat/full-frontend-rework` matched at `66d03cc85814e1835d37c0e8594d9d63c5dad590`, ahead/behind `0/0`. Created `chore/visual-assets-skill` from that baseline after confirming its ref was absent on origin.
- Inspected both homepage JPEGs and checked their component crops, provenance and existing icon family. Installed the `sll-create-visuals` skill and `visual-asset-maker` role with the repository installer. [Visual direction decision](decisions/0036-homepage-visual-direction.md)
- `npm.cmd run check`, all 274 tests, `git diff --check`, and both skill validator runs passed. The installer dry run confirmed all 19 source and installed files match. The local Codex app server returned the enabled skill and display metadata from the project path.
- The agent role passed structural validation. Live subagent execution and fresh image generation were outside the verification scope. The commit containing this entry is the checkpoint. The branch upload is verified at handoff.

## 2026-11-22: full frontend rework

- Request: rework the whole interface after owner rejection of the visual pilot. Retain the photo-rich references and larger, readable study text.
- Started 13:05 CET (Europe/Paris). Clean `D:/dev/projects/SmartLingo` `feat/visual-frontend-pilot` and live origin matched at `51890c4f9f503fd9687885fa6d5fac7ede5f0531`, ahead/behind `0/0` after `git fetch origin --prune`. Created `feat/full-frontend-rework` from that source. The new task ref was absent on origin.
- Scope: language chooser, Today, Learn and topic detail, standard lessons, kana, daily course, listening and speaking, Review, Report, Profile and the French curriculum editor. Preserve existing content, learning, offline and publication contracts.
- Integrated the new layouts from [plan 0042](plans/0042-full-frontend-rework.md). Three UI builders and one independent reviewer used `gpt-6.1-sol` at high effort. The primary owns the shared shell, generated scenes, typography, integration and validation. [Media and font sources](MEDIA_SOURCES.md#bundled-presentation-scenes-and-type)
- Validation: `npm.cmd run check`, `npm.cmd test` (274 passed), export (133 files, 11,461,010 bytes), and 18 rendered states at each of 320, 390 and 1,440px. After correcting stale presentation assertions and the resource panel icon, the full browser suite passed 143, skipped one existing case, and found two course overflows. The full offline suite passed 23 with one matching overflow. Fixed nested course controls and example width. Final targeted reruns passed 18 browser course and six offline course cases, covering all remaining failures. Offline fixtures used `8182` with separate trace output because the existing preview uses `8082`.
- Outcome: complete learner and local French editor rework is implemented. The commit containing this entry is the checkpoint. The verified local and origin SHAs are reported at handoff after final staged checks.
- Next: owner visual review using the local preview and screenshots. Safari, physical audio, screen-reader and actual zoom verification remain open.

## 2026-11-22: visual frontend pilot

- Request: begin implementing the frontend redesign from [plan 0040](plans/0040-visual-frontend-redesign.md).
- Started: 12:30 CET (Europe/Paris). State: pilot implemented and validated.
- Source: clean `D:/dev/projects/SmartLingo`, `docs/ui-redesign-plan`, local/live head `9ebe354116b34dfc0066aae70104460e88b592ec`, ahead/behind `0/0` after `git fetch origin --prune`. Verified learner ancestor `132144fcca3a8cf6142bbbd2c08690b357131175` on origin. Created `feat/visual-frontend-pilot` from the synchronized planning baseline. The task ref was absent on origin.
- Scope: readable shared shell, responsive image-led Learn library, and a large lesson presentation exercised through the existing French café and Japanese kana/meaning-first journeys. Preserve the learning and offline paths. Use the working pilot for visual review before full rollout.
- Implemented the pilot in [plan 0041](plans/0041-visual-frontend-pilot.md). The shared shell and study layouts use larger system-font text. Learn uses local photos, a topic rail or keyboard-accessible disclosure, and restores filters and scroll on explicit lesson exit. Lesson steps move focus to the next activity heading. The two builders and independent reviewer used exposed `gpt-6.1-sol` at medium effort.
- Validation: `npm.cmd run check`, `npm.cmd test` (274 passed), final `npm.cmd run test:e2e -- --workers=3 --output .tmp/visual-e2e-results --reporter=dot` (145 passed, one existing skip) and the full offline suite (24 passed). The offline suite used an ignored copy with only port/import/output adjustments on `8182` because the existing preview uses `8082`. Isolating trace directories resolved first-run trace cleanup contention. Final export passed with 126 files and 10,241,303 bytes. Pilot screenshots inspected at 1,440, 390 and 320px. Independent reviewer found no actionable defects in the completed scope.
- Checkpoint: the commit containing this entry on `feat/visual-frontend-pilot`. Final staged checks, normal upload and live origin readback are reported at handoff.
- Next: use the working pilot for visual review, then continue full learner layouts and media curation under [plan 0040](plans/0040-visual-frontend-redesign.md).

## 2026-11-22: whole frontend redesign plan

- Request: prepare a detailed SmartLingo frontend redesign plan using the two supplied references, larger type and more pictures and photos.
- Started: 12:23 CET (Europe/Paris). State: plan complete.
- Source: clean `D:/dev/projects/SmartLingo`, `docs/repo-sync-tracking`; local and live origin both `84502527237fca016d7ca9ad02433e69c0ca6612`, ahead/behind `0/0`. `git fetch origin --prune` succeeded. Verified live `feat/calm-learner-redesign` at `132144fcca3a8cf6142bbbd2c08690b357131175` is an ancestor of the current source. Created `docs/ui-redesign-plan` from the verified documentation and learner baseline. The new task ref was absent on origin.
- Scope: inventory the existing French/Japanese learner and French curriculum editor, then plan visual direction, responsive layouts, media, delivery slices and acceptance checks.
- Outcome: [plan 0040](plans/0040-visual-frontend-redesign.md) specifies larger typography, an image-led library, a focused lesson stage, the editor workspace, asset selection and rights, responsive behaviour, five delivery phases and acceptance checks. Reviewed both supplied screenshots, the seven repository references, current learner and editor source, and design, media and test documentation. Decisions are proposals for mockup and pilot review.
- Validation: `npm.cmd run check` passed repository checks and TypeScript. Reviewed the plan against current source and checked the staged documentation with `npm.cmd run check:staged`, `git diff --check` and `git diff --cached --check`. Browser, application and offline suites are reserved for implementation.
- Checkpoint: the commit containing this entry on `docs/ui-redesign-plan`. Actual SHA and live origin verification are reported at handoff after final staged checks.
- Next: when implementation is requested, begin Phase 1 by capturing the current desktop and phone journeys and proposing the Learn, lesson and editor mockups.

## 2026-11-22: repository synchronization and tracking rules

- Request: check local and remote first for every task/status request, synchronize the relevant source and record all work in documentation.
- Started: 12:02 CET (Europe/Paris). State: documentation implemented, reviewed and validated; checkpoint upload is the final handoff step.
- Repository/worktree: `D:/dev/projects/SmartLingo`.
- Baseline: clean `feat/calm-learner-redesign`, local and live origin both `132144fcca3a8cf6142bbbd2c08690b357131175`; fetched origin with pruning, inspected worktrees/history, ahead/behind `0/0`. Explicit fast-forward-only synchronization returned Already up to date.
- Task branch: `docs/repo-sync-tracking`, from that verified baseline. Other worktrees and running services preserved.
- Scope: root/contributor instructions, authoritative session workflow, repository map, this durable log and the latest checkpoint. No application changes.
- Outcome: every task/status request now explicitly starts with repository verification and safe synchronization; every work request gets a dated entry maintained during work and at handoff. [ADR 0033](decisions/0033-repository-sync-and-work-tracking.md) records the decision.
- Validation: `npm.cmd run check` passed repository/Markdown and TypeScript checks; complete documentation diff reviewed and `git diff --check` passed. Application/browser/offline suites were not rerun for documentation-only changes.
- Checkpoint: the commit containing this entry on `docs/repo-sync-tracking`; actual SHA and verified remote equality are reported at handoff. Final staged checks and normal push follow the workflow; preserve/report any failure.
- Next: apply these rules at the start of the next request and add its own dated entry.

## 2026-11-22: simplify the learner interface

- State: completed in `132144f` on `feat/calm-learner-redesign`; local/live origin equality reconfirmed at the start of the next task above.
- Outcome: focused Today recommendation, topics in Learn, metrics in Report, clearer study steps, grouped settings and responsive navigation for French/Japanese.
- Recorded validation at that checkpoint: 274 tooling/application tests, 143 browser tests with one intentional skip, 24 offline tests, repository/TypeScript checks and exported build passed. Those application suites are historical evidence for that revision, not reruns for subsequent documentation work.
- Evidence: [plan 0039](plans/0039-calm-learner-redesign.md), [ADR 0032](decisions/0032-calm-learner-interface.md) and Git history. Owner/device/screen-reader/voice-quality acceptance remains open.
