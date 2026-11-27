# Grammar step and notebook stars

Status: completed

## Outcome

The shared lesson reader shows Grammar between Key phrases and Listen. Each bundled note gives a short rule or example in plain English. The step strip names the current activity and the content starts directly below it. The star beside a French or Japanese word or Slang expression saves or removes it. Slang categories remain available in the filters.

## Implementation

- The primary agent owns routes, course cursors, the shared reader and notebook persistence. Grammar has its own URL and can be resumed in guided courses.
- French and Japanese curriculum agents own the brief learner-facing notes. The authored lesson and course revisions retain their original copy and review history.
- The test agent owns the grammar journey, bookmark and offline assertions. The UI agent owns the shared notebook star, vocabulary and Slang cards.

## Validation

Check the six steps and keyboard focus on desktop and at 320 px. Check French and Japanese grammar, a saved Grammar cursor and a cold offline reload. Verify save and unsave from both Slang and topic vocabulary, including after reload. Run repository, application and browser checks and verify the export served on port 8082.

All 292 application tests, 18 tooling tests, 23 targeted online browser cases and 14 cold-offline cases passed on the final source and export. Verified the layout and served assets at 1440 and 320 px. [Checkpoint](../SESSION_CHECKPOINT.md)
