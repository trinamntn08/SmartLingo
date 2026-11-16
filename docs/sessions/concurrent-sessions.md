# Session: concurrent-sessions

Updated: 2026-11-16 (Europe/Paris). Implementation and independent review complete; the commit containing this note is the local checkpoint. Report its hash after Git confirms it.

Branch: chore/concurrent-sessions. Base: 3bac1c76c9bdb886e5ff5e160b6766babc1b9211.

## Request and ownership

Owner request: investigate and implement a proper way to run different tasks in multiple sessions simultaneously, while preserving the existing running session; update the docs.

Acceptance: independent checkout/branch/index; committed source only; no owner files/staged changes/processes/credentials copied or altered; unique task checkpoint and accurate inventory; reproducible creation/adoption instructions; explicit runtime/test constraints; collision/failure verification and reviewed local checkpoint commit.

Primary owns scripts/session.mjs, scripts/tests/session.test.mjs, scripts/codex-hook.cjs, package.json (script only), root instructions and workflow/setup/index/status/decision documentation. Other task remains in D:/dev/projects/SmartLingo on feat/greetings-first; all its initial modified/untracked files belong to that session. This worktree was created at 3bac1c7 before edits. No shared app contracts, learner/API/content files or dependency versions/lockfile changes.

## Progress and validation

Implemented create/init/list via ordinary Git worktrees, ignored per-checkout metadata, tracked per-task notes and startup context routing. Added operating guide and ADR 0020; linked from root instructions, README, CONTRIBUTING, workflow/setup/index and status. Existing root checkpoint history is preserved with a task pointer. Chose ADR 0020 after read-only observation that the other running session had created its own ADR 0019; no edits were made there.

Initial isolated Git tests: five passed; one failed because the Windows Git fixture inherited CRLF conversion. Fixed fixture-only core.autocrlf=false; full rerun passed. Tests cover dirty/staged caller preservation, separate commits, path/branch/name/ref refusals, linked-caller placement, explicit bases, metadata/checkpoint preservation and start-hook routing. npm.cmd ci --ignore-scripts --no-audit --no-fund passed (537 packages), with local dependencies only. Final npm.cmd run check passed repository and TypeScript checks. Final npm.cmd test passed all 25 tooling and 184 application tests after the review fix. git diff --check passed. No browser/offline/provider runs are claimed; those fixed ports belong to the active owner/test workflow and no app behavior changed.

Independent read-only change-reviewer (actual exposed gpt-6.1-sol, medium, fresh bounded context) found a duplicate-name registration gap in init. Resolved with repository-wide uniqueness checking under an exclusive short-lived common-Git-dir setup lock, documented busy/crash recovery, and a regression test. Reviewer inspected final guard/test and reported no unresolved actionable finding. Final focused session tests: 7/7 passed. Primary inspected the complete deliberate index; npm.cmd run check:staged and git diff --cached --check passed. These checks run again after staging this final validation note and before committing.

Remaining verification limits: client runtime hook activation and actual multi-chat UI launch unverified; no simultaneous subprocess stress test or injected disk/permission/crash failure test. Busy-lock refusal/retry, failed-registration preservation, Git isolation and hook context are covered. No app behavior changed.

Next after this checkpoint: open a new task in a distinct helper/client-created worktree, set its request/acceptance/ownership and run local setup/checks. The setup branch is available locally; integration into the active greetings branch is not authorised or performed. No implementation remains for this setup after final validation/commit.

## Runtime and recovery

No app servers or browser origins started or stopped. Main owner's previews/API remain untouched. Parallel editing/builds/unit checks are supported; fixed-port browser suites and connected API journeys require coordination under docs/PARALLEL_SESSIONS.md. No extra runtime settings, credentials, paid calls, push, merge, publication or scheduler.

Usage observation at 20:21 Europe/Paris on 2026-11-16: inspected exposed capability names/descriptions once; account allowance unavailable, not zero/unlimited. Automatic resume not configured. Primary implemented sequentially in its isolated worktree; independent review delegated as recorded when complete. Official Codex/Git worktree documentation inspected on 2026-11-16 using openai-docs skill/manual and official pages. No global client config or role/hook definitions changed; actual client hook activation remains unverified.
