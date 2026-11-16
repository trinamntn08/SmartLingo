# Session checkpoint

Updated: 2026-11-16, Europe/Paris. Free learner website implementation, review and local validation are complete on `codex/free-learner-cloud-deploy`, created in a separate worktree from `origin/docs/free-testing-deployment` at `cf4fedb`; the original `chore/cloud-workflow` checkout remains untouched. Implementation checkpoint: `68b8d0f`.

## Current authorised scope and progress

Implement, validate, package, review, commit and push the explicit hosted learner configuration described in plan 0025, then deploy the reviewed artifact to a new Cloudflare Pages Free project when secure account access permits. No merge, force-push, existing-site replacement, paid service/call, owner-data upload or credential sharing is authorised.

Hosted mode is explicit and local remains the default. The hosted UI never mounts editor/publication, AI conversation/transcription or neural-generation controls; ordinary bundled study, pictures, dialogues, lesson practice, notebook/search/review/progress, backup/restore, offline download and device speech remain. The worker maps only the manifest `/index.html` network fetch to `/`, preserving its cache identity, exact decoded size/hash checks and every other redirect rejection. Pages headers, 404 and clean-source/build metadata are generated after the manifest; the inspector rejects dirty provenance, private/debug files, common credential patterns, limits or any manifest mismatch. Narrow focus/layout fixes preserve phone interaction and were traced to upstream focused fix `5d80acb` without merging the other branch.

## Actual validation and review

- Pinned Node 24.19.0/npm 11.17.0: `npm ci` and `npm run setup` pass. `npx playwright install --with-deps chromium` could not elevate to root on this managed runner; plain install obtained the pinned browser, but its missing system integration reproduced the environment's known touch failures. The supported preinstalled `/usr/bin/chromium` was used for the complete matrix.
- `npm run check`: PASS. `npm test`: PASS, 19 tooling and 194 application tests. Host-shaped worker tests include root mapping plus strict redirect/hash/error cases.
- Complete two-worker system-Chromium E2E: PASS, 81 passed and three intentional skips across desktop and narrow/touch projects, including the added focus-stability regression.
- `npm run test:hosted`: PASS, two exported-build capability checks. Both block/count loopback traffic and observe zero requests through `/#editor`, Practice and Profile.
- `npm run test:offline`: PASS, eight desktop/narrow explicit-download, cold launch, interrupted/corrupt update, learner-data-preserving removal and stalled-network fallback cases.
- Independent read-only reviewer found two medium provenance/stale-artifact defects. `test:hosted` now rebuilds hosted mode; metadata records worktree state and the inspector rejects dirty artifacts. No remaining confirmed correctness/privacy/offline finding. Actual Pages headers, 404s, hosted byte verification and hosted offline journey remain publication-time evidence.
- No real `.env`, owner database/profile, credential, recording, provider request or paid call was accessed. Usage allowance remains unavailable, not zero/unlimited. Delegation used inherited model for exclusive UI and worker scopes plus read-only review; no model override or paid API was used. No automatic resume is configured.

## Publication blocker and next exact action

Commit these deployment/status/checkpoint documents, then rebuild and inspect the exact clean committed hosted artifact. Push this task branch without force and open a draft PR if supported. Current environment status exposes no Cloudflare outbound identity, runtime variable or secret, and restricted network policy does not include Cloudflare hosts. Secure setup must provide a Cloudflare account connection/secret binding outside chat with permission limited to creating/deploying a new Pages project, plus network access to Cloudflare's API. Then verify the current Free plan, create a new `smartlingo-test` or unused variant, deploy only `apps/learner/dist`, and run the hosted HTTP/browser/offline checklist. No live URL or deployment ID exists yet.

---

## Previous documentation handoff (historical)

Updated: 2026-11-16, Europe/Paris. Cloud deployment handoff documentation complete. The commit containing this note is the local checkpoint; report its hash and verified remote result at handoff.

## Authorised request and outcome

Owner requested: write the deployment instructions in docs, push to remote, and provide a copyable prompt for Codex Cloud to implement/deploy remotely. Branch docs/free-testing-deployment started this step clean at 042e7ca. The preceding free-hosting plan is preserved in [plan 0025](plans/0025-free-web-testing.md).

Added [the complete Cloud execution prompt](CLOUD_DEPLOY_PROMPT.md), linked from the plan and [cloud workflow](CLOUD_WORKFLOW.md). It names the correct source branch, requires actual app/offline hosting preparation, local and hosted checks, focused commits/push/draft PR, and a new free Cloudflare test deployment when secure account access exists. It forbids paid calls/upgrades, merging, history rewriting, owner-data upload and unauthenticated local API exposure. Missing account access must not prevent finishing the reviewable release; the prompt requests only the remaining secure setup after that work.

This step is documentation and authorised branch upload only. No production code/configuration/dependency changes, app build, real .env or owner database access, provider call, account setup or deployment. Original local API/previews remain untouched. Physical phones, Safari/audio and Cloudflare account access are not verified. No website URL is claimed live.

## Remote inspection and actual validation

- git fetch origin: PASS. Origin remains https://github.com/trinamntn08/SmartLingo.git. origin/main is 1c6e943; origin/chore/a1-a2-curriculum-review is available. Before this new checkpoint, only 042e7ca was not already reachable from fetched origin refs. Target docs/free-testing-deployment had no remote head at inspection. No remote integration or rewrite is needed.
- npm.cmd run check: PASS repository/documentation and TypeScript checks for the new prompt/links/status. git diff --check: PASS. Final checkpoint/staged checks and commit follow this note.
- Primary reviewed prompt against plan 0025, current branch ancestry and Cloud workflow. No application/browser/offline suites rerun: no runtime change. Prompt lists those as future execution requirements, not completed checks.

## Final upload and next exact action

Stage only docs/CLOUD_DEPLOY_PROMPT.md, docs/CLOUD_WORKFLOW.md, docs/plans/0025-free-web-testing.md, docs/STATUS.md and this checkpoint. Run npm.cmd run check:staged and git diff --cached --check, commit, then push docs/free-testing-deployment to origin without force. Verify the remote branch hash equals local HEAD and report the result. If push fails, preserve this checkpoint, record the actual blocker and do not claim the source is accessible in Cloud.

After verified upload, owner can select the SmartLingo repository/environment and docs/free-testing-deployment branch in Codex Cloud, then paste the execution prompt. Cloud must fetch and branch from the actual current remote source rather than old main. It may need secure Cloudflare account access to publish; no access is established by this document. This local task does not itself implement or deploy the website.

## Usage and preserved context

Usage observation 2026-11-16: account allowance tool unavailable, not zero/unlimited. No automatic resume configured. No delegation or model override; bounded sequential documentation handled by primary. Previous planning checkpoint: git show 042e7ca:docs/SESSION_CHECKPOINT.md. Curriculum research/checkpoint: git show 8ba59ae:docs/SESSION_CHECKPOINT.md. Cloud setup history: git show 1c5b5d4:docs/SESSION_CHECKPOINT.md. Existing learner data remains browser-local; backup/restore is the transfer route, not account sync.
