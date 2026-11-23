# First local learning journey

Status: completed first learner slice; full M1 remains in progress
Owner: primary agent

## Outcome
Open an Expo web preview, choose restaurant customer practice, study six illustrated words/phrases, reveal translations and grammar, solve picture and sentence activities, save/edit a notebook entry, and reload with attempts and completion preserved in IndexedDB. No API key or running API is required for bundled lessons. Draft content stays visibly unreviewed.

## Relevant context
[M1 and backlog](../../PROJECT_PLAN.md), [architecture](../ARCHITECTURE.md), [content guide](../CONTENT_GUIDE.md), and root instructions apply. The repository began clean at `e0639fa`. This is the first M1 slice; full editor publication, downloadable offline packs, review scheduling, and native adapters remain later steps.

Official documentation checked during scaffolding: [Expo monorepos](https://docs.expo.dev/guides/monorepos/), [Expo SDK](https://docs.expo.dev/versions/latest/), [Fastify](https://fastify.dev/docs/latest/Reference/Server/), [Node SQLite](https://nodejs.org/api/sqlite.html), and [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB). Package versions are verified against npm and Expo's template/compatibility metadata.

## Steps and ownership
1. Primary: shared domain schemas, learning/storage contracts, two original draft seeds, workspace manifests, dependencies, and browser adapters.
2. UI builder: learner screens/components/styles only; use shared contracts and browser adapters. Read references 1–7. Responsive cream/yellow interface, optional help, clear persistence errors.
3. API builder: local Fastify API and SQLite content repository/tests only. Read-only draft catalogue and health routes, loopback binding, versioned migration. No credentials needed or publication route.
4. Primary: integrate and run domain/storage/API/browser checks and web export; independent read-only reviewer then inspect the whole change. Address findings, update status/checkpoint, and commit deliberate paths locally.

## Validation
Run existing tooling tests/checks, TypeScript, meaningful domain/IndexedDB/API tests, an actual desktop/small-viewport browser journey including reload and API independence, Expo dependency validation, and web export. Phone hardware and audible French voice quality need separate owner testing. Test browser speech fallback without paid calls.

## Progress and decisions
Shared package interfaces preceded delegation. npm workspaces keep domain code independent of React/Fastify/storage. Browser state uses individual event/notebook records rather than overwriting a whole snapshot. Lesson assets are bundled; this is API independence, not a service-worker offline installation. SQLite uses Node 24's built-in adapter. Account usage/reset capability was unavailable; delegation stayed bounded to UI, API and independent review.

Independent review found stale-tab word capture could overwrite personal notes. Atomic capture now preserves the existing entry, with adapter and two-tab browser regression checks. Primary integration also corrected SVG URI double-encoding and mobile navigation overflow found through screenshot inspection. Existing-save actions preserve notebook edits; hiding a used hint does not erase its history.

## Handoff
Accepted journey passes without an API key or API process. `npm.cmd run check`, 16 tooling tests, 19 application tests, all 10 Chromium checks, Expo dependency compatibility and final web export passed. Live loopback API returned health ok and two drafts. Desktop and narrow screenshots were inspected. See [testing](../TESTING.md) for actual scope and the three moderate upstream build-tool audit findings. Owner content review, physical phone/audio checks, first editor fields and publication remain next M1 work. Local checkpoint identity is in [the session checkpoint](../SESSION_CHECKPOINT.md).
