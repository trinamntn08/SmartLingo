# ADR 0020: GitHub-backed Codex Cloud working route

Date: 2026-11-16
Status: accepted direction; account-specific environment activation pending

## Context

The owner requested a second working route that remains usable from a phone while the Windows computer is off, then authorised setting up the proposed GitHub upload, cloud environment and tested pull-request workflow. GitHub's old `main` contains the tooling scaffold; the current application checkpoint is 27 commits ahead.

## Decision

Preserve existing history and upload the current source plus cloud preparation on `chore/cloud-workflow` to the existing owner-selected repository. Open a draft pull request against `main`; do not merge or deploy as part of setup. Prepare a reusable Codex Cloud environment against the current branch and verify it from a phone before claiming the full route active.

Add GitHub Actions checks using the repository's runtime requirements and existing provider-independent tests. Keep runtime databases, browser learning data and permanent provider credentials outside source and CI. Environment publication is a separate setup action from app deployment and curriculum publication.

## Consequences

Future remote task briefs identify a source baseline, acceptance criteria, and branch/PR delivery. Repository instructions, skills and checkpoints support handoff; cloud runtime loading and successful tests must be observed. A connector alone supplies neither a test runner nor a published cloud environment. Source transfer does not transfer the owner's notebook/editor database. See [the cloud guide](../CLOUD_WORKFLOW.md) for activation and acceptance steps.
