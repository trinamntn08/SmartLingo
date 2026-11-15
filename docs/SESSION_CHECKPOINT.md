# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised request and completed outcome

Owner requested review and repository integration of the downloaded `french-curriculum-researcher`. Completed on `chore/french-curriculum-researcher`, based on metadata checkpoint `6f6a58f`. The commit containing this checkpoint captures this step; report its actual hash after Git confirms it. No initial unrelated changes existed.

Installed all six skill resources under `.agents/skills/french-curriculum-researcher` and matching `tooling/agents/skills/` sources. Added author-workflow routing, invocation/docs, tooling inventory/resource-copy coverage, plan 0015 and ADR 0014. Kept supplied 32-topic/481-row seed data unchanged and unreviewed; Git normalises CSV line endings to LF while retaining its UTF-8 BOM. Corrected lesson pacing to 6–10 items, research/runtime import confusion, translation/original-example schema gaps, draft/owner publication boundaries and local checkpoint authorisation. Application content, shared runtime contracts, storage, dependencies and running preview were untouched.

## Actual validation and review

- `npm.cmd run check`: repository structure/metadata/Markdown links/script syntax/whitespace and TypeScript passed, including a final run after documentation/bootstrap-message edits.
- `npm.cmd run test:tooling`: all 18 passed, including fresh installation of all 15 files/resources, byte comparison, conflict refusal and idempotence.
- `npm.cmd run setup:codex` installed new resources; `setup:codex:plan` confirms all 15 match.
- `python -X utf8 .tmp/validate-curriculum-skill.py`: 32 unique topics (16 A1/16 A2), all 481 CSV rows match JSON/framework, source assets unchanged, installed/prepared resources match; Draft 2020-12 schema valid; translated research fixture accepted and eight invalid/mismatched records rejected. Bundled skill-creator `quick_validate.py` passes both skill copies.
- Validation Python packages are isolated in ignored `.tmp/skill-validation-deps`; no project/global dependency changes. Initial missing PyYAML/jsonschema and optional URI-checker gaps were resolved there. CSV parser uses `utf-8-sig` for the supplied BOM. The one-off harness is session-only; its fixtures are not authored curriculum.
- Independent instructionally read-only `change-reviewer`, actual `gpt-6.1-sol`/medium per session routing: no actionable findings. Bakery coverage forward-test identifies existing senses and a bounded payment cluster, marks proposals provisional with no browsing/publication. Primary reviewed the full integration and final diffs.
- Runtime/app/browser/export tests were not repeated: no application/content/storage edits. Prior metadata checkpoint passed 94 app tests and 33 browser regressions (one intentional duplicate publication skip), plus production export/offline fixture verification.
- Final `npm.cmd run check:staged` and cached/worktree whitespace checks passed; repeat the staged checks after this final note, then create the focused local checkpoint commit. Only deliberate skill/tooling/docs paths are staged; ignored validation packages/scripts, databases, exports and caches are excluded. Verify actual commit/log/clean tree. No push, merge or publication authorised/performed.

## Preserved owner preview

Prior verified preview: `http://localhost:8082` PID 30084; actual curriculum API `http://127.0.0.1:3001` PID 16248. Build `6b657e91158267075364018af5ef89e2d782dcae334b3cd3fde0fc71cd120811`, four files/1,250,949 bytes. This session did not probe/restart these processes or access learner/API data; check current listeners before future changes. Old downloads need explicit Update offline copy. Ports 8081/8082 have separate browser stores.

## Limits and next action

This owner request is complete after final checks/commit. Invoke `$french-curriculum-researcher` for the next requested topic research/audit; read its file directly if client discovery has not refreshed. Seed language/levels/originality, external source claims and automatic discovery are not verified by installation. Owner preview/review/publication is still required for actual curriculum. No new lessons, sources or seed approval were claimed.

Earlier product backlog remains: bounded duration/order or target/exercise editor fields, learner reset with cross-tab safety, full editor/media/import, AI speaking, native packages and per-topic packs. Do not start these solely from this integration request. Three moderate Expo/fingerprint/minimatch audit findings remain unresolved. Physical-phone/Safari/install-icon, audible voice, screen-reader, real quota/eviction and durability limits remain.

Usage observation on 2026-11-15 at 10:26 Europe/Paris: no account allowance/reset lookup tool exposed; unavailable, not zero/unlimited. No automatic resume scheduler configured. Local commits are not off-device backups.
