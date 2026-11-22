# Verification

This guide describes the checks in the current checkout. Record actual results and unrun checks in [the session checkpoint](SESSION_CHECKPOINT.md); a listed command is not evidence that it has passed.

## Commands

Install the pinned [runtime and local dependencies](ENVIRONMENT.md) with `npm ci`. Before the first browser run, use `npx playwright install chromium` (Linux CI needs `--with-deps`). PowerShell users can use `npm.cmd` / `npx.cmd`.

```sh
npm run check
npm test
npm run test:e2e -- --workers=2
npm run test:offline
npm run test:android-contract
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
| `test:offline` | Six exported-browser cases across desktop/320px for explicit download, interrupted/corrupt transfer, update, removal and stalled-navigation fallback. Uses test-only response controls; the production server has none. |

`npm test` runs tooling and application suites. The [GitHub workflow](../.github/workflows/verify.yml) runs those checks plus Chromium and offline journeys on Ubuntu with isolated fixtures, read-only repository permissions and fake providers. It creates no deployment; remote job success must be verified separately.

Development browser tests use `localhost:8081` (reusable outside CI) and an isolated in-memory curriculum API at `127.0.0.1:3002`. Only the tested browser is routed to that API. The offline suite starts its own server on `localhost:8082` and refuses to reuse a listener. Check listeners first. If the owner preview occupies 8082, preserve it: defer the suite or deliberately use reviewed temporary fixture/config copies with distinct ports and record the substitutions. Do not stop owner processes automatically.

Tests use temporary databases and browser contexts, not owner databases/profiles. Browser traces/screenshots live in ignored `test-results/`. The staged scan rejects known protected paths/high-confidence credential patterns without printing values; it cannot detect every secret. Tooling checks do not prove runtime role/hook discovery or trust.

## Historical evidence

Per-step results, test counts, export hashes, screenshots, initial failures and fixes through 2026-11-15 are preserved in Git:

```sh
git show cf4fedb:docs/TESTING.md
```

These describe their tested revisions, not a fresh run of the current checkout. Focused records remain in the [saved-speech plan](plans/0022-cached-french-speech.md), [offline plan](plans/0010-offline-web-downloads.md) and [build-tool audit investigation](plans/0011-build-tool-audit.md). Use [status](STATUS.md) for current product scope and the checkpoint for the latest validation.

## Android test package

`npm run android:doctor` checks local JDK/SDK prerequisites; `npm run build:apk` exports current assets and assembles a debug APK. See [Android testing](ANDROID_TESTING.md) for install/update/data-loss limits and the physical-device checklist. Tooling tests cover prerequisite/argument handling and build failure paths. `test:android-contract` runs isolated exported Chromium fixtures on port 8084, simulating Capacitor to check hidden PC features, notebook/course persistence, delayed/cancelled document-save feedback and unchanged web backup downloads. It does not run Android Java, a system document picker or a real phone. Native Gradle/signature/package inspection and device observations must be recorded separately.

## Known gaps

- Chromium viewport/touch emulation is not physical-phone, Safari, Android/iOS or screen-reader verification. An Android test shell is available; full native SQLite/audio adapters remain future work.
- Fake speech and an original test MP3 establish playback/control behaviour, not audible French quality, OS voice installation, real microphone hardware or provider/subscription compatibility. No paid provider success is established by these suites.
- Real storage quota/eviction, power loss, ongoing multiprocess contention and some filesystem alias/durability scenarios remain unverified. Browser data can be cleared; keep private backups separately.
- Automated content/schema checks do not establish French teaching accuracy, complete CEFR alignment, owner approval or media suitability. Curriculum remains subject to saved-revision preview and explicit publication.
- Per-topic offline packs, bulk speech, full editor tools and production/listening or adaptive review remain future work. Whole-app download and explicit saved-speech replay are implemented.
- The last recorded dependency audit (2026-11-15) reported three moderate Expo/fingerprint/minimatch findings and no high/critical findings. The attempted override was reverted; no remediation is claimed. Consult the [investigation](plans/0011-build-tool-audit.md) and run a fresh audit before making a current security claim.

Hosted-mode implementation and its reported checks now exist on the separate `codex/free-learner-cloud-deploy` branch; they are not integrated into this checkout or included in the results above. [Plan 0025](plans/0025-free-web-testing.md) records the inspected branch/blocked publication. Local checks do not establish a live website, public hosted acceptance or account sync.
