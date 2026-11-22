# Web navigation and direct learning links

Accepted for the local web learner on 2026-11-22. [Implementation plan](../plans/0045-web-navigation-and-lesson-links.md)

## Context

Screen and activity state lived in separate React components. Browser Back could leave the learner after Next sentence. The previous browser-back branch demonstrated shell history while retaining the root URL. The current French and Japanese learner also needs links that open directly from a new tab, a refresh and a downloaded copy.

## Decision

Use one typed route codec and a web history coordinator. URLs identify language and meaningful destinations, including listening questions, lesson stages and course sections. Task controls push deliberate destinations. Traversal selects a view, stops audio and restores its bounded in-memory visit state. The language chooser owns the saved home preference. A direct link selects its language for the current view.

Durable write actions keep their own existing owners and event IDs. Save-dependent moves create an entry after the save succeeds. Known same-tab traversal during a recoverable save returns to the guarded view. Editor preview and optional AI work keep their separate state and explicit actions. Browser history metadata stores route and visit identifiers. Answer sets, temporary search, note text and recordings stay in their feature state.

Use existing stable content IDs where they exist. Current topic data exposes names, so use a language-scoped exact name for ordinary topic links and a deterministic compact key when the encoded name is long. An ambiguous or renamed topic resolves to the unavailable view and the topic browser. A listening URL includes the topic key when it changes the deck. Existing speaking dialogue turns use position within a named lesson revision.

The exported preview and service worker share one document-path allowlist. Nested navigation uses the same app shell and the worker accepts a complete compatible saved build. A downloaded copy created before clean-route support remains usable from the home address and shows an update prompt when handling a nested route it cannot open. Keep the local review origin on port 8082 and the automated offline fixture on port 8185.
