# 0025: Preserve unchanged daily-course history when adding days

Date: 2026-11-19. Status: implemented and validated; all course content remains draft.

The owner asked the agent to continue useful implementation during their absence. The next bounded step in the existing daily-course direction is a second original beginner day and a free day chooser. [Plan 0031](../plans/0031-daily-course-continuation.md) defines acceptance. This does not authorise publication, deployment or a complete-course claim.

Course revision 2 adds a day without rewriting revision-1 learning events. A day's optional `progressRevision` explicitly selects its original course-release event scope when its entire teaching payload is unchanged. Without that field, progress remains scoped to the current course revision as before. The first day's IDs, vocabulary, explanations, answers, ordering and outcome are protected by a SHA-256 fixture over its original JSON payload; its explicit progress revision is 1. The new original second day uses revision 2. Validators reject future, nonpositive or noninteger progress revisions.

This is an authoring compatibility assertion, not automatic content equivalence detection. A changed day must use a fresh progress scope. Do not reuse an earlier scope after changing its teaching/answer payload, and do not migrate historical answer results to a different activity. The frozen day-1 fixture makes the current compatibility assertion reviewable. Future course authoring/publication will need equivalent immutable-release validation; this bundled draft does not implement that workflow.

Both reads and new writes use `courseDayProgressRevision`. The existing event field `courseRevision` continues to identify the exact course release that authored that day. Backups keep those events intact; neither IndexedDB v4 nor backup v3 needs a migration. No legacy lesson, notebook, review schedule, server storage or provider contract changes.

Resume selects the latest valid event matching a known course/day/progress revision/block. A deliberate return to an earlier or completed day survives reload; first use falls back to the next incomplete day. Each day's cursor comes from its own history. Day switching records a navigation event before changing the screen; failed saves leave the current day visible with retry/discard. Storage-unavailable browsing remains possible without pretending to save. Completion stays explicit, does not auto-advance, and offers another unfinished day when available. Calendar dates never skip material, lock days or imply proficiency.

The new second day uses original SmartLingo text with unchanged existing canonical vocabulary. The first day's bounded BCcampus attribution and exclusions remain attached to the same text; no new source-media reuse or whole-course licence claim is introduced. Owner/native-teacher review and real-device/audio acceptance remain outstanding.
