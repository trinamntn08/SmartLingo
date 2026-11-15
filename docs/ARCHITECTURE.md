# Architecture baseline

Status: local web learning and first editor/publication slice implemented; native adapters, full editor, and provider services remain planned.

| Location | Responsibility |
| --- | --- |
| apps/learner | Expo/React Native learner app; web first, native later |
| apps/api | Local Node/Fastify API, private credentials, media generation/cache, SQLite content |
| packages/domain | Language-independent types, answer checking, review scheduling |
| packages/content | Reproducible draft/reviewed curriculum and schema |
| packages/ui | Shared theme/components when actual reuse warrants extraction |
| scripts | Development tooling and hooks |

`packages/ui` is deferred until actual cross-feature reuse warrants a separate package. The learner's theme/components currently live with its UI. See [ADR 0004](decisions/0004-local-preview-foundation.md) for the first storage/content boundaries and limitations.

## Boundaries

- Client -> local API -> provider. Permanent credentials stay on the API.
- Local published content/media -> downloaded lessons -> offline activities.
- Browser IndexedDB/native SQLite adapters -> stable learning events, notebook, and reviews.
- Explicit exported-web download -> size/hash-validated staged CacheStorage -> complete offline app copy. A separate typed browser asset manager/worker never opens learner IndexedDB. Web Locks serialize updates/removal across worker generations; removing owned asset caches preserves learner data and unrelated caches. See [ADR 0012](decisions/0012-offline-web-assets.md).
- Learner backup files -> bounded UTF-8/schema validation -> explicit atomic merge of notebook/events/cached publications. Server curriculum database is a separate backup concern.
- Server curriculum snapshots -> read-only SQLite online backup -> full integrity/schema/history validation -> exclusive fresh-file publication. CLI recovery never replaces the active database; explicit existing-file configuration controls later API startup. Snapshot adapter remains separate from repository migrations/seeding and browser backup. See [ADR 0013](decisions/0013-curriculum-snapshots.md).
- Manual recognition events -> framework-independent versioned calendar schedule; store assisted ratings separately, never infer proficiency from activity. Backup v2 includes review events and migrates v1 files; IndexedDB v3 preserves prior stores.
- Draft editing -> validation/preview -> explicit publication -> versioned content.
- Published API content -> validated IndexedDB cache -> learner catalogue; newer drafts remain editor-only. Preview practice uses an isolated in-memory model.
- Stable-ID/target-guarded original SVG media -> learner WordIllustration adapter. Visual catalogue data stays separate from immutable lesson revisions; unknown/abstract words remain text-supported. An explicit vocabulary-overview review event uses the existing event contract, scoped to lesson/revision; mere browsing records no review.
- Separate target language, explanation language, and UI language.
- Keep provider/model identifiers configurable and media keyed by content/settings hash.
- Keep tests provider-independent; add opt-in live checks only when requested.

Use stable IDs and explicit content revisions. Avoid synchronisation/billing infrastructure until those features are needed.

## Implementation standards

Owner requirement, recorded 2026-11-14: implementation must be clean, modular, maintainable, and extensible. These standards apply to new features and changes to existing code.

- **One responsibility per function:** give each function one coherent job, a clear name, and explicit inputs and outputs. A coordinating function may call focused helpers for one use case; split independent concerns and deeply nested logic when doing so improves clarity. Use responsibility and readability to guide extraction rather than arbitrary line limits.
- **Cohesive modules:** group code by responsibility or feature, expose a small public interface, and keep internal details private. Avoid large files that mix unrelated features and generic utility folders with no clear owner.
- **Separate concerns:** UI components render state and handle interaction; domain modules implement learning rules; application services coordinate use cases; adapters handle storage, audio, network, and AI providers. Keep domain logic independent of React, Fastify, databases, and provider SDKs.
- **Explicit dependencies:** pass external dependencies through small typed interfaces at module boundaries. Domain code defines the capabilities it needs; adapters implement those contracts. Keep dependencies one-way and avoid circular imports, hidden global state, and provider-specific objects in shared contracts.
- **Practical extensibility:** make language content, review settings, themes, and provider choices data/configuration where appropriate. Add platforms, storage backends, or providers through adapters so existing learning rules remain reusable. Implement extension points needed by the agreed plan; defer unused plugin systems and speculative infrastructure.
- **Simple composition:** compose focused functions and components. Extract shared code when real reuse or a concrete variation warrants it; keep feature-specific details local. Avoid deep inheritance, unnecessary indirection, and abstractions that obscure the behaviour they serve.
- **Readable contracts and state:** use descriptive names, precise TypeScript types, and explicit state transitions. Validate untrusted input at boundaries, represent recoverable failures clearly, and keep side effects visible. Comments explain intent, constraints, or tradeoffs when the code alone cannot.
- **Testable behaviour:** keep calculations and learning rules pure where practical. Test important domain outcomes and adapter interactions with deterministic inputs and fakes; ordinary checks must not require paid services. Cover meaningful failure paths and preserve existing behaviour when extending a module.

## Review criteria

Before handing off implementation, check that each changed module has a clear responsibility, functions have one coherent job, and dependency boundaries remain intact. Verify that a supported extension can be added without copying learning logic or leaking platform/provider details into the domain. Run the relevant checks, review the diff for unnecessary complexity, and document material boundary or contract decisions.

These are implementation and review requirements; the current tooling does not automatically enforce architectural quality. See [the decision record](decisions/0002-implementation-standards.md) for scope and tradeoffs.

See [the product plan](../PROJECT_PLAN.md) for the full model and [the initial decision](decisions/0001-project-tooling.md) for development setup.
