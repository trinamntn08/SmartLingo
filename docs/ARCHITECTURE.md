# Architecture baseline

Reviewed: 2026-11-22 against the Japanese-enabled shared learner. French/Japanese lesson UI, basic kana, language-scoped notebook/review, read-only reports, listening and guided speaking are implemented. The French editor/publication, optional AI and paid saved speech remain language-specific; Japanese has an optional free local voice adapter. Native adapters and the full editor remain planned. [Repository state](REPOSITORY_STATE.md) distinguishes the separate Android and hosted branches. Actual voice quality still requires owner audition.

| Location | Responsibility |
| --- | --- |
| apps/learner | Expo/React Native learner app; web first, native later |
| apps/api | Local Node/Fastify API, private credentials, media generation/cache, SQLite content |
| packages/domain | Shared content/course/backup contracts, answer checking, review scheduling and pure report aggregation |
| packages/content | Schema-validated French/Japanese draft lessons and daily courses, basic kana metadata and bundled media metadata |
| packages/ui | Shared theme/components when actual reuse warrants extraction |
| scripts | Development tooling and hooks |

`packages/ui` is deferred until actual cross-feature reuse warrants a separate package. The learner's theme/components currently live with its UI. See [ADR 0004](decisions/0004-local-preview-foundation.md) for the first storage/content boundaries and limitations.

## Current code organization

The [maintenance review](CODEBASE_REVIEW.md) records the 2026-11-22 cleanup and remaining opportunities; [ADR 0031](decisions/0031-modular-learner-foundation.md) explains the separation. These are concrete responsibilities, not a general routing/widget framework:

| Module | Owns |
| --- | --- |
| `apps/learner/App.tsx` | Learner/editor mounting and hash routing; preserves mounted workspaces and stops speech on route changes. |
| `apps/learner/src/app/LearnerApp.tsx` | Scoped learning/catalogue/report composition and destination rendering. |
| `apps/learner/src/app/useLearnerNavigation.ts` | In-session destination/chooser state, guarded transitions, scroll reset and speech cancellation. Does not store learning progress. |
| `apps/learner/src/profile/ProfileScreen.tsx` | Named expandable groups compose existing language-specific settings panels. Shared `ui/Disclosure` owns expansion, lazy mounting and optional retained child state only. |
| `apps/learner/src/ui/designTokens.ts`, `theme.ts`, `controls.tsx` | Shared visual values/styles and Button/Badge primitives, independent of provider/audio/storage modules. See [design system](DESIGN_SYSTEM.md). |
| `apps/learner/src/audio/Speak.tsx` | Speaker/stop/options UI over existing audio adapters; composes base controls. |
| `packages/content/src/topics/preview-lessons.ts` | Unchanged original restaurant/bakery seed lesson payloads; the content index assembles/exports the catalogue. |
| `apps/api/src/request-cancellation.ts` | Disconnect signal and response-listener cleanup shared by feature routes; services retain timeouts/admission/error rules. |

Dependency direction remains application composition → feature components/services → small domain/adapter contracts. The domain has no React/Fastify/database dependency. Base UI does not import audio features; audio UI may compose base controls. Refactoring changes neither learning/backup schemas nor content identity/revisions.

## Boundaries

- Client -> local API -> provider. Permanent credentials stay on the API.
- Optional practice -> validated shared contracts -> expiring in-memory session service -> injected conversation/transcription providers. Explicit actions share bounded attempts/single flight and idempotent request tombstones; terminal failures permit a new deliberate attempt. Browser recording is temporary and separate from editable message text and notebook persistence. Only explicitly saved phrases reach learner storage. See [ADR 0016](decisions/0016-optional-ai-practice.md).
- Local published content/media -> downloaded lessons -> offline activities.
- Implemented browser IndexedDB adapter -> stable learning events, notebook and reviews. A native SQLite adapter remains planned behind the shared contracts.
- An eligible correct sentence appends the attempt and revision-scoped lesson completion together in one IndexedDB transaction. Retry keeps both event IDs. The editor applies the same operation to temporary state. [Inline completion decision](decisions/0039-inline-lesson-completion.md).
- Explicit exported-web download -> size/hash-validated staged CacheStorage -> complete offline app copy. A separate typed browser asset manager/worker never opens learner IndexedDB. Web Locks serialize updates/removal across worker generations; removing owned asset caches preserves learner data and unrelated caches. See [ADR 0012](decisions/0012-offline-web-assets.md).
- Learner backup files -> bounded UTF-8/schema validation -> explicit atomic merge of notebook/events/cached publications. Server curriculum database is a separate backup concern.
- Server curriculum snapshots -> read-only SQLite online backup -> full integrity/schema/history validation -> exclusive fresh-file publication. CLI recovery never replaces the active database; explicit existing-file configuration controls later API startup. Snapshot adapter remains separate from repository migrations/seeding and browser backup. See [ADR 0013](decisions/0013-curriculum-snapshots.md).
- Manual recognition events -> framework-independent versioned calendar schedule; store assisted ratings separately, never infer proficiency from activity. Review events were introduced with backup v2/IndexedDB v3; the current learner uses backup v4 and IndexedDB v4 while retaining legacy imports/stores.
- Bundled French/Japanese daily courses → validated course/day/block contracts → immutable revision-scoped navigation, study, support, choice, self-review and completion events. IndexedDB v4 includes the course-event store. Backup v4 preserves both languages and imports v1/v2/v3. Optional course-unit metadata groups the five French A1 opening days, in authored order. Japanese has 13 original draft days through selected estimated B1 tasks. Optional day progress revisions preserve existing event scopes when days are appended. See [ADR 0023](decisions/0023-open-course-draft-pilot.md), [French continuation](decisions/0025-append-course-days-with-stable-progress.md) and [Japanese course](decisions/0025-japanese-daily-course.md).
- The compact French presentation groups existing block IDs into dialogue, practice and Try it without remapping stored events. Next records dialogue study and the new cursor. An explicit finish after dialogue study records completion. Practice feedback uses its own answer events, and previous full-lesson records still count. The optional vocabulary disclosure preserves canonical notebook IDs. [Shorter lesson flow](plans/0043-french-daily-course.md#shorter-lesson-flow-after-owner-review)
- Draft editing -> validation/preview -> explicit publication -> versioned content.
- French published API content -> validated IndexedDB cache -> learner catalogue; newer drafts remain editor-only. Japanese content is bundled and the workshop/publication UI remains French-only. Preview practice uses an isolated in-memory model.
- Stable-ID/target-guarded original SVG media -> learner WordIllustration adapter. Visual catalogue data stays separate from immutable lesson revisions; unknown/abstract words remain text-supported. An explicit vocabulary-overview review event uses the existing event contract, scoped to lesson/revision; mere browsing records no review.
- Licensed bundled photographs -> exact sense/target lookup -> photo-first study rendering with illustration/text fallback. Per-file source/licence/hash records and credits travel with exported app assets; contextual photographs are labelled and do not change abstract meaning-matching exercises. Photo coverage is separate from owner curriculum approval.
- Browser device-voice enumeration -> separate versioned voice/rate preference adapter -> shared speaker controls. Explicit sample playback and local preference writes require no provider request or learner database change. Device availability and audible quality remain external capabilities. See [ADR 0017](decisions/0017-vocabulary-photo-and-voice-preferences.md).
- Japanese shared speaker controls -> device or separate Japanese browser clip cache -> guarded local speech API -> fixed loopback VOICEVOX style 2. Explicit clicks may synthesize free local speech; browsing/status never generates audio. Bounded adapters, cancellation guards and cache-removal epochs keep this independent of French paid speech and learner storage. Optional pinned CORE runtime/model installation stays outside app assets under ignored data/. See [ADR 0028](decisions/0028-free-local-japanese-speech.md).
- Explicit neural generation -> validated speech contract -> durable separate SQLite media/attempt ledger -> fixed Azure provider. Verified browser CacheStorage clips feed hybrid saved/device playback; Web Locks/removal epochs isolate audio deletion from learner data and app downloads. Neither normal playback nor content browsing invokes paid generation. See [ADR 0018](decisions/0018-explicit-cached-neural-speech.md).
- Separate target language, explanation language, and UI language.
- One Learn destination composes vocabulary/lessons, derived sentence comprehension, guided scripted speaking and language-specific external resources. Comprehension question construction is pure and language-scoped; temporary answers and oral prompts do not write existing lesson/report events. Changing section stops speech and unmounts optional French AI sessions/recordings. See [ADR 0029](decisions/0029-unified-learning-hub.md).
- Original Japanese alphabet metadata -> dedicated kana row study/recognition -> existing LearningEvent completion persistence. A known-ID/revision registry scopes saved alphabet events to Japanese and derives row continuation without migrating storage or changing vocabulary payloads. Alphabet row study remains separate from word/report totals; existing backup/restore preserves its events. See [ADR 0030](decisions/0030-japanese-alphabet-first.md).
- Existing lesson/course/recognition events -> pure language-scoped report aggregation -> read-only repository loading hook -> Report metrics and accessible weekly chart. Today recommendations use existing scoped learning events; they do not duplicate detailed reports. Current content scopes own completion/explored totals; known historical revisions may contribute actual activity. Viewer-local calendar weeks, immutable event deduplication, stale-read guards and retryable unavailable states require no new stored counters or migration. See [ADR 0027](decisions/0027-read-only-learning-report.md) and [interface ADR 0032](decisions/0032-calm-learner-interface.md).
- Homepage target-language preference -> one shared Today/catalogue/lesson/notebook/review UI; filter displayed events and notebook without rewriting history. Optional kana/example readings travel through the shared content contract. Existing Japanese daily-course content projects to separate stable Lesson IDs for shared exercises while preserving original course events. Backup v4 preserves Japanese metadata; legacy French notes without language stay French. Shared device speech/voice settings strictly match the target language; Japanese bypasses French neural cache/provider adapters. See [ADR 0026](decisions/0026-shared-language-learning.md).
- Typed web URLs → one `WebNavigation` coordinator → feature-owned view state and explicit save controls. Per-visit answers, filters and scroll positions stay in bounded memory. The preview and offline worker share an allowlist for nested app documents. [Web navigation decision](decisions/0038-web-navigation.md).
- Static external listening metadata (`apps/learner/src/listening`) stays separate from lessons, publication and progress storage. The library has 11 French and 5 Japanese resources. A1/A2/B1 resource filters do not establish curriculum coverage; shared lesson/course contracts support Japanese B1-labelled tasks. Explicit provider links load no embedded media; external playback needs internet and is excluded from app downloads. See [ADR 0024](decisions/0024-external-listening-resources.md) and [hub refinement](decisions/0029-unified-learning-hub.md).
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
