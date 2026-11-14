# Verification

## Commands

```sh
npm run check
npm test
npm run test:e2e
npm run build:web
npm run check:staged
git diff --check
```

Install dependencies with `npm ci`. Before the first browser run, use `npx playwright install chromium`. PowerShell users can use `npm.cmd` / `npx.cmd`. Browser checks start Expo on localhost:8081 or reuse that server, plus an isolated in-memory API at 127.0.0.1:3002. Stop unrelated servers on those ports first. Editor tests proxy only the tested browser to this isolated API and never publish to the owner's on-disk database or call a paid provider.

## Existing checks

- `check`: repository structure, deliberately small TOML configuration subset, skill frontmatter, hook shape, local Markdown links, script syntax, Git whitespace, and TypeScript for application/shared/test code.
- `test:tooling`: 16 tests covering staged-secret scanning, ignored data, configuration parsing, installer behaviour, and lifecycle hooks in temporary repositories. These do not prove Codex runtime hook trust or loading.
- `test:app`: 54 tests covering content/answers, progress, IndexedDB migration/idempotency/cache, backup merges/format1→2 compatibility, speech fallback, content requests, SQLite editor/security and manual recognition scheduling. Review tests cover interval caps, supported/independent dates, early/same-day recall, edited-note revision scoping, timezone/DST and immutable IDs; v3 ratings persist and participate in backup rollback. Backup checks cover invalid/corrupt/oversized UTF-8 files and personal-note preservation.
- `test:e2e`: Chromium desktop/phone-sized learner regressions plus the isolated editor journey through draft save, preview isolation, explicit review/publication, later-draft separation, cache/reload and historical learning preservation. Narrow editor forms support keyboard entry and preserve unsaved text across learner navigation. Publication has one desktop writer; the duplicate mobile publication case is deliberately skipped against shared test content. Screenshots/traces stay in ignored `test-results/`.
- `build:web`: real Expo/Metro web export under ignored `apps/learner/dist`.

The staged check inspects actual index bytes for protected paths and high-confidence credential patterns without printing values. It cannot detect every secret and does not run the full application suite. This preview has no CI deployment service.

## Latest observation and limits

On 2026-11-14, the commands above passed during the first implementation slice; final staged checks are recorded in the session checkpoint. Expo `install --check` reported compatible dependencies. The actual loopback API returned health `ok` and two draft lessons. Desktop/390px screenshots and the 320px lesson preview were inspected; original SVG drawings render and navigation wraps.

The editor continuation also passed TypeScript, 16 tooling/36 application tests, the web export, and the final browser run (15 passed, one deliberate duplicate mobile publication skip). Desktop publication-review and 320px editor-field screenshots were inspected. Preview attempts/notebook changes remain isolated; published learner content survives API loss/reload while newer drafts stay separate.

The backup continuation passed TypeScript, 16 tooling/39 application tests, a focused recheck after the fatal UTF-8 decoding fix, and final web export. Final browser run: 17 passed, one deliberate publication skip; actual download/upload, no-write preview, restore to a fresh context, duplicate merge, reload and preservation of newer personal edits pass. Narrow backup-preview screenshot inspected. Generated test backups remain ignored test artifacts.

Manual review continuation: full browser run 21 passed/one deliberate publication skip, including DST, failed rating retry, reload, stale-tab focus refresh and backup rating recovery. Six review/backup browser cases were rechecked after note-revision scoping was added; all passed, including edit-after-rating fresh practice. The scheduler independently rejects early recall advancement even between UI refreshes. Current combined TypeScript/test/export results are in the checkpoint.

This uses Chromium viewport/touch emulation, not a physical phone or Safari/native test. Audio tests use a fake device-speech boundary; audible French quality, browser voice installation, and owner curriculum/illustration review remain necessary. Device speech may depend on the browser's own voice service. The core text/picture lesson is independent of the API; service-worker offline installation and downloaded packs are not implemented.

`npm audit` reports three moderate findings along Expo → `@expo/fingerprint` → minimatch 10.2.6 ([upstream advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249)). The suggested automated fix downgrades Expo across SDKs. A pin override did not replace the workspace transitive dependency and was removed; no forced dependency change or audit suppression was retained. The vulnerable path is build-time glob processing; local preview validation is not a clean dependency audit. Revisit with an upstream-compatible release before wider distribution.

## Future validation

Production/listening or adaptive review; full editor tools; downloaded packs and cache invalidation; microphone/permission handling; actual mobile and screen-reader checks. Owner review establishes French/English correctness and media suitability; automated schema checks cannot do that.
