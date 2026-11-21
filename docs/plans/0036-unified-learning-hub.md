# Task: One Learn area with visible listening and speaking

Status: completed
Owner: primary agent

## Outcome

Replace duplicated Explore/Practice navigation with Learn. Keep vocabulary and complete lessons in one catalogue, with clearly named Vocabulary & lessons, Listening & videos and Speaking sections. Both French and Japanese use the same interface. Add real sentence-meaning listening comprehension from existing lesson examples with replay, answer feedback and optional transcript. Expose language-specific, researched external video/audio resources. Speaking offers guided scripted role-play in both languages, with existing optional French AI kept explicit and separate.

## Boundaries and ownership

Primary owns App/navigation/integration, shared contracts, existing regression adaptations, docs and checks/Git. Activity worker owns new listening-comprehension and guided-speaking widgets/pure exercise builder plus focused tests. Resource worker owns listening resource metadata/UI/source records and resource tests. Independent reviewer remains read-only. No curriculum payload, storage schema, proficiency metric or paid automatic generation changes. Listening and scripted oral checks are temporary practice and do not fabricate saved completion or assessment.

Shared component contracts: ListeningComprehension({lessons: Lesson[]}); GuidedSpeaking({lessons: Lesson[]}). Both are keyed by target language at mount and use shared audio with the lesson language. ListeningResources({language?: TargetLanguage,onClose?:()=>void}) supports embedding beneath comprehension. Keep existing listeningResources export as the eleven French entries; add Japanese metadata and getListeningResources(language). Existing format/level types stay compatible.

## Verification

Check one Learn navigation destination, distinct section content, same French/Japanese flow, listening questions/replay/feedback/transcript/error and cancellation, speaking role switching/text fallback, correct external language resources and safe link-only loading, unsaved-write guards and French optional-AI cleanup. Run check/test and meaningful desktop/narrow and exported/offline checks, then update status/checkpoint, deliberate staging, commit/push task branch and verify origin SHA.

## Progress

Base8612e1a matches fetched origin/feat/free-japanese-audio. Original root worktree and unrelated backup.spec.ts status preserved. Usage reporting unavailable; no allowance inferred. No scheduler configured.

Hub source was reviewed, checked and tested: final unit suite18 tooling/246 application PASS; full Chromium127 PASS/1 intentional duplicate-publication skip. Export126assets/10,205,772bytes, buildfafeba6a3dd5da7d76e48f4ff8903aa2de172ee48d4453e4aa848394954ae829. New cold-offline listening/transcript/library checks PASS2/2 desktop/320px. Final live exported Japanese activity playback pending. Review concern about constant distractors resolved by varied same-lesson/topic/language choices and regression cases.

Owner steering received 2026-11-22: Japanese should start with alphabet lessons. Extend this slice with original basic Hiragana then Katakana rows, explicit saved row study using existing learning events, first-entry/default/home guidance, and free vocabulary exploration. Preserve existing topic/lesson/course IDs and do not count characters as words or claim script mastery. Separate content and UI workers own new alphabet files; primary owns shared export/progress/integration and final validation.

Alphabet extension validated: final unit suite18 tooling/251 application PASS; alphabet/hub/shared-language/report focused22/22 PASS. Final alphabet/listening cold-offline checks4/4 PASS desktop/320px. Real exported Japanese listening/dialogue audio and isolated kana prompts completed playback at1440/320px, with no paid/provider media requests. CORE analysis confirmed basic vowel/ha/he/n phonemes. Review fixed explicit vocabulary links accidentally opening the alphabet default. Export53a4a20d7e2da3f987fa00589422d799c727f3aea0f225edab3650f73826917f has126assets/10,222,599bytes.

Further owner UI feedback: replace the unfriendly row dropdown with a visual kana path. UI worker owns ordered row cards, previews and progress/current/next states; browser worker owns adapting row-selection checks and320px keyboard coverage. Keep the active lesson prominent and save/recognition semantics unchanged. Preview8082 is actively used; preserve its server while rebuilding. Source finalisation/export/checkpoint awaits this picker refinement.

Final picker is a compact horizontally browsable path of numbered kana cards, current/suggested/studied markers and Previous/Next group controls. No dropdown; current row auto-scrolls into view. Accessible names include the same status cues as the visible cards. Final picker browser8/8 PASS including320px keyboard, progress/backup/retry and French isolation. Final check/test PASS18 tooling/251 application tests. Export18b35bb3228dbf8a6b869ed4e45a62c8728638b02c00b2cfccc10b6cbe164ad1 has126assets/10,224,981bytes. Actual exported card selection, accessible names, Japanese kana audio completion and explicit vocabulary shortcut verified at1440/320px. Preview stayed running during the final update. The session checkpoint records final cold-offline results and remote delivery.
