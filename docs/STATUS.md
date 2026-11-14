# Project status

Updated: 2026-11-14 (Europe/Paris).

Working name: **SmartLingo**. Project path: D:\dev\projects\SmartLingo.

Owner-selected GitHub target: https://github.com/trinamntn08/SmartLingo.
Sync is blocked: remote lookup failed with getaddrinfo() thread failed to start; .git/config and .git/index.lock writes returned Permission denied. Origin is now configured correctly. main remains unborn and all bootstrap files are untracked. Remote history is unknown; inspect it before integrating and never force-push. See [checkpoint](SESSION_CHECKPOINT.md) for exact recovery steps.

Authorised continuation retried on 2026-11-14: `git ls-remote --symref origin` still fails with the same network error. This session explicitly marks .git read-only; no metadata write or sync was attempted. The owner request remains authorised and unfinished.

## Implemented

- Session workflow, usage/checkpoint guidance, task-based subagent model routing and capability fallbacks. Session-start hook context points to recovery instructions. Usage lookup failed; no automatic resume is confirmed.
- Product requirements and visual references.
- Active root/scoped Codex instructions and Git pre-commit checks.
- Four subagent role definitions, three repository skills, and lifecycle hook definitions under .codex/.agents, with installation sources under tooling. Runtime discovery and hook trust remain unverified.
- Dependency-free Node tooling, hook tests, Git exclusions, local npm configuration, Node version files, lockfile, and private package allowlist.

Validation: rename reverified on 2026-11-14. Zero former-name text or filename matches remain. All nine installed/prepared Codex files match; installer dry run, repository checks, all 16 tooling tests, and git diff --check pass. GitHub sync retry still fails: remote lookup returns getaddrinfo() thread failed to start, and Git metadata writes return Permission denied. No commit or push succeeded.

## Not implemented

- Learner app, local API, database schema, lesson content, audio generation, AI conversations.
- Offline packs, content editor, mobile packages, cloud accounts, deployment.
- Initial commit, successful push, or CI service.

## Next task

Latest owner request (2026-11-14): report status and commit the current bootstrap. Repository checks, all 16 tooling tests, and `git diff --check` passed again. Commit remains blocked by the session's explicit read-only Git metadata permission; remote lookup still fails with `getaddrinfo() thread failed to start`. No commit or push was made.

Finish the already authorised remote sync after the environment blockers are resolved. App implementation requires a separate owner request: scaffold the planned Expo/TypeScript learner app and local Fastify API, then build the first restaurant lesson end to end. Use [the product plan](../PROJECT_PLAN.md) for acceptance criteria. Ordinary lessons must work without an API key.

## Owner review

Review/trust hooks in Codex; definition files alone do not prove activation. French/English content and the first visual preview need owner review. Keep AI-created curriculum in draft until approved. No public launch date is committed.
