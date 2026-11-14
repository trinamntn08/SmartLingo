# 0009 — Topic banks with short lessons

Date: 2026-11-14. Status: accepted for implementation.

The owner requests many A1–A2 topics with 30–50 vocabulary entries each. Keep the established 6–10-item lesson contract and group short lessons by their existing topic field. This supplies a 30-entry topic bank without requiring a 30-word linear session. Derive groups from bundled plus owner-published lessons; no storage migration or separate persisted topic registry is needed.

Search covers topics, lesson headings and French/English vocabulary. A topic view presents its short lessons and directly visible word details with notebook capture. Existing starter IDs/revisions, progress and personal edits remain intact.

Add optional `pictureActivity.mode` (`picture` or `meaning`). Existing lessons with no mode retain picture matching. New lessons use explicit meaning matching for abstract vocabulary; do not substitute a contextual notebook image for a word's literal meaning. Keep the existing persisted `picture` activity key as the matching-stage identifier to retain progress/backup compatibility. Vocabulary `context` marks a nonliteral notebook illustration, suppressed in the study card. This is a backward-compatible schema extension, not a new scoring/proficiency measure.

Remove repetitive synthetic-voice labels from each Listen control. Keep the synthetic device-voice disclosure in Profile alongside availability limitations. Draft status stays visible; content generation never grants owner approval.
