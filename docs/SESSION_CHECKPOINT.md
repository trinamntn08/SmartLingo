# Session checkpoint

Updated: 2026-11-15 (Europe/Paris).

## Authorised request and result

Owner asked to review similar/redundant words, add useful gaps/remove redundant slots, try photographs for each word and investigate a better French voice. Completed a bounded quality/media/voice step on `feat/vocabulary-photos-and-voice`, based on `39c4830`. The commit containing this note is the local checkpoint; report its actual hash after Git confirms it. No push, merge, owner publication or API restart.

- Audited all 24 banks/120 lessons/741 appearances. Replaced 16 duplicated introduction slots across three routine/admin lessons and clarified two horaire senses. Current inventory: 705 canonical senses/696 written forms. Five lessons append revision 4; fifty-five remain revision 3 and sixty remain revision 1.
- Moved the 16 displaced canonical payloads unchanged into shared-entries.ts; their old IDs remain taught in the appropriate banks. Exact prior-revision fingerprints retain owner edits/publications and historical progress. Full audit, replacement brief, catalogue and ADR0017 record the changes and evidence. Everything remains draft for owner review.
- Bundled 120 JPEG photographs (116 Commons/four Pexels), covering 397/705 exact ID/target pairs: 116 literal/281 labelled contextual, with 308 explicit gaps. Image bytes total 7,802,322. Public credits/source/licence/creator/hash records, guarded lookup, whole-frame rendering and illustration/text failure fallback are implemented. No remote photo request during ordinary study. Abstract matching remains meaning based.
- Profile → French audio offers the actual available French voices, Slow/Gentle/Normal speed, explicit sample/stop and guarded reload-persistent preferences separate from learner history/backups. All speaker buttons honor the choice. VOICE_OPTIONS records current official browser/Windows/Azure/OpenAI options. No natural provider voice/audio cache was implemented and no paid samples were generated; actual sound quality remains for audition.

## Validation actually completed

- `npm.cmd run check`: repository/TypeScript passes; final documentation/index checks precede the checkpoint commit.
- `npm.cmd test`: all 18 tooling tests pass. Final `npm.cmd run test:app`: 144/144 pass.
- Final `npm.cmd run test:e2e`: 61 passed/one intentional duplicate-publication skip, approximately 1.7 minutes. Includes new voice persistence/playback and local photo/load-failure fallback on desktop/narrow Chromium.
- Six existing offline cases pass against the final candidate via ignored `.tmp/photos-offline.config.ts` and fixture copies. Only port8084/candidate paths changed, preserving owner8082. Actual coverage: cold load, interrupted/corrupt retry/update, all-store-preserving asset removal and stalled navigation fallback.
- Production export to ignored `.tmp/vocabulary-photo-export`: 126 hashed files/9,648,233 bytes; build `cb38aaf002336a524ad1c0052b24cfc5949f46d521301ba1a972a8be5b65cf76`. Expo export, prepareOfflineExport and final source/public-file parity passed. Credits CSS was synced after the final source correction and the candidate was rehashed.
- Private ephemeral-port desktop/320px production smoke: new routine words, decoded coffee photo, Profile audio controls, explicit download, cold offline photo and decoded offline credits image pass, with zero page errors/owner API access. Screenshots inspected, including narrow credits overflow. Temporary smoke server closed.
- Independent curriculum/voice review: exactly five intended payload changes, 16 unchanged canonical payloads and all five prior SHA fingerprints verified; 25 targeted checks pass. Independent final photo review: all 120 JPEGs decode with recorded dimensions, 397 unique/live exact bindings, hostile/changed target rejection, hashes/bytes/source/credit parity and clean public inventory; two photo tests pass. Visually sampled final photos and all four stock sources. No remaining confirmed actionable finding in the bounded review.

Initial issues resolved: an unsuitable ancient bowl photo and its three bindings were removed; missing shirt creator credit recovered as ChristianGlaeser. A valid short alt exposed an arbitrary test length threshold, replaced with actual nonempty/descriptive/context-prefix checks. An unrelated backup child process exceeded its 10-second harness deadline under concurrent Expo/browser/application load; the unchanged full 144-test suite passed alone. Two browser cases exposed a helper assuming raw final punctuation; it now uses the existing real answer normalizer, and the full final browser suite passes. A temporary offline-fixture working-directory bootstrap path was corrected before all six cases passed. No application check was bypassed or weakened to hide a failing outcome.

## Runtime, ownership and limits

New review preview: http://127.0.0.1:8083, tool session96551, served from the final candidate. It has separate browser storage and bundled vocabulary/photos/device-voice controls; this origin is not enabled for editor/AI API access. Existing owner preview8082/API3001 remain PIDs30084/16248 and were not replaced, restarted or used for learner writes/publication. Check listeners again before future work. No learner data was migrated or cleared.

Actual routing: curriculum-author gpt-6.1-sol/high (audit/replacement docs), photo worker gpt-6.1-sol/high (media/lookup/rights/maintenance scripts), ui-builder gpt-6.1-sol/medium (audio module/tests/report), change-reviewer gpt-6.1-sol/high (instructionally read-only independent curriculum/voice/photo review). Primary integrated source revisions, UI, manifests, validation and documentation. No dependency, learner-storage schema or API contract changes. No real .env reads, paid calls, retained recording or owner database access.

Owner approval, actual audible quality/provider audition, phone/Safari/native and screen-reader checks remain. Device voices may be limited; Windows natural Narrator voices are not guaranteed to appear in browser Web Speech. The 308 photo gaps include abstract expressions and still-uncovered concrete objects; no full-photo-coverage claim. Unchanged three moderate Expo/fingerprint/minimatch findings remain as recorded in the preceding status review. GitHub's last observed branch was main at1c6e943; current work remains a local checkpoint, not off-device backup.

## Next step

Owner can inspect8083, review the new vocabulary/media and audition Profile → French audio. Keep drafts unapproved until explicit saved-preview/publication. If installed voices remain unsatisfactory, next bounded implementation is an audition-backed provider speech/cache journey with server-only credentials, explicit bounded generation, cache identity/invalidation and downloaded replay. Prioritize meaningful photos for remaining concrete gaps; retain clear text for abstract grammar rather than forcing unrelated photos. Remaining editor/reset/onboarding/per-topic/native work is listed in STATUS.md; no new slice started here.

Latest usage observation: 20:08 Europe/Paris, 2026-11-15; account-allowance lookup is not exposed, so usage is unavailable rather than zero/unlimited. No automatic resume is configured.
