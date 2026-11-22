# Development workflow

Read [AGENTS.md](AGENTS.md), [current status](docs/STATUS.md), [the latest checkpoint](docs/SESSION_CHECKPOINT.md) and the relevant [product requirements](PROJECT_PLAN.md). The [documentation index](docs/README.md) distinguishes current guides from dated records.

## Branches and scope

Use `feat/<topic>`, `fix/<topic>`, `docs/<topic>` or `chore/<topic>` for one reviewable outcome. Preserve unrelated owner edits. Inspect live remote history before integrating with the [owner-selected repository](https://github.com/trinamntn08/SmartLingo); uploaded topic branches are not automatically merged into main.

Read [repository and branch state](docs/REPOSITORY_STATE.md) before selecting a baseline. The current shared French/Japanese learner is on the unified-hub lineage; the Android APK and older hosted builds have separate histories. An older checkout or `main` may not contain already implemented features. Fetch and compare heads, preserve other worktrees and start from the source relevant to the task.

For parallel work, assign exclusive files and agree shared schemas first. One owner controls manifests/lockfiles; the primary integrates and verifies. Do not move other sessions' unfinished work or stop their servers. Commands from an unmerged task branch are not installed features of this checkout.

Keep branch-specific native builds in dedicated worktrees when practical. Switching a build directory to a branch without its native ignore rules can expose old generated assets/caches as untracked files. Inspect before cleanup; preserve valuable artifacts outside the source tree with verified paths/hashes instead of deleting broadly or hiding unknown source behind a directory-wide ignore. The [maintenance review](docs/CODEBASE_REVIEW.md) records the resolved Android example.

## Validation and checkpoints

Follow [architecture standards](docs/ARCHITECTURE.md#implementation-standards) and the [testing guide](docs/TESTING.md). Run `npm run check`, `npm test` and meaningful checks for the changed journey; record actual results and unrun suites. Documentation-only edits do not require paid calls, browser rebuilds or real owner data merely to claim verification.

The authoritative [checkpoint procedure](docs/SESSION_WORKFLOW.md#automatic-checkpoint-commits) covers diff review, deliberate staging, staged checks, automatic focused commits/task-branch pushes and recovery after failure. The owner's 2026-11-16 extension supplies standing task-branch push authorisation; merging, deployment, curriculum publication and direct main updates remain separate. Verify the remote SHA and report the actual commit/upload result; never bypass failed checks or create an empty checkpoint commit.

The pre-commit hook runs structural/whitespace and staged-secret checks, not the entire application suite or a review. Its presence does not establish that a client loaded or trusted it.

## Local data and documentation

Keep keys, databases, recordings, transcripts, generated audio, exports and installed dependencies out of Git. Reproducible seed content belongs in `packages/content`; optional API settings are documented in [.env.example](.env.example) and [local operations](docs/LOCAL_OPERATIONS.md). No real environment file is read automatically by the API. Use deterministic provider fakes for ordinary tests; only explicitly authorised live checks may spend credits.

Update STATUS for capability changes and the checkpoint for each completed step. Use [execution plans](docs/templates/EXECUTION_PLAN.md) for substantial work and [decision records](docs/templates/ADR.md) for material architecture choices. Link current procedures instead of repeating them across status, setup and plans. Preserve dated sources and unique audit evidence.

No application licence has been chosen. Public distribution/commercial release requires a deliberate licence and media-rights decision.
