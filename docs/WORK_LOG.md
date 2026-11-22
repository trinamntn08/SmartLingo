# Work log

Track every work request here, including status checks, reviews and documentation tasks. Follow [the session workflow](SESSION_WORKFLOW.md#repository-check-and-synchronization-first) before reporting status or editing. Keep one dated entry per task, update it as work progresses, and preserve previous entries. Full implementation evidence belongs in linked plans, decisions and Git history; [the checkpoint](SESSION_CHECKPOINT.md) owns the latest recovery action.

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
