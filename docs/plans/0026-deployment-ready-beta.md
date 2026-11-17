# Task: complete-content deployment-ready beta

Status: completed
Owner: primary agent

## Outcome

Owner authorised all complete topics/materials/courses in the beta, with manual review after deployment. Prepare free hosting and optional backend, leaving account URLs/secrets blank. No account creation, domain purchase or actual publication requested at this step.

Acceptance: 129 lessons/25 banks include six bridge lessons and five corrections; no historical ID/data loss; a Cloudflare-compatible static export works without any backend or credentials; optional HTTPS API requires separate owner/beta tokens and preserves SQLite on disk; public config never contains credentials; offline integrity and browser learning/backup journeys pass; concrete setup guide and upload artifact supplied.

## Steps and ownership

Source baseline: fetched `origin/chore/cloud-workflow` at `a3913dd`; topic branch `feat/deployment-ready-beta`. Selectively reuse curriculum pack from `8ba59ae` and hosting work from `c88bc41`; preserve the focus fix and updated policies rather than merging stale branch copies wholesale.

- Primary: scripts, manifests/lock, Docker/hosting/CI, integration, docs and validation.
- API helper: apps/api hosted configuration/access guard/tests.
- UI helper: apps/learner runtime config, token controls, unavailable states and tests.
- Curriculum helper: content packages, historical research pack/validator and curriculum tests.
- Independent read-only reviewer: security, release integrity, correctness and regressions.

Helpers inherit the active model/effort; no explicit override or separate runtime role loading is claimed. Usage lookup unavailable; no automatic resume configured. Repository delivery/review skills apply. Owner instruction supersedes manual approval guidance for beta inclusion; no invented human validation or local database publication.

## Validation

Run repository/TypeScript checks, tooling/application suites, historical research negative fixtures, desktop/narrow regression, offline and hosted-beta journeys. Verify the committed export's file hashes, identity, absence of known credential patterns, Cloudflare limits and clean provenance. Test container build/startup/persistence where environment permits; record unavailable checks accurately. Paid providers remain fake; no live secrets/owner data.

## Progress and decisions

All complete material integrated. Cloudflare Pages chosen for free learner hosting without domain/backend; portable single-instance Docker/Caddy backend optionally supports an Always Free VM. Static-only feature availability is explicit. Account-specific values stay empty in templates. Three moderate upstream build-tool findings confirmed; ineffective patched-resolution attempt reverted.

## Handoff

Final validation and checkpoint results are recorded in the session checkpoint. See [deployment instructions](../DEPLOYMENT.md) for exact manual setup and blank fields.
