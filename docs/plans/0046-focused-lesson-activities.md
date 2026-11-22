# Focused lesson activities

Status: implemented and validated in isolated preview

Owner: primary agent

## Outcome

The shared French and Japanese lesson opens in one centered activity with a compact four-step progress indicator. Study words, conversation, matching and sentence building each provide one clear action. A correct final exercise completes the lesson when the earlier work is done. The final activity displays the result and a link back to lessons.

## Relevant context

Reuse the [focused listening design](0044-focused-listening.md), [bilingual dialogue presentation](0043-french-daily-course.md) and [web navigation contract](0045-web-navigation-and-lesson-links.md). Existing lesson events, notebook, authored content and offline assets support the four activities.

## Steps and ownership

1. The primary owns the lesson shell, progress strip, route aliases, integration and combined browser checks.
2. One UI builder owns the word study and conversation views. Keep direct meanings, contextual visuals, audio and notebook actions. Use the complete bilingual transcripts where appropriate.
3. One UI builder owns the matching and sentence activities. Give the prompt, options and feedback clear roles. Show lesson completion inline in sentence building.
4. One API builder owns atomic append of the final attempt and completion plus the editor's temporary model. Preserve stable retry IDs and existing learning formats. All builders use the inherited model and effort.

## Validation

Run repository and application checks. Verify each stage visually on desktop and narrow screens. Exercise final answer completion, failed save and retry, storage-unavailable browsing, existing attempts, legacy `/finish`, browser Back/Forward, reload, editor isolation and a cold offline lesson. Use isolated previews for validation. The separate consolidation chat owns the combined refresh on port 8082.

## Progress and decisions

Four content stages are the public learner flow. A correct final answer and its eligible completion belong to one atomic write. Returning to the lesson list records an eligible completion for an already-solved older attempt. The old `/finish` URL resolves to sentence building. Browser navigation and reload restore the view. The shared conversation view keeps whole transcripts together, uses the existing generated scenes where available, and stacks the languages on narrow screens.

## Handoff

The lesson checkpoint releases the primary checkout for preview consolidation. Review via the existing local preview at `http://localhost:8082` after the combined refresh.
