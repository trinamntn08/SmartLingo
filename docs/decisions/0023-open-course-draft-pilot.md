# 0023: Separate daily-course draft progress and bounded open-source reuse

Date: 2026-11-17. Status: implemented pilot decision; curriculum awaits owner review.

The owner authorised starting [the open-course plan](../plans/0027-open-course-integration.md) with freely reproducible material and proper attribution. The first complete scope is one beginner day in the local learner, not a full imported textbook, new level or deployed release. [Execution plan 0028](../plans/0028-open-course-pilot.md) owns acceptance and validation.

Keep the 123 existing `Lesson` payloads, revisions and learning events intact. A separate typed `OpenCourse` composes ordered study, vocabulary, bilingual dialogue, situational choice and self-review blocks into a parent study day. Its status is explicitly draft. For this bundled pilot there is no new API, server schema, curriculum importer or editor publication operation. General editable course releases and B1 support remain later steps.

Separate immutable course events record navigation, study, support, choices, reflection and completion against the exact course revision/day/block. Browsing does not complete a block; reflection is self-review rather than automatic correctness. Completion requires all blocks and explicit save; missed calendar days do not advance the route. Course activity does not become legacy lesson completion, review success or proficiency evidence.

IndexedDB v4 adds only the course-events store. Learner backup v3 includes this history and normalises v1/v2 imports without inventing course events. Conflict detection and all-store atomic merge remain in force. Ordinary curriculum backups/snapshots on the server are unchanged because no server content tables are added. New backups contain course events, not copied course/media payloads; the current pilot is bundled with the app.

Adapt only the small textual resource on BCcampus's *Basic greetings* chapter, which carries © 2023 Mirabelle Tinio and a CC BY 4.0 notice. Supply source/author/copyright/licence and modification notices in the learner and exported app. The [source record](../curriculum/open-course-pilot-sources.md) identifies exclusions: source photographs, recordings, H5P, external UT content and unrelated pages are not imported. The source keeps its CC BY 4.0 permissions; no additional restriction is imposed on that material and no new licence grant is made over independent SmartLingo additions, existing canonical support or application/media assets. No whole-book permission claim or publisher endorsement is made.

Use existing canonical vocabulary without rewriting IDs or support. Existing licensed/original visuals and optional device speech retain their own provenance; neither is presented as imported BCcampus media or a listening assessment. Ordinary study needs no API, provider key or paid generation. Owner/native-teacher content and real-device/audio acceptance remain separate from schema/browser checks.
