# 0011 — Everyday examples, noun gender and immutable draft refresh

Date: 2026-11-14. Status: accepted.

The owner wants fuller quotidien examples, compact gender labels next to the word and a sound icon in place of the Listen button. Supply original contextual French sentences and matching English, generally 8–16 words, without raising every example to advanced grammar or padding generic clauses. Keep target/sense IDs, meanings, activities and media unchanged. Levels remain estimates; examples and translations need owner review.

Add optional grammatical gender metadata (masculine, feminine, both) and allow empty usage notes. Render compact m., f. or m./f. separately from the target heading; keep useful notes only. No gender is guessed from an elided article or a person's identity. Older explicit English noun prefixes can be displayed compactly. Editor selection uses the effective legacy/metadata value and strips the legacy prefix when changing gender, preserving its useful suffix. Unknown-language/ungendered entries can omit metadata.

Updated examples belong to revision2 drafts. Preserve immutable server revisions: an opt-in trusted fingerprint manifest of the exact 60 old bundled revision1 drafts allows a consecutive append within BEGIN IMMEDIATE only if the current head still matches that old draft. No baseline means the existing missing-ID-only policy. Never overwrite owner edits, append above a newer local draft, or publish automatically. All incoming seeds validate before writes; corruption rolls back the batch. SHA256 compares canonical validated JSON and carries no private learner data. Empty databases can seed the current revision directly. Owner publications continue to take precedence in the learner catalogue.

Revision-scoped progress starts separately for the changed drafts; prior history stays recorded. Existing notebook captures and manual-review ratings remain untouched, including personal example edits. No IndexedDB/backup/SQLite schema migration is needed: gender is optional content metadata, not a new learner store.

Speaker-only controls remain labelled for screen readers, focusable and at least 44px. Synthetic speech disclosure stays in Profile. Playback/stop/error/text fallbacks remain explicit and no paid audio is introduced.
