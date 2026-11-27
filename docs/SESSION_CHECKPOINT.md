# Session checkpoint

Updated 2026-11-27 UTC. The combined learner release on `release/combined-learner` brings together `feat/material-first-lessons` and `fix/android-native-speech`. Android preview 0.2.4 uses version code 6 with the existing application ID and storage schema. Bundled Japanese clips play by default, and an explicitly selected Android voice takes priority. See the [work log](WORK_LOG.md) for branch coverage and release verification.

The web ZIP was launched after extraction. All 344 application/tooling tests and 10 Android/browser contract cases passed. The merge commit containing this checkpoint is the source for the combined platform builds. APK assembly and signer verification use the repository’s provenance check. See the release handoff for the resulting binaries and device verification limits.
