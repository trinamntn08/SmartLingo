# Session checkpoint

Updated: 2026-11-19, Europe/Paris. A1–B1 listening resource library completed, reviewed and validated. The commit containing this note is the checkpoint; its actual SHA and verified upload are reported at handoff.

## Request and outcome

Owner requested more listening resources from A1 through B1, including YouTube. Practice → Browse listening resources now opens 11 editorial recommendations with level/format filters, four YouTube options, podcasts and guided video exercises. Each card includes a short original task, text-support/access notes, level caveats and a checked date. Back to practice restores the ordinary practice landing screen.

Opening the library ends temporary conversation/draft/recording state; a visible notice explains this before the action. Links open safely on provider sites; browsing loads no remote media. The downloaded list/guidance works offline; external playback requires internet. No listening proficiency/completion events, runtime B1 lesson support, curriculum publication, copied media, storage migration, dependency changes or paid calls were added.

[Plan 0030](plans/0030-listening-resources.md) owns acceptance and actual checks. [Source evidence](curriculum/listening-resource-sources.md) records live primary-source inspection and known retrieval/access limits. [ADR 0024](decisions/0024-external-listening-resources.md) records the link-only boundary.

## Validation actually performed

- npm.cmd run check: PASS repository/documentation and TypeScript; rerun after final UI/docs before delivery.
- npm.cmd test: PASS 18 tooling / 202 application tests.
- Final focused Chromium listening suite: PASS 6/6 desktop/narrow, including all level/format combinations, keyboard selection, reset, exact safe links, no provider requests, disclosure and navigation back to ordinary practice. 320px descendant bounds passed; screenshot inspected by primary/UI builder.
- npm.cmd run build:web: PASS. Export 126 assets / 9,744,284 bytes / build 36dbd44b01c4212131003e7ba2818ca1c062e3eeb9c74d95424aa9ba41e44221.
- New production cold-offline listening suite: PASS 2/2 desktop/320px. Explicit app download, offline cold start, B1 YouTube filter/guidance and no provider requests. Free port 8082 used by the isolated test server; no owner process stopped.
- Independent read-only review: initial conversation-reset disclosure defect fixed and asserted before final browser checks; no unresolved actionable findings. git diff --check PASS. Final index/secret and cached-whitespace checks run before commit.

Not verified: audiovisual quality, permanent provider availability, physical-phone/Safari/native/screen-reader acceptance. Native link-error UI exists but was not device tested. Current catalogue covers all filter combinations, so the empty branch is not reached by browser tests. RFI destination is its verified publisher podcast listing because direct RFI retrieval was restricted.

## Git and recovery

Task branch feat/listening-resources, base b09b12c. Started with unrelated untracked docs/plans/0029-japanese-course-b1.md; concurrent Japanese-session edits appeared and were later moved/cleared by that session. Preserve any remaining tests/e2e/backup.spec.ts status; it is unrelated and excluded from this commit. App integration was reapplied after the other session cleared it, then final tests passed. No merge, force push, deployment or main update authorised/performed.

Stage only listening UI/catalogue/tests and related documentation. Run check:staged and git diff --cached --check; commit; inspect live origin task ref; push normally; verify remote SHA matches local HEAD. If delivery fails, preserve the local checkpoint and record the exact failure/recovery action here. Prior course-pilot checkpoint b09b12c and its source evidence remain in Git.

This requested listening slice is complete; no further feature work is needed. Future additions can extend the static catalogue with verified sources; B1 curriculum/assessment and hosted deployment remain separate work.

## Delegation and usage

UI builder owned ListeningResources.tsx, App.tsx integration and focused e2e tests; independent change-reviewer remained read-only. Both used exposed gpt-6.1-sol / medium with fresh contexts per SESSION_WORKFLOW. Primary owned typed catalogue, source evidence, offline test, docs, combined verification and Git. Prepared role files are not claimed to have loaded automatically.

Account-allowance reporting unavailable in this client on 2026-11-19; this is not zero or unlimited. No automatic-resume schedule configured. Export/screenshots/caches stay ignored and outside the commit.
