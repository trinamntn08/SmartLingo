# Japanese kana topics in the shared library

Status — completed, 2026-11-27.

Japanese Today recommends a guided lesson in the French layout. Learn opens the same course and lesson library layout in both languages. Hiragana and Katakana are searchable Foundations topics with lesson counts, saved study status and direct lesson links. Their topic pages connect to the current script practice and shared navigation.

The primary agent owns Today, Learn, navigation, kana reader entry and verification. The UI builder owns the catalogue entries, script topic page and shared lesson cards. Reuse the original kana IDs, bookmarks and events. Keep script study progress separate from vocabulary and guided course totals.

Verify French and Japanese Today and Learn, both kana topics, saved practice, direct and historical links, and cold-offline use. Check at desktop and narrow widths and rebuild the local preview.

The shared preview serves build `16991611ac2f`. Repository and TypeScript checks, 327 automated tests, 30 focused Chromium cases and two cold-offline cases passed. [Source and verification](../WORK_LOG.md#2026-11-27-bring-japanese-letters-into-the-lesson-library)
