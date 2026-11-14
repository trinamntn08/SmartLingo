# SmartLingo

A planned practical language-learning app for English-speaking newcomers to France. French first, with web, Android, and iOS targets.

**Current state:** planning and Codex/Git tooling only. The learner app and API have not been scaffolded.

## Start here

- [Product plan](PROJECT_PLAN.md)
- [Current status and next task](docs/STATUS.md)
- [Codex setup and usage](docs/CODEX_SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development workflow](CONTRIBUTING.md)
- [Content authoring](docs/CONTENT_GUIDE.md)
- [Documentation index](docs/README.md)

## Tooling prerequisites

Node.js 24.19.0 (Node 24 supported), npm 11.x, and Git. The bootstrap tooling uses Node built-ins only; no dependency download is required. See [local environments and packaging](docs/ENVIRONMENT.md). Dependencies/cache stay project-local; runtime-manager version files and a lockfile support reproducible installation.

Run from the repository root:

```sh
npm run setup
npm run check
npm test
```

PowerShell: use `npm.cmd` if execution policy blocks `npm.ps1`.

- `setup`: set this repository's Git hooks path; leave global Git settings unchanged.
- `check`: validate project instructions/configuration/skill structure and Git whitespace.
- `test`: exercise tooling, staged-secret detection, and hook behaviour without paid API calls.
- `check:staged`: include staged-file secret checks before a commit.
- `doctor`: show Node/Git availability, hook installation, and Codex CLI availability.

These are tooling checks, not application tests. No `dev`, app `build`, or app test command exists yet.

## Working with Codex

Open this folder as the project and read [the setup guide](docs/CODEX_SETUP.md). Root AGENTS.md, roles, skills, and lifecycle hook definitions are now installed. The copies under [tooling](tooling/README.md) are retained as installation/validation sources. Runtime loading and hook trust must be checked in the Codex client.

Run `npm run setup:codex:plan` to check matching installed files. Use manual checks if your client does not load project hooks.

For this initial repository, `npm run setup:finish` performs that installation, checks/tests, and the initial local commit together. Preview with `npm run setup:finish:plan`. It refuses existing history, conflicting config, or pre-staged changes and never pushes.

The initial setup commit already exists; do not rerun `setup:finish` on this repository. During authorised work, the agent makes a reviewed, validated local commit after each completed step under the [checkpoint policy](docs/SESSION_WORKFLOW.md#automatic-checkpoint-commits).

Origin is configured for the owner-selected [SmartLingo repository](https://github.com/trinamntn08/SmartLingo). Consult the [checkpoint](docs/SESSION_CHECKPOINT.md) for the latest live-remote verification; cached refs alone do not prove a successful push. No public deployment is configured. Reference image rights are unverified; keep them as local design inputs until resolved.
