# Session checkpoint

Updated: 2026-11-21 (Europe/Paris). Completed, independently reviewed and validated: at least 30 entries in every Japanese topic. The commit containing this note is the checkpoint; its actual SHA and verified upload are reported at handoff.

## Request and outcome
Owner asked for much more Japanese vocabulary, at least 30 words per topic. All 13 banks now contain exactly 30 distinct normalized targets, with five six-entry short lessons each: 65 lessons, 390 topic appearances and 380 canonical words/phrases. Added 52 original draft lessons with kana/readings, English meanings, examples/translations, dialogue, grammar, meaning practice and sentence assembly. Shared senses reuse one stable payload. The French/Japanese interface remains shared and unchanged.

The original French lessons, 13 Japanese lessons, 78 Japanese source entries and complete Japanese daily-course payload remain hash-identical; all earlier IDs/revisions and progress scopes are preserved. Added lesson/word IDs own new activity. No dependency, schema, migration, API, provider, media, publication or hosting change. Existing daily-course six-entry selections remain unchanged; all 30 entries and five lessons are available in the topic sidebar/Explore.

[Plan 0033](plans/0033-japanese-topic-vocabulary.md) owns scope and actual results; [coverage/provenance](curriculum/japanese-topic-vocabulary.md) lists every topic and review limits. Original shared-interface checkpoint 337d922 matched fetched origin at startup. Worktree D:/dev/projects/SmartLingo-sessions/shared-language-learning now uses feat/japanese-topic-vocabulary. Original root remains feat/daily-course-continuation with pre-existing tests/e2e/backup.spec.ts status untouched.

## Actual validation
- npm.cmd run check PASS repository/documentation and TypeScript; final staged repository/secret and whitespace checks before commit.
- npm.cmd test PASS 18 tooling / 216 application tests, final rerun after content refinements. Frozen SHA fixtures protect all historical payloads; all-topic counts/readings/IDs/choice meanings and every accepted sentence answer are checked. Focused integration/source suite initially PASS 7/7; final focused expansion checks pass after review fixes.
- Final build:web PASS: 126 assets / 10,151,432 bytes / build 6aeb5f2f4657f10edc85558ba7cb90b02af9d7b1d74e74b0c6f517cd8d43ba52.
- Final exported Chromium desktop/320px suite PASS 20/20. Visits all 13 banks, checks 30 cards/five lessons, kana search, representative added foundations/A1/A2/B1 lesson completion, note save/edit/review/backup, reload and independent original resume. French greetings and shared-language regression journeys included. Primary inspected expanded-topic screenshots at desktop/320px.
- Final full cold-offline suite PASS 20/20. Added word search/save, full short practice and completion/reload work offline, with no remote source/media/provider requests in the added journey. Original Japanese B1 cursor, shared language switch/notebook, both French days and app download/update/removal regressions passed.
- Independent read-only source review: all banks at 30 distinct entries, canonical reuse consistent, original payloads unchanged; calendar long-vowel note corrected and fair sentence alternatives/prompts refined. No remaining actionable findings. Primary verified actual on-disk refinements before the final export/tests. git diff --check PASS.

## Delivery and next action
Stage only the 18 deliberate content/test/documentation paths, run check:staged and cached whitespace, commit and normally push only feat/japanese-topic-vocabulary; read back live origin SHA. Never force-push or merge into main. If delivery fails, preserve work and record exact recovery. No further feature expansion is part of this completed request.

Updated production preview restarted at http://localhost:8082 after the isolated offline test server stopped. It serves this task worktree's final export. Verify HTTP before handoff; the actual tool session/commit SHA are reported there. Old separate Japanese preview on18190 is not the updated bank. Browser data remains per origin; no owner database or recordings were opened by test fixtures.

## Delegation and limits
Three content workers owned only foundations/routines/discussion modules; primary owned the shared canonical entries/builder, integration, tests, docs, combined checks and Git. Separate independent reviewer stayed read-only. All helpers used exposed gpt-6.1-sol / medium with fresh contexts per SESSION_WORKFLOW; roles were supplied explicitly, automatic client loading is not claimed. Account allowance reporting unavailable; no allowance inferred and no automatic-resume schedule configured.

Owner and qualified Japanese review remain pending for naturalness, register, readings, translations and task-level estimates. No full CEFR/JLPT coverage or proficiency claim. Physical-phone/Safari/native/screen-reader and real audible quality remain unverified; ordinary study requires no paid call. Existing dependency audit findings were not changed or re-audited by this content expansion.
