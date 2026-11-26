# Build and test SmartLingo on Android

SmartLingo Preview is a private, debug-signed test app. It bundles the current French and Japanese learner, including lessons, pictures and fonts. Bundled study opens offline on first launch without a running computer or an API key. The app uses Android WebView and stores learning data on the device.

## 1. Set up Windows

Open PowerShell at the root of the SmartLingo worktree that includes `apps/android` and the `android:doctor` script. See [repository and branch state](REPOSITORY_STATE.md) to identify that worktree.

| Tool | What to install |
| --- | --- |
| Git and JavaScript runtime | Git for Windows and Node.js 24.19.0, which bundles npm 11.17.0. [Git for Windows](https://git-scm.com/install/windows), [Node.js 24.19.0 downloads](https://nodejs.org/download/release/v24.19.0/) |
| Java | A complete JDK 21 matching your PC architecture. The reference host uses Eclipse Temurin 21.0.13.1+2. The JDK directory must contain `bin\java.exe`, `bin\javac.exe` and `bin\jar.exe`. [Eclipse Temurin JDK 21](https://adoptium.net/temurin/releases/?version=21) |
| Android SDK | Android SDK Platform 36, Android SDK Build-Tools 35.0.0 and Android SDK Platform-Tools. The reference host uses Platform-Tools 35.0.2. In Android Studio's SDK Manager, choose API 36 under **SDK Platforms**. Under **SDK Tools**, enable **Show Package Details** to select Build-Tools 35.0.0. Review and accept the licence terms presented for the installed components. [Android Studio](https://developer.android.com/studio), [SDK tools](https://developer.android.com/tools) |
| Android build | The project pins Capacitor 8.6.2 and Android Gradle Plugin 8.13.0. The checked-in wrapper supplies Gradle 8.14.3. |

For a fresh checkout, clone the Android task branch into a new folder after installing Git.

```powershell
git clone --branch feat/android-current-learner-apk https://github.com/trinamntn08/SmartLingo.git SmartLingo-Android
Set-Location -LiteralPath '.\SmartLingo-Android'
```

Use your actual JDK and SDK folders in this PowerShell session. The SDK example uses Android Studio's common per-user Windows location.

```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
node --version
npm.cmd --version
& (Join-Path $env:JAVA_HOME 'bin\java.exe') -version
& (Join-Path $env:JAVA_HOME 'bin\javac.exe') -version
& (Join-Path $env:JAVA_HOME 'bin\jar.exe') --version
npm.cmd ci
npm.cmd run android:doctor
```

The first setup or build needs internet access for uncached npm dependencies, Android SDK components, the Gradle distribution and Gradle dependencies from Google Maven or Maven Central. Ordinary use of the bundled learner is offline. For optional emulator testing, install **Android Emulator** and a compatible system image through SDK Manager, then create a dedicated test device in Device Manager. [Android emulator setup](https://developer.android.com/studio/run/emulator)

## 2. Build and verify the APK

From the same worktree and PowerShell session, run the build once the doctor passes.

```powershell
npm.cmd run build:apk
```

The build exports the current learner, copies the export into the Android shell, and assembles a debug-signed APK. It leaves these local files outside Git:

- `dist/android/SmartLingo-preview.apk` is the installer.
- `dist/android/SmartLingo-preview.provenance.json` records the build source and verification data.

Use the APK from a successful build. To compare its SHA-256 and size with the adjacent metadata and check its signature:

```powershell
$apk = Resolve-Path -LiteralPath '.\dist\android\SmartLingo-preview.apk'
$receipt = Get-Content -Raw -LiteralPath '.\dist\android\SmartLingo-preview.provenance.json' | ConvertFrom-Json
$hash = (Get-FileHash -LiteralPath $apk.Path -Algorithm SHA256).Hash
if ($hash -ine $receipt.sha256 -or (Get-Item -LiteralPath $apk.Path).Length -ne $receipt.bytes) {
    throw 'The APK does not match its build metadata. Run the build again.'
}
$hash
& (Join-Path $env:ANDROID_HOME 'build-tools\35.0.0\apksigner.bat') verify --verbose --print-certs $apk.Path
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed.' }
& (Join-Path $env:ANDROID_HOME 'build-tools\35.0.0\aapt.exe') dump badging $apk.Path
& (Join-Path $env:ANDROID_HOME 'build-tools\35.0.0\aapt.exe') dump permissions $apk.Path
```

The application ID is `com.smartlingo.preview`. This preview is version `0.2.0-preview` (version code 2), with minimum API 24 (Android 7) and target API 36. Use a current Android System WebView or Chrome supported by your device. [APK signature verification](https://developer.android.com/tools/apksigner), [Capacitor Android support](https://capacitorjs.com/docs/android)

## 3. Install on your phone

### Transfer the APK and open it in Files

1. Connect the unlocked phone to the PC and select **File transfer**, or use another private file-transfer method.
2. Copy `SmartLingo-preview.apk` to the phone. Open the APK in **Files** and choose **Install**.
3. If Android asks, allow **Install unknown apps** for the app opening the APK. You can switch that permission off after installation.
4. Open **SmartLingo Preview** from the launcher. For a fresh-install offline test, turn on airplane mode before opening it.

### Install over USB with ADB

Enable **Developer options** and **USB debugging** on the intended phone. Connect it with a data cable, unlock it and approve Android's debugging prompt. The device should appear as `device` in the list.

```powershell
& (Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe') devices -l
npm.cmd run android:install
```

When more than one device or emulator is connected, replace `YOUR_DEVICE_SERIAL` with the intended serial from the list.

```powershell
npm.cmd run android:install -- --serial YOUR_DEVICE_SERIAL
```

The helper verifies the local APK and uses `adb install -r` for a data-preserving reinstall or update. [ADB device and install commands](https://developer.android.com/tools/adb)

## 4. Keep learning data during an update

- Export a learning backup from the installed app before an update. Keep the JSON in a private folder separate from the app. It is unencrypted and can contain personal notes.
- To update in place, use the same application ID and signing key, with a version code Android will accept. Use the same debug key as the older APK when rebuilding. Different Windows accounts or computers can have different debug keys. Keep the original APK available if an update fails.
- A signature mismatch leaves the existing app installed. Prefer rebuilding with the original signing key. Before considering a reinstall, export a backup and confirm that the saved file exists and opens. Uninstalling or clearing app storage deletes on-device progress and notebook entries.
- The earlier French-only test APK exports backup version 3. The current learner accepts supported version 3 backups and exports version 4, which preserves French and Japanese learning. Use a version 4-compatible app to restore a current backup. The rewritten French A1 Lesson 1 starts at its new opening. Earlier activity is retained, and compatible saved steps such as French A1 Lesson 2 still resume.
- On the phone, open **Profile → Offline & backups**. Choose **Download learning backup** and confirm the destination in the Android document picker. To restore, use **Choose a learning backup**, review the counts, confirm you trust the backup, then choose **Restore backup** and **Reload learning**. The restore merges records and keeps existing notes. If Android restarts the app while the picker is open, retry export and confirm that the file was saved.

## 5. Run the device smoke tests

1. **Start offline.** Install on a fresh test device or test emulator, switch on airplane mode and ensure Wi-Fi is off before the first launch. Open French **Today** and a guided lesson. Switch to Japanese, open a lesson and try kana practice in **Japanese letters**. Check that pictures, Japanese readings and English explanations appear.
2. **Check persistence.** Save a word in each language and advance to a specific lesson step in each. Force-stop and reopen SmartLingo Preview. Check each notebook and the resumed lesson position.
3. **Check navigation and layout.** Use Android Back from a lesson, then reopen it through Learn. Rotate the device, enlarge system text and open the keyboard on a text input. Check that navigation and buttons remain reachable without content overlapping the system bars.
4. **Check backup and restore.** Cancel an export and verify no success is shown. Retry, confirm the save, and check the JSON exists. Choose an invalid test file and verify it is rejected. Choose a valid test backup, review its contents, explicitly merge it, then reload and verify the notebook and progress. Test with a version 3 backup from the earlier APK if available.
5. **Check update and audio.** On a test device with saved data, install a compatible same-key build over the previous build and verify that progress and notes remain. Try the speaker controls in both languages, then restore internet access and try an external listening or video link. Record voice availability and how the link opens.

Record whether each test used an emulator or a physical phone, along with the Android API level, WebView version, and reproducible failures. Keep personal notes and backups out of bug reports. Desktop browser contract tests exercise the expected bridge and browser behaviour. See the [session checkpoint](SESSION_CHECKPOINT.md) for validation actually performed.

The reference APK passed the offline study, persistence, Back, rotation, private file backup and same-key update checks on an Android 15 (API 35) emulator with WebView `124.0.6367.219`. The emulator had no speech engine, and the written activities were usable. The physical-phone checklist is ready for testing.

## What works offline

Ordinary lessons, pictures and kana practice are bundled. Notebook entries and learning progress are stored on the phone. Audio depends on available device voices, and written study support stays visible. Listening and video links open externally and need internet. For transfer between a browser and the APK, use a compatible private learning backup.

The Android app omits the desktop curriculum editor and publication controls, AI conversation and transcription, and server-generated voices. To refresh bundled study material, install a newer APK. This private preview uses the existing web learner in Android WebView. Store distribution and full native Android and iOS adapters remain planned.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Doctor cannot find JDK 21 | Run the two Java version commands above. Point `JAVA_HOME` at the full JDK folder and rerun the doctor. |
| SDK, Build-Tools or licences are missing | Check that `ANDROID_HOME` matches the SDK location in Android Studio. Install the exact components listed above and complete any licence prompts in SDK Manager. |
| Gradle download or build fails | Read the first specific Gradle error. Check internet or the configured proxy for dependency downloads, and SDK components or licences for toolchain errors. Rerun the doctor and build after fixing the cause. |
| ADB finds no device or reports `unauthorized` | Unlock the phone, enable USB debugging, use a data-capable cable and approve the prompt. Rerun `devices -l`. |
| ADB lists several devices | Rerun the installer with the intended serial using the command above. |
| Update signature or version mismatch | Keep the installed app and export its backup. Use the original debug key and a compatible version code to build the update. |
| The app is blank or closes | Verify the APK hash and rebuild if it differs. Update Android System WebView or Chrome as applicable, retry, then record the Android API level, WebView version and steps to reproduce. |
