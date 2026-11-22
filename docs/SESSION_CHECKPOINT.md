# Session checkpoint

Updated: 2026-11-22 (UTC). Learner UI redesign implemented on `feat/learner-ui-redesign` from clean app baseline `2249086`. Combined browser and exported offline verification is complete. The local commit containing this note is the UI checkpoint.

## Current authorised request

Review and redesign the SmartLingo app UI. Keep the owner’s seven supplied images as design references. Preserve the main learner flows, drafts and publication boundaries, stored notebook and progress, and bundled offline study.

## Completed work

- Reviewed the original desktop and narrow layouts in Chromium and inspected all seven references. Applied the project’s UI Builder guidance and feature-delivery skill. Delegated lesson/vocabulary and catalogue components to separate UI builders, with an independent read-only reviewer using the inherited model. Account allowance was unavailable.
- Redesigned the learner shell, Today, Explore, study, review and settings screens. Kept the desktop rail, the horizontal mobile topic list and vocabulary-first topic pages. Added a keyboard shortcut to the mobile nav and direct jumps to short lessons and the next lesson stage.
- Used ImageGen for the decorative bakery scene and saved a local compressed JPEG for the existing asset export. Source and interaction decisions are recorded in [ADR 0021](decisions/0021-learner-navigation.md).
- Updated browser selectors for the intentional menu and ARIA changes. Extended keyboard coverage for the new skip links, short-lesson shortcut and stage focus, and offline coverage for hero-image decoding.

## Verification

- `npm run check`, `npm test` and `git diff --check` passed. The application check covered all 18 tooling and 190 application tests.
- Combined and focused reruns validated 81 distinct desktop/narrow browser cases with one intentional duplicate-publication skip. Initial checks caught hero and level-filter overflow plus Today’s missing learner role. Those fixes passed Chromium inspection at five widths from 320 to 1440 pixels. Final focused reruns also confirmed the revised status text, topic disclosure and keyboard focus.
- `npm run build:web` produced 127 offline files and 9,956,921 bytes, build prefix `340f421b188a`. All eight test cases passed against the export, including cold offline hero loading. Used the existing system Chromium fallback and isolated fixtures. The shared Cloud browser returned an unavailable runtime. Screen-reader, native, Safari and physical-phone results remain unverified.
- Independent read-only closeout confirmed the owner’s horizontal narrow topic list and vocabulary-first access, keyboard skips, French markup, editor stage focus and offline asset manifest. See [plan 0025](plans/0025-learner-ui-redesign.md). The checkpoint is local on the UI branch.

Previous repository/cloud preparation is preserved in `2249086` and documented in [the Cloud workflow](CLOUD_WORKFLOW.md). No automatic resume is configured.
