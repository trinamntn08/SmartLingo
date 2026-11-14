# Verification

## Existing tooling

```sh
npm run check
npm test
npm run check:staged
npm run doctor
```

The repository check verifies required files, the project's deliberately small TOML configuration subset, skill frontmatter, configured hook shape, relative Markdown links, script syntax, and Git whitespace. It is not a full Codex schema validator or a Codex runtime load test. Markdown discovery honours Git ignores and excludes protected learner-data paths even when staged.

The staged check inspects actual index bytes for protected filenames and high-confidence credential patterns without printing their values. It cannot detect every secret. Use a dedicated secret scanner/CI when external hosting is added.

Tests exercise positive/negative parsing, staged-versus-worktree behaviour, Unicode paths, nested-directory hook invocation, malformed input, and stop-hook recursion protection. They use temporary Git repositories and no network/paid APIs.

## Application validation to add with implementation
- Answer alternatives, accent handling, independent vs supported recall.
- Review dates/timezones, stable IDs, duplicate events, migrations.
- Editor publication/revisions and backup restore.
- Offline operation, cache invalidation, denied microphone, API failure/cancellation.
- Responsive/keyboard/screen-reader flows and actual device audio.
- Owner review of French text, translations, and synthetic audio.

Do not add a successful placeholder test command for unimplemented application features.
