# Session checkpoint

The owner requested the Android installer for the completed course refactor. SmartLingo `0.2.7-preview` (version code 9) built successfully from clean source `e958050a2cea9ec944b84956b4b5fc4748c8b109`. The signed APK is in `/workspace/shared/downloads/SmartLingo-0.2.7-preview.apk` and matches the build receipt. The signing certificate differs from the public 0.2.6 APK. Anyone replacing that build needs a private learning backup and a fresh install. Device installation remains unverified. [Work log](WORK_LOG.md#2026-11-27-android-preview-with-the-shared-course-interface)

Updated 2026-11-27 UTC. Course interface refactor is complete on `feat/shared-course-interface` in `/workspace/SmartLingo-courses`, based at `5d31ae05296820483d786569daa1d5ae1155905e`. All 76 fetched and live origin branch heads matched before the checkpoint. The clean original checkout remains on `chore/cloud-workflow`. [Work log](WORK_LOG.md#2026-11-27-shared-course-interface) · [Plan](plans/0062-shared-course-interface.md)

The registry, outline, Learn landing and launch cards are shared. Japanese keeps the letters route, guided practice and bundled recordings. Repository and TypeScript checks, 34 tooling tests, 311 application tests and the web build passed. Compared five French screens before and after at 320 and 1440 px and checked Japanese readings and wrapping. The export contains 815 offline files under build `a0182ca051d10d45e5c1d04768a35b031647306ee1aea886d0a6bb5e3b545f24`.

Desktop and phone Chromium covered 259 passing cases across the matrix and a focused rerun, with one intentional skip. The original Japanese speech fixture expected device speech under Automatic and now selects the device source explicitly. All 18 focused cold-offline course, kana and navigation cases and all 10 Android browser contracts pass. The final export opens the Japanese guided course from Today at both 320 and 1440 px.

The commit containing this note is the validated checkpoint. Physical-device, Safari and screen-reader testing remain open. Account allowance is unavailable and automatic resume is unconfigured.
