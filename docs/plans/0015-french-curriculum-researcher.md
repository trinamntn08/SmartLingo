# Integrate the supplied curriculum research skill

Owner request: inspect the downloaded `french-curriculum-researcher` and integrate it into this repository.

Acceptance criteria:

- Keep the supplied research framework and unreviewed A1/A2 seeds available as a repository skill, with matching prepared installation sources.
- Route curriculum research from the existing author workflow and document how to invoke it.
- Resolve conflicting lesson sizes, content contracts, approval and commit instructions. Research records must not imply a supported app importer or automatic publication.
- Validate skill metadata, JSON/schema structure, seed JSON/CSV consistency, fresh installation/idempotence, repository checks and staged content. Leave app content, learner data and the running preview untouched.

Implementation: review all six supplied files; adapt the entrypoint and research schema; copy the prepared skill into `.agents/skills`; update author routing, tooling inventory checks/tests and setup documentation; independently review, validate and create a focused local checkpoint.

Source: owner-supplied folder `smartlingo-french-curriculum-skill/french-curriculum-researcher` in Downloads, integrated 2026-11-15. Seed language/levels remain unreviewed; supplied external research links have not been revalidated by this integration.

Completed: six resources installed and mirrored; author routing, docs and tooling counts updated. Preserved 32-topic/481-row seed data without vocabulary edits; CSV retains its UTF-8 BOM and Git applies the repository's LF line-ending convention. Corrected lesson-size, runtime/import, approval, translation/provenance and checkpoint-commit conflicts. See [ADR 0014](../decisions/0014-curriculum-research-skill.md).

Validation: `npm.cmd run check`, all 18 `test:tooling` cases and `setup:codex:plan` pass. An ignored one-off Python harness (`python -X utf8 .tmp/validate-curriculum-skill.py`) checks original/prepared/installed bytes, JSON/CSV/framework agreement, Draft 2020-12 schema validity, one valid translated research record and eight invalid records, plus the bundled skill-creator `quick_validate.py` for both skill copies. PyYAML/jsonschema/URI-format dependencies are isolated under `.tmp/skill-validation-deps`; initial missing-module and URI-checker gaps were resolved there without modifying project dependencies. This harness is session-only, not a shipped validation command or proof of French correctness. Independent read-only review/forward-test reports no actionable defects. Runtime/browser suites are unchanged and not rerun for this tooling-only step.
