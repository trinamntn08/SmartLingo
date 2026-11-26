# Preserve learning data through an Android APK update

Status: completed for private APK handoff.

## Outcome

Install the new SmartLingo APK as an update and study offline with the earlier bilingual APK's notebook, practice and course history, kana progress, and preferences. Reject an incompatible APK before the USB install action. Check two local APK files independently for a Files update.

## Relevant context

The previous APK uses the package `com.smartlingo.preview`, origin `https://localhost`, and the shared IndexedDB store. The next APK keeps them and uses the same signing key. The current schema can stay in place. [Android packaging decision](../decisions/0046-shared-learner-android-preview.md), [Signing](https://developer.android.com/studio/publish/app-signing#considerations), [ADB](https://developer.android.com/tools/adb)

## Steps and ownership

- Primary owns the Android tool, tests, version and guide.
- The device tester seeds and validates the exact old-to-new APK upgrade on a dedicated emulator.
- An independent reviewer inspects compatibility and failure paths.

## Validation and handoff

Run repository, application and Android browser checks. Compare both APKs, verify the prior APK stays intact, and compare synthetic learning state on the emulator with the exact new artifact before and after relaunch. Report physical-phone testing separately.

The clean implementation APK passed an offline code 2 to 3 update and relaunch on Android 15. The original APK and receipt are preserved. The Android guide gives the Files update, APK comparison and backup recovery steps. [Validation record](../WORK_LOG.md#2026-11-26-preserve-learning-data-through-android-apk-updates), [Android guide](../ANDROID_TESTING.md)
