# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Owner request and completed checkpoints

Continue authorised pending work, commit each reviewed/validated step, and leave a testable preview before allowance ends. No push, merge or public deployment authorised. Latest prior checkpoints: b076f3d curriculum snapshot CLI/recovery; 5aa1bf2 unresolved audit investigation; fea47df offline web downloads; f40ddcf everyday examples/gender/speakers. Earlier hashes remain in STATUS/history. Tree was clean after each commit.

## Current completed step

Branch feat/edit-dialogue-lines from b076f3d. Primary implemented/self-reviewed the small sequential UI-only change: existing dialogue speaker roles, French text and English translations now editable through typed immutable line updates in DraftFields. Same save/preview/explicit publication/cache flow, no schema/storage/API/content/dependency change. Line count/order, vocabulary targets, exercises and media remain fixed. No subagent needed for this step. See plan0013.

Actual verification:
- npm.cmd run check: repository/TypeScript passed; final documentation check follows before commit.
- npx.cmd playwright test tests/e2e/editor.spec.ts --output=.tmp/dialogue-browser: seven passed, one existing deliberate duplicate publication skip. Role/French/English survives saved preview/publication and cached reload with API unavailable. Preview leaves real test history unchanged. Empty French sends zero draft POSTs; corrected form enables save. 320px/home navigation preserves unsaved dialogue.
- Narrow dialogue screenshot inspected. Existing 18 tooling/93 application tests and full31 browser/six offline baselines were not redundantly repeated for unchanged modules.
- Separate Expo production export to .tmp/dialogue-export and prepareOfflineExport passed: four files/1,249,933 decoded bytes, build e023717829ac25b301863e92f2972ecc2f984c0ceca9551755e9925434e227a7.
- After validation, copied candidate assets into regular preview, retaining old hashed scripts for existing tabs and replacing index/manifest last. All four HTTP-served hashes/sizes verify. Isolated fixture-only production browser renders new fields with no page errors or submitted edits; actual owner curriculum was not read/written by this smoke. API health ok. Owner told to refresh when ready.
- Final staged secret/whitespace checks and focused local commit follow; verify actual hash/log/clean tree. Stage only UI/test and related docs, exclude candidate exports/screenshots/logs/caches. No unrelated initial changes.

## Running owner preview

http://localhost:8082 (PID30084) now serves the validated dialogue-editor build above; actual local API http://127.0.0.1:3001 (PID16248) remains running with its previous loaded code, compatible unchanged editor contract. Both are hidden/loopback. Keep preview running; check listener/process identity before stopping or duplicate starts. The fault-injection offline test server is stopped. Owner can test examples/gender/speakers, offline download, and new dialogue fields after refresh. An old downloaded copy stays available until explicit Update offline copy; new online navigation loads current app assets.

8082 and old development8081 use separate learning stores; private backup/restore transfers deliberately. Agent performed no learner save, real owner publication, actual curriculum snapshot/restore or API database switch. Snapshot CLI commands are available in source; switching recovered files needs a later explicit API restart. Actual phone/Safari/SVG installation, screen readers, audible/offline voice, real quota/eviction and some filesystem durability scenarios remain unverified. Owner review remains required.

## Next exact action and limitations

Finish final checks/local commit. Then a bounded next editor slice can expose lesson topic, learner role and estimated level through the same validated revision path. Preserve IDs/exercises/history, explain estimated levels, verify filtered/topic grouping after publication and keep owner preview stable until a tested candidate is ready. Destructive learning reset requires cross-tab/storage design and remains pending. Full editor create/archive/media/target/exercise editing, AI speaking/native/per-topic packs remain later work.

Three moderate Expo/fingerprint/minimatch findings remain unresolved; no downgrade/ineffective override/suppression retained. npm ci restored original dependencies after the investigation. Usage/reset lookup unavailable; no allowance estimate or automatic resume configured. Owner authorised active-session continuation. Local commits are not off-device backups.
