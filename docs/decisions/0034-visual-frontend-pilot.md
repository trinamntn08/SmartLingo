# ADR 0034 · Shared visual frontend pilot

Date 2026-11-22 · Accepted for the pilot

## Context

The first implementation slice of the frontend redesign needs one complete visual learning journey with larger type, a recognizable photo-led topic library and a readable lesson stage. It serves French and Japanese learners and the saved-revision preview of the French editor. [Redesign plan](../plans/0040-visual-frontend-redesign.md)

## Decision

Keep the shared theme and existing feature components. Use a system font stack with Japanese fallbacks so the pilot can be inspected offline without shipping a font file. Keep the topic rail inside the Learn vocabulary library and offer a compact, labelled selector with focus return. Hold the catalogue filters and scroll location in the navigation session and restore them on explicit lesson exit. Show current and saved steps as a read-only outline, and focus the stage heading when advancing.

French topic covers reuse the guarded local photo catalogue. Restaurant uses the photo bound to `fr.restaurant.book-table` and Bakery uses the photo bound to `fr.bakery.country-loaf`. Japanese and missing-photo cases use open-book artwork drawn in SmartLingo code for this pilot. The artwork is decorative and carries an honest description. Topic covers are presentation assets and have no exercise answer bindings. [Photo rights](../PHOTO_SOURCES.md) · [Cover implementation](../../apps/learner/src/ui/TopicCover.tsx)

## Consequences

The same lesson component presents the pilot in the learner and editor preview. Existing lesson IDs, revisions, learning-event rules, answer keys, reports and backups retain their contracts. Navigation filters are session state. Physical-device review, wider media curation, a bundled typeface trial and the full editor workspace belong to later slices. [Pilot verification](../plans/0041-visual-frontend-pilot.md)
