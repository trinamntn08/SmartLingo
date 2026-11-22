# Session checkpoint

Updated 2026-11-22 at 15:28 CET, Europe/Paris. The French A1–B1 daily-course plan and generated-only image policy are ready. [Work log](WORK_LOG.md#2026-11-22-french-daily-course-plan-and-generated-images)

After fetch, the clean local and live `docs/french-course-design-direction` heads matched at `82bce28748789ff6e64ddaf90a7d5b1f973294c6`, ahead/behind `0/0`.

The [course plan](plans/0043-french-daily-course.md) links A1, A2 and B1 maps with 24 units and 168 study days, starting with the existing two pilot drafts. The [generated-only imagery decision](decisions/0037-model-generated-imagery.md) applies to new website imagery and informs the planned French course renderer. Current third-party legacy files continue to carry their credits.

The three maps passed the day count, sequence, table, pilot title and relative link checks. Independent review confirmed transfer cadence and progress compatibility. `npm.cmd run check`, `git diff --check`, the setup dry run and both visual skill validators passed. Course implementation, image generation and release review are pending.

The commit containing this note is the checkpoint. Finish staged checks, push the topic branch and read back the live head. When implementing, start with D003 and the generated-only course renderer policy. Verify the existing first two days' identities, progress and credits through the new draft.

Account usage reporting is unavailable in this client. No automatic-resume schedule is configured.
