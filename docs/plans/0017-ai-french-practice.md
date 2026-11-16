# Optional French AI practice

Status: completed for local implementation; live provider/hardware checks pending
Owner: primary agent

## Outcome

From Practice, choose lesson context and explicitly start an optional AI conversation. Send French text, request English help, read translated replies and supportive feedback, replay through the existing French device voice, and save a useful editable phrase to the notebook. Stop cancels pending work and clears the conversation. Missing configuration/network never blocks ordinary lessons.

## Acceptance criteria

- Server-only OpenAI credentials; no provider calls on page load, status or session creation. No real paid calls in validation.
- Bounded, expiring memory-only sessions, server-enforced daily attempt/session limits, single flight, stable request IDs, timeouts and explicit cancellation. Usage reflects reported tokens and reserved attempts, not billing totals. Restart resets the in-memory daily allowance.
- Validate both boundaries, reject unapproved browser origins/headers, avoid transcript/key logs and persistent transcripts. Store only explicitly captured notebook phrases.
- English interface, French replies/translations, editable text fallback, unavailable/error/limit states, desktop and narrow browser verification.
- Preserve the pre-existing French course rework and owner preview processes; stage only this feature's paths.

## Steps and ownership

Primary owns shared domain practice contracts, App integration, documentation, combined checks and browser tests. API helper owns new apps/api/src/practice files, app/server/local-access integration, API tests and .env.example. UI helper owns new apps/learner/src/practice files and learner practice adapter tests. Neither helper owns dependencies, content, repository.ts or existing unrelated edits. Independent reviewer is read-only.

## Validation

Run npm run check, application tests, feature browser flows with a fake provider, export and staged checks. Real provider French quality, audible device voice and physical device checks remain separate. Official Responses API and Structured Outputs documentation consulted on 2026-11-15; use store:false, no tools, a configurable model and validated structured results.

## Progress and decisions

Account allowance lookup is unavailable. Bounded delegation uses exposed gpt-6.1-sol at medium effort. Existing branch contains active/uncommitted curriculum work; preserve it and do not switch branches or include it in this checkpoint. Existing preview/API listeners remain untouched.

Independent review resolved terminal failed/cancelled retry classification, hard idle expiry, transcription overwriting concurrent edits and incorrect terminal-action guidance. Initial shared-tree curriculum links/fixtures were completed by their owner in checkpoint `baa3679`; combined repository/application checks now pass. This feature does not claim ownership of those curriculum changes.

Continue the same authorised speaking journey with optional recorded input. Explicit Record requests microphone access, Stop produces a local-only clip, and Transcribe recording sends at most two MiB to the server/provider. Review/edit the returned text before a separate Send action. Cap local recording at thirty seconds, release tracks on stop/discard/navigation and keep raw audio temporary. Transcription shares attempt/single-flight limits and replay IDs with conversation. No uploaded audio file is retained. Configured transcription is optional; text/replay remain available.

## Handoff

Recorded input and text practice implemented. Repository/TypeScript and all 136 application tests pass; full Chromium suite has 47 passes/one intentional duplicate publication skip, including twelve practice cases. Production export has four hashed files/1,410,720 bytes. A separate private 390px browser verified unavailable AI and explicit download/cold offline lesson use with no owner data access/page errors. Narrow screenshots inspected. Independent review reports no remaining actionable finding. No paid calls or owner preview/API restart. Real provider quality/model access, hardware microphones, audible voice, Safari/native and screen readers remain unverified. Generated/downloaded AI speech and real-time duplex voice remain later slices.
