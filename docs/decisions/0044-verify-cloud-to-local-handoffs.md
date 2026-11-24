# 0044 Verify Cloud-to-local handoffs against all branches

Date 2026-11-24. Accepted by owner instruction.

## Context

The local preview branch matched its upstream while GitHub held the illustrated slang catalogue on `feat/everyday-french-slang`. The owner had to request another check before the Cloud feature was brought into the preview. [Integration record](../WORK_LOG.md#2026-11-24-bring-the-cloud-slang-catalogue-into-the-local-preview)

## Decision

At the start of every task or status check, verify the full GitHub branch inventory against the fetched refs and review relevant Cloud work. Record its source and whether the intended learner includes it. Before handing off the preview, refresh that evidence and verify the actual build and included Cloud features. Reconcile compatible work within the requested scope and report any remaining source or integration blockers. [Session procedure](../SESSION_WORKFLOW.md#cloud-to-local-handoff)

An outgoing Cloud change is delivered to GitHub after the assigned branch's live head matches the checkpoint commit. The handoff names the branch, full SHA, tests and any remaining local integration. [Cloud delivery procedure](../CLOUD_WORKFLOW.md#hand-off-cloud-work-to-local)
