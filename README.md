# SmartLingo

A local French-learning preview for English-speaking adult newcomers to France. Web first; Android and iOS remain planned. Start with everyday greetings, explore practical topics, and save personal vocabulary. Study meanings, examples, translations and explanations are visible directly.

See [current capabilities and gaps](docs/STATUS.md) for the verified scope. Bundled curriculum remains draft until owner review and explicit publication; lesson completion and level labels do not establish proficiency.

Choose **French** or **Japanese** on the homepage, then use the same topic browser, vocabulary cards, lessons, dialogue, practice, notebook and review. Japanese offers 13 topics with 30 entries each across 65 short lessons, with English support, kana readings and independent saved progress. Original Japanese lessons/daily-course history are preserved. See [language selection and learning](docs/LOCAL_OPERATIONS.md#choose-a-language-and-learn) and [Japanese scope](docs/curriculum/japanese-topic-vocabulary.md). These short units do not establish complete CEFR/JLPT coverage.

## Dashboard and report

After choosing a language, **Today** opens a friendly dashboard with your next lesson and real activity summaries. **Report** shows your saved weekly activity and topic progress. The same widgets serve French and Japanese; report visits do not change learning history. [Report definitions and limits](docs/LOCAL_OPERATIONS.md#your-dashboard-and-learning-report).

## Run the preview

Use Node 24.19.0, npm 11.x and Git. From the repository root:

```sh
npm ci
npm run setup
npm run dev
```

Open the localhost address printed by Expo (configured development port 8081). No API key is required for ordinary lessons. In a second terminal, start the optional local editor/API:

```sh
npm run dev:api
```

The API defaults to `http://127.0.0.1:3001`. Keep learner data at the same browser/hostname/port; other origins have separate storage. Do not expose this loopback API to the public internet.

For lesson, notebook, editor/publication, private learning-backup and voice instructions, use [Local operations](docs/LOCAL_OPERATIONS.md). Credentials are optional server-process settings described in [.env.example](.env.example); real `.env` files are not loaded automatically.

## Test the offline-ready preview

```sh
npm run build:web
npm run preview:web
```

Open `http://localhost:8082`, then Profile → Learn offline → Download for offline use. Wait for Ready before testing a cold offline reload. Build again after source changes. Development mode does not offer app downloads. [Offline use and storage transfer](docs/LOCAL_OPERATIONS.md#test-the-offline-ready-preview) explains updates, removal and browser-storage limits.

## Optional saved neural French audio

Device speech is optional and synthetic. Explicit Azure generation/saving is a separate opt-in action that may use credits; ordinary playback never generates paid speech. Follow [neural speech setup and retention](docs/LOCAL_OPERATIONS.md#optional-saved-neural-french-audio). Real voice quality and physical-device checks remain open.

## Free Japanese audio

Japanese speaker buttons use a free local VOICEVOX fallback when no Japanese device voice is installed. Profile → Japanese audio lets you select and preview Shikoku Metan, set speed and remove saved clips. On Windows x64 with Python 3.12+, run `npm run setup:japanese-voice` once, then keep `npm run dev:japanese-voice` and `npm run dev:api` running in separate terminals. Already saved clips can replay offline. [Setup, research and voice credits](docs/JAPANESE_AUDIO.md) explains the local runtime and limits; no API key or paid speech is required.

## Back up and recover server curriculum

Browser learning backups and server curriculum snapshots are separate. Use [server backup/recovery instructions](docs/LOCAL_OPERATIONS.md#back-up-and-recover-server-curriculum) for the implemented `backup:curriculum` / `restore:curriculum` commands; recovery writes a new file and never replaces the running database.

## Optional AI French practice

Practice supports explicit text exchanges and optional temporary recorded-input transcription, with English help and editable phrase capture. Server-only OpenAI settings and usage/privacy limits are documented in [AI practice setup](docs/LOCAL_OPERATIONS.md#optional-ai-french-practice). Ordinary downloaded lessons remain available without AI.

## Tooling prerequisites

Use `npm.cmd` in PowerShell if execution policy blocks `npm.ps1`. Dependencies/cache stay local; [Environment](docs/ENVIRONMENT.md) describes runtime pins and packaging.

| Command | Purpose |
| --- | --- |
| `npm run setup` | Configure repository-local Git hooks. |
| `npm run check` | Repository/documentation structure, whitespace and TypeScript. |
| `npm test` | Tooling and application/domain/storage/API tests; no paid calls. |
| `npm run check:staged` | Repository checks plus staged secret scan before commit. |
| `npm run doctor` | Inspect runtime, hooks and Codex CLI availability. |
| `npm run test:e2e` | Chromium desktop/narrow journeys; install Chromium with `npx playwright install chromium` first. |
| `npm run test:offline` | Build and verify isolated cold-offline/update/removal journeys. |
| `npm run setup:codex:plan` | Preview repository Codex configuration installation. |
| `npm run setup:codex` | Install matching project configuration; refuses conflicting files. |
| `npm run pack:check` | Inspect bootstrap tooling packaging; not a deployable app. |

Detailed commands, fixtures and verification limits belong in [Testing](docs/TESTING.md). Repository CI is configured; an individual CI run must be checked separately. No live website deployment is established by these commands.

## Start here

- [Documentation index](docs/README.md): choose the current guide for your task.
- [Current status](docs/STATUS.md) and [session checkpoint](docs/SESSION_CHECKPOINT.md): capabilities, gaps and latest handoff.
- [Product plan](PROJECT_PLAN.md) and [architecture](docs/ARCHITECTURE.md): target requirements and implementation boundaries.
- [Development workflow](CONTRIBUTING.md), [Codex setup](docs/CODEX_SETUP.md) and [cloud workflow](docs/CLOUD_WORKFLOW.md).
- [Content guide](docs/CONTENT_GUIDE.md), [course catalogue](docs/COURSE_CATALOGUE.md) and [unpublished curriculum review pack](docs/curriculum/README.md).
- [Free website design/status](docs/plans/0025-free-web-testing.md) and [Cloud continuation prompt](docs/CLOUD_DEPLOY_PROMPT.md): hosted code exists on a separate branch; actual publication remains blocked, with no live URL recorded.

## Working with Codex

Read [AGENTS.md](AGENTS.md) and the linked session workflow. Prepared configuration under `tooling/` and installed `.codex/` / `.agents/` copies intentionally coexist for reproducible installation. File presence does not prove client loading or hook trust. Keep independent task branches and owner edits separate; an uploaded branch is not a merge into `main`.
