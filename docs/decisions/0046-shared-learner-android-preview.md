# 0046 Keep the Android test shell on the shared learner

Accepted on 2026-11-26 for private Android testing.

Port the existing Capacitor packaging to the shared French and Japanese learner. Keep the application ID `com.smartlingo.preview`, WebView origin `https://localhost` and IndexedDB store identity for signed updates. Version code 2 advances the earlier French-only package. The v4 backup preserves language and reading information and accepts supported v3 backups. Existing revision rules still apply to revised lessons.

Use the shared route parser and navigation coordinator. In the APK, keep routes after the root fragment so reloading a course or lesson ID containing periods can always read the bundled index. Android Back traverses that history. Browser URLs retain their existing paths and service worker. The APK bundles its own assets, uses supported device voices, and leaves desktop-only API controls unavailable.

Keep Android document selection and writing in the native shell. Only the user-selected JSON is written, and the learner reports success after the write closes. Keep the pending bytes in memory, disable bridge logging, and use the shared schema and explicit merge on import.

Use debug signing for private tests and check the signature, identity, asset digests, and source metadata of the artifact. Device verification and store readiness remain distinct. [Android guide](../ANDROID_TESTING.md)
