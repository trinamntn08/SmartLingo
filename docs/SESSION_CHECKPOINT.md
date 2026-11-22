# Session checkpoint

Updated: 2026-11-22 (Europe/Paris). Documentation reconciliation is complete and independently reviewed. The commit containing this note is the checkpoint; actual SHA/upload results are reported at handoff after final staged checks and verified push.

## Result and source

The owner corrected the initial French-only reading: Japanese already exists on another branch. Fetched origin, inspected worktree/history/live refs, then switched the main workspace from feat/android-test-apk (0d21d67) to docs/current-codebase-sync, based on origin/feat/unified-learning-hub (d8274ee). Existing hub and Android heads each matched origin. No branches merged, application source/manifests changed or main update.

[Repository state](REPOSITORY_STATE.md) identifies the Japanese hub, earlier Japanese/topic/audio/report branches, separate Android APK and older hosting work. Root instructions/README/product plan, status, architecture, operations, testing, environment, catalogue, content/media/research guides, index and Cloud guidance agree with source. Historical plans/decisions/audits remain dated. The [previous hub checkpoint](history/unified-learning-hub-2026-11-22.md) preserves earlier checks/process observations, not currently running services. [Plan 0037](plans/0037-current-codebase-documentation.md) records scope and ownership.

Source inventory: French 25 banks/123 lessons/765 appearances/722 IDs/713 forms; Japanese 13 banks/65 lessons/390 appearances/380 IDs/forms; daily courses 2 French/13 Japanese days; kana 20 rows/46 basic forms per script. Japanese words/examples have kana readings; alphabet characters have romaji/sound notes. French has audio/selected notes, not complete written pronunciation. No qualified teaching approval, full CEFR/JLPT coverage or proficiency claim.

## Validation actually performed

- npm.cmd run check: PASS repository structure, Markdown links, whitespace and TypeScript. Final documentation additions receive repository/staged rechecks before commit.
- npm.cmd test: PASS 18 tooling and 251 application tests with deterministic fakes/temporary data; no paid calls or owner data.
- python -X utf8 -m unittest discover -s scripts/japanese_voice -p test_server.py: PASS 3 model-free protocol tests; no model download/live synthesis.
- Curriculum helper ran existing review-pack self-test: PASS including 8 negative fixtures and 6 bridge/5 refinement candidates. Read-only inventory/photo/drawing/resource checks confirm language scopes/counts.
- Independent read-only reviewer confirmed counts, pronunciation controls, backup v4/legacy imports, media, commands and branch topology. Fixed stale website-priority wording that could point to the old French artifact; STATUS now requires current-hub reconciliation and both-language validation. Final review found no remaining actionable inaccuracies.
- git diff --check: PASS. Final staged secret/whitespace checks, commit and push follow; actual Git results are reported at handoff.

No fresh browser/offline export, microphone/audio hardware, live engine, APK, physical phone, hosted release, provider availability or qualified teaching review performed for this docs step. Existing services were not stopped/restarted or claimed current. Git sync does not transfer browser IndexedDB data or rebuild another worktree's export.

## Preserved work and Git handoff

Original tests/e2e/backup.spec.ts was flagged modified but its Git hash matched the Android HEAD blob. Before switching, copied exact bytes to D:/dev/projects/SmartLingo-sessions/documentation-sync-preserved/backup.spec.ts.original; both SHA-256 values matched db947ab1fa6ef77a6be61cdff9f64a1f2965d7255d2a6e1d9b75612841d9bd77. Restoring identical tracked content allowed the safe switch. The newer test content comes from the hub baseline, not this task.

Untracked apps/android generated build/assets remain preserved locally, excluded from this commit. Other worktrees/branches untouched. Stage deliberate task Markdown only, run staged checks, commit, inspect live docs/current-codebase-sync origin ref, push normally and verify remote SHA equals HEAD. No merge, force push, main update, deployment or curriculum publication.

## Next authorized UI work

Original request remains outstanding after this docs prerequisite: review the whole interface for a new learner, slow initial hiragana/word introduction, improve pronunciation display and reorganize widgets. Continue from this Japanese-enabled source, inspect the seven references and first-time flow, then implement a complete beginner journey with relevant UI checks. Do not assume Japanese is unimplemented or claim UI changes were delivered by documentation.

## Delegation and usage

Operations/curriculum helpers owned exclusive docs; independent reviewer stayed read-only. Exposed gpt-6.1-sol medium for helpers/high for review selected under routing; primary owned integration, root guides, branch map, checkpoint and Git. No automatic role/hook loading claimed. Account allowance reporting unavailable on 2026-11-22; none inferred; no automatic-resume scheduler configured. No credentials, recordings or paid services accessed.
