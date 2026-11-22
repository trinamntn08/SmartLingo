# Architecture baseline

Status: local web learning, first editor/publication, optional conversation/transcription and explicit cached neural speech implemented. Android testing uses a bundled web shell; full native adapters and full editor remain planned. Actual provider voice quality still requires audition.

| Location | Responsibility |
| --- | --- |
| apps/learner | Expo/React Native learner app; web first, native later |
| apps/android | Capacitor test shell, Android document backup adapter and native project; bundles the web learner |
| apps/api | Local Node/Fastify API, private credentials, media generation/cache, SQLite content |
| packages/domain | Language-independent types, answer checking, review scheduling |
| packages/content | Schema-validated draft curriculum and bundled media metadata |
| packages/ui | Shared theme/components when actual reuse warrants extraction |
| scripts | Development tooling and hooks |

`packages/ui` is deferred until actual cross-feature reuse warrants a separate package. The learner's theme/components currently live with its UI. See [ADR 0004](decisions/0004-local-preview-foundation.md) for the first storage/content boundaries and limitations.

## Boundaries

- Client -> local API -> provider. Permanent credentials stay on the API.
- Optional practice -> validated shared contracts -> expiring in-memory session service -> injected conversation/transcription providers. Explicit actions share bounded attempts/single flight and idempotent request tombstones; terminal failures permit a new deliberate attempt. Browser recording is temporary and separate from editable message text and notebook persistence. Only explicitly saved phrases reach learner storage. See [ADR 0016](decisions/0016-optional-ai-practice.md).
- Local published content/media -> downloaded lessons -> offline activities.
- Implemented browser IndexedDB adapter -> stable learning events, notebook and reviews. A native SQLite adapter remains planned behind the shared contracts.
- Android test shell -> bundled Expo web assets at stable `https://localhost` -> existing IndexedDB learning adapter in WebView. `platform/runtime.ts` detects the shell and exposes only the narrow Android document-save plugin. No server URL or API credentials are bundled. PC-only API features and web asset downloads are hidden. Android JSON export confirms document writing before success; import retains shared backup validation/atomic merge. Native system insets keep the web content inside bars/cutouts/keyboard. Android automatic backup is disabled; explicit private backups remain available. See [ADR 0026](decisions/0026-android-webview-test-package.md).
- Explicit exported-web download -> size/hash-validated staged CacheStorage -> complete offline app copy. A separate typed browser asset manager/worker never opens learner IndexedDB. Web Locks serialize updates/removal across worker generations; removing owned asset caches preserves learner data and unrelated caches. See [ADR 0012](decisions/0012-offline-web-assets.md).
- Learner backup files -> bounded UTF-8/schema validation -> explicit atomic merge of notebook/events/cached publications. Server curriculum database is a separate backup concern.
- Server curriculum snapshots -> read-only SQLite online backup -> full integrity/schema/history validation -> exclusive fresh-file publication. CLI recovery never replaces the active database; explicit existing-file configuration controls later API startup. Snapshot adapter remains separate from repository migrations/seeding and browser backup. See [ADR 0013](decisions/0013-curriculum-snapshots.md).
- Manual recognition events -> framework-independent versioned calendar schedule; store assisted ratings separately, never infer proficiency from activity. Backup v2 includes review events and migrates v1 files; IndexedDB v3 preserves prior stores.
- Bundled draft daily course -> separate validated course/day/block contracts -> immutable revision-scoped navigation/study/support/choice/self-review/completion events. IndexedDB v4 adds only the course-event store; learner backup v3 includes it and normalises v1/v2 imports. Legacy lessons/events, review scheduling and server SQLite/snapshot schema stay intact. Exact resume and explicit activity completion do not imply proficiency. Two draft days support free selection and independent cursors; optional explicit day progress revisions preserve unchanged teaching payloads across appended course releases without rewriting events. General course editing/publication and B1 remain future work. See [ADR 0023](decisions/0023-open-course-draft-pilot.md) and [ADR 0025](decisions/0025-append-course-days-with-stable-progress.md).
- Draft editing -> validation/preview -> explicit publication -> versioned content.
- Published API content -> validated IndexedDB cache -> learner catalogue; newer drafts remain editor-only. Preview practice uses an isolated in-memory model.
- Stable-ID/target-guarded original SVG media -> learner WordIllustration adapter. Visual catalogue data stays separate from immutable lesson revisions; unknown/abstract words remain text-supported. An explicit vocabulary-overview review event uses the existing event contract, scoped to lesson/revision; mere browsing records no review.
- Licensed bundled photographs -> exact sense/target lookup -> photo-first study rendering with illustration/text fallback. Per-file source/licence/hash records and credits travel with exported app assets; contextual photographs are labelled and do not change abstract meaning-matching exercises. Photo coverage is separate from owner curriculum approval.
- Browser device-voice enumeration -> separate versioned voice/rate preference adapter -> shared speaker controls. Explicit sample playback and local preference writes require no provider request or learner database change. Device availability and audible quality remain external capabilities. See [ADR 0017](decisions/0017-vocabulary-photo-and-voice-preferences.md).
- Explicit neural generation -> validated speech contract -> durable separate SQLite media/attempt ledger -> fixed Azure provider. Verified browser CacheStorage clips feed hybrid saved/device playback; Web Locks/removal epochs isolate audio deletion from learner data and app downloads. Neither normal playback nor content browsing invokes paid generation. See [ADR 0018](decisions/0018-explicit-cached-neural-speech.md).
- Separate target language, explanation language, and UI language.
- Static external listening metadata (`apps/learner/src/listening`) stays separate from lessons, publication and progress storage. Local A1/A2/B1 resource filters do not extend runtime lesson levels. Explicit provider links load no embedded media; external playback needs internet and is excluded from app downloads. See [ADR 0024](decisions/0024-external-listening-resources.md).
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
