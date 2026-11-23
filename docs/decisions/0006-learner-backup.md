# ADR 0006: Versioned learner snapshots with atomic merge restore

Date: 2026-11-14
Status: accepted for local beta

Browser storage is evictable. Add a separate learner file backup without changing the curriculum publication lifecycle or introducing remote sync.

- Export a consistent IndexedDB transaction covering learning events, personal notebook and cached publications. The version1 file format is separate from browser schema version2. No server drafts/database, keys or recordings are included.
- Limit files to 5 MB, 20,000 events, 5,000 notebook entries and 200 cached publications. Validate UTF-8 strictly before JSON/schema parsing; reject unknown formats/versions, duplicate IDs and draft lesson cache. Treat imported text as data and never execute it.
- File selection previews counts/date without writing. Restore requires an explicit trusted-file merge action. Cached publications in a backup are trusted local snapshots, not a publication into the server catalogue.
- Merge all three stores in one transaction. Identical event IDs deduplicate; changed immutable IDs/revisions abort the whole operation. Existing personal notes always win rather than trusting device clock comparisons. Newer cached revisions win. No overwrite/reset mode is added.
- Show actual committed counts and require reload to refresh mounted learning/catalogue state. Failed writes do not claim success or retry automatically. Files are private and unencrypted; users choose durable private storage themselves.

No operating-system backup job or cloud service is installed. Curriculum database backup, archive/reset, richer conflict resolution and backup format migration beyond version1 remain future work.
