# 0014 — Separate curriculum research from runtime content

Date: 2026-11-15. Status: accepted.

The owner supplied `french-curriculum-researcher` and requested review and repository integration. Keep its topic progression, research method and unreviewed 32-topic seed map as a repository skill, alongside `sll-author-french`. The author workflow routes topic planning/coherence/source research to it; ordinary lesson drafting retains the existing workflow.

The supplied JSON schema describes richer research-topic records with fields and levels that differ from runtime lessons. Retain it as an optional research brief contract with translated examples/dialogue, original-example labeling and draft-only status. It is not an app importer, approval record or replacement for `lessonSchema`. Runtime conversion must preserve canonical sense IDs/revisions, provide all required activity/provenance fields and split candidates into 6–10-item lessons. B1/B2 remain planning only.

Keep installed resources under `.agents/skills/french-curriculum-researcher` and matching installation sources under `tooling/agents/skills/`. Preserve the supplied CSV/JSON seed data, including CSV's UTF-8 BOM (read with `utf-8-sig` in Python), while disclosing that language accuracy, originality and external source access were not independently established by installation. Research/tests never approve or publish content; the existing owner preview/review/publication flow remains authoritative. No runtime contract, curriculum, storage, dependencies or personal/global configuration changes are needed.
