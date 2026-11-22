# Task · Consolidate the local learner preview

Status: completed

Owner: primary agent

## Outcome

The primary learner checkout serves one review build at `http://localhost:8082`. Today prioritises the next activity and the daily course, and offers vocabulary, listening and speaking shortcuts. Saved words are available in Review. Direct routes, browser history, the completed French audio discovery fix and the Japanese pronunciation improvements work together.

## Relevant context

The canonical web learner has browser navigation at `ee25977`. Today and French audio were tested separately at `ab953bc` and `e2b80f2`. Japanese pronunciation was tested on the older learner at `28f1f4e`. Other worktrees may retain historical prototypes and test artifacts. [Local operations](../LOCAL_OPERATIONS.md#test-the-offline-ready-preview)

## Steps and ownership

- The primary agent ports Today and French audio, verifies the combination, and owns the shared preview.
- The primary completed the Japanese port after the delegated attempt yielded no source edits. An inherited-model read-only inventory and review were requested.
- After the lesson task records and pushes its work, integrate this checkpoint into the primary learner with its history and unrelated changes preserved. Build and verify from that checkout before handoff.

## Validation

Run repository, application and targeted Chromium checks. Exercise French and Japanese Today, daily-course history, Review, and Japanese reading at a narrow width. Serve isolated test builds on separate ports and verify the final manifest and actual learner routes at port 8082.

## Progress and decisions

Reused the current navigation contracts and the previously checked audio and Today changes. Isolated export `a58741711a90` passed the repository and application checks, 46 Chromium cases and six cold-offline cases. The primary checkout was released after the separate lesson checkpoint `2773b64` was pushed. The verified consolidation was then applied to that source.

## Handoff

The primary learner export `1f032cfdf5d9` serves the combined preview at port 8082. The final checks cover both languages, Today and Review, direct lesson links, lesson completion and cold-offline use. [Session checkpoint](../SESSION_CHECKPOINT.md)
