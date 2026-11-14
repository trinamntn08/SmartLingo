# Architecture baseline

Status: planned application architecture; development tooling exists.

| Location | Responsibility |
| --- | --- |
| apps/learner | Expo/React Native learner app; web first, native later |
| apps/api | Local Node/Fastify API, private credentials, media generation/cache, SQLite content |
| packages/domain | Language-independent types, answer checking, review scheduling |
| packages/content | Reproducible draft/reviewed curriculum and schema |
| packages/ui | Shared theme/components when actual reuse warrants extraction |
| scripts | Development tooling and hooks |

These application directories will be created during implementation; do not populate them with placeholder applications in a tooling task.

## Boundaries

- Client -> local API -> provider. Permanent credentials stay on the API.
- Local published content/media -> downloaded lessons -> offline activities.
- Browser IndexedDB/native SQLite adapters -> stable learning events, notebook, and reviews.
- Draft editing -> validation/preview -> explicit publication -> versioned content.
- Separate target language, explanation language, and UI language.
- Keep provider/model identifiers configurable and media keyed by content/settings hash.
- Keep tests provider-independent; add opt-in live checks only when requested.

Use stable IDs and explicit content revisions. Avoid synchronisation/billing infrastructure until those features are needed.

See [the product plan](../PROJECT_PLAN.md) for the full model and [the initial decision](decisions/0001-project-tooling.md) for development setup.
