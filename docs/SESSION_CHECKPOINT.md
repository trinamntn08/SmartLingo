# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised request

Owner requested completing the examples/gender/speaker work, committing, then continuing pending work until allowance ends. Owner also requested a testable preview before allowance ends. Standing reviewed/validated local commits apply; no push, merge or public deployment authorised.

## Completed application checkpoints

- f40ddcf: fuller original examples/translations for all 353 canonical entries, compact noun gender, optional notes and labelled 44px speaker/Stop controls, immutable draft revision2 seed refresh.
- fea47df: explicit offline Profile download/status/size/retry/update/removal; hash/size-validated staged CacheStorage; preserved old copies; three-second stalled-navigation fallback; Web Locks across worker generations; original SVG PWA icon/manifest; loopback export preview8082 and exact API origin extension. Asset removal preserves all learner IndexedDB stores/unrelated caches. All 18 tooling/79 application tests, repository/TypeScript/export, 31 development browser cases/one deliberate duplicate skip and six real exported-browser cases passed. Independent review and desktop/narrow screenshot inspection completed. Tree clean after commit.

## Current completed investigation

Branch chore/expo-build-tool-audit from fea47df. See docs/plans/0011-build-tool-audit.md. npm audit still reports three moderate linked findings. Registry current stable Expo58.0.25/fingerprint0.21.10 still requests minimatch10.2.6; patched minimatch11.0.8 has actual major-version changes. An ignored isolated comparison passed24 representative fingerprint Path-helper cases with the candidate. A scoped root override plus npm install and explicit workspace update still resolved10.2.6. The update only hoisted the vulnerable copy. All deliberate manifest/lockfile experiments were reverted; npm ci restored original locked packages and still reported3 moderate findings. No ineffective override, downgrade or suppression retained. This is documented unresolved work, not a successful vulnerability fix.

This small sequential investigation/self-review changed docs only. No new subagents; previous independent application review remains valid. Run final repository/TypeScript, staged secret/whitespace checks, focused documentation commit and verify log/clean tree. No need to repeat unchanged application/browser suites. npm ci warned that esbuild postinstall lacks an allowScripts entry; no global approval/config changes were made. Validate current commands before claiming a blocker from that warning.

## Owner preview running

Regular exported preview http://localhost:8082 PID30084; actual local curriculum API http://127.0.0.1:3001 PID16248. Both started hidden/loopback after isolated tests completed. Shared link and Profile offline test instructions with owner. Keep this exported build stable and running while owner tests; check listeners/process identity before stopping or duplicate starts. The fault-injection test server is stopped and must not replace the owner preview. API startup applies the reviewed immutable seed policy. Agent performed no learner save or real curriculum publication in the owner preview.

8082 and old development8081 use separate browser stores; private backup/restore transfers deliberately. Actual phone/Safari installation, SVG icon compatibility, screen readers, audible/offline voice and real browser quota/eviction remain unverified. Owner content/media review remains necessary. No real .env read, API key, paid call, push or merge.

## Next exact action

After committing the investigation, take the next bounded pending server curriculum backup/recovery slice on a fresh branch. Preserve all server revisions/publications and current owner preview. Prefer consistent SQLite snapshots and restore-to-new-file rather than automatic overwrite; record plan/contracts, consult current official Node SQLite docs, validate using temporary databases only, independent review for data safety, final checks and local checkpoint commit. Full editor/AI speaking/native/per-topic downloads remain later work. Revisit the build-tool audit when a compatible upstream release or reproducible validated resolution becomes available.

Usage/reset lookup unavailable; no allowance estimate or automatic resume configured. Owner authorised active-session continuation. Local commits are not off-device backups.
