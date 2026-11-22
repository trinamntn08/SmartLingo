# ADR 0035 · Complete frontend rework

Date 2026-11-22 · Implemented, awaiting owner visual review

## Context

The owner rejected the visual pilot and asked to rework the whole interface. The supplied course-library and teaching-canvas references guide the structure. SmartLingo needs a consistent frontend for French, Japanese and the local French curriculum editor. [Prior pilot decision](0034-visual-frontend-pilot.md)

## Decision

Use warm neutral surfaces, pine primary actions, gold highlights and bundled variable Inter with a Japanese system fallback. Put teaching content and contextual photos early in the layout. Give the catalogue, course, structured practice, review, report, settings and editor their own task-specific layouts. Present the study step and its saved progress separately. In focused recall, keep the notebook mounted and hidden so in-progress note edits survive.

Bundle original contextual scenes and the font with the offline export. Context photos are presentation media. Literal word-photo associations and exercise answers remain bound to the existing content. The editor preserves its explicit save, saved-revision preview and publication, including stale revision and unsaved edit protections. [Asset provenance](../MEDIA_SOURCES.md#bundled-presentation-scenes-and-type)

## Consequences

The shared learner and editor need one offline asset set and a single set of UI primitives. The visual changes use the existing content, event, storage and provider interfaces. The screen changes require wide and compact viewport assessment and a cold-offline asset check. Physical-device and assistive-technology acceptance remain separate verification. [Implementation plan](../plans/0042-full-frontend-rework.md)
