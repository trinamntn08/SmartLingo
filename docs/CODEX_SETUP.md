# Codex project setup

For GitHub-backed work that can continue from a phone while the PC is off, follow [the cloud workflow](CLOUD_WORKFLOW.md). Check the session checkpoint for actual environment activation and remote verification results.

Verified against official documentation on 2026-11-14.

**Installation state:** root AGENTS.md, Git hook configuration, and all fifteen Codex agent/skill/hook/resource files are installed, including the supplied curriculum researcher and its planning assets. Matching sources are retained under tooling/codex and tooling/agents. Runtime discovery and hook trust remain unverified.

Git is initialized, the initial setup commit exists, origin is configured for the owner-selected repository, and core.hooksPath is set. The earlier Git metadata permission failures are historical; use the [current checkpoint](SESSION_CHECKPOINT.md) for actual results rather than assuming they still apply.

`npm run setup:finish` is a one-time bootstrap helper for repositories without history. It checks for conflicts/pre-staged changes/existing history, installs prepared config, verifies the setup, stages explicit bootstrap paths, sets the pre-commit executable index bit for POSIX clones, and commits locally. It never creates a remote, pushes, or sets hook trust. Do not rerun it to continue this already-initialized project. If it stops in a new bootstrap, inspect git status; it preserves files rather than resetting them.

## Files and responsibilities

| Path | Role |
| --- | --- |
| AGENTS.md | Durable repository instructions and delegation rules |
| references/AGENTS.md | Preserve design inputs and their unverified rights |
| .codex/config.toml | At most three concurrent subagents; inherit other settings |
| .codex/agents/*.toml | UI, API, curriculum, and independent review roles |
| .agents/skills/*/SKILL.md | Reusable project feature/content/review workflows |
| .codex/hooks.json | Session-start context and advisory stop checks |
| scripts/codex-hook.cjs | Hook implementation; Node built-ins only |
| .githooks/pre-commit | Check repository and staged files before committing |

## Activate

1. Open the repository root as the Codex project.
2. Run `npm run setup`, `npm run check`, and `npm test`.
   On a fresh clone, run `npm run setup:codex:plan` and `npm run setup:codex` if the configuration is not already present.
3. Let the client discover repository skills and agent definitions. If they do not appear, reopen/refresh the project and inspect your client's configuration support.
4. Review project hooks in Codex: CLI `/hooks`, or the available Review hooks / Settings > Hooks surface. Trust the definitions only after reviewing them.
5. Keep existing managed permissions. Project config deliberately does not modify model, credentials, sandbox, approval policy, or trust.

Non-managed hooks require exact-definition trust; changed hooks may need another review. Do not bypass that review. A cloud-orchestrated Work session may not execute repository command hooks. Unsupported clients can still read AGENTS.md and run manual checks. Files being present does not establish that a runtime has loaded them.

The readiness check on 2026-11-14 found `codex-cli 0.167.0-alpha.4.1` on PATH. `npm run doctor` verifies executable availability, not project configuration loading or hook trust; no runtime activation is established by that result.

## Hooks

Follow [the session workflow](SESSION_WORKFLOW.md) and maintain [the checkpoint](SESSION_CHECKPOINT.md) while working. Check usage when the client exposes it, preserve progress before limits, and resume only already authorised tasks. Hooks do not schedule a future run or replenish allowance. Automatic resuming requires a confirmed scheduler with repository access; it is not configured by this repository.

The primary agent is authorised to create local checkpoint commits after completed, reviewed, validated steps under the [checkpoint policy](SESSION_WORKFLOW.md#automatic-checkpoint-commits). The advisory Stop hook does not create those commits or replace step review and validation.

- SessionStart: return concise context pointing at product plan and current status. Handle startup/resume/clear/compact/fork.
- Stop: run lightweight repository checks and return an advisory warning on failure. Do not block/continue the conversation, edit files, spend credits, auto-commit, or auto-push.
- Both use Git to locate the root, work from nested directories, read only the supplied event JSON, and never read transcript files.
- Git pre-commit checks actual staged content, not just worktree content. It prevents known secret filenames/patterns and whitespace errors. It is not a complete security boundary.

Install Git hooks with `npm run setup` in every fresh clone; Git does not copy local core.hooksPath settings. Git for Windows runs the small POSIX launcher, which delegates to portable Node code.

## Agent roles and delegation

| Name | Use | Typical ownership |
| --- | --- | --- |
| ui-builder | Responsive learner UI and visual/accessibility work | apps/learner, packages/ui |
| api-builder | API, persistence, provider adapters | apps/api, assigned packages/domain |
| curriculum-author | Original A1-A2 content and feedback | assigned packages/content files |
| change-reviewer | Independent evidence-based review | instructionally read-only |

Primary agent owns integration, shared contracts, dependency/lockfile coordination, and final checks. Do not run all roles for every small task. Custom agents inherit parent permissions; read-only instructions are not an enforced read-only sandbox.

Follow the [session workflow model-routing table](SESSION_WORKFLOW.md#subagent-model-routing) for task-specific model and effort choices. Role TOML files deliberately inherit the parent model; per-task overrides apply only when supported by the active client. Log the model actually used and any fallback in the checkpoint. Prepared files alone do not activate model routing or prove that a role was loaded.

If named roles are unavailable, the primary may spawn a built-in agent and supply the role's developer instructions as task context, without claiming the named configuration was loaded.

## Example requests

- `Use $sll-deliver-feature to build the first restaurant lesson. Delegate independent UI and API work after agreeing the content contract.`
- `Use $sll-author-french to draft a beginner café lesson for owner review.`
- `Use $french-curriculum-researcher to audit topic coherence and propose A1/A2 coverage gaps against existing lessons.`
- `Use $sll-review-change to review the current diff without editing it.`

Skills are repository-scoped. This setup does not install or alter your global personal skills.

The [curriculum researcher](../.agents/skills/french-curriculum-researcher/SKILL.md) complements the French author workflow with research, a proposed 32-topic map and unreviewed seed catalogs. Its JSON schema describes research briefs, not importable app lessons. Convert proposals into the current runtime contract and keep them draft for owner preview/review. See [integration scope](plans/0015-french-curriculum-researcher.md). Files being present does not establish that this session's skill catalog has refreshed; the skill can also be read directly by path.

## Official sources

- [AGENTS.md discovery and scope](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Subagents and standalone definitions](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Skill discovery and metadata](https://learn.chatgpt.com/docs/build-skills)
- [Hook events, trust, and output contracts](https://learn.chatgpt.com/docs/hooks)
- [Configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)

Client versions change. Check these sources before expanding config syntax. Our structural checks deliberately validate only this project's small configuration subset.
