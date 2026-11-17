# Session checkpoint

Updated: 2026-11-17 (Europe/Paris). Local beta preview preparation complete; owner testing is next. The commit containing this note is the checkpoint; its actual hash and verified upload are reported at handoff.

## Request and isolated source

Owner requested building and launching the latest preview, ready to test all available features. Fetched origin and created branch `chore/local-beta-preview` from `origin/feat/deployment-ready-beta` at `ac061ec`, in `D:\dev\projects\SmartLingo-sessions\local-beta-preview`. Original `D:\dev\projects\SmartLingo` remains clean on `docs/documentation-cleanup` at `0ab3feb`; existing worktrees were preserved. No merge, main update, external deployment, real curriculum publication or application-code change was performed.

Acceptance: build the 129-lesson/25-bank beta, verify existing suites, run a full local preview plus the static learner beta with isolated server data and no provider credentials, open the full preview for the owner, and provide a testing guide.

## Running previews and artifacts

- Full local export: <http://localhost:8084>. API/editor controls are enabled through the existing loopback configuration.
- Learner-only website beta: <http://localhost:8082>. Blank API configuration; ordinary study, notebook/review, backups, device speech and explicit offline download are available.
- Fresh worktree-local API: <http://127.0.0.1:3001/health>. Health is OK, `/lessons` returns 129. AI/transcription and neural speech report unavailable; usage counters are zero. The launcher passes an explicit credential-free configuration instead of inherited provider keys or database overrides.
- Hidden background launchers at handoff: API parent PID 16612, preview server PID 15600. Ignored `.tmp/local-preview-api.mts` and `.tmp/local-preview-server.mjs`; logs and PID files are alongside them. Local curriculum/speech data stays under this worktree's ignored `data/`. No earlier database was opened.
- Local export `apps/learner/dist`: 126 manifest files / 9,763,355 bytes, build `a91585f42cdafb5586d19ac196077ff8aa6de2bcd4d28c7d8a6e7d51516ed7b9`. No deployment-config.js, so the local API fallback is active.
- Static beta preserved under ignored `.tmp/website-beta-export`: 127 manifest files / 9,763,507 bytes, build `248854515a4a3f11404b8f608eb38519ef68cb2a6c67bcd07b4b5688a657b391`. Configuration is exactly blank API plus beta true. This is a local test export built while documentation was uncommitted, not a clean release artifact; `verify:beta` was not run or claimed.
- Actual Chrome window visibly rendered the full preview at localhost:8084, showing LOCAL PREVIEW, greetings-first Today and all topic controls. Browser automation then stopped while opening a second tab because its URL-confidence check could not determine the current browser URL. No further browser input was issued. The second preview is HTTP/hash verified but was not visually opened through Computer Use.
- Browser data was not cleared. Reusing an existing origin can retain that origin's earlier learning data; the two origins have separate stores. [Testing guide](LOCAL_BETA_TEST.md) covers exact addresses, testing order, data boundaries and local restarts. Processes may end on reboot; these are local-PC URLs, not phone/public hosting.

## Actual verification

- `npm.cmd ci --no-audit --no-fund`: PASS, 537 packages. npm reported an unapproved esbuild install-script warning; the installed executable subsequently ran the build/tests successfully. No dependency manifests changed.
- `npm.cmd run check`: PASS repository/documentation and TypeScript. `git diff --check`: PASS. Final documentation/staged checks follow before the checkpoint commit.
- `npm.cmd test`: PASS 20 tooling / 203 application tests.
- `npm.cmd run test:e2e -- --workers=2`: PASS 81 desktop/narrow Chromium cases, one intentional duplicate-publication skip. Uses isolated fixture API/fake providers.
- `npm.cmd run build:beta`: PASS; `npx.cmd playwright test --config playwright.hosted.config.ts`: PASS all 6 desktop/narrow beta cases, including no-localhost API probing, configured role isolation, backup and cold offline use.
- Preserved beta export with a checked native Move-Item, then `npm.cmd run test:offline`: PASS local production export plus all 8 desktop/320px offline cases, including interrupted/corrupt update recovery, asset removal preserving learning and stalled-network fallback.
- Ignored `.tmp/verify-served-previews.mjs`: PASS every served manifest file's HTTP status, exact bytes and SHA-256 for both running previews, totals, local-versus-beta configuration, API count and provider status. No real paid calls or secrets used.
- Initial `.ts` launcher import used CommonJS and could not import the API's top-level await; renamed it to `.mts` and verified the real API startup/health/count afterwards. This was a generated launcher issue; app source was unchanged.
- Primary reviewed the small documentation/helper change. Independent `change-reviewer` using exposed `gpt-6.1-sol`, medium, fresh context, read-only scope found no confirmed actionable documentation, isolation or credential issue. It did not run duplicate suites or inspect real .env/owner data. Primary verified final artifact/config/endpoint gaps after the review.

## Completion and next action

Owner next: start at localhost:8084 and follow [LOCAL_BETA_TEST](LOCAL_BETA_TEST.md). Check content and real French voice quality, then notebook/review, backups, offline and saved-draft preview. Explicit local test publication only affects this isolated server database. Real providers require later server configuration; no provider keys were read or activated here. Physical-phone/Safari/native, hardware microphone, screen-reader and curriculum-quality acceptance remain manual. No new audit was run; the beta branch's three moderate build-tool findings remain an inherited limitation.

Commit only `docs/LOCAL_BETA_TEST.md` and this checkpoint after final checks; push only `chore/local-beta-preview` normally and verify live remote SHA equals local HEAD. No generated artifacts, launchers, databases, logs, recordings or browser data belong in the commit. After verified delivery, preview preparation is complete; no feature implementation is pending under this request.

Usage allowance lookup unavailable in this client, not zero/unlimited. One bounded independent reviewer was used as noted above; no automatic resume or background commit service configured.
