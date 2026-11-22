# Task: review and organize the maintainable codebase

Status: implemented, independently reviewed and validated; checkpoint upload at handoff
Owner: primary agent

## Outcome

The owner requested a whole-codebase architecture review, cleanup, refactoring and updated docs after seeing many unstaged files. Identify actual source changes versus generated artifacts, preserve unrelated work, and deliver coherent improvements to the current French/Japanese learner without changing curriculum, data formats or learning behavior.

Acceptance criteria:

- Explain and resolve the untracked Android build clutter without deleting source or local artifacts.
- Review learner UI/application composition, design primitives, content/domain, API/persistence/media and tooling boundaries; record confirmed defects separately from opportunities.
- Give app mounting, learner navigation and profile their own cohesive modules; keep save guards, language separation, editor lifecycle and speech cancellation intact.
- Make shared design tokens the source of existing visual values, while retaining the current appearance and public theme imports.
- Separate seed lesson payloads from content catalogue composition; prove exact runtime content is unchanged.
- Implement an additional backend refactor only when audit evidence identifies a bounded useful responsibility boundary.
- Run repository/TypeScript, application and meaningful desktop/narrow browser checks; independently review the combined changes, update docs, commit and verify normal task-branch upload.

## Context

[Architecture standards](../ARCHITECTURE.md), [source map](../REPOSITORY_STATE.md), [status](../STATUS.md) and [session workflow](../SESSION_WORKFLOW.md) govern this work. Baseline `f0637e7` is the verified Japanese-enabled documentation checkpoint. New branch: `refactor/maintainable-foundation`. No branch merge, migration, dependency upgrade, publication or deployment is needed.

## Ownership

- Primary: artifact preservation, shared design tokens/theme/controls, content entrypoint/seed extraction, shared contracts/manifests if needed, docs, final checks and Git.
- UI helper: `apps/learner/App.tsx`, new `src/app/` and `src/profile/`, and an optional focused shell browser regression. It may inspect other UI read-only.
- Backend helper: initially read-only API/domain/persistence/tooling audit; implementation ownership is assigned only after a concrete boundary is agreed.
- Independent reviewer: read-only combined review after implementation.

## Cleanup evidence

No tracked source was modified at startup. Git listed 153 untracked paths under `apps/android/`; the complete residual build/cache directory contained 924 files / 55,015,483 bytes. These remained when the previous session changed from the Android source branch to the Japanese hub: the native branch's generated-file ignore rules were no longer present.

Verified the source stayed inside this workspace, the destination stayed inside the explicitly named preservation directory, no Android files were tracked and no reparse points were present. Moved the directory using native PowerShell to `D:/dev/projects/SmartLingo-sessions/android-build-preserved-2026-11-22/apps-android`, with a sibling local manifest. All 924 file hashes and counts matched after the move. No deletion, blanket ignore or source integration was used; Git status became clean.

## Verification and handoff

Record actual commands/results and remaining review items here and in [the checkpoint](../SESSION_CHECKPOINT.md). Source-derived runtime-content fingerprints before/after protect canonical payloads. Use isolated browser fixtures/ports and deterministic providers; preserve existing owner services and data. The earlier gentler-hiragana/pronunciation/widget request remains a separate UX journey rather than an implied result of structural refactoring.

Delivered: dedicated shell/navigation/Profile modules, base-control/audio separation, typed shared design tokens with unchanged appearance, unchanged seed payload extraction, API-local disconnect cleanup and validation before speech database acquisition. Direct editor hash navigation now cancels hidden learner speech. API helper owned app construction, three feature route modules, the new cancellation helper and related tests; no shared contracts/manifests were changed.

Actual final validation:

- Repository/TypeScript check PASS; root application run PASS 18 tooling / 256 application. An initial extra blank EOF in extracted controls was fixed; the tooling hook test that depends on repository whitespace then passed without a weakened assertion.
- Full Chromium run PASS 137 / 1 pre-existing intentional duplicate-publication skip, desktop/narrow, including the new shell lifecycle regression. Duration 6.1 minutes.
- Fresh web export PASS: 126 files, 10,229,278 bytes, build `726a95ec88e5519caa6d51230cb6954264cdd02bce7a216e09ac6a1996eacf62`.
- Full exported cold-offline run PASS 24/24 desktop/320px in 2.5 minutes. Used ignored temporary fixture/config copies on 8086 because the owner preview occupied 8082; specs equal originals except the port substitution, shared helper byte-identical. Initial temporary cwd/module/import-path setup errors were corrected without changing app behavior, assertions or limits. Primary inspected narrow offline-ready and Japanese Report screenshots; owner preview process stayed running.
- Five runtime payload SHA-256 fingerprints exactly match the baseline; independent review also deep-compared extracted seed JSON. Independent code and documentation reviews found no remaining actionable findings. `git diff --check` passed; final staged secret/whitespace checks and verified push are handoff operations.

[The codebase review](../CODEBASE_REVIEW.md) records remaining configuration, JSON-budget, allocation, refresh and editing-policy opportunities. No performance/teaching/device/voice-quality, universal accessibility, release or deployment acceptance is inferred from these checks. No paid calls, owner learner data, dependency changes, migrations, content revisions or publication.
