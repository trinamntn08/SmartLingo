# ADR 0033: synchronize first and record every task

Date: 2026-11-22
Status: accepted by owner instruction

## Context

The owner requires checking local and remote source and synchronizing before every task or status request, and recording ongoing work in project documentation. Separate feature histories and worktrees make a dated status page or an old main checkout insufficient evidence of current implementation.

## Decision

[SESSION_WORKFLOW](../SESSION_WORKFLOW.md#repository-check-and-synchronization-first) is authoritative for the required first action: inspect local edits/worktrees, fetch origin, compare relevant local and live remote heads, and safely synchronize before reporting or editing. Clean matching topic branches may fast-forward automatically. Preserve dirty/divergent work and explicitly report failed or unsafe synchronization. Existing restrictions on main, unrelated branch merges, history rewriting and deployment remain.

[WORK_LOG](../WORK_LOG.md) retains a dated entry for every work request, including status-only checks, reviews and documentation work. Start it before substantial work and maintain progress, source evidence, actual checks, outcome, blockers and next actions. Preserve earlier entries. SESSION_CHECKPOINT remains the concise latest recovery state; STATUS remains the capability summary. Link detailed plans, decisions and commits instead of duplicating them.

Completed, reviewed and validated documentation checkpoints follow existing automatic task-branch commit/push rules. A note identifies its containing commit; actual resulting SHA and verified remote equality are reported at handoff without recursive commits just to embed a commit's own hash.

## Consequences

Status answers are based on fresh repository evidence and distinguish verified remote source from local-only observations. Tracking survives session interruption without conflating fetched code, running builds, learner data or deployment. This is a working procedure, not a background synchronization service or proof that every client loads these instructions.
