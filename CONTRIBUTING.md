# Development workflow

Read [AGENTS.md](AGENTS.md), [status](docs/STATUS.md), and the relevant [product plan](PROJECT_PLAN.md) before a task.

## Branches and scope

Use `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, or `chore/<topic>`. Keep a complete reviewable outcome per change. Preserve unrelated owner edits. No external remote is configured.

For independent parallel tasks, assign exclusive files and agree shared schemas first. One agent owns dependency manifests and lockfiles. The primary agent integrates and verifies the combined result.

## Checks and commits

1. Run `npm run check` and `npm test`.
2. Run relevant application checks once implementation introduces them.
3. Inspect `git diff` and stage deliberate paths.
4. Run `npm run check:staged`.
5. Commit with a clear subject such as `feat: add restaurant sentence practice`.

Git pre-commit runs the structural/whitespace and staged-secret checks. It does not run the whole application suite, call APIs, or replace a review. Hooks can be bypassed or unavailable; checks are also explicit commands.

## Local data

Copy [the environment example](.env.example) to a local ignored environment file only when the API is implemented. Keep keys, databases, recordings, transcripts, generated audio, and exported learner data out of Git. Keep reproducible seed content separately under packages/content.

The paid provider path should have deterministic mocked checks and an explicitly requested manual live check. Do not claim voice evaluation is tested from a text-only mock.

## Documentation

Update [status](docs/STATUS.md) after meaningful milestones. Record material architecture changes using [the ADR template](docs/templates/ADR.md). Use [the execution-plan template](docs/templates/EXECUTION_PLAN.md) for substantial work. Label proposed capabilities and commands accurately.

No application license has been chosen. Public distribution/commercial release requires a deliberate license and media-rights decision.
