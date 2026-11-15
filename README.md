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

Choose any topic directly from the left-hand sidebar on desktop or the horizontal topic list on phones. Click SmartLingo to return home, including from the editor; unsaved editor fields stay available when you reopen it. Explore shows the vocabulary grid before optional short lessons, with French/English search and A1/A2 filters. Lesson vocabulary also appears together: no Next word sequence. Meanings, fuller everyday examples and explanations stay visible, with compact noun gender markers, a speaker icon beside each word, and Save on each card. Continue to dialogue explicitly records review of the displayed set; browsing alone records no study. The 30-word banks retain six-item practice sessions.

Original bundled drawings illustrate 125 vocabulary items across all twelve topics, alongside the earlier concrete pictures. Abstract words can remain text-supported. No image API, remote photo requests or paid calls are needed. See [media sources and limits](docs/MEDIA_SOURCES.md) and [curriculum research](docs/CURRICULUM_RESEARCH.md).

Review offers French→meaning cards for saved vocabulary. Try to recall before revealing, then choose Again, Needed help or Remembered. These are manual recognition ratings, not a proficiency assessment. Independent due-day recall follows a 1/3/7/14/30-day calendar schedule; help returns the item tomorrow. Early or repeated same-day recall does not advance the schedule. Editing a note starts fresh practice for that revision while preserving prior ratings. Ratings survive reload and are included in backups.

Optional, in a second terminal:

```sh
npm run dev:api
```

The local API listens at `http://127.0.0.1:3001` with `/health`, `/lessons`, `/lessons/fr.restaurant.customer`, and `/published-lessons`. It seeds drafts into ignored `data/smartlingo.sqlite`. The learner uses bundled/cached lessons and remains usable while this API is stopped. Host overrides are limited to loopback; LAN access/authentication is not implemented.

For editing, open the learner at `http://localhost:8081` (development) or `http://localhost:8082` (exported preview), choose Profile → Open curriculum editor (or `/#editor`), select a lesson, edit its fields, and save a draft revision. Preview the saved revision, inspect the answer keys and provenance, then explicitly confirm your review before publishing. Preview practice is temporary and does not change learner progress. Fields cover headings/outcome, topic, learner role, estimated level, vocabulary support, existing dialogue roles/French lines/English translations, and grammar. Vocabulary target words, pictures, exercises and dialogue line count/order stay fixed in this slice. Blank required fields prevent saving.

Estimated content levels are Foundations, A1 and A2; they do not measure learner proficiency. Explore includes a Foundations filter alongside A1/A2 (the bundled drafts remain A1/A2 until edited). A published topic change moves that lesson into the new topic bank when you explicitly load publications. Match the learner role name to the relevant dialogue speaker labels; those labels are edited separately.

Word notes may be empty, and noun gender can be changed separately. The revised bundled examples are draft revision 2. API startup appends these only above an exact, untouched bundled revision-1 draft; owner edits, publications and newer revisions stay intact. Existing notebook examples and review history are preserved.

Return to Profile → Load published lessons to save published revisions into this browser. Later draft changes stay separate. Previous attempts/notebook entries remain recorded when a new revision arrives. A newer revision starts its own lesson progress. Editor requests require the exact local browser origin and a guarded JSON request; this is local origin protection, not account authentication or public-hosting access control.

Profile also supports learning backup/restore. Download a private, unencrypted file containing attempts, manual review ratings, notebook entries and cached published lessons (not server drafts/credentials/recordings). Choose a backup to inspect counts/date, confirm the merge policy, then restore and reload learning. Existing personal notes win; duplicate events stay single; immutable conflicts abort the whole restore. Only supported UTF-8 backups up to 5 MB are accepted. Version 2 exports include ratings; version 1 files remain importable with no invented review history. Server curriculum has separate local snapshot commands below.

Device speech is optional, synthetic, and depends on an installed French browser/device voice. Text is always available. Per-topic downloads, the complete curriculum editor, production/listening review, microphone conversations, and mobile packages remain planned.

## Test the offline-ready preview

```sh
npm run build:web
npm run preview:web
```

Open `http://localhost:8082`. In Profile → Learn offline, choose Download for offline use and wait for Ready for offline use. This saves the app, all 60 bundled draft lessons and their pictures. You can then disconnect or stop both local servers and reload at the same address. Loaded publications, saved vocabulary, progress and manual review use the existing browser storage. Speech is not downloaded and may require a connection. Use the browser menu's Install/Add to Home Screen option if it is available; offline readiness is shown separately.

Port 8082 has separate browser storage from development on 8081. To bring existing learning across, download a private learning backup from the old address, then explicitly restore it in Profile at the new address. Do not clear the old browser data to make that transfer.

Profile shows download size, saved complete-copy size, progress, status and retry/update/removal controls. Updates retain previous complete copies for older tabs; removing downloaded assets clears all those app copies while preserving notebook, practice/review events and loaded publications. Interrupted staging files are cleaned on retry/removal; sizes describe complete-copy files and exclude staging/browser overhead. Keep a separate private learning backup because browser storage may be evicted.

This local route requires a browser with service workers, Web Locks and a secure localhost context. Expo development does not offer offline downloads. Actual phone/Safari installation and offline voice quality are unverified; this is not a public/LAN deployment.

## Back up and recover server curriculum

From the repository root:

```sh
npm run backup:curriculum
```

This prints the path of a new private SQLite snapshot under `data/backups/` and counts of lessons/stored revisions/publications. It includes every server curriculum revision, including unpublished edits, and can run while the API is open. It does not include browser learning data, `.env` files, recordings or credentials. Keep an off-device copy separately; local snapshots are unencrypted and ignored by Git. Use `--source PATH` and/or `--destination NEW.sqlite` to choose files explicitly.

To recover a backup, use its printed filename and choose a new destination:

```sh
npm run restore:curriculum -- --source "data/backups/YOUR-BACKUP.sqlite" --destination "data/recovered.sqlite"
```

Recovery validates SQLite integrity, the supported schema and every historical lesson revision, then writes a separate file. It refuses existing destinations and never replaces the running database. Source snapshots remain unchanged. The filesystem must support hard links; unsupported/invalid inputs fail without replacing files.

To use the recovered copy, stop the API instance you intend to switch, then set its database path before starting it. In PowerShell:

```powershell
$env:SMARTLINGO_DATABASE_PATH = 'data/recovered.sqlite'
npm run dev:api
```

The configured file must already exist and pass validation. Relative paths resolve from this repository root even when npm starts the API workspace. Normal startup seed preservation still applies; actual publications and owner edits remain intact. Keep the original database and snapshot separately. After stopping that API, `Remove-Item Env:SMARTLINGO_DATABASE_PATH` returns later starts to the default database. No real `.env` file is loaded automatically. Use `npm run backup:curriculum -- --help` or the restore equivalent for command help.

## Optional AI French practice

Open **Practice** to choose a lesson context and start a temporary French conversation. Send a message to receive French, its English translation, gentle feedback and an optional phrase to save in your editable notebook. English help is available with a message. Speaker buttons replay through the existing French device voice.

For microphone input, also configure `OPENAI_TRANSCRIPTION_MODEL` on the server. Record French captures up to thirty seconds locally. Stop recording releases the microphone; **Transcribe recording** explicitly sends the clip to OpenAI and may use API credits. Review/edit the resulting text before a separate **Send message** action. Discard, Stop conversation and leaving Practice clear temporary clips. Recording requires a supported browser and microphone permission; typing remains available if permission is denied. Clips are limited to two MiB; SmartLingo does not write them to disk or include them in backups. Provider processing/retention is separate from local temporary storage.

The local API needs `OPENAI_API_KEY` and `OPENAI_TEXT_MODEL` in its process environment. Choose a model your API account supports with the Responses API and Structured Outputs, then start `npm run dev:api`. The app never asks for or stores the key. No real `.env` file is loaded automatically; `.env.example` documents configuration. Restarting an already running API is required to load new environment settings.

Only explicit message sending or recording transcription calls OpenAI. Session creation, availability checks, recording locally, device replay and notebook saving do not. Text, selected context and explicitly submitted clips are processed externally; avoid private details. Conversations are temporary and are discarded when you leave practice, reload or stop. Explicitly saved phrases remain in your browser notebook. Provider retention is governed separately by your API account settings; conversation requests use `store:false`, which is not a zero-retention guarantee.

The API bounds session turns, reserves a daily attempt for each conversation or transcription call, permits one active call, and times out/cancels pending work. A manual retry keeps the request ID to recover an uncertain response. A confirmed failed attempt permits a fresh explicit send, which can use additional credits. Failed calls can consume allowance. Displayed attempts and provider-reported conversation token totals are local operational counters, not billing totals; transcription tokens are not reported here. Counters reset when the API restarts. Ordinary lessons remain available without AI configuration or network access. Real provider/model quality, microphones and audible voice still require owner testing.

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

- `build:web`: export the Expo web application to ignored `apps/learner/dist`, then generate its hashed offline file manifest.
- `preview:web`: serve that export on loopback at `http://localhost:8082`; build first. Leave the terminal running while opening/downloading it.
- `test:e2e`: run Chromium desktop and phone-sized browser checks (install once with `npx playwright install chromium`).
- `test:offline`: build the current export, then run isolated desktop/320px Chromium checks for cold offline launch, failure/retry/update, learner-data-preserving asset removal and stalled-network fallback. Stop the regular port-8082 preview first; tests refuse to reuse it.

See [verification](docs/TESTING.md) for test scope and device limitations.

## Working with Codex

Open this folder as the project and read [the setup guide](docs/CODEX_SETUP.md). Root AGENTS.md, roles, skills, and lifecycle hook definitions are now installed. The copies under [tooling](tooling/README.md) are retained as installation/validation sources. Runtime loading and hook trust must be checked in the Codex client.

For curriculum research, use `$french-curriculum-researcher` ([skill](.agents/skills/french-curriculum-researcher/SKILL.md)) to audit topic coherence, research sources or propose A1/A2 coverage gaps. Its seeds are planning drafts requiring conversion and owner review; they are not added to the app automatically.

Run `npm run setup:codex:plan` to check matching installed files. Use manual checks if your client does not load project hooks.

For this initial repository, `npm run setup:finish` performs that installation, checks/tests, and the initial local commit together. Preview with `npm run setup:finish:plan`. It refuses existing history, conflicting config, or pre-staged changes and never pushes.

The initial setup commit already exists; do not rerun `setup:finish` on this repository. During authorised work, the agent makes a reviewed, validated local commit after each completed step under the [checkpoint policy](docs/SESSION_WORKFLOW.md#automatic-checkpoint-commits).

Origin is configured for the owner-selected [SmartLingo repository](https://github.com/trinamntn08/SmartLingo). Consult the [checkpoint](docs/SESSION_CHECKPOINT.md) for the latest live-remote verification; cached refs alone do not prove a successful push. No public deployment is configured. Reference image rights are unverified; keep them as local design inputs until resolved.
