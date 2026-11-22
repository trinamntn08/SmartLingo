# Session checkpoint

Updated: 2026-11-22 (Europe/Paris). Task: simplify and redesign the homepage and all shared learner destinations. Branch feat/calm-learner-redesign, clean starting base 786219d, origin fetched before work. Implementation, independent review and combined validation are complete. The commit containing this note is the source checkpoint; its actual SHA and verified origin upload are reported at handoff after final staged checks.

## Implemented

One Today recommendation replaces duplicate lesson cards, global topic rails and metrics. French starts/resumes a word lesson; fresh Japanese starts kana, while more recent word-lesson activity resumes that lesson. Daily course has a compact entry and deliberate day/section browsing. Learn owns topics with short-lesson entry before full vocabulary. Study shows its current step and saved activity separately; kana focuses on the current row with explicit row choice. English meanings, examples/translations and reading support remain visible. Review puts recall first; Report owns real metrics/chart. Detailed explanations unfold separately.

Shared cream/white/burgundy/gold styles and explicit typography, desktop top navigation and labelled mobile bottom navigation replace the global sidebar. Mobile Learn modes scroll on one row. Profile has named audio, offline/backups, French curriculum and information groups. Settings disclosures mount on first use and retain state while hidden; optional AI instead unmounts on collapse, invoking existing conversation/recording cleanup.

No content/revision/storage/API/provider contracts, dependencies, curriculum publication or deployment changed. Owner services on 8082/3001 remain running. Primary started development on 8081; test services are isolated. Visual snapshots and temporary offline harness are ignored under .cache/. No secrets or real .env read, recordings or paid calls.

## Actual validation so far

- npm.cmd run check: PASS repository scan and TypeScript after final source edits. git diff --check: PASS.
- npm.cmd test: PASS 18 tooling and 256 application tests (274 total).
- Independent read-only reviewer: no actionable findings; traced guards, language scoping and temporary AI cleanup. Direct Chromium checks: expanded French Profile at 320px has no overflow; Japanese Today at 320/599/600/640/768px has no page/navigation overflow; disclosure accessibility relationships work.
- Primary captured 26 desktop/320px destination snapshots and checked document widths: all contained. Inspected home, lessons, Profile, speaking and kana visually. Improved mobile learning mode layout after inspection.
- Fresh final npm.cmd run build:web: PASS 126 files / 10,228,199 bytes; manifest build 95ef7dd9440f79aa16c4676ad1276f5666772ed3fa78b97bee69bada76488bd4.
- Full npm.cmd run test:e2e -- --workers=2: PASS 143 tests / 1 pre-existing intentional duplicate-publication skip (6.9 minutes), isolated 8081/3002. Includes direct-start/320px regressions, backup selection retained through collapse and AI disclosure/mode recording cleanup. Initial targeted/full runs exposed obsolete Published badge, Today completion and expanded-AI assertions, plus a bounding-box check treating intentionally clipped horizontal mode tabs as page overflow. Updated those expectations for the deliberate UI; actual document overflow, saved-history, publication, guard and cleanup assertions remain. Final full run passed without further changes.
- Full isolated exported offline suite: PASS 24/24 desktop/320px tests (3.8 minutes), through .cache/redesign.offline.config.ts on 8086. Copied specs differ only by port; server relative imports adjusted for ignored harness. Original owner preview process on 8082 preserved.

## Git handoff and remaining limits

All implementation checks are complete. Final reviewed task paths are deliberately staged; run npm.cmd run check:staged and git diff --cached --check, create the focused checkpoint and push only feat/calm-learner-redesign. Compare live remote SHA with HEAD before reporting upload success. No main change, merge, force push, deployment or publication. Build/cache/screenshots remain ignored; no owner data enters Git. Existing preview/API processes 13668/2708 on 8082/3001 stayed running; development on 8081 is available for owner inspection.

Owner acceptance, physical-phone/Safari/screen-reader and real speech quality remain open. Local preview validation does not establish deployment or curriculum approval. No additional pronunciation inventory, proficiency assessment or storage migration is claimed.

## Delegation and limits

Exposed gpt-6.1-sol high: UI builder owned Today/course then Profile/Disclosure; UI builder owned Learn/catalogue/lesson/kana then offline test adaptation; worker owned e2e specs/helpers; independent change reviewer remained read-only. Primary owns shared tokens/shell, Review/Report integration, docs, final checks and Git. Agents were told to preserve concurrent work. No automatic role/hook loading claimed.

Account usage reporting unavailable in this client on 2026-11-22; none inferred. No automatic-resume scheduler configured. Real device/Safari/screen-reader/voice quality and owner acceptance of redesigned pacing remain unverified. Complete French pronunciation inventory and Japanese word-by-word romaji remain separate future content work.
