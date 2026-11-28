# 0042 — Use the shared reader for course lessons

Accepted 2026-11-23 for the local learner.

Course and topic lessons use the five-step reader. The course outline selects lessons, and the reader's numbered strip navigates the steps within one lesson. Learner labels use Course or Lesson.

Course lessons project the authored dialogue, vocabulary and learning goal into the shared view. The French course uses new contextual matching and sentence-building drafts. Japanese uses the matching authored practice from its lesson projection. Course listening keeps the existing prompt and playback, and course drafts retain the current revision scopes.

New activity records use stage IDs in the existing course event store. The step strip updates the resume cursor. Continuing from dialogue or key phrases records study. Matching and sentence building use their own practice results. Completion follows recorded key-phrase study and both correct results. Previous completions remain valid, and learners can solve the new exercises when revisiting those lessons. Bookmarked blocks map to their closest available step, and existing history and backups keep their identifiers. [Execution plan](../plans/0054-five-step-course.md)

In the six-step reader, Next from Key phrases records vocabulary study and opens Grammar. The lesson tabs still offer direct access to dialogue and matching. Next lesson opens Read dialogue in the following lesson. Resume links and the course outline still use saved progress.
