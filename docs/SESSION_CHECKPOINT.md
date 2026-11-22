# Session checkpoint

Updated 2026-11-22 at 15:53 CET, Europe/Paris. The five-day French A1 preview is ready for manual owner review on `feat/french-daily-opening`. The clean plan baseline matched live origin at `b73b51d2f5933f8e5c8a3a96d7cb4dff842c4d41` after fetch, ahead/behind `0/0`. [Work log](WORK_LOG.md#2026-11-22-first-five-french-daily-lessons)

The local preview is running at `http://localhost:8082` from export `c5a7c2b99800`. A fresh browser verified French → Today → Open daily course → Choose a study day and all five lessons. Days 1–2 keep original payloads and progress scopes, and Day 1 keeps its credits. Days 3–5 have original bilingual study and practice. The French daily course uses text cards with optional vocabulary audio.

`npm.cmd run check`, all 275 tooling/application tests, 147 Chromium tests with one existing skip, 24 cold-offline tests, and all four focused French offline checks on the final export passed. Independent review and a 320 px smoke check passed. Physical-device audio quality and owner content approval are pending.

The commit containing this note is the checkpoint. Finish staged checks and verify the topic branch upload. Keep the current preview for manual review and stop after Day 5. Resume with owner feedback before deciding how to complete the first unit.

Account usage reporting is unavailable in this client. No automatic-resume schedule is configured.
