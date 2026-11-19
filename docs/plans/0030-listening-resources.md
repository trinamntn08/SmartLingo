# Task: A1–B1 listening resources

Status: completed
Owner: primary agent

## Outcome

Learners can open a listening library from Practice, filter by A1/A2/B1 and format, and follow useful YouTube, podcast and video-exercise links. Cards explain listening purpose, text support, access restrictions and a short original practice task. Levels are recommendations, not assessments or new B1 curriculum support.

## Acceptance criteria

- At least three relevant choices per level and multiple YouTube options.
- Verified primary-source destinations and dated evidence; uncertain access or captions disclosed.
- Accessible links, keyboard filters, narrow layout, empty/reset state and clear online-only external playback notice.
- No third-party embeds, automatic media requests, copied recordings, learner-data writes or paid API calls.
- Existing lesson and Practice journeys preserved; check, application tests and focused desktop/narrow browser checks pass.

## Steps and ownership

Primary owns the typed static catalogue, source evidence, documentation, integration checks and Git delivery. UI builder owns only ListeningResources.tsx, App.tsx integration and tests/e2e/listening-resources.spec.ts. Independent reviewer is read-only. No shared lesson schema, storage, dependency or runtime CEFR changes.

## Validation

Passed: `npm.cmd run check`, `npm.cmd test` (18 tooling / 202 application tests), focused Chromium listening suite (6/6 desktop/narrow), production export, and new cold-offline listening suite (2/2 desktop/320px). Final staged checks are recorded in the checkpoint. Browser tests cover all nine level/format combinations, reset, keyboard selection, safe exact destinations, no automatic provider requests, navigation back to existing practice, and library descendant bounds at 320px. Primary and UI builder inspected the narrow screenshot.

Cold-offline checks explicitly download the exported app, disable network, close/reopen the page, and verify B1 YouTube filtering and guidance without provider requests. Normal port 8082 was free at inspection and used only by the isolated test server. Export: 126 assets / 9,744,284 bytes / build `36dbd44b01c4212131003e7ba2818ca1c062e3eeb9c74d95424aa9ba41e44221`. No owner listener stopped. Browser tests do not prove audible quality or permanent third-party availability.

## Progress and decisions

Started 2026-11-19 from b09b12c on feat/listening-resources. Preserve unrelated untracked docs/plans/0029-japanese-course-b1.md. Account-usage reporting unavailable; no automatic-resume schedule configured. External resource metadata is separate from the draft lesson/publication catalogue.

Concurrent Japanese work appeared briefly and was moved/cleared by its other session; preserved it throughout. Its backup.spec.ts worktree status remains outside this checkpoint. This task stages only deliberately reviewed listening paths and related documentation.

Eleven resource cards include four YouTube options; Coffee Break Season 1 audio/YouTube are explicitly the same content in two players. A compact Practice entry opens the library without burying the existing conversation/catalogue. Visible disclosure explains that entering it clears the temporary conversation, unsent text and recordings. Independent read-only reviewer found that missing disclosure; it was added and asserted before final browser validation. No unresolved final actionable findings.

## Handoff

Implemented filtering, safe external links, dated source evidence, original short practice suggestions and provider text/access caveats. All metadata remains separate from runtime lessons and progress. [ADR 0024](../decisions/0024-external-listening-resources.md) records the boundary; [source record](../curriculum/listening-resource-sources.md) records live primary-source verification and RFI retrieval limitations.

UI builder and independent reviewer used exposed `gpt-6.1-sol`, medium, fresh contexts per the session workflow; primary owned catalogue/docs, integration validation and Git. Current catalogue fills all filter combinations, so the implemented empty state is not reached in browser checks. Audible quality, physical phones/Safari/native Linking errors and screen-reader acceptance remain unverified. No media was copied, embedded, downloaded from providers or published as curriculum. No deployment/merge.
