# Project status

Updated: 2026-11-14 (Europe/Paris).

Working name: **SmartLingo**. Project path: D:\dev\projects\SmartLingo.

Owner-selected GitHub target: https://github.com/trinamntn08/SmartLingo.

## Current Git state

- Preparation branch: `docs/implementation-standards`, based on local main at `1c6e943` (`docs: record repository sync status`). On 2026-11-14, `git ls-remote --symref origin HEAD` verified live GitHub main also points there. The preparation checkpoint is local unless separately pushed.
- This preparation step combines the existing implementation-quality documentation with the owner's automatic local checkpoint-commit policy and readiness review. See [checkpoint](SESSION_CHECKPOINT.md) for validation and commit identity.
- Origin uses the owner-selected HTTPS URL for fetch and push.
- Earlier sessions reported Git metadata permission and remote lookup failures. Branch creation succeeded during this preparation; historical restrictions must not be assumed to persist. Never force-push.

## Implemented

- Product requirements and visual references.
- Owner-required implementation standards documented in ARCHITECTURE.md and ADR 0002, linked from the plan, contributor workflow, and agent instructions: clean, modular, extensible code and focused functions. These are review requirements; no automatic architecture enforcement exists.
- Standing owner authorisation for reviewed, validated local commits after each completed step, documented in SESSION_WORKFLOW.md and ADR 0003. The active agent creates these checkpoints; no background auto-commit service or Stop-hook commit was added.
- Session workflow, usage/checkpoint guidance, task-based subagent model routing and capability fallbacks.
- Root/scoped Codex instructions and Git pre-commit checks.
- Four subagent role definitions, three repository skills, and lifecycle hook definitions under .codex/.agents, with installation sources under tooling. Runtime discovery and hook trust remain unverified.
- Dependency-free Node tooling, hook tests, Git exclusions, local npm configuration, Node version files, lockfile, and private package allowlist.

Earlier validation on 2026-11-14: rename scan found zero former-name text or filename matches; all nine installed/prepared Codex files matched; installer dry run, repository checks, all 16 tooling tests, and whitespace checks passed. Current preparation checks and independent review are recorded in [the checkpoint](SESSION_CHECKPOINT.md); historical results are not substitutes for current verification.

## Not implemented

- Learner app, local API, database schema, lesson content, audio generation, AI conversations.
- Offline packs, content editor, mobile packages, cloud accounts, deployment.
- Automated CI service. This preparation performs no push.

## Next task

Ready for M1 implementation when the owner starts that task: scaffold the planned Expo/TypeScript learner app and local Fastify API with shared domain/content contracts, then build the first restaurant lesson end to end. Verify current official dependency/API documentation during scaffolding. Use [the product plan](../PROJECT_PLAN.md) for acceptance criteria. Ordinary lessons must work without an API key. Review, validate, and create a local checkpoint commit after each completed step.

The existing main baseline is verified on GitHub; this preparation's new checkpoint is local. Inspect live remote refs/history before future integration; preserve existing work and never force-push. The initial local commit already exists; do not repeat bootstrap setup. Local checkpoints do not prove remote backup.

## Owner review

Review/trust hooks in Codex; definition files alone do not prove activation. French/English content and the first visual preview need owner review. Keep AI-created curriculum in draft until approved. No public launch date is committed.
