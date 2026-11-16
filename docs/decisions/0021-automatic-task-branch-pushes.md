# ADR 0021 Automatic task branch pushes

Date: 2026-11-16
Status: accepted by explicit owner instruction

## Context

The owner requested committing and pushing the architecture guide when complete, then asked for the same behaviour automatically once future work finishes. The earlier checkpoint policy authorised automatic local commits but left pushes separately scoped. A local-only checkpoint is insufficient for continuing from another computer.

## Decision

After each completed, reviewed, validated step within authorised work, the primary agent deliberately stages task files, creates a focused commit and pushes the assigned topic branch to the existing owner-selected origin without repeated confirmation. Inspect the live remote head first; verify that the remote SHA matches the task commit afterwards. Apply this to local and Cloud work.

Keep unrelated work and other branches untouched. A detached/main checkout needs a named task branch. Never force-push or rewrite history. Resolve remote changes safely within the authorised task or report the blocker; a failed push must not be reported as a remote backup. Do not bypass checks or create empty commits to claim a checkpoint.

## Consequences

Completed work is normally recoverable from GitHub as well as the local checkout. Failed checks/commits/pushes need an accurate checkpoint and exact next action. This does not grant new feature scope, merging, deployment, curriculum publication, direct updates to main or blanket staging. It does not install a background watcher or make hooks push automatically. Follow [the session workflow](../SESSION_WORKFLOW.md#automatic-checkpoint-commits).
