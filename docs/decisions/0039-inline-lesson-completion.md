# Inline lesson completion

Accepted for shared French and Japanese lessons on 2026-11-22. [Implementation plan](../plans/0046-focused-lesson-activities.md)

## Context

The lesson previously ended with a fifth Save session view after its four learning activities. It repeated saved activity information even though every attempt already wrote through the learning model.

## Decision

Use four stages and show completion in the sentence activity. Checking a correct final sentence with the vocabulary and matching prerequisites satisfied appends the correct attempt and revision-scoped completion in one transaction. The same event IDs are reused on retry. For an earlier solved attempt with its prerequisites satisfied, Back to lessons records the remaining completion as part of the return. New completion events carry an optional automatic marker. The report counts those events toward completed lessons and counts the learner’s answer once in weekly practice. Existing completion events retain their reporting and backup behavior.

Legacy `/finish` links resolve to `/sentence`. Browser traversal and opening a lesson by URL select the activity. The editor uses the same presentation with its temporary learning model. Daily courses track their own sections and events.
