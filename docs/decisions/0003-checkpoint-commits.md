# ADR 0003: Automatic local checkpoint commits

Date: 2026-11-14
Status: accepted (explicit owner instruction); extended by [ADR 0021](0021-automatic-task-branch-pushes.md) on 2026-11-16 to include automatic verified task-branch pushes.

## Context

The owner requested automatic commits after each step, a review of the preparation work, and a commit before application implementation begins. Uncommitted session notes alone do not provide a Git recovery point.

## Decision

The primary agent creates a focused local commit after each small, coherent step is complete, reviewed, and validated, without asking for permission again. Include the task's checkpoint/status updates, deliberately stage task paths, review the staged diff, run staged checks, commit, and verify the result. Report the actual hash.

Follow the [session workflow](../SESSION_WORKFLOW.md#automatic-checkpoint-commits). Keep unrelated work out of the commit. On interruption or failed checks/commit, preserve changes and record recovery instructions rather than claiming a successful checkpoint.

This is an active-agent workflow, not a background service or a change to the advisory Stop hook. The original local-commit authorisation did not cover pushing; ADR 0021 now supplies that separate standing authorisation for completed task branches. Merging, deployment, curriculum publication, Git identity changes and rewriting history remain separately scoped.

## Alternatives

- Committing after every edit would create checkpoints without coherent behaviour or validation.
- Committing only at final handoff would lose intermediate recovery points during longer tasks.
- A blanket auto-commit hook could capture unrelated or unvalidated work and lacks the context needed for review.

## Consequences

Break authorised implementation into reviewable steps with acceptance criteria and one checkpoint commit per completed step. Validation failures prevent a step from being recorded as complete. Local commits support recovery; off-device backup requires a verified push under ADR 0021 rather than merely a successful local commit.
