# Repository and branch state

Inspected: 2026-11-22 (Europe/Paris), after `git fetch origin` and live `git ls-remote --heads origin`. This is a dated source map, not a guarantee that remote heads or running previews stay unchanged. [STATUS](STATUS.md) describes implemented behaviour on this checkout; [the checkpoint](SESSION_CHECKPOINT.md) records the current task and actual checks.

## Current working source

At the start of the synchronization/tracking documentation task, `D:/dev/projects/SmartLingo` had clean local and live origin `feat/calm-learner-redesign` heads at `132144fcca3a8cf6142bbbd2c08690b357131175`, ahead/behind `0/0`. Fetch and fast-forward-only synchronization confirmed Already up to date on 2026-11-22 at 12:02 CET (Europe/Paris). The documentation task uses `docs/repo-sync-tracking` from that verified baseline. See [WORK_LOG](WORK_LOG.md) for each subsequent observation rather than treating this dated map as live state.

The learner baseline includes maintainable-foundation `786219d` and the unified French/Japanese hub lineage `d8274ee`, plus the focused interface redesign. The earlier hub also has a separate worktree at `D:/dev/projects/SmartLingo-sessions/shared-language-learning`; changing branches here does not update that worktree's files or rebuild its served export.

The redesigned learner checkpoint was pushed and its full origin SHA verified. Its implementation/checks belong to [plan 0039](plans/0039-calm-learner-redesign.md); prior structural cleanup belongs to [the maintenance review](CODEBASE_REVIEW.md). The feature heads below retain their earlier dated observations unless explicitly refreshed; they are not branch merges or a claim that every remote was revalidated in this documentation task.

The main folder previously selected `feat/android-test-apk`, a French-only sibling branch. Reading its documentation correctly described that older checkout, but missed Japanese implemented elsewhere. Always inspect `git status --short --branch`, the worktree list and fetched branch history before deciding a feature is absent from the repository.

| Source branch | Inspected head | Source present there |
| --- | --- | --- |
| `feat/calm-learner-redesign` | `132144f` | Local/live origin reconfirmed for this task: focused French/Japanese learner, grouped settings and responsive navigation, based on maintainable-foundation `786219d`. |
| `feat/unified-learning-hub` | `d8274ee` | Current shared French/Japanese learner; Today, Learn, Review, Report, Profile; Japanese letters, listening and guided speaking. Includes the earlier Japanese/topic/audio/report branches below. |
| `feat/free-japanese-audio` | `8612e1a` | Free local Japanese VOICEVOX fallback and browser clip cache. Included in the current baseline. |
| `feat/friendly-learning-report` | `244d9b9` | Shared dashboard and read-only learning report. Included in the current baseline. |
| `feat/japanese-topic-vocabulary` | `4122183` | 13 Japanese topic banks expanded to 30 entries each. Included in the current baseline. |
| `feat/shared-language-learning` | `337d922` | Homepage language choice, shared lessons/notebook/review and backup v4. Included in the current baseline. |
| `feat/japanese-course-b1` | `58fe9b6` | Original 13-day Japanese draft course with selected foundations/A1/A2/B1 tasks. Its content is present in the current source, but its commit is not an ancestor: the original implementation was incorporated into the shared-language work. |
| `feat/android-test-apk` | `0d21d67` | Earlier French-only Capacitor Android debug APK and document backup, based on French daily-course head `ee23e93`. |
| `feat/android-current-learner-apk` | [Task checkpoint](SESSION_CHECKPOINT.md) | Current French/Japanese learner packaged for private Android testing, based on `feat/french-daily-opening`; see the [Android guide](ANDROID_TESTING.md). |
| `codex/free-learner-cloud-deploy` | `c88bc41` | Earlier static-hosted learner implementation. Separate from the current Japanese hub; its previous checkpoint reports account/network-blocked publication and no live URL. |
| `feat/deployment-ready-beta` | `ac061ec` | Earlier complete-content deployment preparation; not the current Japanese hub. |
| `main` | `1c6e943` | Older repository checkpoint; does not represent the current learner implementation. |

The inspected local hub, Japanese feature branches and Android branch matched their corresponding origin heads. Updating this documentation creates a new task branch; it does not move those feature branches, merge their code, update `main` or publish an application.

## Branch-specific commands and artifacts

The current `package.json` provides `dev`, `dev:api`, `setup:japanese-voice`, `dev:japanese-voice`, web build/preview, tests and backup tooling. See [README](../README.md), [local operations](LOCAL_OPERATIONS.md) and [Japanese audio](JAPANESE_AUDIO.md).

`android:doctor`, `build:apk`, `android:install` and `test:android-contract` are available on `feat/android-current-learner-apk` for the shared learner. The initial `feat/android-test-apk` branch remains a historical French-only snapshot. See the [Android guide](ANDROID_TESTING.md) for setup and the [session checkpoint](SESSION_CHECKPOINT.md) for actual validation. Full native SQLite and audio adapters remain planned.

Residual Android build/cache files left after the branch switch were moved and hash-verified outside this source tree at `D:/dev/projects/SmartLingo-sessions/android-build-preserved-2026-11-22/apps-android`, with a local sibling manifest. This clears untracked generated-file noise while preserving the build; it does not move or remove the Android source branch. See [cleanup evidence](CODEBASE_REVIEW.md).

Hosted build/test commands from the Cloud branch likewise do not exist automatically here. To deploy the current French/Japanese app, first reconcile the old hosting capability gates with the current learner and validate the combined result in a separately authorized implementation step. [Cloud guidance](CLOUD_WORKFLOW.md) and the [historical deployment brief](CLOUD_DEPLOY_PROMPT.md) describe that distinction. No live website is established by Git synchronization.

## Safe continuation

1. Before every task or status/progress answer, follow [repository check and synchronization first](SESSION_WORKFLOW.md#repository-check-and-synchronization-first). Inspect local work, fetch all origin branches, compare the full fetched and live branch inventories, check relevant Cloud handoffs, and safely synchronize the intended baseline. Record the evidence and any unresolved difference in [WORK_LOG](WORK_LOG.md).
2. Start the task from the branch containing the intended implementation. Preserve unrelated changes and generated local files; do not copy an entire older worktree over newer source.
3. Keep code synchronization separate from browser data transfer. Notebook/progress live in browser IndexedDB, not Git; transfer them only through private explicit learning backups. Backup v4 needs a compatible app and cannot be imported by the older Android source.
4. Before preview handoff, refresh the full inventory and [Cloud inclusion check](SESSION_WORKFLOW.md#cloud-to-local-handoff). Rebuild from the reconciled source. Verify the actual preview process/worktree, served build identity and the learner entry point for each Cloud change included in the handoff.
5. Commit deliberate task paths, push the assigned topic branch normally and verify the live remote SHA. Standing authorization does not include merging, force-pushing, changing main or deployment.
