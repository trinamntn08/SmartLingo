# Efficient sessions and interruption recovery

Owner preference recorded: 2026-11-14. Use the included Plus allowance efficiently and preserve progress so authorised work can continue without re-explanation.

## Start and work

1. Read STATUS.md and SESSION_CHECKPOINT.md, inspect Git status, then read only the relevant plan sections and source files. Preserve unrelated and uncommitted work.
2. Select one small, complete step within the owner's existing request. Record acceptance criteria and exact next actions before substantial implementation. A backlog entry alone is not permission to start a new feature.
3. If the client exposes usage limits, check at session start, before substantial work/delegation, and before handoff. Record the observation time, remaining allowance for each available window, and reset times with timezone. Missing data means unavailable, not zero or unlimited. Do not repeatedly retry a failed usage tool in the same session.
4. Use targeted searches, bounded output, batched independent reads, and concise updates. Reuse verified findings. Delegate only substantial independent tasks with exclusive ownership; extra agents also consume allowance. Run appropriate checks once after a coherent change, repeating only for new changes or unresolved failures.
5. Update SESSION_CHECKPOINT.md after each meaningful completed step, before risky or long work, before compaction when signalled, and before stopping. Keep it short and replace stale details. Update STATUS.md for milestones and meaningful blockers; record material decisions in decisions/.

## Subagent model routing

Keep small sequential work in the primary agent. Delegate when a substantial independent task saves enough work to justify its context and review costs; default to at most three concurrent subagents. Model names below are preferences only when exposed by the current client, not new dependencies or guaranteed plan entitlements.

| Task | Role | Preferred available model and effort |
| --- | --- | --- |
| Bounded documentation, inventory, simple consistency checks | Task-specific helper | `gpt-6-luna`, low or medium |
| UI/API implementation, ordinary content drafting, focused review | ui-builder, api-builder, curriculum-author, change-reviewer | `gpt-6.1-sol`, medium; high for complex code |
| Difficult architecture, migrations, subtle correctness or privacy review | Relevant builder or change-reviewer | `gpt-6-astra`, high, only when task complexity warrants it |

Choose by task complexity rather than assigning an expensive model permanently to a role. The primary owns shared schemas, manifests, lockfiles, integration, and combined verification. Give each helper only its task, necessary context, acceptance criteria, exclusive paths (or read-only scope), and a concise reporting requirement. A reviewer must be independent of the implementation being reviewed.

Before spawning, check exposed capabilities and usage once if available. Record role, model, effort, scope, and fallback in the checkpoint. When model overrides require a fresh context, use `fork_turns: "none"` and supply the necessary instructions explicitly. Otherwise inherit the parent model and avoid claiming an override occurred. Never invent a model identifier, silently use a paid API, or edit global settings to obtain a model. If a preferred model is unavailable, use an exposed suitable model or the primary agent; report the fallback. Do not repeatedly spawn replacements for the same task.

At 20% or less remaining allowance, avoid new delegation unless needed to finish a tiny active step; at 10% or less, checkpoint without new delegation. If usage is unavailable, keep scope conservative and delegation bounded; do not treat unknown allowance as exhausted or unlimited. Validate returned work before integration and do not repeat checks without a reason.

## Budget and stopping policy

These thresholds are project heuristics, not platform guarantees. If any relevant reported allowance is 20% or less, finish only a small already-started step and prioritise a checkpoint. At 10% or less, avoid new implementation/delegation and save a recoverable handoff. If a limit is exhausted, stop work and record the reported reset. Checkpoint regularly even above these thresholds: a hard cutoff may arrive without warning.

Context capacity and account usage limits are different. Compaction does not restore account allowance. A five-hour window resetting does not necessarily clear a weekly limit. Use actual client-reported reset times rather than adding five hours to the current time. Do not estimate a token balance from message count, purchase resets/credits, or switch to paid API usage automatically.

## Checkpoint contents

- Current authorised request, scope, and completion/paused/in-progress state.
- Completed steps, relevant files, and current uncommitted work to preserve.
- Commands actually run, their results, and verification still pending.
- Next exact step, acceptance criteria, blockers, and owner decisions needed.
- Latest usage observation with source/time, or explicitly unavailable.
- Automatic-resume configuration confirmed by the scheduler, or explicitly not configured.

Never put credentials, raw voice recordings, or private transcripts in the checkpoint. Git commit/push rules still apply; a checkpoint is not a commit or backup of the entire working tree.

## Resume and automation

The owner authorises resuming an unfinished, already authorised task after allowance recovers, without asking again. Inspect the checkpoint against the current files and validate assumptions before continuing. Stop when that request is complete, an owner decision blocks progress, or limits prevent further work.

Documentation and lifecycle hooks cannot wake an idle agent or detect a reset by themselves. Use a supported project/thread scheduler only when available, and claim automatic resuming only after it confirms creation. A scheduled retry must check actual allowance before starting one bounded step and save a checkpoint afterwards. A timer is not a reset event; do not assume the quota has recovered. Respect the scheduler's local access and runtime requirements. A notification-only task cannot substitute for an agent with repository access.

Current session: usage lookup and the local thread scheduling request both failed on 2026-11-14. Remaining allowance and reset times are unknown; no automatic resume is confirmed. Until scheduling succeeds, a new owner message such as `Continue from docs/SESSION_CHECKPOINT.md` is needed to start another turn. Do not run background shell retry loops as a substitute.

## Platform references

Checked 2026-11-14; recheck when platform behaviour matters:

- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Managing usage in Work and Codex](https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex)
