# Vocabulary photographs, redundancy and device voice preferences

Date: 2026-11-15. Status: accepted implementation direction; curriculum/media remain draft for owner review.

## Context

The owner requested photographs for as many words as possible, a review of similar/redundant vocabulary with useful replacements, and investigation of a better French voice.

## Decisions

- Replace 16 duplicated introduction slots across three lessons with new routine/paperwork senses. Keep useful shared practice and genuinely different contextual senses; clarify transport versus work meanings of horaire. The course stays 120 lessons/741 appearances, with 705 canonical senses/696 written forms.
- Keep historical lesson IDs even where their original slugs no longer describe the revised title. These are persisted identities, not learner labels. Five changed lessons append draft revision 4. Exact prior fingerprints permit immutable refresh, preserving owner edits/publications.
- Move the 16 displaced canonical payloads into explicit shared content data, retaining identical IDs/meaning/examples for Numbers/Calendar/Digital and other legitimate reuse. A word's identity does not depend on its first introduction lesson. Do not rewrite saved notebook entries or historical attempts.
- Keep photographic media outside curriculum revisions, with exact ID/target guards and independently recorded provenance. Bundle licensed image bytes locally with attribution/licence/source records and a user-accessible credits page. Avoid hotlinks, remote photo requests during study and arbitrary imagery to inflate coverage.
- Use literal photographs for clearly depicted vocabulary and honest situation photographs for relevant actions/chunks. Situation imagery is labelled; it does not turn an abstract word into a literal picture quiz. Retain illustration/text fallback when no trustworthy photo exists or loading fails. Document uncovered senses.
- Store voice identity/rate in a separate versioned, guarded browser preference key. Enumerate actual French voices and allow explicit sample playback; default locale/locality selection is not a quality ranking. No learner database/schema or backup changes. Native preferences remain future work.
- Investigate provider voices through current official documentation and later comparable auditions. This change does not generate paid audio, install OS voices, assert a subjective quality improvement or implement provider speech/cache. Any later generated voice requires explicit generation, server credentials, content/settings cache identity and reviewed downloadable clips.

## Consequences and limits

Photos increase the exported/offline pack size; hash/size verification and explicit downloads apply unchanged. Source credits travel with the offline pack. A contextual photo is support for the situation, not proof of an abstract meaning. Licensed source metadata and automated validation do not establish teaching suitability; owner review remains necessary.

Browser voices differ across devices and may depend on a network service. Selecting another device voice can help only if a satisfactory voice is available; natural provider voices need a separate implementation and listening comparison. Audio preferences are per browser origin and excluded from private learning backups.

See [execution plan](../plans/0021-vocabulary-photos-and-voice.md), [vocabulary audit](../CURRICULUM_REDUNDANCY_AUDIT.md), [photo sources](../PHOTO_SOURCES.md) and [voice investigation](../VOICE_OPTIONS.md) for evidence and actual verification. Do not infer owner publication from this decision.
