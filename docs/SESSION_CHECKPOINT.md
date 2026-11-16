# Session checkpoint

Updated: 2026-11-16, Europe/Paris. GitHub/cloud preparation reviewed and locally validated; upload, Linux CI and environment activation follow this checkpoint.

## Authorised request and scope

Owner accepted setting up the proposed remote working route: upload current source to the existing GitHub repository, expose a tested draft PR, prepare a Codex Cloud environment, and verify phone access. Current branch `chore/cloud-workflow`, based on greetings checkpoint `d5a56ed` (previous request complete). Do not merge, deploy the learner, publish curriculum or transfer owner databases as part of setup.

## Completed preparation

- Live `git fetch origin` and branch listing verify only `main` at `1c6e943a3a2f4d9fdbf6886a71ac31c0d3b235ef`; it is an ancestor of `d5a56ed`, 27 commits behind. Existing owner-selected remote preserved. Working tree started clean.
- Added `.github/workflows/verify.yml`, `docs/CLOUD_WORKFLOW.md`, ADR 0020, and README/Codex setup links. Workflow runs existing checks and browser/offline journeys on Ubuntu 24.04 without provider secrets. Cloud guide names the current source branch so setup cannot silently use the old scaffold on `main`.
- Independent read-only change-reviewer (`gpt-6.1-sol`, medium; explicit fresh context) scanned all 1,095 newly reachable historical objects: 702 blobs, 27 commits, 366 trees. No protected paths or supported credential patterns. Bounded scanner cannot identify every key format or private JSON semantically. Review of workflow/docs found no actionable issue. Primary owns all edits and integration.

## Actual checks and capabilities

- `npm.cmd run check`: PASS repository checks and TypeScript.
- `npm.cmd test`: PASS 18 tooling / 190 application tests.
- Parsed workflow using installed `js-yaml`: PASS. First inline Node invocation failed because Windows argument quoting stripped quotes; corrected here-string/stdin invocation succeeds. No dependency changes.
- `git diff --check`: PASS before final documentation/staging; final staged checks and commit follow this note.
- Local browser/offline suites not repeated for tooling/docs changes; new remote Linux workflow must supply that evidence.
- GitHub connector read/write access verified. No Cloud environment-management tool exposed. Browser access host unavailable; native Chrome new tab opened, navigation blocked twice by concurrent user input. No login, permissions or account settings changed. Async question requests account-specific Cloud/Create environment availability while GitHub preparation continues.
- Account usage unavailable: no allowance tool exposed (2026-11-16). No automatic resume configured. Skills applied: openai-docs (prior investigation), computer-use; reviewer read the repository review skill.

## Exact next actions

1. Stage only cloud workflow/docs paths, run `npm.cmd run check:staged` and `git diff --cached --check`, commit and verify. Commit containing this checkpoint records the prepared step; report its actual hash after confirmation.
2. Push `chore/cloud-workflow` normally (no force) and open a draft PR against `main`. Verify remote SHA and wait for the actual Linux workflow results; fix reproducible failures within setup scope.
3. Finish account-specific Cloud environment creation using `docs/CLOUD_WORKFLOW.md`. Confirm the prepared source branch, runtime, actual setup tests and publication. User interaction may be required for login or unavailable UI controls. Then run the phone acceptance task.
4. Update this checkpoint with actual upload/CI/activation results and commit the focused handoff. Never claim an environment is active from a setup guide alone.

## Existing application state to preserve

Greetings-first implementation is complete at `d5a56ed`: 25 banks, 123 lessons, 765 appearances, 722 canonical senses, 713 forms. New greetings remain draft revision 1; owner content review/publication remains explicit. Prior validation and implementation details are preserved in that commit and STATUS.

Owner preview remains at `http://localhost:8082`, API `http://127.0.0.1:3001`; neither was restarted or changed for cloud preparation. No real `.env` reads, paid calls, new media/audio, curriculum publication or learner-data migration. Physical-phone/Safari/native, audible provider quality and screen-reader checks remain open. A cloud source checkout does not restore the local learner's notebook or editor data.
