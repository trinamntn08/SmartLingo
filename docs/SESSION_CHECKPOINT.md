# Session checkpoint

Updated: 2026-11-22 (Europe/Paris). Task: review the codebase, resolve untracked clutter, refactor clear responsibility boundaries and update documentation. Branch refactor/maintainable-foundation, base f0637e7. Implementation, independent code/documentation review and all validation are complete. The commit containing this note is the source checkpoint; actual SHA and verified origin upload are reported at handoff after final staged checks.

## Completed work

Startup had no modified tracked source. The 153 untracked Git paths were residual Android build/cache outputs after the previous branch switch. Verified no tracked Android source or reparse points; native PowerShell moved the 924 files/55,015,483bytes to D:/dev/projects/SmartLingo-sessions/android-build-preserved-2026-11-22/apps-android. A sibling manifest stores relative paths, sizes and SHA-256. All 924 hashes/counts matched after the move; no deletion or blanket ignore. Git was clean before deliberate refactoring.

App now owns mounting/hash routing; app/LearnerApp composes language-scoped models/destinations; app/useLearnerNavigation owns guarded session navigation; profile/ProfileScreen composes settings. Generic Button/Badge and shared designTokens stay independent of audio; audio/Speak owns playback/options UI. Content index composes unchanged restaurant/bakery seeds from topics/preview-lessons. API routes share response-disconnect cleanup; resource-free validation precedes speech database acquisition. Fixed direct editor hash entry leaving hidden learner speech running, and invalid Japanese options opening a speech DB before throwing.

[Codebase review](CODEBASE_REVIEW.md), [design system](DESIGN_SYSTEM.md), [architecture](ARCHITECTURE.md), [ADR 0031](decisions/0031-modular-learner-foundation.md) and [plan 0038](plans/0038-maintainable-foundation.md) describe coverage, module contracts and remaining opportunities. No domain/storage format, migration, dependency, canonical payload/revision, publication or branch merge changed. All five runtime-content fingerprints match before/after: French/Japanese lessons, French/Japanese daily courses and kana. Independent reviewer separately confirmed exact seed equality.

## Actual validation

- npm.cmd run check: PASS repository/Markdown/whitespace and TypeScript after correcting an extra blank EOF in extracted controls. The initial whitespace failure also caused the tooling hook assertion to fail; no assertion/check was weakened.
- npm.cmd test: final PASS 18 tooling / 256 application (274 total). API helper separately ran 52 focused tests, reviewer 8; all fakes/temporary data and no paid calls.
- Independent read-only review: no actionable findings in combined code diff. Covered mounting/navigation/write guards, scoping, speech lifecycle, token values, exact content extraction and API cancellation/startup.
- Full npm.cmd run test:e2e -- --workers=2: PASS 137 tests / 1 pre-existing intentional duplicate-publication skip (6.1 minutes), isolated ports 8081/3002. Includes direct-hash speech cancellation and mounted-lesson regression at desktop/narrow.
- Fresh npm.cmd run build:web: PASS 126 files / 10,229,278 bytes; build 726a95ec88e5519caa6d51230cb6954264cdd02bce7a216e09ac6a1996eacf62. Full isolated exported offline suite: PASS 24/24 desktop/320px (2.5 minutes), run with npx.cmd playwright test --config .cache/maintenance.offline.config.ts. Ignored copied fixtures differ only by port 8082 to 8086; shared helper is byte-identical. Initial temporary-harness cwd/CJS/import-path setup failures were corrected without changing application code, assertions or limits. Owner preview process 13668 on 8082 stayed running. Primary inspected 320px offline-ready and Japanese Report screenshots.

## Git handoff and remaining work

All implementation checks are complete. Run final documentation/staged checks, deliberately stage task files, create the focused checkpoint and push only refactor/maintainable-foundation. Compare live remote full SHA with HEAD. No main change, force push, merge, deployment or curriculum publication. No secrets, databases, build artifacts/caches or preserved Android files enter Git.

Whole-codebase review follow-ups remain documented: default-only learner API endpoint versus configurable server, justified JSON response budgets, historical catalogue allocation, report/catalogue refresh work and dirty-edit/navigation feedback. No unmeasured speed or security guarantee claimed. Original slower hiragana/pronunciation/widget journey remains separate outstanding UI work; structural cleanup is not a claim it was implemented.

## Delegation and limits

UI builder exclusively owned shell/profile plus browser regression; API builder owned cancellation/startup/tests; primary owned artifacts/design/content/docs/integration/Git; independent reviewer stayed read-only. Exposed gpt-6.1-sol high used for these bounded tasks per routing. No automatic role/hook loading claimed. Account usage reporting unavailable on 2026-11-22; none inferred; no automatic-resume schedule configured. Existing owner services/data preserved; no provider keys, raw recordings or paid calls. Physical-phone/Safari/screen-reader/real audio and qualified teaching acceptance remain unverified.
