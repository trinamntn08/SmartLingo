# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised request and completed outcome

Owner requested completing the unfinished examples/gender/speaker task, committing, then continuing pending work until allowance ends. Owner also requested a testable preview before allowance ends. Standing reviewed/validated local commits apply; no push, merge or deployment authorised.

Previous complete checkpoint f40ddcf covers fuller examples for all 353 canonical entries, compact gender, optional notes and labelled 44px speaker/Stop controls, with immutable draft revision2 refresh. Its tree was clean after commit.

Current completed step on feat/offline-web-downloads: explicit Profile download of the exported app/60 draft lessons/pictures, available/saved complete-copy sizes, progress/status/retry/update and confirmed asset removal. Staged size/SHA256 checks and final completion records preserve working copies across failures. Root/index navigation falls back after a three-second deadline, including query navigations/stalled connections. Only owned CacheStorage is removed; all learner IndexedDB stores and unrelated caches remain. Browser management requires secure service workers and Web Locks across generations. Original SVG PWA icon/manifest and loopback export server on 8082 added. API allows only exact 8081/8082 loopback origins. No new dependencies, paid calls or automatic publication. Per-topic packs/downloaded speech/native delivery remain planned.

## Review and actual validation

- npm.cmd run check passed repository/TypeScript. Repeat on final documentation before checkpoint commit.
- npm.cmd test passed 18 tooling and 79 application tests, including 11 VM worker cases for integrity, rollback/failure, eviction, cross-generation locks and document deadlines.
- npm.cmd run build:web passed; current pack has four files/1,248,979 decoded bytes. npm.cmd run test:offline now builds first to avoid stale exports.
- npm.cmd run test:e2e -- --output=.tmp/browser-regression: 31 passed, one existing deliberate duplicate publication skip.
- npm.cmd run test:offline: all six desktop/320px cases passed. Verified cold offline reload with published fixture/notebook/events/reviews, actual loaded pictures, interrupted download/retry, corrupt update retaining previous complete copy, successful newer-copy fallback, cache-only removal preserving all four stores/unrelated cache and failed offline launch after removal, plus real stalled-navigation/query fallback within a few seconds.
- Desktop ready/narrow error screenshots inspected. Initial failure fixtures were corrected: Chromium transparently retried one broken socket; page.content omits a comment outside html. Stable fault mode/version meta fixed those tests. No check was bypassed.
- api-builder offline_worker (gpt-6.1-sol medium) owned worker/VM tests; ui-builder offline_ui (same model medium) owned panel/hook. Independent read-only change-reviewer (gpt-6.1-sol high) found the unbounded document wait; builder fixed it, reviewer independently passed two targeted regressions and reported no outstanding actionable finding. Primary owned contracts/browser adapter/export/static server/API origin/App/browser tests/docs/integration and reviewed all changes.
- Final staged secret/whitespace checks and actual local commit follow; verify Git log/status before claiming hash. No unrelated initial edits; all current source/tests/docs belong to this step. Exclude exports, logs, screenshots, caches, databases and keys.

## Owner preview running

After all isolated suites completed, started the regular exported preview http://localhost:8082 (PID 30084) and actual local curriculum API http://127.0.0.1:3001 (PID 16248). Confirmed HTTP200 and health ok, then shared link/test instructions with owner. Processes are hidden and loopback-only; check live listeners/process identity before stopping or duplicate starts. Leave this stable export running while owner tests. The test fault-injection server is stopped and must not replace the owner preview. Agent did not save learner events or publish curriculum in this preview; actual API startup applies the reviewed immutable seed policy to the local DB.

8082 and old development 8081 use separate browser stores. Owner can explicitly transfer private learning backup/restore. Actual phone/Safari installation, SVG install-icon compatibility, screen readers, audible/offline voice and real browser quota/eviction remain unverified. Owner content/media approval remains necessary.

## Next exact action

Run final repository/TypeScript and deliberate staged secret/whitespace checks, commit this reviewed completed step, then verify log/clean tree and report actual hash. Continue with a bounded investigation of the three documented Expo fingerprint/minimatch build-tool audit findings on a fresh topic branch. Prefer an upstream-compatible fix; never force an SDK downgrade or ineffective override. Keep the owner's served export stable while investigating. If no compatible fix exists, document evidence before moving to the next bounded curriculum-backup/editor task.

Usage/reset lookup unavailable; no allowance estimate or automatic resume configured. Owner authorised continuation during this active session. Local commits are not off-device backups. No remote push/merge/public hosting or real owner publication performed by the agent.
