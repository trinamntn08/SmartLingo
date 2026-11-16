# Session checkpoint

Updated: 2026-11-16, Europe/Paris. Free website deployment planning complete. The commit containing this note is the local checkpoint; report its hash after Git confirms it.

## Authorised request and outcome

Owner requested a detailed plan to deploy SmartLingo to a website for testing now, preferably free. [Plan 0025](plans/0025-free-web-testing.md) recommends a Cloudflare Pages Free learner-only export: no domain purchase, backend or paid provider needed. It includes runtime-specific preparation, release commands, dashboard upload, data transfer, phone/offline acceptance, CI upgrade, recovery and separate backend requirements. Pricing/limits and provider behaviour were checked against linked official documentation today; no account or hosted deployment was tested.

Branch docs/free-testing-deployment started from clean 8ba59ae; all curriculum research and inherited checkpoints are preserved. Scope is documentation only: plan, STATUS and this checkpoint. No application/configuration/dependency changes, build/export, owner database/real .env access, provider calls, publication, push, merge, account setup or deployment. Original previews/API remain untouched. No skill or subagent was needed for this bounded sequential planning task.

## Findings and actual verification

- Static bundled learning can be hosted independently of Fastify. Current source has 25 banks/123 lessons; research candidates remain unregistered.
- Local content/practice/speech clients hard-code loopback. Public release needs explicit hosted capability gating; a hosting env var alone is insufficient. Authenticated editor hosting is not implemented.
- Cloudflare documents HTML canonical redirects; the manifest/validators require /index.html and the worker rejects redirects. Plan proposes a narrow root-fetch/cache-key adaptation retaining integrity checks, plus host-shaped and live verification. No fix is claimed.
- Host control-file exclusions, genuine missing-file responses and revalidation/unchanged served bytes need release validation. No blanket SPA rewrite or public API/tunnel is proposed.
- npm.cmd run check: PASS repository tooling/documentation and TypeScript before final bookkeeping. Final check/staged whitespace and commit verification follow this note.
- Primary reviewed the proposal against architecture, current scripts/adapters/worker and official sources. Application/browser/offline suites are future release gates, not rerun for documentation-only changes.

## Next exact step and limits

Planning request is complete. Next, on an implementation/deployment request, prepare the hosted learner-only capability and offline/packaging adaptations, run application and isolated browser/offline checks, review the concrete artifact, then publish through the owner's free account and verify the actual HTTPS URL on phones. Account login may require owner interaction. No website is live from this work and no deployment permission is requested by this planning handoff.

Use one stable origin; browser learning stays separate on each device and only explicit backups transfer it. Editor/publication, AI/transcription/neural generation, login/sync and a durable cloud database remain outside the first free static release. Physical-phone/Safari/audio/accessibility and real hosting behaviour remain unverified.

Prior curriculum pack/draft outcome and cloud-setup follow-up are preserved in git show 8ba59ae:docs/SESSION_CHECKPOINT.md; cloud preparation detail is in git show 1c5b5d4:docs/SESSION_CHECKPOINT.md. Inspect live remote history before resuming remote actions; this task did not recheck uploads, PR/CI or Cloud account state. Historical localhost8082/API3001 addresses are not newly verified here.

## Usage and recovery

Usage observation 2026-11-16: no account-allowance tool exposed; unavailable, not zero/unlimited. No automatic resume configured. No delegation/model overrides. Final deliberately staged paths: docs/plans/0025-free-web-testing.md, docs/STATUS.md, docs/SESSION_CHECKPOINT.md. Do not include generated output or private data. Required final stage/check/commit remains pending until Git confirms success; record any failure here without bypassing checks.
