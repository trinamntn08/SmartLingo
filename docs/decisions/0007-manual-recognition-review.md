# ADR 0007: Manual recognition ratings and local-day review

Date: 2026-11-14
Status: accepted for local beta

Add a calm queue for saved words without treating lesson completion as proficiency.

- Store recognition-only manual ratings as immutable UUID events with algorithm version 1, UTC instant, valid recorded timezone and matching local study date. Scope each event to its notebook entry's saved updatedAt revision, so edits start fresh practice while retaining earlier history. These are self-reports, separate from automatic lesson attempts and future listening/production skills.
- Version 1 uses calendar intervals 1/3/7/14/30 days. Supported days (Again/Needed help) reset to tomorrow; independent due-day Remembered advances at most once per local date. Any supported rating makes that date supported. Early recall cannot advance the schedule. The intervals are a heuristic, not a validated memory/proficiency measure.
- Derive schedules from stable ordered/deduplicated history. Refresh stored ratings on tab focus and periodic date refresh; reread after saves. Failed saves retain the same UUID/instant for retry. The domain early-recall guard protects against stale UI between refreshes.
- IndexedDB v3 adds reviewEvents without changing prior stores. Extend [backup ADR](0006-learner-backup.md) with file format2; migrate validated format1 with empty review history. All four stores export consistently and restore atomically; conflicting review UUIDs abort the merge.

No streak penalty, proficiency score, adaptive algorithm, automatic rating, production/listening review or paid service is introduced. Future schedule changes require a deliberate algorithm version/migration rather than reinterpreting history silently.
