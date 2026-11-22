# 0026: Bundle the web learner in an Android test shell

Date: 2026-11-22. Status: accepted for owner-requested phone testing.

The owner requested documentation followed by implementation of an installer that generates an APK for their Android phone. The current learner uses browser APIs throughout persistence, SVG pictures, backups and audio; a native React Native build alone would not make those adapters functional.

Use a thin Capacitor Android shell with a local, bundled Expo web export for this testing step. Keep shared domain/content and IndexedDB unchanged. Pin the Capacitor packages, commit native project source and Gradle wrapper, and generate a debug-signed APK with local tooling. The package is `com.smartlingo.preview`, at the stable local `https://localhost` origin. Updates with the same signing key retain app storage; clearing data/uninstalling removes it. Different computers can have different debug keys, so preserve private learning backups before changing build machines.

The APK starts offline without a PC or service worker. Hide desktop loopback API features in this shell and never expose the local API to obtain phone access. Ordinary study and personal vocabulary remain usable. Export private learning backups through Android's document picker with explicit user action and confirmed write completion. No blanket shared-storage or microphone permissions are needed. Browser file import retains existing validation and merge behaviour.

This adds a testing bridge alongside the web preview. It does not complete M5 or claim native SQLite, native speech, microphone, iOS, release signing, store readiness or actual phone acceptance. Device voices may be unavailable in WebView; text remains visible. A future native implementation can replace platform adapters while keeping learning contracts and stable content IDs.
