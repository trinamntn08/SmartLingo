# Session checkpoint

Updated: 2026-11-17 UTC. Complete-content beta deployment preparation completed. Account creation, live hosting, domain setup and real provider activation remain owner steps, intentionally left blank.

## Authorised request and source

Owner requested all topics/materials/courses in beta without prior manual checking, then all preparation necessary for free deployment, with host/domain/API fields blank for later completion. Fetched current app branch and fast-forwarded clean docs baseline 2249086 to a3913dd; created feat/deployment-ready-beta. Selectively integrated complete research material from origin/chore/a1-a2-curriculum-review (8ba59ae) and useful hosted/offline work from origin/codex/free-learner-cloud-deploy (c88bc41). Preserved current focus fix, automatic push policy and architecture guide; did not merge stale copies or touch main.

## Delivered

- 129 complete lessons/25 banks, 819 vocabulary appearances, 757 canonical IDs/748 forms: all 123 prior lessons plus six bridge lessons and five grammar-only corrections. Historical fingerprints/IDs remain exact; guarded seed updates protect owner edits and publications. Draft provenance records unreviewed status without blocking beta use. Incomplete seed/gap proposals remain reference material, not invented courses.
- Free Cloudflare Pages export with blank public API URL, offline hash identity, safe host headers, clean-source release inspector and CI upload artifact. Public settings contain URLs only. Hosted browsers with no API never probe visitor localhost; ordinary lessons/notebook/review/backup/device speech remain available.
- Optional single-instance Node/Fastify/SQLite API hosted mode: separate owner/beta Bearer tokens, exact Host/origins, guarded CORS and JSON feature headers. Memory-only Profile token entry; public publication reads do not receive owner credentials. Provider keys stay server-side. Docker/Caddy package persists /app/data and runs non-root with read-only root filesystem.
- docs/DEPLOYMENT.md covers upload and Git build routes, optional free VM prerequisites, exact blank fields, secrets, HTTPS, backups and later device tests. No host account, resource, domain or live website created; no real provider/owner data accessed. README/status/architecture/testing updated.

## Verification

- npm run check: PASS repository/docs/TypeScript; git diff --check PASS. Final staged checks run before checkpoint commit.
- npm test: PASS 20 tooling and 203 application tests.
- Historical curriculum integrity validator --self-test: PASS all historical fingerprints plus eight rejected negative fixtures; runtime additions covered separately.
- Full final Chromium desktop/narrow regression: 81 passed, one intentional duplicate-publication skip. New header brand/badge width constraint fixes a reproduced 321.156px overflow at320px. Health-topic count assertions now derive from expanded real content.
- Exported offline suite: 8 passed, including interrupted/corrupt/update/removal/stalled-network and cold launch journeys.
- Hosted beta suite: 6 passed, including new family material, zero localhost calls, learning backup/restore/cold launch, configured API owner headers/public-read isolation and reload-cleared tokens. Output directories separated to avoid diagnostic deletion between suites.
- Docker image build PASS using this environment's trusted proxy CA as an optional temporary build secret; TLS verification remains enabled. Source files are made readable for non-root runtime. Isolated container smoke PASS:129 seeds, anonymous/beta editor denied, owner edit succeeds and survives container replacement on persistent volume, optional provider status responds without provider keys. Temporary test data/resources removed.
- Caddy configuration validation PASS. No live DNS/ACME certificate or real public-host behavior claimed.
- Fresh npm audit still reports three moderate Expo/fingerprint/minimatch build-tool findings, zero high/critical. An ineffective scoped override/lock resolution experiment was reverted fully; no dependency fix or suppression claimed. Revisit a compatible upstream resolution before wider distribution.
- Independent read-only release review found no confirmed actionable auth/CORS/configuration/curriculum or deployment-doc defect. API/UI/curriculum helpers worked exclusive paths with inherited active model/effort; no explicit model override/runtime role activation claimed. Usage lookup unavailable; no automatic resume configured.

## Delivery and next step

Commit these deliberate paths and push feat/deployment-ready-beta under standing owner authorisation, then read back remote SHA. Rebuild from the clean checkpoint and run npm run verify:beta; package the verified output as /workspace/smartlingo-beta.zip. The commit containing this note is the completed checkpoint; report its actual SHA and release verification result in the final response. A successful source push is not a live deployment.

Owner next: create Cloudflare Pages Free project and upload the zip, or connect the task branch using docs/DEPLOYMENT.md. No purchased domain or API credentials required for this learner beta. Optional API deployment and paid provider keys can be filled later. Changing API URL requires rebuild/reupload of the full export, not editing hashed deployed config. Owner reviews the content on the deployed site as requested. Physical phone/Safari/install/audio/screen-reader and real provider checks remain device/live-service verification.
