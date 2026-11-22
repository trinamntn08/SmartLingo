# Historical unified-hub checkpoint

Archived during the 2026-11-22 documentation reconciliation. The following records earlier checks and process observations at d8274ee; it does not establish currently running services or fresh validation. See [current checkpoint](../SESSION_CHECKPOINT.md) and [repository state](../REPOSITORY_STATE.md).

# Session checkpoint

Updated: 2026-11-22 (Europe/Paris). Unified Learn, alphabet-first Japanese and the owner-requested visual kana path are implemented, reviewed and validated. The commit containing this note is the checkpoint; actual SHA and verified task-branch upload are reported at handoff.

## Delivered behaviour

One Learn destination replaces duplicated Explore/Practice. Shared Vocabulary & lessons, Listening & videos and Speaking serve French/Japanese, with Today shortcuts. Sentence comprehension uses existing authored examples, varied same-lesson/topic/language choices, replay, feedback and transcript/error alternatives. Guided speaking offers role selection, partner/model audio and readings. These temporary activities do not fabricate saved completion or proficiency. Existing explicit French AI remains separate and clears recordings/session on leaving Speaking.

External resources: unchanged11 French plus5 Japanese (Erin, MarugotoA1/A2, Irodori, Teppei), with access/text-support notes and protected links. Provider media is never embedded/fetched on browsing. Source records distinguish checked metadata from audiovisual audition.

Japanese starts with20 original draft row lessons: Hiragana10 thenKatakana10,46 basic forms each. Today recommends the alphabet and Learn defaults to it; explicit vocabulary/topic links remain free and open the catalogue. The dropdown was replaced with numbered kana-preview cards, current/suggested/studied markers, script progress, auto-scrolled current row and Previous/Next group controls. Keyboard and accessible names expose the same status cues. Explicit row study after character attempts uses existing LearningEvents, confirmed-save continuation, retry identity and backup/restore. Letters do not inflate word-lesson/report totals. No new storage/migration, paid playback or publication.

## Actual validation

- Final check/typecheck PASS; npm.cmd test PASS18 tooling /251 application tests. Includes8 comprehension builder cases,2 resource cases,2 alphabet inventory/readings cases and3 progress cases. No paid automated calls.
- Full hub Chromium run127 PASS /1 intentional duplicate-publication skip (8minutes), before alphabet extension. After alphabet integration,22 targeted browser cases PASS (alphabet6, hub4, shared-language6, report6). Do not claim a full-suite rerun after the alphabet extension. Final visual-picker/accessible-label suite8/8 PASS desktop/narrow including explicit320px Tab/Enter selection, all progress/status names, wrong-answer study, save failure/idempotent retry, backup restoration, existing history and French exclusion.
- Alphabet/listening exported cold-offline4/4 PASS before visual picker. Final selector-adjusted cold-offline rerun uses a temporary config against the running normal8082 preview (no fault-control server), preserving owner's active preview; result recorded below. These cases need normal downloads only; test-only mode POST receives the production refusal and is unused.
- Final build:web PASS126assets /10,224,981bytes, build18b35bb3228dbf8a6b869ed4e45a62c8728638b02c00b2cfccc10b6cbe164ad1. Exported UI verified current accessible names, no dropdown, card selection/scroll and explicit vocabulary navigation at1440px and320px.
- Real free Japanese playback on final export: native HTML Audio decoded/ended for kana prompts A and HA at0.640s/0.554667s at1440/320px; live comprehension sentence and scripted reply also completed both widths (sentence1.109333s). Zero paid/provider-media requests. Local CORE analysis separately confirmed vowel a/i/u/e/o, ha/he and nasalN query phonemes. This does not establish native-speaker pronunciation quality or actual speaker hardware.
- Independent read-only reviews cleared final logic and found three resolved issues: repeated distractors (now contextual/varied), explicit vocabulary links opening alphabet default (now explicit vocabulary mode), and hidden accessible progress labels (now included in card names). Final git diff --check/staged checks before commit.
- Ad-hoc live-probe corrections were test-only: blob playback URLs were initially classified as remote requests; corrected HTTP(S) classification. Earlier curly-apostrophe expectation encoding was corrected in new browser tests. No application workaround, removed behaviour assertion or raised limit was used.

## Delivery and running preview

Task worktree D:/dev/projects/SmartLingo-sessions/shared-language-learning; branch feat/unified-learning-hub based on8612e1a matching fetched origin/feat/free-japanese-audio. At continuation, the separate D:/dev/projects/SmartLingo checkout is on feat/android-test-apk with concurrent staged Android work and the pre-existing unstaged tests/e2e/backup.spec.ts change. All were left untouched. All stages use deliberate task paths; no secrets, databases, runtime binaries, generated export or test caches are committed. Normal task-branch push only, live origin SHA verification; no merge/main update/force push/deployment.

The preview and voice/API processes had stopped when the owner resumed. Restarted the normal preview at http://localhost:8082 (session38604), Japanese free CORE voice on127.0.0.1:50021 (session86254), and API on127.0.0.1:3001 (session47485). HTTP confirmed final build18b35bb3228dbf8a6b869ed4e45a62c8728638b02c00b2cfccc10b6cbe164ad1 and voice available. Tests used fresh browser contexts and temporary data, never the owner's stored notebook. Refresh the preview; Japanese Today -> Start Hiragana / Continue Japanese letters, or Learn -> Japanese letters. Learn also exposes listening/video and speaking modes.

## Delegation and limits

Resource, activity, content, UI and browser helpers used exposed gpt-6.1-sol /medium with fresh contexts or their same-task followups and exclusive files. Independent reviewer stayed read-only. Primary owned integration/navigation/progress/shared exports/docs, final checks and Git. Usage reporting unavailable; no allowance inferred; no automatic-resume schedule.

Alphabet covers basic forms only: voiced marks, small-kana combinations, long vowels, kanji, handwriting/stroke order and teacher review remain later work. Actual external audiovisual playback, qualified pronunciation/teaching review, screen-reader hardware, Safari/native and physical-phone testing remain unverified. Existing word/course report definitions are preserved; alphabet row study has its own displayed progress. Normal native speech synthesis may finish internally after HTTP cancellation; stale playback/cache results are suppressed by the existing audio adapter.

Final selector-adjusted cold-offline result:4/4 PASS (32.2seconds) on the running production preview via the temporary no-server config, including saved row resume, Katakana cards/recognition, no API requests and language-specific library filters. Final next action is owner visual/voice audition after validated checkpoint upload.

Delivery verified: implementation196c7fd200e1e49eefceaec43debb0ac1f490e97 is uploaded to origin/feat/unified-learning-hub, with live remote SHA matching. This documentation-only continuation checkpoint records restarted services and preserves the separate concurrent Android checkout. No product source changed after the recorded checks.
