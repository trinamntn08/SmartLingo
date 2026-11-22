# Copyable Codex Cloud task: free learner website

**Historical release brief, scope warning added 2026-11-22.** The prompt below targets the older French hosted branch. The current French/Japanese learner is on the unified-hub lineage, with kana, shared Learn and reports; see [repository state](REPOSITORY_STATE.md). Do not use this prompt to publish an older app as the current release. A new current-app deployment task must first reconcile the old hosting capability gates with the new learner and validate both languages. This documentation task performs no deployment and grants no new publication authorization.

Prepared and reviewed: 2026-11-16 (Europe/Paris). This is a continuation brief, not evidence of a deployment. Remote inspection found the hosted implementation on `codex/free-learner-cloud-deploy` (head `c88bc41` at inspection); its checkpoint reports publication blocked and no live URL. The detailed research, hosting constraints and acceptance checklist are in [plan 0025](plans/0025-free-web-testing.md).

Select the SmartLingo repository/environment in Codex Cloud. Select `codex/free-learner-cloud-deploy` as the starting branch where the client allows it. Paste the following prompt. It directs the agent to inspect completed work and fetch the correct source if the environment initially checks out older code.

```text
Continue and deploy SmartLingo's free learner test website remotely.

Historical source scope: this brief predates the Japanese-enabled unified hub.
Before acting on a NEW request for the CURRENT app, read REPOSITORY_STATE.md,
compare origin/feat/unified-learning-hub, preserve its French/Japanese features,
and reconcile hosting gates in a separate implementation branch. Do not ship
the older French-only artifact as the latest app or infer deployment permission
from a documentation-only synchronization request.

Repository: https://github.com/trinamntn08/SmartLingo.git
Starting source: origin/codex/free-learner-cloud-deploy.
Read docs/plans/0025-free-web-testing.md and this execution brief.
The hosted implementation already exists there. This pasted continuation
updates older handoff wording that may remain on the source branch.

Authorisation and goal
- Prepare, validate, commit and push a focused implementation branch, and
  open or update a draft pull request if supported. Deploy the reviewed
  learner-only artifact to a NEW Cloudflare Pages Free test project in my
  account when secure account access is available. No repeated permission
  is needed for these actions within this scope.
- The result should be a stable HTTPS pages.dev URL that I can open on my
  phone or computer while my PC is off. Prefer smartlingo-test if available;
  otherwise choose a clear available variant and report it. Do not replace
  an existing site or project without explicit instructions.
- Spend EUR 0: no purchased domain, paid hosting/add-ons, paid AI calls or
  automatic paid upgrades. Verify the current Free offering before using it.
- Do not merge to main, force-push, change repository visibility, publish
  curriculum through the editor or expose my local computer/API.

Start from the actual current application
1. Inspect git status and preserve existing work. Fetch origin and inspect
   remote branches/history. The old main may contain only tooling.
2. Inspect origin/codex/free-learner-cloud-deploy and its checkpoint first.
   Continue the existing task when appropriate, or start a separate
   follow-up branch from its current remote head. Do not overwrite another
   task. Verify that
   cf4fedb is an ancestor and docs/CLOUD_DEPLOY_PROMPT.md is present. Use the
   newer remote documentation head, not that older commit as a checkout.
3. Read AGENTS.md, docs/STATUS.md, docs/SESSION_CHECKPOINT.md,
   docs/SESSION_WORKFLOW.md, relevant PROJECT_PLAN.md sections and
   docs/ARCHITECTURE.md. Read the repository sll-deliver-feature skill.
   Reconcile the plan against current source before editing. Follow the
   repository's bounded delegation and independent review workflow if
   supported; keep shared contracts/manifests under one owner.

Verify the existing hosted learner journey; fix remaining gaps only
- Keep the normal local editor/API workflow working. Add an explicit,
  documented static-hosted learner configuration. In that mode, ordinary
  lessons, pictures, dialogues, practice, personal words, search, review,
  progress, learning backup/restore and device speech must work without API
  access. Do not claim account sync or approved curriculum.
- Prevent hosted editor/publication, AI practice/transcription and neural
  status/generation requests to localhost/127.0.0.1. Hide unavailable
  controls or explain their availability clearly. Do not just wait for
  network failures, and do not embed provider credentials in the browser.
- Resolve the Pages HTML-canonicalisation/offline mismatch described in
  plan 0025. Preserve manifest/cache compatibility, strict byte/hash checks,
  and redirect rejection for other requests. Test the narrowly mapped root
  document fetch against a host-shaped fixture and the real deployment.
- Keep deployment control files out of the offline manifest; configure
  revalidation, MIME/security headers and genuine missing-file responses.
  Do not use a blanket rewrite that returns HTML for missing asset/API URLs.
  Avoid optional content transformations/injection; verify served bytes.
- Preserve stable content IDs/revisions and browser learning data. No
  learner migration, account system, hosted backend or curriculum candidate
  integration is needed. Preserve the image credits and test/draft labels.

Validate and package
- Use the pinned Node/npm versions; the documented baseline is Node
  24.19.0 and npm 11.17.0. On Linux use npm/npx, not npm.cmd.
- Install dependencies with npm ci and hooks with npm run setup. Install
  Chromium with npx playwright install --with-deps chromium.
- Run npm run check, npm test, npm run test:e2e -- --workers=2 and
  npm run test:offline, plus npm run test:hosted on the hosted source branch.
  Use isolated disposable fixtures and fake providers.
  Add meaningful checks for hosted capability gating, URL/redirect/error
  behaviour and unchanged offline integrity. Fix failures rather than
  disabling checks or weakening protections.
- Document the actual hosted-mode build command. Build that configuration
  using the existing export/offline preparation pipeline. Output is
  apps/learner/dist; do not upload the repository or owner/private data.
- Inspect the upload package, file count, largest file, credentials/debug
  artifacts, manifest hashes and the source commit/build ID. Do not access
  real .env files or include SQLite files, backups, recordings or transcripts.
- Independently review the complete change when supported. Update STATUS,
  SESSION_CHECKPOINT and the deployment instructions. Run final staged
  checks, create the required focused commits, push the task branch and
  report the actual remote result. No force-push or merge.

Deploy and prove the result
- Use secure Cloudflare access already available through supported tools or
  the runtime. Prefer Direct Upload through reviewed/pinned Wrangler tooling
  for this remote task; do not depend on a local Windows browser or PC.
  Keep credentials in supported secret storage, out of source, logs, chat,
  artifacts and client assets. Never ask me to paste a token into the chat.
- Deploy only the reviewed static artifact to the new Free Pages project.
  Use the stable project URL for daily testing and retain rollback details.
- Fetch all manifest assets from the host and verify decoded size/hash with
  the intended root-document mapping. Verify HTTPS, MIME/cache headers,
  worker/manifest availability and genuine 404s for unknown assets/API paths.
- Run hosted browser checks for the greetings-first journey, pictures,
  save/edit/search/review/reload and backup/restore, plus explicit offline
  download and a fresh offline browser launch. Check desktop/narrow layouts
  and network requests; confirm normal hosted flows make no loopback or paid
  provider calls. Use disposable learner data only.
- If remote Chromium cannot verify offline mode, fix the test setup where
  feasible and report the exact unverified part. Do not claim physical
  Android/iPhone, Safari, screen-reader or audible voice results without
  actually testing them. Give me the remaining phone acceptance checklist.

Missing access or interruption
- Finish and validate all work that does not need account access first.
  If Cloudflare login, secure credentials, network access or publication is
  unavailable, preserve the reviewed artifact, commits and reproducible
  build/deploy instructions. Request only the specific secure account setup
  needed, then continue when it is supplied. Never invent a URL or call the
  release deployed without verified deployment output and HTTP/browser checks.
- Do not switch to a paid provider, expose an unauthenticated API, disable
  checks or stop after merely proposing another plan. Keep a recoverable
  checkpoint if allowance/tool limitations interrupt the task.

Final report
Give the live stable URL (or precise remaining access blocker), source and
remote branch/commit, draft PR if created, deployment/build IDs, real check
results, rollback steps and remaining device checks. Explain that progress
is browser-local; transfer existing localhost learning only through a
private explicit backup/restore. Do not claim automated cross-device sync.
```

Account access is conditional. A repository checkout does not provide Cloudflare credentials. If access is missing, the Cloud task should finish the implementation and checks and leave a reproducible release ready for the account handoff. No secret should be entered into this document or the copied prompt.
