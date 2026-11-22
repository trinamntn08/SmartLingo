# Repository and branch state

Inspected: 2026-11-22 (Europe/Paris), after `git fetch origin` and live `git ls-remote --heads origin`. This is a dated source map, not a guarantee that remote heads or running previews stay unchanged. [STATUS](STATUS.md) describes implemented behaviour on this checkout; [the checkpoint](SESSION_CHECKPOINT.md) records the current task and actual checks.

## Current working source

`D:/dev/projects/SmartLingo` now continues on `refactor/maintainable-foundation`, from documentation checkpoint `f0637e7` on `docs/current-codebase-sync`, based on `origin/feat/unified-learning-hub` at `d8274ee`. It contains the Japanese-enabled shared learner. The same hub source also has a separate worktree at `D:/dev/projects/SmartLingo-sessions/shared-language-learning`; changing branches here does not update that worktree's files or rebuild its served export.

The documentation checkpoint was pushed and its full origin SHA verified. Subsequent structural cleanup and its own actual checks/upload belong to [the current checkpoint](SESSION_CHECKPOINT.md) and [maintenance review](CODEBASE_REVIEW.md); this map's feature heads remain dated observations, not branch merges.

The main folder previously selected `feat/android-test-apk`, a French-only sibling branch. Reading its documentation correctly described that older checkout, but missed Japanese implemented elsewhere. Always inspect `git status --short --branch`, the worktree list and fetched branch history before deciding a feature is absent from the repository.

| Source branch | Inspected head | Source present there |
| --- | --- | --- |
| `feat/unified-learning-hub` | `d8274ee` | Current shared French/Japanese learner; Today, Learn, Review, Report, Profile; Japanese letters, listening and guided speaking. Includes the earlier Japanese/topic/audio/report branches below. |
| `feat/free-japanese-audio` | `8612e1a` | Free local Japanese VOICEVOX fallback and browser clip cache. Included in the current baseline. |
| `feat/friendly-learning-report` | `244d9b9` | Shared dashboard and read-only learning report. Included in the current baseline. |
| `feat/japanese-topic-vocabulary` | `4122183` | 13 Japanese topic banks expanded to 30 entries each. Included in the current baseline. |
| `feat/shared-language-learning` | `337d922` | Homepage language choice, shared lessons/notebook/review and backup v4. Included in the current baseline. |
| `feat/japanese-course-b1` | `58fe9b6` | Original 13-day Japanese draft course with selected foundations/A1/A2/B1 tasks. Its content is present in the current source, but its commit is not an ancestor: the original implementation was incorporated into the shared-language work. |
| `feat/android-test-apk` | `0d21d67` | Capacitor Android debug APK tooling and phone-local document backup. A sibling of the Japanese learner, based on French daily-course head `ee23e93`; not integrated here. |
| `codex/free-learner-cloud-deploy` | `c88bc41` | Earlier static-hosted learner implementation. Separate from the current Japanese hub; its previous checkpoint reports account/network-blocked publication and no live URL. |
| `feat/deployment-ready-beta` | `ac061ec` | Earlier complete-content deployment preparation; not the current Japanese hub. |
| `main` | `1c6e943` | Older repository checkpoint; does not represent the current learner implementation. |

The inspected local hub, Japanese feature branches and Android branch matched their corresponding origin heads. Updating this documentation creates a new task branch; it does not move those feature branches, merge their code, update `main` or publish an application.

## Branch-specific commands and artifacts

The current `package.json` provides `dev`, `dev:api`, `setup:japanese-voice`, `dev:japanese-voice`, web build/preview, tests and backup tooling. See [README](../README.md), [local operations](LOCAL_OPERATIONS.md) and [Japanese audio](JAPANESE_AUDIO.md).

`android:doctor`, `build:apk`, `android:install` and `test:android-contract` belong to `feat/android-test-apk`. Its tracked instructions are `docs/ANDROID_TESTING.md` on that branch. The previously verified APK is a French-preview artifact, not proof of Japanese Android support. Native SQLite/audio adapters, physical-phone acceptance and integration with the current hub remain open.

Residual Android build/cache files left after the branch switch were moved and hash-verified outside this source tree at `D:/dev/projects/SmartLingo-sessions/android-build-preserved-2026-11-22/apps-android`, with a local sibling manifest. This clears untracked generated-file noise while preserving the build; it does not move or remove the Android source branch. See [cleanup evidence](CODEBASE_REVIEW.md).

Hosted build/test commands from the Cloud branch likewise do not exist automatically here. To deploy the current French/Japanese app, first reconcile the old hosting capability gates with the current learner and validate the combined result in a separately authorized implementation step. [Cloud guidance](CLOUD_WORKFLOW.md) and the [historical deployment brief](CLOUD_DEPLOY_PROMPT.md) describe that distinction. No live website is established by Git synchronization.

## Safe continuation

1. Fetch origin and inspect `git status --short --branch`, `git worktree list` and current source history. Compare local and remote heads before integrating or pushing.
2. Start the task from the branch containing the intended implementation. Preserve unrelated changes and generated local files; do not copy an entire older worktree over newer source.
3. Keep code synchronization separate from browser data transfer. Notebook/progress live in browser IndexedDB, not Git; transfer them only through private explicit learning backups. Backup v4 needs a compatible app and cannot be imported by the older Android source.
4. Rebuild the export after source changes. Check the actual preview process/worktree and build identity before claiming its UI matches the checked-out commit.
5. Commit deliberate task paths, push the assigned topic branch normally and verify the live remote SHA. Standing authorization does not include merging, force-pushing, changing main or deployment.
