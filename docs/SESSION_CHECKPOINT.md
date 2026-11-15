# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised request

Owner requested completing examples/gender/speaker work, committing, then continuing pending work until allowance ends. Owner also requested a testable preview before allowance ends. Standing reviewed/validated local commits apply; no push, merge or public deployment authorised.

## Completed checkpoints

- f40ddcf: fuller original examples/translations for 353 canonical entries, compact noun gender, optional notes and labelled 44px speaker/Stop controls, immutable revision 2 refresh.
- fea47df: explicit offline download/status/size/retry/update/removal, hash/size-validated complete copies, three-second stalled-navigation fallback, cross-generation Web Locks, PWA manifest/SVG icon and loopback export preview on 8082. 18 tooling/79 application tests, check/export, 31 browser cases/one deliberate skip and six real offline cases passed. Independent review/screenshots completed.
- 5aa1bf2: documented unresolved Expo fingerprint/minimatch audit. Current stable dependencies still select vulnerable 10.2.6. Patched 11.0.8 passed 24 bounded path comparisons but scoped override/workspace update did not change actual resolution; experiments reverted, npm ci restored original lock. Three moderate findings remain, no downgrade/suppression/ineffective override retained.

## Current completed step: curriculum server snapshots

Branch feat/curriculum-database-backup from 5aa1bf2. CLI npm run backup:curriculum creates a read-only SQLite online snapshot of all draft/published revisions. npm run restore:curriculum requires source and fresh .sqlite destination; it makes another verified independent copy, never replaces the running DB. Full integrity_check(1), exact supported schema and bounded per-row validation reject corrupt/foreign/future/history/index errors. Exclusive hardlink publication refuses occupied/alias/racing targets. Private owned stages are cleaned; a valid published copy remains success if OS cleanup later fails. Hard-link filesystem required.

Explicit SMARTLINGO_DATABASE_PATH selects an existing validated recovery file for later API startup, rooted at repository root regardless npm workspace cwd. A missing/foreign file fails before migrations/seeding. Default original DB path and normal seed/publication preservation remain unchanged. No learner UI, dependency, served export, owner backup/restore or current API switch changed. Source adapter, CLI, config, commands/help, tests and docs all implemented; see plan 0012/ADR 0013.

## Review and actual checks

- api-builder offline_worker reused gpt-6.1-sol medium for snapshot module/10 tests only. Primary owned contracts/CLI/path/server/4 CLI-config tests/package/docs/integration. Independent read-only change-reviewer reused same model high.
- Reviewer reproduced quick_check accepting damaged PK-index correspondence/uniqueness, causing row scans/backup to accept corruption. Builder changed to full integrity_check(1), added exact corrupt-index fixture; reviewer independently passed targeted regression and reported no outstanding actionable finding.
- First Windows focused run failed because fsync used a read-only staging fd; staging now uses r+, source stays readOnly. Native progress deadline rejection/cleanup verified in isolated Node24 child.
- npm.cmd run check passed; repeat on final docs before commit.
- npm.cmd test passed 18 tooling/92 application before added index regression. After integrity fix, npm.cmd run test:app passed all 93. Coverage includes all history/publications/WAL, independent copies, existing/case/hardlink/concurrent targets, invalid old rows/schema/foreign objects/size limits, source-byte preservation, owned-stage cleanup, actual CLI child commands and isolated recovered-file API startup.
- npm.cmd run backup:curriculum -- --help and restore equivalent both passed without reading owner DB.
- Prior learner export/31 browser regressions/six offline cases are unchanged and not rerun. No key, real .env, paid call, provider or owner publication used.
- Remaining verification: explicit symlink/parent aliases, active concurrent-writer contention, non-hard-link volumes, power-loss directory durability. Final staged secret/whitespace checks/local commit follow. Stage deliberate source/tests/docs/.env.example/package only; exclude DBs/exports/logs/cache/fixtures. No unrelated initial edits.

## Owner preview remains running

Regular exported preview http://localhost:8082 PID 30084 and actual curriculum API http://127.0.0.1:3001 PID 16248 were started hidden/loopback after offline tests. Link shared; owner can test examples/gender/speakers and Profile offline download. Keep this served build stable; do not replace with fault-injection test server. Check listeners/process identity before stopping/duplicate starts. API startup applied reviewed immutable seed policy; agent saved no learner data or real publication in the preview. 8082 and old 8081 storage are separate; private backup/restore transfers deliberately.

Actual phone/Safari installation, SVG icon compatibility, screen readers, audible/offline voice and real quota/eviction remain unverified. Owner content/media review remains necessary. Preview readiness is independent of CLI-only backup additions.

## Next exact action

Run final check/staged secret/whitespace checks, commit reviewed completed snapshot step and verify log/clean tree. Then continue a small editor capability such as editing existing dialogue lines (French/English/role) through the existing immutable save/preview/publication path; keep stable IDs, exercise answers and owner's served preview intact. Record acceptance/plan, targeted editor validation and focused checkpoint before further scope. Destructive learner reset requires broader cross-tab/storage design and remains pending. AI speaking/native/per-topic downloads remain later work. Audit remains unresolved until compatible validated resolution.

Usage/reset lookup unavailable; no allowance estimate or automatic resume configured. Owner authorised active-session continuation. Local commits are not off-device backups.
