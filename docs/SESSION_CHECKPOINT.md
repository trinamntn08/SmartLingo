# Session checkpoint

Updated: 2026-11-22 (Europe/Paris). Task: make local/remote synchronization the first action for every task/status request and document all work continuously. Branch docs/repo-sync-tracking. Documentation implemented, reviewed and validated. The commit containing this note is the documentation checkpoint; actual SHA and verified origin upload are reported at handoff after final staged checks.

## Source and synchronization

At 12:02 CET, inspected clean feat/calm-learner-redesign, origin URL, all worktrees and relevant fetched history. git fetch origin --prune succeeded. Local and live origin both 132144fcca3a8cf6142bbbd2c08690b357131175; ahead/behind 0/0. git merge --ff-only origin/feat/calm-learner-redesign confirmed Already up to date. Created this docs topic branch from that verified baseline. No owner edits or other worktrees were changed.

## Recorded changes

Root AGENTS and contributor/status/index entry points require synchronization before reporting or editing and link the authoritative SESSION_WORKFLOW procedure. That procedure handles equal/behind/ahead/dirty/divergent/unreachable states without discarding local work, automatically changing main or merging unrelated histories. New WORK_LOG retains one dated entry per request, including status checks/reviews/docs, updated during work and at handoff. ADR 0033 records the owner instruction. Repository map now identifies the actual redesigned learner baseline.

Current durable entry: [repository synchronization and tracking rules](WORK_LOG.md#2026-11-22-repository-synchronization-and-tracking-rules). Previous UI redesign is complete and uploaded in 132144f, with its tests/limitations retained in the log, plan 0039 and Git history. No UI changes are part of this documentation task.

## Validation and next action

PASS: npm.cmd run check (repository/Markdown and TypeScript), complete documentation diff review and git diff --check. Deliberately stage the nine documentation paths, run npm.cmd run check:staged and git diff --cached --check, commit/push docs/repo-sync-tracking and verify live remote SHA equals HEAD. No outstanding implementation work; next request begins with fresh repository verification/synchronization and its own dated log entry.

No application/browser/offline suites have been rerun for these documentation-only edits. Earlier 274 application/tooling, 143 browser and 24 offline passes apply to the UI checkpoint, not this task. No merge, deployment, curriculum publication, database/secrets access or paid calls.

Small sequential documentation task handled by primary; no delegation. Account usage reporting unavailable in this client; no automatic-resume schedule configured. If synchronization fails in a future request, record available local evidence and the exact remote uncertainty before continuing safe independent work.
