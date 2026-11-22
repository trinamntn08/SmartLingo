# Android phone test APK

Status: implemented and build-verified, 2026-11-22 (Europe/Paris); physical-device acceptance pending
Owner: primary agent

## Outcome and acceptance

Generate an installable, debug-signed Android APK from this checkout so the owner can test the existing learner on a phone. Bundle the exported learner, lessons and pictures in the APK: opening and ordinary study must work without a computer, development server, API key or internet. Notebook and course progress must survive app restarts. Provide a repeatable build command, an explicit optional USB installation command, prerequisites, troubleshooting and a physical-device checklist.

The first test package uses a Capacitor Android WebView shell around the existing Expo web export. It preserves the IndexedDB adapter and language-independent learning logic. This is a phone-testing bridge; the React Native storage/audio migration, iOS, release signing and store distribution remain separate work. No hosted API, curriculum publication or deployment is included.

## Boundaries and contracts

- Application ID: `com.smartlingo.preview`; local origin: `https://localhost`. Keep both stable for test updates and local learning data.
- APK assets come only from a fresh local export, never a development/remote server URL. Android builds do not use the web service-worker download path.
- Detect the Android shell using Capacitor's native runtime. Hide the loopback-only editor, published-content refresh, AI conversation/transcription and neural generation. Show bundled-offline and device-local-data guidance. External listening links remain explicit and require internet.
- Android backup export uses a narrow `LearningBackup.save({ filename, contents })` native plugin returning `{ saved: true }` only after the Android document picker writes the UTF-8 JSON file. Cancellation/failure rejects. Import continues through the system file picker and existing bounded validation/atomic merge.
- No server credentials, new learner storage schema, analytics, microphone permission, paid requests or automatic installation on attached devices.

## Steps and ownership

1. Primary: record this plan and packaging decision before implementation; own shared manifests/lockfile, learner runtime/UI/backup adaptations, integration checks and Git.
2. Android builder: exclusive ownership of `apps/android/`, `scripts/android-apk.mjs`, and `scripts/tests/android-apk.test.mjs`. Implement the native shell/document-save plugin, prerequisite/build/install tooling and focused failure-path tests. Do not modify shared manifests or learner files.
3. Independent reviewer: read-only review of packaging, runtime boundaries, data preservation and actual validation.
4. Primary: finish user-facing instructions/status/checkpoint, run combined checks, inspect the APK if build prerequisites permit, commit and push the topic branch. Preserve pre-existing `tests/e2e/backup.spec.ts` status.

## Validation

Run repository/TypeScript checks, tooling/application tests, fresh export and Android Gradle debug assembly. Inspect APK identity/signature/assets using installed SDK tools. Exercise the Android capability UI and persistence in a browser fixture separately from native testing. Actual install, first launch in airplane mode, restart persistence, document save/import, system back/navigation, safe areas and audio require an emulator or explicitly authorised physical device; do not label browser emulation as phone acceptance.

## References

- [Project mobile requirements](../../PROJECT_PLAN.md), M5.
- [Capacitor installation](https://capacitorjs.com/docs/getting-started), [Android](https://capacitorjs.com/docs/android), [environment requirements](https://capacitorjs.com/docs/getting-started/environment-setup).
- [Architecture](../ARCHITECTURE.md) and [packaging decision](../decisions/0026-android-webview-test-package.md).

## Progress

Initial inspection: no existing APK installer, only a web learner and Codex setup installer. Node 24/npm 11 and Android SDK platform tools are present. Java/SDK compatibility and Gradle assembly remain to be checked. Account allowance reporting is unavailable in this client; no automatic-resume scheduler is configured.

Implemented shell/build/install helper, original code-native launcher icon, native document-save adapter and phone-specific capabilities. The first independent review found private backup contents could enter Capacitor's default debug log and Android's size-limited saved activity state. Fixed by enforcing `loggingBehavior: none`, removing contents from native call options before opening the picker and retaining only bounded in-memory UTF-8 bytes. Process recreation requires a retry; no automatic private-file staging. Final independent source review confirmed both fixes and found no further actionable defects.

Actual checks so far: `npm.cmd run check` PASS; `npm.cmd test` PASS (30 tooling / 205 application); isolated exported Chromium contracts PASS 4/4 desktop/320px, including local progress/resume, Android export cancellation/delayed success/restore, no loopback API requests and unchanged browser download. Primary inspected the 320px screenshot and corrected a header badge flex-width issue; the stronger width assertion and final rerun passed. Initial default e2e run was blocked by an occupied pre-existing port3002; no owner process stopped. New fixtures isolate on8084.

Prepared checksum-verified portable JDK21 under ignored `.cache/android-tools/jdk/` and official Platform36 under the existing SDK; existing licence files and global Java settings stayed unchanged. `android:doctor` PASS. `npm.cmd run build:apk` PASS: fresh export/sync, Gradle 8.14.3 assembly (93 tasks, first build 10m8s), debug signature/certificate verification, package `com.smartlingo.preview`, min SDK24 / target36, bundled index/Expo JS/pictures. Output `dist/android/SmartLingo-preview.apk`, 12,278,821 bytes, SHA-256 `2e976400d66bfb40eddbf7e46f43f0436ad5a7c7caa23e14ae096f24dd451879`. Adjacent provenance records the tested worktree's base commit and dirty state; this was built before its checkpoint commit. APK, debug key, private SDK paths and portable tools stay outside Git. Real-device testing remains unperformed.

## Handoff

Build and installer tooling are ready for the owner's private Android phone test. Transfer the local APK and follow [Android testing](../ANDROID_TESTING.md). No device was accessed or installed, no merge/deployment/publication occurred, and no physical-phone, real document-provider or native voice acceptance is claimed. Full React Native adapters remain separate work.
