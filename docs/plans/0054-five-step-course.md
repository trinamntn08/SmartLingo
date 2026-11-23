# Unify courses with the five-step lesson reader

Status: implemented and verified on 2026-11-23, Europe/Paris.

## Outcome

Both courses use the common Read dialogue, Key phrases, Listen, Match and Build sequence. The outline shows lesson choices. Today and Learn lead to the recommended lesson and keep saved continuation. Learner controls say Course or Lesson.

## Implementation

- Project the authored course material into the shared lesson view. Retain the original course IDs, French dialogue photographs, listening prompts, course credits and related practice.
- Use course activity history for course lessons. Convert existing section links to the corresponding step and keep earlier completion and saved vocabulary. Use the same step components for course and topic lessons.
- Keep course progress, projected content and the course screen with separate owners. The primary agent integrates the shared reader, entry points, documentation and browser verification.

## Validation

Repository and TypeScript checks and all 303 tooling and application tests passed. The affected Chromium suite passed 54 cases, then six of those cases passed on the final reader. Twelve focused cold-offline cases passed against the final export. The shared preview at `http://localhost:8082` served build `e9e06a957800`. Chromium at 320, 958 and 1,440 px showed the new outline, the numbered steps and French listening word cards. Real-device audio and assistive technology remain unverified.
