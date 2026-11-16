# Efficient sessions and interruption recovery

Owner preference recorded: 2026-11-14. Use the included Plus allowance efficiently and preserve progress so authorised work can continue without re-explanation.

## Concurrent independent sessions

Owner request, 2026-11-16: support different tasks running at the same time. Follow [concurrent task sessions](PARALLEL_SESSIONS.md): one worktree, branch and task checkpoint per independent session. `npm run session -- create <name>` creates an isolated checkout without moving or copying the active session's unfinished work; `npm run session -- list` shows Git's inventory. Open the returned folder as the new chat's project.

In registered checkouts, references to SESSION_CHECKPOINT.md below mean the task note in `.codex/sessions/session.json` (`docs/sessions/<name>.md`). Read the root note for context, but update the task note during work, failures and handoff. The designated integrator updates shared STATUS/root summaries when integration is authorised. Task notes travel with their commits; local metadata is ignored. This is separate from subagent delegation within one session. Port/API/browser-test limits and cleanup are documented in the linked guide.

## Start and work

1. Read STATUS.md and SESSION_CHECKPOINT.md, inspect Git status, then read only the relevant plan sections and source files. Preserve unrelated and uncommitted work.
2. Select one small, complete step within the owner's existing request. Record acceptance criteria and exact next actions before substantial implementation. A backlog entry alone is not permission to start a new feature.
3. If the client exposes usage limits, check at session start, before substantial work/delegation, and before handoff. Record the observation time, remaining allowance for each available window, and reset times with timezone. Missing data means unavailable, not zero or unlimited. Do not repeatedly retry a failed usage tool in the same session.
4. Use targeted searches, bounded output, batched independent reads, and concise updates. Reuse verified findings. Delegate only substantial independent tasks with exclusive ownership; extra agents also consume allowance. Run appropriate checks once after a coherent change, repeating only for new changes or unresolved failures.
5. Update SESSION_CHECKPOINT.md after each meaningful completed step, before risky or long work, before compaction when signalled, and before stopping. Keep it short and replace stale details. Update STATUS.md for milestones and meaningful blockers; record material decisions in decisions/.
6. After reviewing and validating a completed step, create its local checkpoint commit under the standing owner authorisation below. Verify the commit and report its hash; do not leave completed validated work uncommitted by default.

## Automatic checkpoint commits

Owner instruction, recorded 2026-11-14: automatically commit after each completed step so there is a recoverable Git checkpoint. This is standing authorisation for the primary agent to make local commits during authorised work without repeated confirmation. A step is a small, coherent, reviewable outcome with acceptance criteria; it is not each individual edit, command, or subagent response.

For each completed step:

1. Review the entire proposed change, including new files, for correctness, relevant failure paths, architecture standards, scope, and sensitive data. Resolve applicable findings. Use an independent read-only reviewer for substantial work with separable review scope; keep small sequential edits in the primary agent.
2. Run the documented checks and relevant application verification. Do not commit a known failing step as though complete, disable hooks, or replace meaningful checks with placeholders.
3. Update SESSION_CHECKPOINT.md with the completed outcome, actual validation, remaining limitations, and exact next step. Update STATUS.md and decision records when warranted. Include these task-related notes in the same checkpoint commit.
4. Inspect the index, stage only deliberate task paths, then inspect the complete staged diff. Preserve unrelated or pre-staged owner work; exclude it from the checkpoint commit. Never use blanket staging when unrelated changes may exist.
5. Run `npm.cmd run check:staged` and `git diff --cached --check` on the final staged content. Create a focused commit with a descriptive subject, then verify `git log -1` and `git status --short`. Report the actual hash and any remaining uncommitted work. Do not create an empty commit when the step changes nothing.

If a step is interrupted, validation fails, or Git cannot commit, preserve the work and record the blocker, actual command result, and exact recovery action in the checkpoint. Fix failures within scope where possible. Do not claim a successful commit until Git confirms it.

The agent performs these commits while actively working. No background auto-commit service, file watcher, or Stop-hook commit is configured or required. Hook checks still run normally. Local checkpoint authorisation does not itself authorise pushing, merging, publishing, changing Git identity, or rewriting existing commits; separately authorised actions retain their scope. Never force-push.

See [ADR 0003](decisions/0003-checkpoint-commits.md) for the decision and tradeoffs.

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
- Latest successful checkpoint commit hash, or identify the commit containing the checkpoint when documenting that same commit (a commit cannot contain its own hash). Report the resulting hash after committing.
- Commands actually run, their results, and verification still pending.
- Next exact step, acceptance criteria, blockers, and owner decisions needed.
- Latest usage observation with source/time, or explicitly unavailable.
- Automatic-resume configuration confirmed by the scheduler, or explicitly not configured.

Never put credentials, raw voice recordings, or private transcripts in the checkpoint. The checkpoint note and its local commit are complementary: only deliberately staged task files are captured. A local commit is not an off-device backup of the entire working tree.

## Resume and automation

The owner authorises resuming an unfinished, already authorised task after allowance recovers, without asking again. Inspect the checkpoint against the current files and validate assumptions before continuing. Stop when that request is complete, an owner decision blocks progress, or limits prevent further work.

Documentation and lifecycle hooks cannot wake an idle agent or detect a reset by themselves. Use a supported project/thread scheduler only when available, and claim automatic resuming only after it confirms creation. A scheduled retry must check actual allowance before starting one bounded step and save a checkpoint afterwards. A timer is not a reset event; do not assume the quota has recovered. Respect the scheduler's local access and runtime requirements. A notification-only task cannot substitute for an agent with repository access.

Earlier session observation on 2026-11-14: usage lookup and a local thread scheduling request failed. Consult the current checkpoint for the latest capability observation; no automatic resume is confirmed. Until scheduling succeeds, a new owner message such as `Continue from docs/SESSION_CHECKPOINT.md` is needed to start another turn. Do not run background shell retry loops as a substitute.

## Platform references

Checked 2026-11-14; recheck when platform behaviour matters:

- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Managing usage in Work and Codex](https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex)
