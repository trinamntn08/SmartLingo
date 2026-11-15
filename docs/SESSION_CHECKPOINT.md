# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised request

Owner authorised completing pending work, committing each reviewed/validated step and continuing while allowance permits. Owner also requested a testable preview before allowance ends. No push, merge or public deployment authorised.

## Completed checkpoints

785f385 dialogue editing; b076f3d server curriculum snapshot/recovery CLI; 5aa1bf2 unresolved audit investigation; fea47df offline web downloads; f40ddcf examples/gender/speaker controls. Each was verified committed with clean tree. Audit remains at three moderate Expo/fingerprint/minimatch findings; ineffective experiments were removed and original lock restored.

## Current completed step

Branch feat/edit-lesson-metadata from 785f385. Editor now exposes required topic/learner-role text and estimated Foundations/A1/A2 buttons, with guidance distinguishing content difficulty from proficiency and matching dialogue roles separately. CatalogueLevel derives from existing Lesson levels, and Foundations has a filter. No schema/storage/API/content/dependency changes. Primary handled this small sequential step and self-review; no new delegation. See plan 0014.

Actual validation:
- npm.cmd run check passed; repeat on final docs before commit.
- npm.cmd run test:app: all 94 passed, including foundation publication grouping/search/filter test and previous snapshot/storage/security/review coverage.
- npm.cmd run test:e2e -- --output=.tmp/metadata-browser: full 33 passed, one intentional duplicate publication skip. Changed topic/Guest role/A2 survives isolated save/preview/publication/cache reload, correct new six-word topic/filtering and previous dialogue/history checks. No owner API publication.
- Separate candidate Expo export/prepareOfflineExport passed: four pack files, 1,250,949 bytes, build 6b657e91158267075364018af5ef89e2d782dcae334b3cd3fde0fc71cd120811.
- Promoted validated candidate into regular 8082 preview, preserving old hashed scripts and replacing index/manifest last. All four served hashes/sizes verify. Fresh fixture-only production browser renders metadata, downloads current assets and cold-loads offline with Foundations filter. No page errors/actual owner data access. Narrow screenshot inspected.
- Prior 18 tooling/six offline failure-update-removal cases cover unchanged modules and were not repeated. Final staged secret/whitespace checks and focused local commit follow; verify actual hash/log/clean tree. Stage only five source/test paths and related docs. Exclude exports/logs/screenshots/cache/databases. No unrelated initial edits.

## Owner preview running

http://localhost:8082 PID 30084 serves the current build above; http://127.0.0.1:3001 PID 16248 is the actual loopback curriculum API, still compatible with unchanged contracts. Owner has the link and can refresh to test examples/gender/speakers, Profile offline download and expanded editor fields. Keep both hidden loopback processes running; inspect listener/process identity before stopping/duplicate starts. No fault-injection test server is running. An old downloaded copy remains until explicit Update offline copy.

8082 and old development 8081 have separate learner stores; private backup/restore transfers deliberately. Agent performed no learner save, actual owner publication, actual curriculum backup/restore or API database switch in this preview. Snapshot CLI is available; selecting a recovery file requires a later explicit API restart. No real .env/key/paid call/provider/audio recording used.

## Next action and remaining limits

Finish final repository/staged checks and local commit. Next bounded pending work: duration/order or validated target/exercise editor fields; learner reset needs explicit cross-tab/storage design. Incorporate owner preview feedback when supplied. Keep IDs/history and approval boundaries; checkpoint one complete journey at a time. Full editor lifecycle/media/import, AI speaking, native packages and per-topic packs remain pending.

Actual phone/Safari/SVG installation, screen readers, audible/offline voice, real quota/eviction and some filesystem durability scenarios remain unverified. Owner curriculum/media approval required. Usage/reset lookup unavailable; no allowance estimate or automatic resume configured. A new owner message is needed to start another turn after this session stops. Local commits are not off-device backups.
