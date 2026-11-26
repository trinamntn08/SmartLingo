# Phone study and course selection

Accepted on 2026-11-26.

Today on compact screens shows a single study action. Learn carries topic browsing, listening, speaking, Japanese letters and French slang. The five main destinations are available from the bottom bar. The lesson reader gives study text priority over course and progress summaries. Its course outline opens on demand and closes through the same history as the reader.

Courses has a dedicated Learn route. The picker displays all courses for the active language and identifies the current one. Selecting an entry opens that course’s own outline. Closing the picker returns to the prior Learn view. A direct picker link can close to Learn without adding a redundant history entry. Existing course and lesson links keep their identifiers and destination behaviour.

Today and Learn use the most recent supported saved activity in the active language’s current course revisions. French defaults to A1 and Japanese can start with Hiragana. An explicit launch from a chosen outline saves a navigation cursor through the existing course event store. Browsing the picker and opening an existing direct lesson link are read-only. Backup format, storage version and Android WebView origin stay at their existing values.

The compact web learner and private Android shell use the same presentation and events. Desktop retains its wide layout and opens the same course picker from Learn. See [the execution plan](../plans/0060-android-phone-redesign.md).
