# Session checkpoint

Updated 2026-11-26 UTC. The full Japanese curriculum redesign is implemented and verified in `/workspace/SmartLingo-japanese`. The commit containing this note is the task checkpoint.

## Source and scope

The task branch `feat/japanese-curriculum-redesign` starts from live `origin/feat/android-phone-redesign` at `cd9d0789d3a5050ede678b11799b90b4f7a67efb`. All 68 fetched and live branch refs matched at setup and before checkpointing. The initial Cloud checkout still contains its original French-only source. [Work log](WORK_LOG.md#2026-11-26-redesign-the-japanese-learning-experience) · [Execution plan](plans/0061-japanese-curriculum-redesign.md) · [Curriculum map](curriculum/japanese-curriculum-redesign.md)

The learner exposes 53 kana lessons, real-life practice in all 69 topic lessons and 13 guided lessons with three cumulative units. The original lesson IDs, revisions and scopes preserve saved progress, bookmarks and earlier backup access. Contextual readings, script-aware typing and review guidance are available in the normal reader. Account allowance was unavailable. Automatic resume is unconfigured.

## Verification

- Repository, TypeScript and staged checks, 34 tooling tests and 310 application tests passed. All 506 authored-transcript MP3s decoded. Selected Open JTalk readings and mora-contrast timings matched the exercises.
- Across the full Chromium run and targeted reruns, 249 desktop and narrow cases passed with one intentional skip. All 16 Japanese bank checkpoints and four guided checkpoints passed on both sizes. Coverage includes wrong and correct answers, observed focus and wrapping, composition events, reading support, bundled audio, draft Back restoration and saved progress/backup.
- The full offline matrix and focused narrow reruns account for all 34 passed cases. ServiceWorker playback and a direct kana words bookmark passed at 320 px on the final export. All eight Android browser contracts passed. The final export contains 656 files and 16,702,426 bytes. Build `fa7fd0326fa82e06eec03c619af46b7818c0936468d171e04485ffd0075fa510`.
- Independent review found missing full readings with partial furigana and loss of typed drafts on Back. Both were fixed and tested. Exported testing caught the new kana bookmark matcher and prompted its online and cold-offline regression. The larger offline download prompted bounded concurrent staging, with existing integrity and atomic publication checks retained.

Physical devices and Japanese IMEs, Safari, screen readers and qualified Japanese listening review remain outside this environment.
