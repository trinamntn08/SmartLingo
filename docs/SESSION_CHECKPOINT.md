# Session checkpoint

Updated: 2026-11-21 (Europe/Paris). Shared French/Japanese interface completed, independently reviewed and validated. The commit containing this note is the checkpoint; actual SHA and verified upload are reported at handoff.

## Request and implementation
Owner requires selecting French or Japanese at the homepage, followed by exactly the same core widgets and learning journey. Worktree `D:/dev/projects/SmartLingo-sessions/shared-language-learning`, branch `feat/shared-language-learning`, base ee23e93. Integrated existing Japanese implementation 58fe9b6 without replacing newer French listening/two-day work. Original checkout remains on feat/daily-course-continuation with unrelated tests/e2e/backup.spec.ts status preserved. No main merge, deployment or publication.

Shared chooser/Today/Explore/Practice/Review/Profile, topic browser, vocabulary cards, dialogues, meaning practice and sentence building. Existing 13 Japanese days project to shared Lesson records; 78 canonical words/readings/dialogue and original course payload remain unchanged. Original Japanese course events and French unchanged-day progress scopes stay intact. Both languages support personal notes and language-scoped review. Backup v4 retains both languages; imports v1/v2/v3 supported, no DB migration. Device voice settings shared with separate language preferences and strict matching; Japanese bypasses French neural cache/provider. Optional French AI/listening services remain explicitly French-only.

[Plan 0032](plans/0032-shared-language-learning.md), [ADR 0026](decisions/0026-shared-language-learning.md) and [Japanese lesson provenance](curriculum/japanese-shared-lessons.md) own acceptance/design/limits.

## Actual validation
- npm.cmd ci --ignore-scripts PASS; three moderate dependency advisories remain, no remediation claimed.
- npm.cmd run check PASS; npm.cmd test PASS 18 tooling / 214 application tests, repeated after final UI recovery refinement.
- Build:web PASS 126 files / 9,922,753 bytes / build f87477ccbe0cc892ec4bc4ebac827a1782fc6a0904632a4d32e31629b267e8d1.
- Independent read-only review: focused 24/24 PASS, unchanged French day-1 hash/revision history and Japanese content payload confirmed. Resolved failed review-save navigation trap with explicit dismiss/reread-history; failure-injection browser tests PASS desktop/narrow/exported. No remaining actionable source findings.
- Full e2e initial run 103 passed / 1 intentional duplicate-publication skip / 6 test-adaptation failures. Final focused backup/course/shared rerun PASS20/20 after explicit empty restore contexts and render wait after reload; all 109 active scenarios covered across those runs. Do not claim a new single all-green full run. Main shared test completes both languages' lessons, edits/ratings and real mixed backup download/fresh-context restore.
- Exported desktop/320px shared suite PASS6/6, including complete journeys, personal kana search, French provider isolation, failed-review dismissal and unavailable IndexedDB/settings storage. Primary inspected homepage and shared vocabulary screenshots at desktop/320px plus offline notebook.
- Final full cold-offline suite PASS18/18. Includes both French days, Japanese B1 cursor, shared Japanese completion/exact lesson resume/language switching/notebook isolation, download/update/removal, and no external course/media/provider requests in focused shared journeys. Initial failures came from retained stalled-document test-server mode across specs; explicit mode reset fixed test isolation without application changes.
- git diff --check PASS; final staged secret/whitespace checks before commit.

## Delivery and next actions
This slice is complete. Stage deliberate task files, remove obsolete indexed JapaneseVocabularyCard addition, run check:staged/cached whitespace checks, create focused commit, push only feat/shared-language-learning normally and verify live origin SHA. Never force-push or merge into main. If delivery fails, preserve the validated work and record exact recovery. Next product action is owner testing and qualified curriculum/audio review, not further unrequested expansion.

Updated shared production preview is running at http://localhost:8082, HTTP200 verified, tool session13554. It replaces only the earlier preview launched by this thread; existing separate Japanese preview on18190 is unchanged. The new preview serves this isolated worktree. Original checkout/owner changes remain untouched. No user DB or recording was opened by test fixtures. Ports use distinct browser storage; private v4 backups can transfer existing Japanese notes/course events from18190 if desired.

## Delegation and limits
UI builder owns assigned shared UI and later existing regression-test adaptations; content worker owns only Japanese adapter/provenance; independent reviewer remains read-only. All exposed gpt-6.1-sol medium with fresh contexts, explicitly supplied role instructions; automatic client loading is not claimed. Primary owns contracts, integration/audio/new shared tests/docs/checks/Git. Usage-reporting capability unavailable; no allowance inferred and no automatic-resume schedule configured. Real device audio, physical-phone/Safari/native/screen-reader and qualified Japanese review remain unverified. Drafts do not establish complete CEFR/JLPT coverage or proficiency.
