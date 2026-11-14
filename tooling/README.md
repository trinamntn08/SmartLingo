# Prepared Codex configuration

Files in codex/ and agents/ are validated installation sources. The latest setup command successfully installed matching files in root .codex and .agents; runtime loading and hook trust still require client verification. Earlier direct patch attempts were rejected by the managed session.

From a local terminal in the project root:

```sh
npm run setup:codex:plan
npm run setup:codex
npm run check
```

The installer refuses to overwrite different existing files and does not change global configuration or hook trust. Keep sources and installed files in sync deliberately; if they differ, review changes manually instead of forcing an overwrite.

After installing, review hooks in Codex. Commit the activated .codex/.agents files when satisfied. Keep these sources while the managed editing restriction remains; the structural check validates both when present.
