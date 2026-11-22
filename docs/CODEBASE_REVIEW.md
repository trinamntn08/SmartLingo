# Codebase architecture review and cleanup

Reviewed: 2026-11-22, starting from `f0637e7` on the Japanese-enabled lineage. This record separates implemented cleanup from remaining opportunities. [Architecture](ARCHITECTURE.md) owns boundaries, [design system](DESIGN_SYSTEM.md) owns shared UI guidance and [plan 0038](plans/0038-maintainable-foundation.md) records acceptance/verification. This is a source review, not a security certification, linguistic review or claim that every file needs rewriting.

## Why Git showed many changes

There were no modified tracked files at startup. Git showed 153 untracked paths from the earlier Android build: Gradle caches, generated Capacitor files and copied web assets. Changing this folder from the Android branch to the Japanese hub removed that branch's tracked native ignore files, leaving its local build products visible. These were generated files, not uncommitted Japanese implementation.

The full residual directory contained 924 files, 55,015,483 bytes. After verifying paths, absence of tracked Android source and absence of reparse points, it was moved to `D:/dev/projects/SmartLingo-sessions/android-build-preserved-2026-11-22/apps-android`. A local manifest alongside it records each path, byte count and SHA-256; every hash/count matched after the move. No artifact was deleted or committed. Git status was clean before starting the deliberate refactor. For Android continuation, use its separate source branch/worktree and regenerate/synchronize assets as appropriate; this archive is build preservation, not a new Android source checkout.

## Reviewed boundaries and changes

| Area reviewed | Finding | Delivered action |
| --- | --- | --- |
| App shell, navigation and Profile | `App.tsx` mixed workspace mounting, scoped models, navigation transitions and settings rendering. | Keep entry-point mounting in App; compose learner UI in `app/LearnerApp`, guarded destinations in `app/useLearnerNavigation`, settings in `profile/ProfileScreen`. |
| Speech and generic UI | Importing base controls also pulled audio/provider preference UI into the primitive layer. | Keep Button/Badge generic; move Speak to the audio feature and update its four consumers. |
| Visual system | Shared typography, colors and shell dimensions lived among component styles and repeated literals. | Add typed design tokens; compose existing theme/styles and shell from them, preserving appearance. |
| Curriculum assembly | The content entry point mixed catalogue registration with the full original restaurant/bakery lesson payloads. | Move unchanged seed lessons to `topics/preview-lessons`; keep catalogue composition/exports in index. |
| API request lifecycle | Four handlers duplicated response-disconnect cancellation/listener cleanup. | One API-local `withRequestCancellation` helper; feature routes retain validation/response formats and service-specific behavior. |
| API initialization | Invalid Japanese timeout options could throw after speech SQLite had opened, before close hooks were installed. | Validate resource-free services before opening the speech store; regression checks invalid configuration creates no speech database files. |
| Direct editor routing | Changing the browser hash could hide a still-mounted learner while its speech continued. | Stop audio on hash navigation; browser regression checks cancellation and preserved lesson state after returning. |
| Domain/storage/backup | Shared domain remains independent of React/Fastify/databases; immutable revisions, ID conflict checks and atomic backup merge are meaningful safeguards. | Preserve contracts, stores, schema versions, publication guards and paid-call boundaries; no cosmetic repository rewrite. |
| Tooling and branch state | Source, generated builds and separate task branches were easy to confuse. | Preserve artifacts outside source, retain branch map and document checking source/ports/build identity before testing. |

No dependency change, content revision, database migration, curriculum publication or branch integration is part of this cleanup. Source-derived fingerprints for French/Japanese lessons, both daily courses and kana are exactly unchanged. Existing curriculum hash/behavior tests remain in force.

## Remaining opportunities

These are evidence-backed follow-ups, not hidden completed work or authorization to implement unrelated features:

1. **Low-severity configuration mismatch:** the server accepts a nondefault loopback port or IPv6-only host, while four learner API clients use `http://127.0.0.1:3001`. Defaults work. A future explicit local-endpoint configuration should be shared by the content, practice and two speech clients while preserving exact-origin protections; do not silently accept arbitrary remote servers. See [server configuration](../apps/api/src/server.ts), [content client](../apps/learner/src/content/api.ts), [practice client](../apps/learner/src/practice/api.ts), [French speech client](../apps/learner/src/audio/generated/client.ts) and [Japanese client](../apps/learner/src/audio/japanese/client.ts).
2. **Response hardening:** some content/practice JSON readers call `response.json()` before schema validation, without the streaming byte budgets already used by audio adapters. No production memory failure was reproduced. Introduce justified feature-specific limits and oversized-response fake tests in a separate boundary change; preserve each feature's error/cancellation/retry semantics.
3. **Potential catalogue scale:** [published lesson reads](../apps/api/src/repository.ts) materialize historical revisions to validate immutable storage. No current slowdown was measured. Streaming validation may eventually reduce allocation, but corruption detection must stay intact.
4. **Unmeasured render/read work:** the catalogue hook returns a fresh merged array, limiting downstream memoization; report refresh runs eagerly/on focus/on a timer as well as when its route becomes visible. Profiling and explicit activation/refresh ownership may reduce redundant work while preserving post-write freshness. No current performance failure was established. See [catalogue hook](../apps/learner/src/content/useCatalogue.ts) and [report hook](../apps/learner/src/dashboard/useLearningReport.ts).
5. **Navigation feedback and editing policy:** topic callbacks refuse transitions during pending writes, but the topic buttons do not visually expose the blocked state. Separately, pending-write guards do not protect unsaved text edits when the notebook unmounts on ordinary navigation; an explicit dirty-edit UX policy is needed before changing that behavior. These are distinct from confirmed-save/idempotent retry rules. See [topic sidebar](../apps/learner/src/ui/TopicSidebar.tsx) and [notebook](../apps/learner/src/ui/Notebook.tsx).
6. **Learner-facing design work:** gentler initial hiragana/word pacing, clearer pronunciation presentation and widget hierarchy still require the original requested UI journey. Shared tokens and smaller modules prepare that work; they do not complete it.

## Verification boundaries

Actual final counts/results belong in [the checkpoint](SESSION_CHECKPOINT.md) and the plan. Focused tests exercise API disconnect/listener cleanup, invalid-startup resource acquisition and direct editor audio cancellation. Full application/browser runs use temporary learner data and fake providers. Existing owner preview processes and browser data are preserved.

Real microphone/speaker quality, qualified French/Japanese teaching review, screen-reader hardware, physical-phone/Safari and deployment acceptance remain outside this refactor. No claim of universal accessibility, performance improvement or complete elimination of technical debt is made without corresponding evidence.
