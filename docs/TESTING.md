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

Install dependencies with `npm ci`. Before the first browser run, use `npx playwright install chromium`. PowerShell users can use `npm.cmd` / `npx.cmd`. Browser checks start Expo on localhost:8081 or reuse that server; stop any unrelated server on that port first. They never start the API or call a paid provider.

## Existing checks

- `check`: repository structure, deliberately small TOML configuration subset, skill frontmatter, hook shape, local Markdown links, script syntax, Git whitespace, and TypeScript for application/shared/test code.
- `test:tooling`: 16 tests covering staged-secret scanning, ignored data, configuration parsing, installer behaviour, and lifecycle hooks in temporary repositories. These do not prove Codex runtime hook trust or loading.
- `test:app`: 19 tests covering validated draft content, answer alternatives/accents, revision-scoped progress, IndexedDB persistence/deduplication/conflicting IDs/concurrent appends, atomic word capture, device-speech failure/cancellation, API routes/configuration, SQLite migrations/revisions/seed safety/reopen/corruption.
- `test:e2e`: 10 Chromium checks across desktop and phone-sized projects. Restaurant journey through hidden help, wrong-answer retry, hint history, reload at each progress boundary, completion, notebook edits, two-tab capture preservation, storage denial, save retry, picture loading, and 320px keyboard navigation. Screenshots/traces stay in ignored `test-results/`.
- `build:web`: real Expo/Metro web export under ignored `apps/learner/dist`.

The staged check inspects actual index bytes for protected paths and high-confidence credential patterns without printing values. It cannot detect every secret and does not run the full application suite. This preview has no CI deployment service.

## Latest observation and limits

On 2026-11-14, the commands above passed during the first implementation slice; final staged checks are recorded in the session checkpoint. Expo `install --check` reported compatible dependencies. The actual loopback API returned health `ok` and two draft lessons. Desktop/390px screenshots and the 320px lesson preview were inspected; original SVG drawings render and navigation wraps.

This uses Chromium viewport/touch emulation, not a physical phone or Safari/native test. Audio tests use a fake device-speech boundary; audible French quality, browser voice installation, and owner curriculum/illustration review remain necessary. Device speech may depend on the browser's own voice service. The core text/picture lesson is independent of the API; service-worker offline installation and downloaded packs are not implemented.

`npm audit` reports three moderate findings along Expo → `@expo/fingerprint` → minimatch 10.2.6 ([upstream advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249)). The suggested automated fix downgrades Expo across SDKs. A pin override did not replace the workspace transitive dependency and was removed; no forced dependency change or audit suppression was retained. The vulnerable path is build-time glob processing; local preview validation is not a clean dependency audit. Revisit with an upstream-compatible release before wider distribution.

## Future validation

Review dates/timezones; editor preview/publication; import/export; downloaded packs and cache invalidation; microphone/permission handling; actual mobile and screen-reader checks. Owner review establishes French/English correctness and media suitability; automated schema checks cannot do that.
