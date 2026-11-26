# Build the shared learner for Android testing

Status: completed for private APK handoff. Owner: primary agent.

## Outcome

Produce a verified, debug-signed APK of the current French and Japanese learner with its bundled assets, stable app identity and local study data. Verify offline launch, learning progress, navigation and private backup where an emulator is available. Provide a Windows setup, build and install guide.

## Relevant context

The earlier Android package introduced the Capacitor shell, a stable WebView origin and private document backup. The current architecture describes the shared learner, IndexedDB and v4 backups. [Historical Android packaging plan](https://github.com/trinamntn08/SmartLingo/blob/0d21d675279ca46363c9adc953097484ec30ab23/docs/plans/0032-android-test-apk.md), [Current architecture](../ARCHITECTURE.md), [Capacitor Android reference](https://capacitorjs.com/docs/android), [Android command-line tooling](https://developer.android.com/tools)

## Steps and ownership

- Primary agent owns the Android project, build scripts, dependencies, emulator and combined acceptance.
- Learner implementation owns the WebView capability gates, route behaviour and existing backup adapters under the learner app.
- Guide author owns the technical guide and discoverability links.
- Independent reviewer reads the combined change before handoff.

## Validation

Run repository and app checks, Android bridge and web regression contracts, then verify the APK signature, identity, asset hashes and build provenance. Exercise a cold offline emulator install, language study, persisted notebook and progress, system Back and private backups where supported. Record any physical-phone testing separately.

## Progress and handoff

The implementation at `2c4bace2f39f103056afb31135a1579f9b5ef1b3` rebuilt cleanly. The verified APK and its provenance JSON are under `dist/android`. Chromium, web cold-offline tests, and Android 15 emulator tests passed. The emulator verified offline study, persistence, Back, rotation, backup and a same-key legacy update. Physical-phone acceptance remains open. [Work log](../WORK_LOG.md#2026-11-26-build-the-current-french-and-japanese-learner-for-android), [Android guide](../ANDROID_TESTING.md)
