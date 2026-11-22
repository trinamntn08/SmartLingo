# Session checkpoint

Updated 2026-11-22 (Europe/Paris). Browser Back and Forward now restore visited learner screens in `D:/dev/projects/SmartLingo-sessions/browser-back` on `fix/browser-back`. The starting local and live base matched at `82bce28748789ff6e64ddaf90a7d5b1f973294c6` with ahead/behind `0/0`. A fresh fetch showed the separate French planning branch advanced to `b73b51d` without learner code changes and the task ref was still absent from origin. [Work log](WORK_LOG.md#2026-11-22-learner-browser-back-and-forward)

The desktop regression reproduced the exit on the original preview. On the fix, six navigation cases and nine editor cases passed on port 8084 in desktop and narrow Chromium. Repository/type checks, 256 application tests, and the other selected learner browser journeys passed. The isolated fixed preview is running at `http://localhost:8084`.

The commit containing this note is the checkpoint. Finish staged checks, push `fix/browser-back` and verify the live ref matches. Account usage reporting is unavailable. No automatic-resume schedule is configured.

Updated 2026-11-22 (Europe/Paris). The copyright question about the proposed French course is answered on `docs/french-course-design-direction`. [Work log](WORK_LOG.md#2026-11-22-french-course-copyright-question)

After fetching, the clean local and live `docs/french-course-design-direction` heads matched at `09dd94a250c1262e825bceee4332d59f5e4b897c`, ahead/behind `0/0`.

Checked the proposed first-week outline and the prior source decision against French copyright law and WIPO guidance. The planned independent progression and original lessons can use general teaching methods as inspiration. The five additional days remain at the outline stage. `npm.cmd run check` and `git diff --check` passed. [Opening week design](WORK_LOG.md#2026-11-22-french-course-design)

The commit containing this note is the checkpoint. Finish staged checks, push the topic branch and read back the live head. When implementing, map vocabulary and prerequisites for the proposed first-week continuation and append the first new draft day while preserving existing course-day identities and progress.

Account usage reporting is unavailable in this client. No automatic-resume schedule is configured.
