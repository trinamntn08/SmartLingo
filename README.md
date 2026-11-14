# SmartLingo

A practical French learning preview for English-speaking newcomers to France. Web first; Android and iOS adapters are planned.

**Current state:** first local implementation slice. Two unreviewed lesson drafts, picture and sentence practice, and a browser notebook. This is an owner preview, not published curriculum.

## Run the preview

Use Node 24.19.0 and npm 11.x, then run from the repository root:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Expo. No API key is required. Study Restaurant → Customer, reveal help as needed, save a word, and find/edit it under Review. Attempts and notebook entries are stored in this browser's IndexedDB and survive reload. Use the same hostname/port/browser to return to that storage. Browser data can be cleared or evicted; export/restore is not implemented yet.

Optional, in a second terminal:

```sh
npm run dev:api
```

The read-only API listens at `http://127.0.0.1:3001` with `/health`, `/lessons`, and `/lessons/fr.restaurant.customer`. It seeds draft content into ignored `data/smartlingo.sqlite`. Node's built-in SQLite may print an experimental warning. The learner uses bundled lessons and remains usable while this API is stopped. Host overrides are limited to loopback; LAN access/authentication is not implemented.

Device speech is optional, synthetic, and depends on an installed French browser/device voice. Text is always available. Full offline installation/downloads, content editing/publication, spaced review, microphone conversations, and mobile packages remain planned.

## Start here

- [Product plan](PROJECT_PLAN.md)
- [Current status and next task](docs/STATUS.md)
- [Codex setup and usage](docs/CODEX_SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development workflow](CONTRIBUTING.md)
- [Content authoring](docs/CONTENT_GUIDE.md)
- [Documentation index](docs/README.md)

## Tooling prerequisites

Node.js 24.19.0 (Node 24 supported), npm 11.x, and Git. See [local environments and packaging](docs/ENVIRONMENT.md). Dependencies/cache stay project-local; runtime-manager version files and a lockfile support reproducible installation.

Run from the repository root:

```sh
npm run setup
npm run check
npm test
```

PowerShell: use `npm.cmd` if execution policy blocks `npm.ps1`.

- `setup`: set this repository's Git hooks path; leave global Git settings unchanged.
- `check`: validate project instructions/configuration/skill structure, Git whitespace, and TypeScript.
- `test`: run tooling and domain/storage/API tests without paid API calls.
- `check:staged`: include staged-file secret checks before a commit.
- `doctor`: show Node/Git availability, hook installation, and Codex CLI availability.

- `build:web`: export the Expo web application to ignored `apps/learner/dist`.
- `test:e2e`: run Chromium desktop and phone-sized browser checks (install once with `npx playwright install chromium`).

See [verification](docs/TESTING.md) for test scope and device limitations.

## Working with Codex

Open this folder as the project and read [the setup guide](docs/CODEX_SETUP.md). Root AGENTS.md, roles, skills, and lifecycle hook definitions are now installed. The copies under [tooling](tooling/README.md) are retained as installation/validation sources. Runtime loading and hook trust must be checked in the Codex client.

Run `npm run setup:codex:plan` to check matching installed files. Use manual checks if your client does not load project hooks.

For this initial repository, `npm run setup:finish` performs that installation, checks/tests, and the initial local commit together. Preview with `npm run setup:finish:plan`. It refuses existing history, conflicting config, or pre-staged changes and never pushes.

The initial setup commit already exists; do not rerun `setup:finish` on this repository. During authorised work, the agent makes a reviewed, validated local commit after each completed step under the [checkpoint policy](docs/SESSION_WORKFLOW.md#automatic-checkpoint-commits).

Origin is configured for the owner-selected [SmartLingo repository](https://github.com/trinamntn08/SmartLingo). Consult the [checkpoint](docs/SESSION_CHECKPOINT.md) for the latest live-remote verification; cached refs alone do not prove a successful push. No public deployment is configured. Reference image rights are unverified; keep them as local design inputs until resolved.
