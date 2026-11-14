# SmartLingo

A practical French learning preview for English-speaking newcomers to France. Web first; Android and iOS adapters are planned.

**Current state:** local learner preview and first curriculum editor. Twelve A1–A2 draft topics with 30 words/phrases each across 60 short lessons, picture/meaning/sentence practice, a browser notebook, and explicit local preview/publication. Bundled content remains draft until the owner reviews and publishes it; level labels are estimates.

## Run the preview

Use Node 24.19.0 and npm 11.x, then run from the repository root:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Expo. No API key is required. Study Restaurant → Customer with meanings, examples, translations and explanations visible directly, save a word, and find/edit it under Review. Attempts and notebook entries are stored in this browser's IndexedDB and survive reload. Use the same hostname/port/browser to return to that storage. Browser data can be cleared or evicted; keep a backup using Profile → Download learning backup.

Choose any topic directly from the right-hand sidebar on desktop or the horizontal topic list on phones. Explore shows the vocabulary grid before optional short lessons, with French/English search and A1/A2 filters. Lesson vocabulary also appears together: no Next word sequence. Meanings, examples and explanations stay visible, with Listen and Save on each card. Continue to dialogue explicitly records review of the displayed set; browsing alone records no study. The 30-word banks retain six-item practice sessions.

Original bundled drawings illustrate 125 vocabulary items across all twelve topics, alongside the earlier concrete pictures. Abstract words can remain text-supported. No image API, remote photo requests or paid calls are needed. See [media sources and limits](docs/MEDIA_SOURCES.md) and [curriculum research](docs/CURRICULUM_RESEARCH.md).

Review offers French→meaning cards for saved vocabulary. Try to recall before revealing, then choose Again, Needed help or Remembered. These are manual recognition ratings, not a proficiency assessment. Independent due-day recall follows a 1/3/7/14/30-day calendar schedule; help returns the item tomorrow. Early or repeated same-day recall does not advance the schedule. Editing a note starts fresh practice for that revision while preserving prior ratings. Ratings survive reload and are included in backups.

Optional, in a second terminal:

```sh
npm run dev:api
```

The local API listens at `http://127.0.0.1:3001` with `/health`, `/lessons`, `/lessons/fr.restaurant.customer`, and `/published-lessons`. It seeds drafts into ignored `data/smartlingo.sqlite`. The learner uses bundled/cached lessons and remains usable while this API is stopped. Host overrides are limited to loopback; LAN access/authentication is not implemented.

For editing, open the learner at `http://localhost:8081`, choose Profile → Open curriculum editor (or `/#editor`), select a lesson, edit its heading/support fields, and save a draft revision. Preview the saved revision, inspect the answer keys and provenance, then explicitly confirm your review before publishing. Preview practice is temporary and does not change learner progress. The first fields cover headings/outcome, vocabulary support, and grammar; target words, pictures, dialogue and exercises are not editable in this slice.

Return to Profile → Load published lessons to save published revisions into this browser. Later draft changes stay separate. Previous attempts/notebook entries remain recorded when a new revision arrives. A newer revision starts its own lesson progress. Editor requests require the exact local browser origin and a guarded JSON request; this is local origin protection, not account authentication or public-hosting access control.

Profile also supports learning backup/restore. Download a private, unencrypted file containing attempts, manual review ratings, notebook entries and cached published lessons (not server drafts/credentials/recordings). Choose a backup to inspect counts/date, confirm the merge policy, then restore and reload learning. Existing personal notes win; duplicate events stay single; immutable conflicts abort the whole restore. Only supported UTF-8 backups up to 5 MB are accepted. Version 2 exports include ratings; version 1 files remain importable with no invented review history. This does not back up the server's curriculum database.

Device speech is optional, synthetic, and depends on an installed French browser/device voice. Text is always available. Full offline installation/downloads, the complete curriculum editor, production/listening review, microphone conversations, and mobile packages remain planned.

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
