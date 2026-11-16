# Session checkpoint

Updated: 2026-11-16, Europe/Paris. GitHub source/workflow is uploaded and verified on Linux. Account-side Cloud environment update and phone acceptance still require user interaction; do not claim the full phone route active yet.

## Latest follow-up: push every local branch

Owner explicitly requested pushing all local branches to GitHub. Fetched origin and compared live refs: 25 local branches, two already present on GitHub and 23 new remote branches. Scanned all 41 newly outgoing Git objects (two commits, eleven trees, twenty-eight blobs), including protected-path checks across the new historical trees: zero supported credential patterns or protected paths. No conflicting branch history found. This is bounded scanning, not an exhaustive secret guarantee.

`git push --dry-run --all origin` and `git push --all origin`: PASS. Independent live `git ls-remote --heads origin` comparison confirms all 25 local branch heads match their GitHub counterparts. This includes the separate curriculum-review and concurrent-session branches; it does not merge their work. Main remains at `1c6e943`. No checkout change, force push, tag push, deployment or owner-data access. Existing uncommitted/ignored files and other worktrees were not staged or changed.

This documentation-only checkpoint records the completed upload. Final repository/staged checks and commit follow this note; push the checkpoint on `chore/cloud-workflow`, then repeat the all-head SHA comparison. No application code changed, so application/browser suites are not rerun for this branch-upload request. The earlier Cloud environment activation work remains pending below. Usage remains unavailable (no allowance tool exposed); no delegation was needed for this small sequential operation.

## Authorised scope and current source

Owner authorised the proposed GitHub upload, draft PR, Codex Cloud environment and phone working route. [Draft PR #1](https://github.com/trinamntn08/SmartLingo/pull/1) is open from `chore/cloud-workflow` into `main`. Preparation `1c5b5d4` preserves the 27 earlier development commits through greetings checkpoint `d5a56ed`; focused browser fix `5d80acbf7e921c860b4ce7ea256f84093611dfb7` is uploaded and its remote SHA verified. Main stays at `1c6e943`; no merge, force push, deployment or curriculum publication.

Work exclusively in isolated worktree `D:/dev/projects/SmartLingo-sessions/cloud-workflow`. Another session switched the original checkout to `chore/a1-a2-curriculum-review` just before preparation committed; the commit contains only the seven intended files with parent `d5a56ed`. Preserved that branch, created the isolated worktree and fast-forwarded `chore/cloud-workflow` to the same commit. Do not reset or edit the other session's checkout.

## Completed work and actual verification

- Added `.github/workflows/verify.yml`, cloud/phone setup guide, ADR 0020 and README/setup links. Read-only, SHA-pinned Actions run pinned Node/npm, existing tests and fake providers; no deployment or provider secrets. Guide requires current source instead of old main.
- Independent read-only reviewer (`gpt-6.1-sol`, medium, fresh context) scanned all 1,095 newly reachable historical objects: 702 blobs, 27 commits, 366 trees; zero protected paths/supported credential patterns. This is bounded scanning, not proof against every key format or arbitrary private JSON. Workflow/docs review had no actionable findings.
- Initial Linux run43942824849 passed repository/TypeScript and 18 tooling/190 application tests, but browser suite had 67 passed / one intentional skip / 12 failed; offline was skipped. Downloaded trace artifacts to ignored `.tmp/cloud-ci-failures`.
- Primary and reviewer confirmed focus borderWidth1 ->3 added four pixels, moving wrapping Open lesson, Send message and mon buttons between pointer-down/up. Shared Button now uses a visible geometry-neutral outline. New focus/keyboard regression failed on old source (width143.59 ->147.59, height48 ->50) and passes on fix. All 24 affected local desktop/narrow interaction and backup cases pass using isolated port8091, fake/aborted API traffic. Backup test now uses its actual page URL; its first isolated run failed only because the fresh context hardcoded8081. All assertions/timeouts preserved. Independent fix/test review has no actionable findings.
- [Full Linux run43945569030](https://github.com/trinamntn08/SmartLingo/actions/runs/43945569030) on `5d80acb`: SUCCESS. Repository/TypeScript, 18 tooling/190 application tests, 81 desktop/narrow Chromium cases / one intentional skip, all 8 exported offline cases. Export126 files /9,692,048 bytes, build prefix `b1c6af23a4f4`.
- Local `npm.cmd run check`, workflow YAML parse, staged repository/secret checks and whitespace checks pass for preparation/fix. Final documentation checks/commit follow this note. One early inline YAML parse command failed due Windows quoting; corrected stdin invocation passed. Isolated `npm ci` succeeded; existing three moderate dependency findings remain, no manifest/lockfile edits.

## Remaining account-side setup and exact next action

User confirms Create environment is available. Their supplied setup screenshot reports 16 tests and no application, proving that initial environment prepared old main; publication was still in progress. No evidence yet verifies an updated app environment or a phone task.

1. In that environment select Edit if already published. Ask setup to fetch origin, prepare latest `origin/chore/cloud-workflow` including `5d80acb`, read `docs/CLOUD_WORKFLOW.md`, install pinned runtime/dependencies/Chromium and run actual app checks. Update install_script/start_skill from the real app, then save and Republish. Exact setup brief is in the cloud guide. Environment publication is separate from app/curriculum publication.
2. On phone open Codex, choose that environment and run the guide's acceptance task. Verify the source branch/ancestor and actual checks. Reopen the same task for continuity; use explicit branch/PR delivery for later implementation. Do not merge/deploy without separate authorisation.
3. This handoff-only commit records successful source CI; run final repository/staged checks, commit and push it normally. Its automatic CI may run again; prior green source run above is verified evidence. Record any new setup/phone result when supplied. Do not infer publication success from instructions or the old tooling-only report.

No Cloud management API is exposed here. Browser host is unavailable; native Chrome selection/navigation repeatedly rejected input due concurrent user activity. No login, credentials, permissions or account settings changed. This is a UI-control blocker, not a request to approve code upload again.

## Preservation and capability limits

Owner preview8082/API3001 were not restarted or accessed for this task. No real `.env` reads, provider calls, learner-data migration or publication. Greetings remain owner-review drafts; local notebook/editor databases do not transfer through GitHub. Native focus rendering, physical-phone learner/audio, Safari and screen-reader checks remain open.

Account allowance unavailable (no usage tool exposed,2026-11-16); no automatic resume configured. Reviewer reused for independent history/workflow and trace/fix review, never edited. Primary owns all changes/integration. Skills used: openai-docs, computer-use, sll-deliver-feature; reviewer read sll-review-change. Task deliverables and known remaining UI work are preserved in this commit and linked guide/plan.
