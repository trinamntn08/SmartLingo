# Session checkpoint

Updated: 2026-11-16, Europe/Paris. Current source uploaded; draft PR open; Linux repository/application checks pass. Initial browser CI exposed a real focus/reflow defect, now fixed and locally verified; full remote rerun and updated Cloud environment activation remain pending.

## Authorised request and scope

Owner accepted setting up the proposed remote working route: upload current source to the existing GitHub repository, expose a tested draft PR, prepare a Codex Cloud environment, and verify phone access. Current branch `chore/cloud-workflow`, based on greetings checkpoint `d5a56ed` (previous request complete). Do not merge, deploy the learner, publish curriculum or transfer owner databases as part of setup.

## Completed preparation

- Live `git fetch origin` and branch listing verify only `main` at `1c6e943a3a2f4d9fdbf6886a71ac31c0d3b235ef`; it is an ancestor of `d5a56ed`, 27 commits behind. Existing owner-selected remote preserved. Working tree started clean.
- Added `.github/workflows/verify.yml`, `docs/CLOUD_WORKFLOW.md`, ADR 0020, and README/Codex setup links. Workflow runs existing checks and browser/offline journeys on Ubuntu 24.04 without provider secrets. Cloud guide names the current source branch so setup cannot silently use the old scaffold on `main`.
- Preparation commit `1c5b5d4e547218af281804012a16ee6a2cca0b8c` is uploaded and its remote SHA verified. [Draft PR #1](https://github.com/trinamntn08/SmartLingo/pull/1) contains the 27 earlier commits plus preparation. Main remains unchanged at `1c6e943`; no force push, merge or deployment.
- Concurrent session switched the original checkout to `chore/a1-a2-curriculum-review` before the preparation commit. The commit contains exactly the seven intended files and parent `d5a56ed`. Preserved that branch; created isolated worktree `D:/dev/projects/SmartLingo-sessions/cloud-workflow` and fast-forwarded `chore/cloud-workflow` to the same commit. Perform all remaining task edits/commits in this worktree, not the shared original checkout.
- Independent read-only change-reviewer (`gpt-6.1-sol`, medium; explicit fresh context) scanned all 1,095 newly reachable historical objects: 702 blobs, 27 commits, 366 trees. No protected paths or supported credential patterns. Bounded scanner cannot identify every key format or private JSON semantically. Review of workflow/docs found no actionable issue. Primary owns all edits and integration.

## Actual checks and capabilities

- `npm.cmd run check`: PASS repository checks and TypeScript.
- `npm.cmd test`: PASS 18 tooling / 190 application tests.
- Parsed workflow using installed `js-yaml`: PASS. First inline Node invocation failed because Windows argument quoting stripped quotes; corrected here-string/stdin invocation succeeds. No dependency changes.
- `git diff --check`: PASS before final documentation/staging; final staged checks and commit follow this note.
- [GitHub run 43942824849](https://github.com/trinamntn08/SmartLingo/actions/runs/43942824849) on `1c5b5d4`: Linux repository/application job PASS, including npm ci/setup/check, 18 tooling and 190 application tests. Initial Chromium job: 67 passed / one intentional skip / 12 failed; offline step skipped after failure. Downloaded diagnostics to ignored `.tmp/cloud-ci-failures` in this worktree.
- Primary and independent reviewer trace diagnosis: focus borderWidth 1 -> 3 adds four pixels, wrapping Open lesson, Send message and sentence mon between pointer-down/up. Fixed only shared Button focus style using an outline; kept normal geometry, visible focus and disabled guards. Added `tests/e2e/controls.spec.ts`; regression RED on old source (width143.59 ->147.59, height48 ->50), GREEN on fix. Independent read-only review finds no actionable fix/test issue; native focus rendering unverified.
- `npm.cmd ci --cache D:/dev/projects/SmartLingo/.cache/npm`: PASS in isolated worktree; same existing three moderate dependency findings, no manifest/lockfile edits. `npm.cmd run check`: PASS after UI fix. Isolated port8091 temporary Playwright config uses fake/aborted API traffic, no owner servers. All 22 selected desktop/narrow lesson/practice/recording/storage/sentence/focus cases PASS. Both desktop/narrow backup journeys also PASS (24 selected cases total). Initial isolated backup run failed because its second context hardcoded8081; corrected test to use `page.url()` and preserved every restore assertion. Independent read-only review confirms the portability fix. Full remote rerun follows commit/push.
- GitHub connector read/write access verified. No Cloud environment-management tool exposed. Browser access host unavailable; native Chrome navigation/selection repeatedly blocked by concurrent user input. No login, permissions or account settings changed. User confirms Create environment is available and supplies a setup-chat screenshot. It reports 16 tests and no application, so it prepared old main; publication was still in progress in the screenshot. Sent exact follow-up brief to prepare `chore/cloud-workflow` at `1c5b5d4`, verify the current application and update install_script/start_skill before republishing. Current app environment publication and phone acceptance are not yet verified.
- Account usage unavailable: no allowance tool exposed (2026-11-16). No automatic resume configured. Skills applied: openai-docs (prior investigation), computer-use; reviewer read the repository review skill.

## Exact next actions

1. Review/stage task changes, run final repository/staged checks and commit/push the focus fix. Wait for the full Linux browser/offline rerun; read remote logs and fix reproducible failures without weakening assertions. Commit containing this note records the fix and known passing local checks; report its hash after confirmation.
2. Finish updating the account-specific Cloud environment using `docs/CLOUD_WORKFLOW.md`. If the old environment has already published, select Edit, prepare the current branch and Republish. Confirm actual setup tests, then run the phone acceptance task. User interaction is currently needed because setup UI input is blocked.
3. Record actual outcomes and remaining blockers, review/stage only task documentation, run repository/staged checks and `git diff --cached --check`, commit and push the focused handoff normally. The original CI run has completed; preserve its failed result as diagnosis evidence.
4. Keep the PR draft and main unchanged unless the owner separately authorises integration. Never claim the current app environment is active from the old tooling-only setup report.

## Existing application state to preserve

Greetings-first implementation is complete at `d5a56ed`: 25 banks, 123 lessons, 765 appearances, 722 canonical senses, 713 forms. New greetings remain draft revision 1; owner content review/publication remains explicit. Prior validation and implementation details are preserved in that commit and STATUS.

Owner preview remains at `http://localhost:8082`, API `http://127.0.0.1:3001`; neither was restarted or changed for cloud preparation. No real `.env` reads, paid calls, new media/audio, curriculum publication or learner-data migration. Physical-phone/Safari/native, audible provider quality and screen-reader checks remain open. A cloud source checkout does not restore the local learner's notebook or editor data.
