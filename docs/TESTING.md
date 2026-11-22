# Verification

This guide describes the checks in the current checkout. Record actual results and unrun checks in [the session checkpoint](SESSION_CHECKPOINT.md); a listed command is not evidence that it has passed.

## Commands

Install the pinned [runtime and local dependencies](ENVIRONMENT.md) with `npm ci`. Before the first browser run, use `npx playwright install chromium` (Linux CI needs `--with-deps`). PowerShell users can use `npm.cmd` / `npx.cmd`.

```sh
npm run check
npm test
npm run test:e2e -- --workers=2
npm run test:offline
npm run build:web
npm run check:staged
git diff --check
```

`test:offline` already builds the export; run `build:web` separately only when an export is needed without that suite. Before committing, also run `git diff --cached --check`. Stage deliberate paths first: `check:staged` inspects index bytes, not just working-tree files.

## Coverage and isolation

| Command | Scope |
| --- | --- |
| `check` | Repository structure, the supported TOML subset, skill metadata, hook shape, local Markdown file links, script syntax, Git whitespace and TypeScript. Link anchors and external URLs are not validated. |
| `test:tooling` | Secret/protected-path checks, configuration/installers, temporary-repository hooks, offline manifests and the guarded static preview server. |
| `test:app` | Content IDs/answers/order/solvability and media guards; progress, review and notebook/backup persistence; IndexedDB and SQLite integrity/migrations; immutable seed refresh and editor/publication isolation; curriculum snapshot recovery; audio, temporary conversation/transcription and saved-speech boundaries. Provider calls use fakes. |
| `test:e2e` | Chromium desktop and narrow learner/editor journeys, validation, explicit preview/publication, cache/reload, notebook/search/review/backups, fake AI/recording and saved speech. One duplicate narrow publication case is deliberately skipped because test content is shared. |
| `build:web` | Expo export plus offline-manifest/worker preparation under ignored `apps/learner/dist`. This is not a deployment. |
| `test:offline` | Exported-browser journeys across desktop/320px for explicit download, interrupted/corrupt transfer, update, removal, cold learning/report/resource use and stalled-navigation fallback. Uses test-only response controls; the production server has none. |

`npm test` runs tooling and application suites. The [GitHub workflow](../.github/workflows/verify.yml) runs those checks plus Chromium and offline journeys on Ubuntu with isolated fixtures, read-only repository permissions and fake providers. It creates no deployment; remote job success must be verified separately.

Development browser tests use `localhost:8081` (reusable outside CI) and an isolated in-memory curriculum API at `127.0.0.1:3002`. Only the tested browser is routed to that API. The offline suite starts its own server on `localhost:8082` and refuses to reuse a listener. Check listeners first. If the owner preview occupies 8082, preserve it: defer the suite or deliberately use reviewed temporary fixture/config copies with distinct ports and record the substitutions. Do not stop owner processes automatically.

Tests use temporary databases and browser contexts, not owner databases/profiles. Browser traces/screenshots live in ignored `test-results/`. The staged scan rejects known protected paths/high-confidence credential patterns without printing values; it cannot detect every secret. Tooling checks do not prove runtime role/hook discovery or trust.

The unified Learn coverage includes same-language sentence-question construction (duplicate/ambiguous mappings, contextual varied choices, fallback and immutability), language-separated resource metadata, French/Japanese listening/replay/transcript/feedback/error and scripted speaking roles, and optional French AI/microphone cleanup on mode changes. External resources remain link-only; tests check safe destinations and absence of provider requests, not provider audiovisual quality. The offline resource journey exercises no-voice transcript/answer fallback after a cold launch.

Alphabet coverage checks the 92-form inventory and readings, known-ID/revision row progress, Hiragana-first continuation, wrong-answer study versus mastery, save retry identity and backup preservation. Visual-path browser cases check card selection, no dropdown, current/studied accessible names, keyboard Tab/Enter and 320px overflow. A cold-offline case resumes saved Hiragana and freely browses/practises Katakana with visible readings and no API request. These checks do not establish handwriting or native-speaker pronunciation quality.

Maintenance coverage includes the API-local disconnect helper (pending/completed/already-disconnected responses and listener release after errors), invalid service options rejecting before speech database acquisition, and direct editor hash navigation cancelling learner speech while preserving the mounted lesson/activity. These use fakes or temporary storage. Content extraction is also checked against unchanged runtime payload fingerprints; see [maintenance review](CODEBASE_REVIEW.md). Shared design-token extraction preserves existing values rather than adding tests that merely restate token constants.

## Optional Japanese voice protocol checks

The compact Python service has model-free protocol tests, separate from `npm test`:

```sh
python -X utf8 -m unittest discover -s scripts/japanese_voice -p test_server.py
```

Live synthesis requires the explicit setup and running services in [Japanese audio](JAPANESE_AUDIO.md). Ordinary suites fake the speech boundary and do not download models or make paid calls. Written kana/romaji checks and decoded playback do not establish native-speaker pronunciation quality. This documentation sync does not claim a fresh live-engine or browser run.

## Historical evidence

Per-step results, test counts, export hashes, screenshots, initial failures and fixes through 2026-11-15 are preserved in Git:

```sh
git show cf4fedb:docs/TESTING.md
```

These describe their tested revisions, not a fresh run of the current checkout. Focused records remain in the [saved-speech plan](plans/0022-cached-french-speech.md), [offline plan](plans/0010-offline-web-downloads.md) and [build-tool audit investigation](plans/0011-build-tool-audit.md). Use [status](STATUS.md) for current product scope and the checkpoint for the latest validation.

## Known gaps

- Chromium viewport/touch emulation is not physical-phone, Safari, Android/iOS or screen-reader verification. This branch has no Android build/run commands. Separate Android test-APK work on `origin/feat/android-test-apk` (`0d21d67` at inspection) is not covered by these commands; consult [repository state](REPOSITORY_STATE.md). iOS packaging and remaining native adapters are not established by this branch.
- Fake speech and an original test MP3 establish playback/control behaviour, not audible French quality, OS voice installation, real microphone hardware or provider/subscription compatibility. No paid provider success is established by these suites.
- Real storage quota/eviction, power loss, ongoing multiprocess contention and some filesystem alias/durability scenarios remain unverified. Browser data can be cleared; keep private backups separately.
- Automated content/schema checks do not establish French/Japanese teaching accuracy, complete CEFR alignment, JLPT equivalence, owner approval or media suitability. Bundled drafts require owner/qualified review; the French editor additionally requires saved-revision preview and explicit publication.
- Per-topic offline packs, bulk speech, full editor tools, independently assessed production/listening and adaptive review remain future work. Whole-app download, saved-speech replay and temporary guided listening/speaking are implemented.
- The last recorded dependency audit (2026-11-15) reported three moderate Expo/fingerprint/minimatch findings and no high/critical findings. The attempted override was reverted; no remediation is claimed. Consult the [investigation](plans/0011-build-tool-audit.md) and run a fresh audit before making a current security claim.

Hosted-mode implementation and its reported checks now exist on the separate `codex/free-learner-cloud-deploy` branch; they are not integrated into this checkout or included in the results above. [Plan 0025](plans/0025-free-web-testing.md) records the inspected branch/blocked publication. Local checks do not establish a live website, public hosted acceptance or account sync.
