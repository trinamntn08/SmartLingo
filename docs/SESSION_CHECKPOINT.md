# Session checkpoint

Updated: 2026-11-16, Europe/Paris. Cloud setup documentation review completed against live GitHub and the owner's latest account report. Repository/source verification passes. Owner confirms environment republished and opened on phone; a fresh Cloud task's source/runtime/check transcript remains to record.

## Current authorised request and source

Owner asked whether everything is up to date, requested setup documentation updates, and asked what remains for Cloud work. Work stays in `D:/dev/projects/SmartLingo-sessions/cloud-workflow` on `chore/cloud-workflow`; started clean at `4d6a4a1`. Other worktrees/branches remain untouched. This task changes setup/testing/handoff documentation only, not product code, dependencies, curriculum or storage.

Live fetch plus `git ls-remote --heads origin` comparison verifies 25/25 local branch heads match GitHub at the review base. Prior all-branch upload created 23 missing branches; outgoing scan covered 41 objects with no supported credential/protected-path finding. [PR #1](https://github.com/trinamntn08/SmartLingo/pull/1) remains open, draft and mergeable against `main` at `1c6e943` (old scaffold). Use latest `origin/chore/cloud-workflow` for app work. Uploaded research branch `chore/a1-a2-curriculum-review` at `8ba59ae` and local-session tooling branch `chore/concurrent-sessions` at `8e36885` remain separate/unmerged. Uploading all branches did not integrate their content or commands.

## Verification and review

- Direct GitHub workflow/job/log inspection: [run43951957211](https://github.com/trinamntn08/SmartLingo/actions/runs/43951957211) on `4d6a4a1` SUCCESS. Repository/TypeScript; 18 tooling /190 application tests; 81 desktop/narrow Chromium cases with one intentional skip; 8 exported offline cases.
- Earlier run43942824849 exposed focus reflow (67 passed/12 failed); fix `5d80acb` preserves Button geometry with a visible outline. Regression failed on old source then passed; 24 affected local cases and full source CI passed. No new application defect is confirmed in this bounded setup review.
- Owner's explicit latest reply: updated/republished the Cloud environment and opened it on the phone. Recorded as owner confirmation, not an independently observed runtime/check report. Supersedes the earlier old-main screenshot as account status.
- Corrected stale activation claims and current test counts; added branch map, Edit/Republish route, and a stronger phone acceptance brief requiring the fetched current remote tip plus `5d80acb` ancestry. A greetings-only ancestor could accept a stale setup. Updated README, setup/environment/testing/index docs, STATUS/checkpoint and ADR0020.
- Independent read-only reviewer reused (`gpt-6.1-sol`, medium) for documentation/operational gaps and final nine-file diff: no unresolved actionable finding. Primary owns all edits; no role/hook loading is implied. `npm.cmd run check` and `git diff --check`: PASS. Final staged checks follow before commit. No paid calls or application/browser reruns are needed for documentation-only changes; previous full Linux evidence remains applicable.

## Remaining setup acceptance

1. In a NEW task under the republished SmartLingo Cloud environment on the phone, run the read-only brief in `docs/CLOUD_WORKFLOW.md#phone-acceptance-task`. Fetch origin; preserve existing work; require HEAD equals current fetched `origin/chore/cloud-workflow` and includes `5d80acb`; report Node/npm, dependency state and actual `npm run check` / `npm test` results. Do not reset a dirty or independently committed task to manufacture acceptance. Start a clean task instead.
2. After that report passes, ordinary Cloud source work needs no further repository setup. For the first real implementation, explicitly request a separate branch, relevant tests, pushed commit and draft PR against the app branch to exercise Cloud-side write delivery. Keep merges, deployment and curriculum publication separate owner decisions.
3. Optional later integration: deliberately review/merge PR #1 so default `main` becomes current, then refresh task baselines. Research drafts and local-worktree tooling need separate selection/integration; neither is required just to use Cloud. App preview hosting is a separate request if the owner wants to test the learner app itself in a phone browser.
4. Finish this documentation step: run `npm.cmd run check`, inspect/stage only task docs, run `npm.cmd run check:staged` and `git diff --cached --check`, commit, push `chore/cloud-workflow` normally, then verify all 25 branch heads again. The commit containing this note is the review checkpoint; report its actual hash after Git confirms it. Automatic CI may rerun for the docs; no source-code verification claim depends on an unfinished run.

No Cloud environment status/management tool is exposed in this local session. Earlier browser input was blocked by concurrent user activity, but no browser action is needed to accept the owner's publication/phone-access report. Do not ask to republish again unless a reusable setup change requires it.

## Preservation and capability limits

Original owner checkout is on the separate curriculum-review branch; preserve it. Preparation `1c5b5d4` was originally committed there after another session switched the shared checkout, then preserved and fast-forwarded into this isolated Cloud branch. Owner preview8082/API3001 were not accessed or restarted. No real `.env` reads, provider calls, owner database reads, learner-data migration, deployment, merge or curriculum publication.

Phone access to Codex is distinct from testing the learner app on a physical phone. Actual audible provider quality, Safari/native and screen-reader checks remain product limitations, not missing Cloud source setup. Browser/local notebook/editor databases do not transfer with GitHub source.

Account allowance remains unavailable (no usage tool exposed,2026-11-16); no automatic resume configured. OpenAI setup guidance reused from the openai-docs workflow and checked against current official Cloud environment documentation. Repository review skill applied read-only by the reviewer; owner's explicit documentation-update request authorises primary edits. Prior checkpoints `5d80acb`, `8e6866f` and `4d6a4a1` preserve the detailed setup/fix/upload history.
