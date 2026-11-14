# ADR 0001: Repository-local Codex setup

Date: 2026-11-14
Status: accepted

## Context
The owner requested agent instructions, subagents, hooks, skills, documentation, and Git before app implementation. The project contains a plan and seven images. Node 24 and Git are available; a standalone Codex CLI was not found on PATH.

## Decision
Use root/scoped AGENTS.md, standalone .codex/agents/*.toml roles, .agents/skills workflows, project lifecycle hooks, and portable Git hooks. Inherit the parent model and permissions. Limit delegation to three subagents by default. Keep the bootstrap tooling dependency-free.

Use current official documentation as the compatibility baseline, but distinguish static checks from actual loading by a client. Project hooks need trust review; no trust-bypass flags or global configuration edits are installed.

## Alternatives
- Global personal skills/config: not appropriate for project-only setup.
- Hardcoded model/provider: would depend on account access and override owner choices.
- Hook after every tool: creates redundant work; use start context and an advisory stop check instead.
- Mandatory CI/provider setup: deferred until an external remote is selected.

## Consequences
The managed editing policy rejected writes to root .codex/.agents during setup. Keep validated installation sources under tooling and provide a conflict-safe local installer. Never use an alternate tool or elevated request to bypass that policy. Root AGENTS.md remains writable.
Git initialization and initial local configuration succeeded, but later metadata writes (config/index locks) were denied. Existing matching Git hook configuration is handled idempotently. Staging/initial commit requires the local completion command.

The setup is portable and versioned locally. TOML validation is intentionally limited to our emitted subset. Codex clients/policies may not load local customisation; manual checks and documented fallback instructions remain available.
