# Japanese pronunciation and larger website type

Status: implemented and verified

## Outcome

Japanese vocabulary in the library, lessons, daily course and saved words shows the kana and a Latin-letter pronunciation guide beside the target. Longer entries wrap. Exercises that test recall reveal their support deliberately. A speaker icon plays the same study audio, changes to a stop icon during playback and keeps an accessible action name.

The shared website typography increases for headings, body text and controls. The French and Japanese learner and French editor continue to use the same design tokens.

## Steps and ownership

- Primary agent. Reuse the authored kana, handle vocabulary phrase readings, place pronunciation inline and share the speaker/stop control across study activities. Keep lesson revisions, saved data and playback logic intact.
- UI builder. Update typography tokens and shared visual styles, including compact layouts.
- Primary agent and independent reviewer. Check corpus coverage, keyboard and touch playback, text reflow in desktop and narrow Chromium, and existing storage and navigation journeys.

## Validation

Run repository/type checks, app tests and browser checks for Japanese vocabulary, alphabet audio, listening and guided speaking. Check the responsive layout and exported preview before committing and pushing.

## Handoff

The pronunciation guide covers all 380 canonical Japanese vocabulary IDs. Chromium verified desktop, 320px, keyboard speaker use, and cold-offline access. Body text increased from 18px to 20px. The local preview runs on port 8081. [Validation details](../WORK_LOG.md#2026-11-22-japanese-pronunciation-and-larger-website-type)
