# Session checkpoint

Concurrent-session entry point (2026-11-16): follow [the worktree guide](PARALLEL_SESSIONS.md). Registered tasks maintain `docs/sessions/<name>.md`; this root note retains legacy history. The concurrent-session setup checkpoint is [concurrent-sessions](sessions/concurrent-sessions.md). Run `npm run session -- list` for actual worktrees; this file does not identify which other chats are live.

Updated: 2026-11-16, 20:08 Europe/Paris. Status and local launch request completed; this note's commit is the local checkpoint.

## Current launch for owner testing

- Starting tree clean on `docs/curriculum-topic-audit`, source checkpoint `8407f30`. Owner requested current status and launch only; no product/curriculum changes were made.
- Rebuilt current source with `npm.cmd run build:web`: PASS, 126 offline files / 9,685,539 bytes, build `11ea6b312dd8`. Preview serves `apps/learner/dist` at `http://localhost:8082`; API started from current source at `http://127.0.0.1:3001` using the normal local database path. Both were stopped before this launch. Servers remain running for owner testing.
- Live HTTP checks: preview and offline manifest both 200; API `/health` returns `{"status":"ok"}`. Browser control host was unavailable, and native Chrome input recovery could not target geometry; no successful browser-page verification is claimed. Owner can open the preview link directly.
- No real `.env` reads, paid calls, publication, push or merge. Optional AI/neural provider configuration and audible quality were not tested. Greetings-first research remains unapplied; existing 24 banks / 120 lessons still use Restaurant-first ordering. Phone/Safari/native and owner curriculum review remain open.
- Validation: build and live HTTP checks pass; final repository/TypeScript and staged checks run before committing this note. Full application/browser/offline suites were not rerun for this launch-only step. One hidden background preview launch command was blocked by execution policy; the ordinary persistent `node scripts/serve-web.mjs` session succeeded instead.
- Usage observed at 20:08 Europe/Paris: account allowance unavailable in exposed tools; no delegation or automatic resume configured. Next step: owner tests the running preview; implementation of research recommendations requires its own authorised task. Previous research checkpoint details follow.

## Previous curriculum research checkpoint (2026-11-15)

Updated: 2026-11-15, Europe/Paris. Completed curriculum research; the commit containing this note is the local checkpoint. Report its hash after Git confirms it.

## Authorised request and outcome

Owner requested the French curriculum researcher skill to review every word in every topic, put everyday greetings/politeness first and compare familiar established courses. Branch: docs/curriculum-topic-audit, based on aac20dc. Starting tree was clean.

Completed all 24 banks / 120 lessons / 741 appearances, preserving 705 canonical sense IDs and 696 written forms. Each occurrence has an individual first-home/action/rationale record. Final dispositions: 547 keep, 52 recycle, 3 move first introduction, 139 revise. These are editorial recommendations, not 139 confirmed French mistakes. Primary integration moved personal contact-detail first homes into introductions and reconciled shared IDs across both subreviews.

[Master findings and proposed 30-area map](CURRICULUM_TOPIC_AUDIT.md), [all 741 readable rows](audits/all-topic-words.md), per-bank notes/JSON, support fingerprints and [opening proposal](audits/greeting-first-proposal.json) are research artifacts included in this checkpoint. Opening proposal: three eight-item lessons, seven existing IDs and seventeen new target candidates. Live TV5MONDE, official Hachette Cosmopolite 1 and Council of Europe pages were inspected on 2026-11-15. Exact Édito sequence/inventory was unavailable and is not claimed. Original selection/examples; no proprietary full course inventory copied.

Confirmed source-level issue: courseSequence is not consumed by learner UI, so bundled insertion order and fresh Today fallback start at Restaurant. Research gives concrete ordering/content recommendations. No runtime curriculum, schema, media, owner publication, learner data, preview process or database was changed. No .env reads, recordings, paid calls, push or merge.

## Actual validation and review

- node --import tsx scripts/verify-curriculum-topic-audit.mjs: PASS, exact 741 occurrences, unchanged current targets/meanings, full-support SHA256 fingerprints, shared homes, field enums, encoding and opening IDs.
- npm.cmd run check: PASS repository checks and TypeScript, including final linked artifacts. Final staged repository checks run before the local checkpoint commit.
- node --import tsx --test packages/domain/tests/topics.test.ts packages/domain/tests/examples.test.ts: 8 passed. These validate unchanged bundled runtime lessons, not the research as importable content.
- git diff --check: PASS. Independent reviewer also verified every readable report row against final JSON, all source claims and the prerequisite corrections; no unresolved confirmed actionable finding.
- Earlier incomplete-artifact check stopped on missing Markdown files; provisional audits also exposed shared-home inconsistency and native-shell Unicode loss. Initial staged check caught an extra blank line at the readable report's EOF; removed before rerunning staged checks. All fixed before final passing checks. Valid existing progrès/disponibilité/expérience entries were retained after support-note review; no needless target rewrite. Digital basics now precede hotel/work tasks in the proposed map.
- Browser/offline/provider suites were not rerun for this research-only step. No claim of dictionary validation of every sense, native-teacher approval, exhaustive full-dialogue/exercise review or publication approval.

## Delegation and usage

Two explicitly invoked curriculum-author agents used exposed gpt-6.1-sol / high, owning exclusive daily/foundations JSON/Markdown pairs (381/360 occurrences). One independent read-only change-reviewer used gpt-6.1-sol / high. Primary owned the master, opening proposal, baseline, integrity checker, readable report, integration corrections, docs, checks and commit. No dependency/lockfile changes. File presence was not treated as evidence of role loading.

Usage capability inspected once: no account-allowance tool exposed; unavailable, not zero/unlimited. No automatic resume configured.

## Remaining and exact next implementation step

The requested review is complete. The proposed curriculum has not been applied to the learner app. When implementing the recommendations, start with the greeting-first short lessons and actual catalogue ordering, preserve stable sense IDs/history and publication overrides, convert research into full runtime drafts, add exact safe seed baselines, check first-start/resume/sidebar/filter/offline behaviour and use saved-revision owner preview before explicit publication. Broader bank restructuring and teacher/media/audio approval remain separate work; the research formats are not editor imports.

Previous feature checkpoint aac20dc contains saved neural French speech and its earlier verification; see STATUS/README/plan0022. This research did not restart the earlier 8084 review preview, owner8082/API3001 or previous8083. Current listeners/builds were not reverified. Actual configured provider listening and physical-phone/Safari checks remain open.
