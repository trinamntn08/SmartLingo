# Integrate the Cloud slang catalogue

Status: completed
Owner: primary agent

## Outcome

French learners can open Slang from the main navigation, search and filter the Cloud catalogue, see bilingual examples and register notes, and save expressions to the French notebook. The catalogue opens by URL and in an updated offline download. Existing French and Japanese study paths remain available on the shared preview.

## Relevant context

The local preview is built from `feat/french-daily-opening`. Cloud commit `1068589290305171539f327c5e7e043e6b992444` contains the catalogue, generated illustrations and earlier learner wiring. Its branch diverged before the current routed learner. [Cloud implementation](https://github.com/trinamntn08/SmartLingo/commit/1068589290305171539f327c5e7e043e6b992444)

## Steps and ownership

- The navigation builder owns the French-only `/slang/fr` route, shell, navigation, document allowlist and routing tests.
- The catalogue builder owns the reference content, catalogue screen, notebook presentation and catalogue unit tests. The shell renders `SlangCatalogue` with the existing French learning model.
- The primary agent owns the existing Cloud photo import, provenance, integration tests, combined validation and preview refresh. An independent reviewer inspects the integrated diff.

## Validation

Run repository and TypeScript checks, domain and application tests, and focused Chromium and offline journeys. Verify the served export at `http://localhost:8082` and the French and Japanese entry paths.

## Handoff

The preview serves build `a138bdaed6c4`. The French navigation opens the catalogue, and searches and saves were verified on desktop and narrow Chromium. The cold-offline export opens the same route, displays photos and saves to the notebook. Japanese retains its existing navigation. The work log records the completed checks. [Work log](../WORK_LOG.md#2026-11-24-bring-the-cloud-slang-catalogue-into-the-local-preview)
