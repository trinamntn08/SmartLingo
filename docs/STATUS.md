# Project status

Updated: 2026-11-14 (Europe/Paris).

Working name: **SmartLingo**. Project path: D:\dev\projects\SmartLingo.

Owner-selected GitHub target: https://github.com/trinamntn08/SmartLingo.

## Current Git state

- Local main contains commit `207cbad` (`chore: bootstrap Codex project workflows and Git tooling`). The working tree was clean before this documentation update.
- Origin points to the selected repository for fetch and push.
- `git update-index --refresh` succeeded during the access check. However, the later commit attempt failed at staging: .git/index.lock returned Permission denied. The refresh command did not establish write access.
- Remote lookup and push dry run fail with `getaddrinfo() thread failed to start`. Windows DNS lookup also returns Access is denied; Windows curl cannot resolve github.com. Remote history and push permissions remain unverified.
- No new commit, fetch, merge, or remote change was made during this verification. See [checkpoint](SESSION_CHECKPOINT.md) for recovery steps.

## Implemented

- Product requirements and visual references.
- Session workflow, usage/checkpoint guidance, task-based subagent model routing and capability fallbacks.
- Root/scoped Codex instructions and Git pre-commit checks.
- Four subagent role definitions, three repository skills, and lifecycle hook definitions under .codex/.agents, with installation sources under tooling. Runtime discovery and hook trust remain unverified.
- Dependency-free Node tooling, hook tests, Git exclusions, local npm configuration, Node version files, lockfile, and private package allowlist.

Earlier validation on 2026-11-14: rename scan found zero former-name text or filename matches; all nine installed/prepared Codex files matched; installer dry run, repository checks, all 16 tooling tests, and whitespace checks passed. These earlier results are distinct from the current Git access checks.

## Not implemented

- Learner app, local API, database schema, lesson content, audio generation, AI conversations.
- Offline packs, content editor, mobile packages, cloud accounts, deployment.
- Verified successful push or CI service.

## Next task

Finish the already authorised remote sync when GitHub connectivity works. Inspect remote refs/history before integrating; preserve existing work and never force-push. The initial local commit already exists; do not repeat bootstrap setup blindly.

App implementation requires a separate owner request: scaffold the planned Expo/TypeScript learner app and local Fastify API, then build the first restaurant lesson end to end. Use [the product plan](../PROJECT_PLAN.md) for acceptance criteria. Ordinary lessons must work without an API key.

## Owner review

Review/trust hooks in Codex; definition files alone do not prove activation. French/English content and the first visual preview need owner review. Keep AI-created curriculum in draft until approved. No public launch date is committed.
