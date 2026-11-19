# Session checkpoint

Updated: 2026-11-19, Europe/Paris. Japanese daily-course implementation completed, independently reviewed and validated; curriculum remains draft. The commit containing this note is the checkpoint; actual SHA and verified remote delivery are reported at handoff.

## Request, outcome and boundaries

Owner requested continuing Japanese courses through B1. Starting local/fetched origin contained only the French daily pilot. Implemented [plan 0029](plans/0029-japanese-course-b1.md): 13 original AI-assisted study days (foundation1, A1 four, A2 four, B1 four), 78 distinct vocabulary entries, 78 blocks and 26 contextual choices. B1 tasks cover connected narration, opinion/contrast, faithful message summary and conditional negotiation. English meanings, kana readings, dialogue, contextual feedback and manual production review are bundled. No complete CEFR coverage, qualified/native review, Japanese audio, publication, merge or deployment claimed. [Authorship/research record](curriculum/japanese-course-sources.md); [ADR 0025](decisions/0025-japanese-daily-course.md).

Today → Open Japanese course supports free day/level browsing, deliberate section/day completion and exact saved day/section resume independently of French. Japanese notebook capture, editing/readings, search and manual recognition preserve language; no French voice plays Japanese. Search folds French Latin accents while preserving kana dakuten. Personal-word creation and optional audio/AI remain French. Legacy French lessons/editor/catalogue unchanged.

Notebook metadata is optional for old French payloads. IndexedDB remains version4 with no new stores/migration. Learning backups now export v4 to prevent older readers silently stripping Japanese metadata; imports v1/v2/v3 remain supported. No dependency, provider, secret or server SQLite changes.

## Workspace and concurrent work

Use `D:/dev/projects/SmartLingo-sessions/japanese-course-b1`, branch `feat/japanese-course-b1`, base `b09b12c`. Another owner session began listening-resource work and switched the original shared checkout during implementation. Japanese files were isolated here and removed/reversed from the original while retaining its listening App hunks. Do not switch or commit the original checkout. This worktree has independent npm dependencies/workspace links. `npm.cmd ci --ignore-scripts` passed, reporting three moderate advisories (no remediation or clean audit claim).

All task changes are deliberate; no unrelated work found in this isolated tree. Ignored exports/configs/results remain outside Git. After validated commit, push only `feat/japanese-course-b1` normally and read back origin SHA; never force-push or merge. If delivery fails, preserve the local commit and record the exact failure/recovery here.

## Actual validation

- `npm.cmd run check`: PASS repository/TypeScript, repeated after final content wording fix. `git diff --check`: PASS (harmless CRLF advisories on two edited files).
- `npm.cmd test`: PASS 18 tooling and 207 application tests. Added domain provenance/reading/canonical-ID/choice/progress isolation/kana-search checks and Japanese IDB reopen/edit/backup round-trip tests. Final focused Japanese domain checks PASS3/3, storage PASS2/2.
- Final isolated production export PASS: 126 assets / 9,881,666 bytes / build `bf7d1bf20f9a8517eeaf5b03e53e782bbb5878a6585be9855c8edf6de0d8db93` under ignored `.tmp/japanese-export`.
- Production Chromium Japanese + existing French course + backup journeys PASS16/16 across desktop/320px. Covers wrong/correct/hinted answers, exact B1 resume despite newer French activity, explicit completion/next-day reload, Japanese notebook editing/kana search/manual review history and storage-unavailable browsing. Initial two existing backup failures were hardcoded8081; using configured baseURL fixed them. Initial ignored server config path also corrected.
- Cold-offline exported Japanese B1 and French pilot journeys PASS4/4, including saved word/cursor/reload with zero remote source/media requests. Additional narrow Japanese browser journey PASS after screenshot positioned on vocabulary; visually inspected readable Japanese/kana/English and no observed horizontal overflow.
- Independent read-only reviewer ran focused tests PASS16/16 and found no unresolved actionable code defects. Resolved one misleading optional-audio sentence; Japanese explicitly has text/kana only. No physical-device/Safari/native/screen-reader, audible or qualified Japanese teaching acceptance claimed; no paid calls.

## Reviewable preview and next action

Task preview at `http://localhost:18190`, process47716, HTTP200 verified; open Today → Open Japanese course. Served from this worktree's tested ignored production export through `.tmp/japanese-preview.mjs` (tool session35128). A hidden-process launcher was rejected by local tool policy; ordinary foreground tool-session serving succeeded. This is loopback-only, not hosted. Browser storage on this port is separate from older previews; confirm listener before restarting and preserve other owner processes.

Next: owner/qualified Japanese review of this compact route before publication; broaden kana/kanji, vocabulary, listening and independent production work before claiming full A1–B1 coverage. General course editor/import/publication and Japanese speech remain future work. No owner decision blocks this completed implementation checkpoint.

## Delegation and usage

Explicit project delegation used exposed `gpt-6.1-sol` high with fresh contexts: curriculum-author owned only Japanese content, ui-builder owned App/course UI/Japanese e2e, independent change-reviewer stayed read-only. Primary owned contracts/notebook/backup/tests/docs/integration/Git. Prepared role files are not claimed automatically loaded. Usage-reporting capability unavailable (checked at start, still not exposed at handoff); no allowance inferred. No automatic-resume schedule configured.
