# Session checkpoint

Updated: 2026-11-22 (Europe/Paris). Completed and build-verified: Android phone test APK tooling and local artifact. The commit containing this note is the source checkpoint; its actual SHA and verified origin upload are reported at handoff.

## Request and result

Owner requested documentation followed by an installer generating an APK for their Android phone, then asked to continue to completion. [Plan 0032](plans/0032-android-test-apk.md), [ADR 0026](decisions/0026-android-webview-test-package.md), and [Android instructions](ANDROID_TESTING.md) record the scope and installation steps.

`npm run build:apk` exports the current learner, synchronises local assets into a Capacitor shell, assembles/signs/verifies the debug package and writes ignored `dist/android/SmartLingo-preview.apk` plus SHA/provenance. `android:doctor` checks prerequisites; `android:install` is a separate explicit USB action with unambiguous device selection. No device was accessed or installed. Build failure invalidates old published outputs instead of presenting a stale APK as current.

The APK bundles lessons/pictures at stable `com.smartlingo.preview` / `https://localhost`, retains the existing IndexedDB adapter, supports phone-local learning and a bounded Android JSON document-save bridge. Import keeps shared validation/atomic merge. PC-loopback API features and web downloads are hidden. Native insets protect the UI; automatic Android backup and Capacitor debug-content logging are disabled. Private export bytes stay in memory and are removed from call options before opening the picker; interrupted process recreation requires retry. Full native SQLite/audio adapters, iOS, accounts and hosted API remain separate work.

## Validation actually performed

- `npm.cmd run check`: PASS repository/documentation and TypeScript, including final source changes; final staged documentation/index rerun before commit.
- `npm.cmd test`: PASS 30 tooling / 205 application tests. Twelve Android tooling tests cover prerequisites, portable JDK discovery, strict arguments/device selection, stale-output/build failures, signature refusal and disabled bridge logging.
- Fresh web export: PASS. Isolated exported Chromium suite `npx.cmd playwright test --config playwright.android.config.ts`: final PASS 4/4 desktop/320px. Covers study/notebook/course resume, hidden PC features and direct editor hash guard, no loopback API requests, delayed native-save acknowledgement/cancellation/retry/restore, and unchanged browser backup download. Primary inspected the final 320px screenshot. Corrected badge-driven mobile layout expansion and strengthened viewport-width assertion before final pass.
- `npm.cmd run android:doctor`: PASS. Used official checksum-verified portable Temurin JDK21 under ignored `.cache/android-tools/jdk/`, and added checksum-verified official Platform36 to the existing SDK. Existing licence terms match after whitespace normalization; licence files and global Java settings stayed unchanged. Source/checksum evidence stays in ignored local tooling cache.
- `npm.cmd run build:apk`: PASS. Fresh export/sync, Gradle8.14.3 assembly (93 tasks, first build10m8s), debug signer/certificate verification and package/SDK/bundled index/JS/picture checks. APK: 12,278,821 bytes; SHA-256 `2e976400d66bfb40eddbf7e46f43f0436ad5a7c7caa23e14ae096f24dd451879`; 130 bundled public files. Independent `aapt dump badging` readback confirms `com.smartlingo.preview`, version `0.1.0-preview`, min SDK24 / target36 and launch activity. No microphone/storage permission requested. Receipt accurately records base `ee23e93` and dirty=true because build preceded the checkpoint commit.
- Independent read-only review: both identified P1 issues fixed (default bridge logging of backup contents, and oversized Android Binder saved state). Final reviewer confirmed fixes against installed Capacitor source, ran Android tooling12/12 and found no further actionable defects. Primary reviewed staged source; fixed generated-template trailing whitespace. `git diff --check`, staged secret scan and `git diff --cached --check` passed before final documentation staging and are rerun before commit.
- Initial default e2e invocation stopped because pre-existing port3002 was occupied. No owner service was stopped; the new contract fixture uses isolated port8084. Full existing browser/offline suites were not rerun. Installation, real document-provider save/import/failure, near5MB export/process recreation, first-launch airplane mode, update persistence, hardware audio, system Back/insets/keyboard and physical-phone acceptance remain unverified.

## Git and next action

Branch `feat/android-test-apk`, base `ee23e93`; the origin daily-course ref matched that base at startup. New Android remote ref was absent at pre-push inspection. Deliberately stage task paths only; preserve/exclude pre-existing `tests/e2e/backup.spec.ts` status with no content diff. APKs, tools, SDK paths, debug signing key, learner data and caches are excluded.

At writing, source commit/push is the remaining handoff operation: final checks, focused commit, inspect live task ref, normal push, compare remote SHA with HEAD. Actual hash/upload state is reported at handoff; do not infer remote success from this note. No merge, main update, deployment, store release or curriculum publication.

Next learner action: transfer the local APK to the owner's phone and follow [the device checklist](ANDROID_TESTING.md), backing up before uninstalling or changing build machines. This implementation step is complete; device observations should drive any follow-up fixes.

## Delegation and recovery

Android builder owned shell/tooling; environment helper owned ignored portable tools/additive SDK setup; independent reviewers stayed read-only. Exposed `gpt-6.1-sol` medium/high used per task routing. Primary owned manifests/lockfile, learner runtime/UI, docs, final SDK copy/native resources, integration and Git. A client tool reset removed earlier handles; files were preserved, final checks/build rerun successfully. No claimed automatic role/hook loading.

Account allowance reporting unavailable in this client on 2026-11-22; no automatic-resume scheduler configured. No paid provider calls, recordings or credentials used. No background build/install/commit service configured.