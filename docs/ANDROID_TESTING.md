# Install SmartLingo on an Android phone

This test package bundles the current learner, lessons and pictures in an Android APK. It opens without a running computer, API key or internet. It uses Android WebView with the existing local learning storage. This is an early test build; it is not a Play Store release or the planned full React Native implementation.

## Build the APK on your computer

Use the repository's Node/npm versions and install dependencies with `npm ci`. Android builds additionally need a complete JDK 21, Android SDK Platform 36, Build Tools 35.0.0, and Android Platform Tools. Android Studio's SDK Manager can install the SDK components. Keep the Android SDK licences accepted by you during SDK setup. The initial build also downloads Gradle and Maven dependencies; later ordinary app use needs none of them.

Set `JAVA_HOME` to the JDK directory containing `bin/java.exe` and `bin/javac.exe`, and `ANDROID_HOME` to the Android SDK directory. The helper also looks in common Windows Android Studio/JDK and Android SDK locations, and in ignored repository-local `.cache/android-tools/jdk/` subdirectories. Java 8 on PATH is insufficient. For example, in PowerShell, using your actual paths:

```powershell
$env:JAVA_HOME = 'C:\path\to\jdk-21'
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
npm.cmd run android:doctor
npm.cmd run build:apk
```

Only use `build:apk` after the doctor passes. It exports the current learner, synchronises local assets into the native shell, builds a debug-signed APK and copies the result to:

```text
dist/android/SmartLingo-preview.apk
```

The output is a local artifact, excluded from Git. The helper reports the APK's SHA-256 and writes build metadata beside it. Building does not install anything on a phone. The Codex setup installer (`setup:codex`) remains separate developer tooling.

## Transfer and install

Copy `SmartLingo-preview.apk` to your phone using USB file transfer or a private file transfer method. Open it in the phone's Files app. Android may ask you to allow **Install unknown apps** for the file manager used to open it. Allow it for this installation and turn it off afterwards if desired. Open **SmartLingo Preview** from your launcher. Android 7 or later and an up-to-date Android System WebView/Chrome are required; actual compatibility still needs device testing.

Alternatively, enable Developer options and USB debugging on your phone, connect it, and approve the phone's USB debugging prompt. Then explicitly run:

```powershell
npm.cmd run android:install
```

The installer uses `adb install -r` with the generated APK. It requires one authorised device; if multiple devices/emulators are connected, specify the intended one:

```powershell
npm.cmd run android:install -- --serial YOUR_DEVICE_SERIAL
```

Do not uninstall to fix an update signature error before saving a learning backup. Updates with the same package ID (`com.smartlingo.preview`) and signing key normally preserve app data. Debug keys belong to the build computer's user and are not committed. A build from a different computer may require a different signature and therefore fail to update the existing install. Save a backup before switching build machines. This debug package is for private testing; store/release signing remains future work.

## What to test

1. Turn on airplane mode **before first launch**. Open Today, a lesson, pictures and both daily-course days. The bundled content should open without a server or app download.
2. Save a word and a course section. Close/force-stop the app, reopen it, and verify the notebook and exact course position remain.
3. In Profile, choose **Download learning backup**. Cancel the Android document picker once; no success should be shown. Retry, choose a private location, save the JSON, and inspect that the file exists. Test **Choose a learning backup**, inspect its counts, then explicitly merge it. Existing notes should remain.
4. Try narrow/landscape layouts, large system text, keyboard input, system Back, screen rotation, cutouts and gesture navigation. Check that all controls remain reachable.
5. Try speaker controls. A French device voice may be unavailable in this WebView; visible French, meanings and translations remain usable. Native speech and microphone integration are not included.
6. With internet restored, open a listening resource. It should open externally; external audio/video is not included in the APK.
7. Install a new APK from the same build computer over the existing app, then verify the notebook and course progress remain.

Browser contract tests simulate the Android bridge but cannot establish these physical-device outcomes. Record the Android version, phone model, WebView version and observed failures when reporting results. Do not include private notes or recordings in reports.

## Data and feature limits

Learning data stays in this app on this phone; there is no account or sync. Browser data and APK data are separate. Transfer browser learning using its JSON backup, then restore in the app. Clearing app storage or uninstalling deletes local progress/notebook. Automatic Android cloud/device backup and Capacitor debug logging are disabled for this private test package; keep your own learning backup separately. Backup JSON is private and unencrypted. An in-flight export stays in memory: if Android restarts the app while the document picker is open, export must be retried. The picker may have created an empty file; only a confirmed save establishes a usable backup.

The APK shows bundled study and personal vocabulary. It hides curriculum editing/publication refresh, AI conversations/transcription and neural voice generation because the API is loopback-only on the computer. Starting that API on your PC does not make it available at the phone's loopback address. Do not expose it publicly. Voices and external listening can require internet. New bundled content arrives through a newer APK; this shell does not use browser service-worker downloads.

## Troubleshooting

| Symptom | Next action |
| --- | --- |
| Doctor reports Java missing/old | Point `JAVA_HOME` at a complete JDK 21; a folder named jdk-21 without its binaries is insufficient. |
| Missing SDK/platform/build tools | Install the named packages through Android Studio SDK Manager, review any required licence terms yourself, and rerun the doctor. |
| Gradle download/build fails | Check internet access and the actual error. A failed build is not a new APK; rerun successfully before transferring. |
| Device is unauthorised | Unlock the phone and approve the USB debugging prompt. |
| Multiple devices | Use `--serial` with the intended authorised device. |
| Update signature mismatch | Back up learning in the installed app and retain its original APK/key. Rebuild on the original machine if possible. |
| Blank screen/crash | Update Android System WebView/Chrome, note OS/WebView versions and collect a minimal reproduction. This still needs real-device acceptance. |

See [execution plan](plans/0032-android-test-apk.md), [packaging decision](decisions/0026-android-webview-test-package.md) and [current status](STATUS.md) for scope and actual validation.
