# Project status

Updated: 2026-11-14 (Europe/Paris).

Working name: **SmartLingo**. Project path: D:\dev\projects\SmartLingo.

Owner-selected GitHub target: https://github.com/trinamntn08/SmartLingo.

## Current Git state

- Local main and cached origin/main point to `1606501` (`update docs`), following bootstrap commit `207cbad`. The previously requested documentation commit exists. Live remote state remains unverified.
- The working tree was clean at session start; this verification updates only STATUS.md and SESSION_CHECKPOINT.md.
- Origin uses the owner-selected HTTPS URL for fetch and push.
- Staging failed creating .git/index.lock with Permission denied. Fetch failed opening .git/FETCH_HEAD with Permission denied.
- Remote HEAD lookup and push dry run both failed with `getaddrinfo() thread failed to start`. Push permission and live remote history remain unknown.
- No staging, new commit, fetch, merge, or remote change succeeded in this session. See [checkpoint](SESSION_CHECKPOINT.md) for the exact recovery steps. Never force-push.
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
