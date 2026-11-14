# Local draft editor and publication

Status: completed
Owner: primary agent

## Outcome
Open a separate local editor, edit first lesson fields, save an immutable draft revision, preview the saved revision without changing real learner history, explicitly confirm owner review and publish. Learners can explicitly load published content, retain it across API shutdown/reload, and keep previous-revision events/notebook unchanged. Draft edits never replace published content until explicit publication. Tests publish only to isolated in-memory test content, never the owner's development database.

## Scope and ownership
- Primary: domain request/response contracts, learner content API adapter, IndexedDB v2 published-content cache/migration, catalogue integration, manifests if needed, browser tests and docs.
- API builder: apps/api/src and apps/api/tests, exclusive. Optimistic revision conflicts, saved-preview receipt, explicit reviewed publication, latest published selection independent of newer drafts, host/origin/custom-header guards and exact CORS allowlist. No provider calls.
- UI builder: apps/learner/src/editor plus App.tsx editor entry/route only. Form edits first fields (lesson heading/outcome, vocabulary meanings/examples/notes, grammar); preview reuses lesson UI with isolated memory state, no learner writes. Primary will separately modify App catalogue integration after UI agent completes.
- Independent reviewer: read-only after combined change. Primary integrates, validates and locally commits.

## Contracts
Shared schemas in packages/domain/src/editor.ts. Existing GET /lessons and /lessons/:id return latest revisions for local editing/preview. GET /published-lessons returns {lessons: Lesson[]} with latest published revision per ID (including when a newer draft exists).

POST /editor/lessons/:id/draft receives {expectedRevision, lesson}; lesson.revision equals expectedRevision and lesson.status is draft. Server appends revision expectedRevision+1; reject stale revision (409), missing lesson (404), invalid body (400). No creating arbitrary IDs in this slice.

POST /editor/lessons/:id/preview receives {expectedRevision}, returns {lesson, previewToken}. Only latest saved draft; opaque receipt bound to ID/revision, expires after 15 minutes and bounded in memory. POST /editor/lessons/:id/publish receives {expectedRevision, previewToken, ownerReviewed:true}; server appends published revision expectedRevision+1. Stale/invalid receipt cannot publish. Repeated stale requests cannot append duplicate publications. Save after publish starts a new draft while published content remains available. Earlier immutable revisions stay intact.

Writes and preview require JSON and X-SmartLingo-Editor: 1 plus allowed Origin (localhost:8081 or 127.0.0.1:8081). Allow only loopback Host headers; reject hostile/null origins and unapproved preflights. This is local browser-origin protection, not account authentication; public/LAN hosting remains prohibited without authentication. API body limit can rise to 128 KiB for a full validated lesson. No new dependencies required.

Primary adapter apps/learner/src/content/api.ts exports localContentApi with listLessons(), saveDraft(lesson,expectedRevision), previewDraft(id,expectedRevision), publishDraft(id,expectedRevision,previewToken), getPublished(). All return validated typed values, bounded timeout, explicit errors, no automatic retries. publishDraft sets ownerReviewed:true only in the UI's explicit reviewed publication action.

## Validation
Run npm check/test, API conflict/publication/security/corruption tests, IndexedDB v1→v2 migration/content cache tests, desktop/phone-sized browser regressions and isolated editor→publish→learner→reload journey, screenshot inspection, web export, independent review and staged checks. Physical phone/voice/owner content review remain external validation gaps. No actual owner curriculum publication performed by the agent.

## Progress
Branch feat/local-editor from clean 83c5573. Continuing owner-authorised implementation until available allowance prevents further progress; account usage/reset tools remain unavailable. Delegate bounded roles per session workflow; checkpoint each complete validated slice.

API and UI agents completed their exclusive work. Primary integrated publication loading/cache and a v1→v2 migration preserving events and personal notes. All 36 application tests/16 tooling tests and TypeScript pass; web export passes. Independent review identified a vocabulary-to-notebook field-capacity mismatch, now fixed in schemas/form limits with a regression check. Browser editor testing caught missing ARIA checkbox state; corrected. The isolated draft→preview→publish→newer draft→learner cache→reload journey passes. No real curriculum was published.

Final browser run: 15 passed, one deliberately skipped duplicate mobile publication writer. Desktop/320px editor screenshots inspected. Independent read-only review reports no remaining actionable findings. First editor fields and publication/caching acceptance criteria met; full editor tools, physical devices and actual owner approval remain future work. Primary records the local checkpoint in SESSION_CHECKPOINT.md before continuing.
