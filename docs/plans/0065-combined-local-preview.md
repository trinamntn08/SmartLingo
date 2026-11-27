# Combined local learner preview

Status — completed, 2026-11-27.

Keep the notebook learner with its latest French and Japanese lesson reader, grammar, romaji and saved-word interactions. Bring the compatible Japanese curriculum and pronunciation from the separate release history into that learner. Preserve existing lesson identities and progress and keep supplemental practice distinct from completion.

- The primary agent owns shared contracts, Japanese topic and guided practice, preview routing, integration, and handoff.
- The kana worker owns alphabet curriculum, learner screens and focused checks.
- The audio worker owns pronunciation adapters, study controls, media and credits. The inventory explorer compares the branch histories read-only.

Verify all live GitHub heads, run repository and application checks, and exercise French and Japanese learner journeys in Chromium at desktop and narrow widths. Verify offline install and a cold reload including newly bundled lessons and pronunciation. Confirm that localhost port 8082 serves the new export. Keep Android packages and hosted deployment on their own delivery tracks.

## Handoff

The export retains the existing notebook layout and lesson identifiers. Japanese letters include 53 lessons. All 69 Japanese topic lessons and 13 guided lessons provide supplemental saved practice, with three guided units. The 664 bundled Japanese MP3 files include native-speaker and credited synthetic audio. The local web preview is available at `http://localhost:8082` as build `8998ba5afc54`.

Repository, TypeScript, 18 tooling, 309 application, 14 focused online Chromium and six cold-offline checks passed. The Android and hosted delivery branches are documented in the work log. Owner and qualified Japanese review remain open. [Source and validation](../WORK_LOG.md#2026-11-27-gather-the-latest-features-and-rebuild-the-learner-preview)
